import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    try {
      setAddingToCart(true);
      await axios.post('/cart', {
        productId: product.id,
        quantity: quantity
      });
      
      // Show success message (you could use a toast notification here)
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const message = error.response?.data?.error || 'Failed to add to cart';
      alert(message);
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-exclamation-triangle text-6xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Product Not Found
          </h3>
          <p className="text-gray-500 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isOwnProduct = user && product.sellerId === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="product-image-large w-full rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold">
                  SOLD
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.isAvailable ? (
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Available
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  Sold
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            
            <div className="text-4xl font-bold text-green-600 mb-4">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Seller Information</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white"></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">{product.sellerEmail}</p>
                <p className="text-sm text-gray-500">
                  Listed on {formatDate(product.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Add to Cart / Actions */}
          {product.isAvailable && !isOwnProduct && (
            <div className="space-y-4">
              <div>
                <label className="form-label">Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="form-select max-w-xs"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn btn-primary w-full btn-lg"
              >
                {addingToCart ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Add to Cart - {formatPrice(product.price * quantity)}
                  </>
                )}
              </button>
            </div>
          )}

          {isOwnProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                <p className="text-blue-800">
                  This is your own product. You cannot add it to your cart.
                </p>
              </div>
            </div>
          )}

          {!product.isAvailable && !isOwnProduct && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="fas fa-times-circle text-gray-600 mr-2"></i>
                <p className="text-gray-800">
                  This product has been sold and is no longer available.
                </p>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="pt-4">
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Products
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">More from this category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* This would typically show related products from the same category */}
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-leaf text-4xl mb-4"></i>
            <p>More sustainable products coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
