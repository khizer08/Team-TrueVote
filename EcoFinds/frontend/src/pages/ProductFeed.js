import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductFeed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      const response = await axios.get(`/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/products/categories/list');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchQuery, selectedCategory, minPrice, maxPrice]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Sustainable Treasures
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find pre-loved items that deserve a second life. Every purchase helps reduce waste 
          and promotes a more sustainable future.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
                >
                  <i className="fas fa-search text-lg"></i>
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary px-8"
            >
              <i className="fas fa-search mr-2"></i>
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="form-label">Max Price</label>
              <input
                type="number"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-outline w-full"
              >
                <i className="fas fa-times mr-2"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="alert alert-error max-w-md mx-auto">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
          <button
            onClick={fetchProducts}
            className="btn btn-primary mt-4"
          >
            <i className="fas fa-refresh mr-2"></i>
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-search text-6xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or browse all products.
          </p>
          <button
            onClick={clearFilters}
            className="btn btn-primary"
          >
            <i className="fas fa-list mr-2"></i>
            View All Products
          </button>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {products.length} Product{products.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="text-sm text-gray-500">
              {searchQuery && `Searching for: "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Call to Action */}
      {!loading && products.length > 0 && (
        <div className="text-center mt-12 p-8 bg-green-50 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Have something to sell?
          </h3>
          <p className="text-gray-600 mb-6">
            Join our community of eco-conscious sellers and give your items a second life.
          </p>
          <a
            href="/add-product"
            className="btn btn-primary btn-lg"
          >
            <i className="fas fa-plus mr-2"></i>
            List Your Product
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductFeed;
