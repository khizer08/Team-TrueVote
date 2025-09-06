import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports & Outdoors',
    'Toys & Games',
    'Beauty & Health',
    'Automotive',
    'Furniture',
    'Jewelry',
    'Art & Crafts',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/products', formData);
      navigate(`/product/${response.data.product.id}`);
    } catch (error) {
      console.error('Failed to create product:', error);
      const message = error.response?.data?.error || 'Failed to create product';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            List Your Product
          </h1>
          <p className="text-gray-600">
            Give your pre-loved items a second life and help reduce waste.
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}

              {/* Product Title */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Vintage Leather Jacket"
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input pl-7"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe your product in detail. Include condition, size, brand, and any other relevant information..."
                  rows="5"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Be detailed and honest about the condition to help buyers make informed decisions.
                </p>
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label htmlFor="imageUrl" className="form-label">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: Add a URL to an image of your product. If not provided, a placeholder will be used.
                </p>
              </div>

              {/* Preview */}
              {formData.title && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
                  <div className="card">
                    <div className="relative">
                      <img
                        src={formData.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={formData.title}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="card-body">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {formData.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {formData.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-green-600">
                          {formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : '$0.00'}
                        </span>
                        {formData.category && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {formData.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1 btn-lg"
                >
                  {loading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus mr-2"></i>
                      List Product
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-outline flex-1 btn-lg"
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-800">
              <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
              Tips for Better Listings
            </h3>
          </div>
          <div className="card-body">
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span>Use clear, descriptive titles that include brand names and key features</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span>Be honest about the condition - mention any wear, damage, or defects</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span>Include measurements, sizes, and other relevant details</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span>Set a fair price based on condition and market value</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span>Use high-quality images to showcase your product</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
