import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Sold
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="card-body">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <i className="fas fa-user mr-1"></i>
            <span>{product.sellerEmail}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-calendar mr-1"></i>
            <span>{formatDate(product.createdAt)}</span>
          </div>
        </div>
        
        {product.isAvailable && (
          <div className="mt-4">
            <Link
              to={`/product/${product.id}`}
              className="btn btn-primary w-full text-center"
            >
              <i className="fas fa-eye mr-2"></i>
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
