import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PreviousPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('purchases');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/purchases');
      setPurchases(response.data);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
      setError('Failed to load purchase history');
    } finally {
      setLoading(false);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Group purchases by date
  const groupedPurchases = purchases.reduce((groups, purchase) => {
    const date = new Date(purchase.purchasedAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(purchase);
    return groups;
  }, {});

  const tabs = [
    { id: 'purchases', label: 'My Purchases', icon: 'fas fa-shopping-bag' },
    { id: 'sales', label: 'My Sales', icon: 'fas fa-dollar-sign' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Loading purchase history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Purchase History
          </h1>
          <p className="text-gray-600">
            Track your sustainable purchases and sales.
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'purchases' && (
          <div>
            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <i className="fas fa-shopping-bag text-6xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No purchases yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start shopping to see your purchase history here.
                </p>
                <Link to="/" className="btn btn-primary">
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedPurchases).map(([date, dayPurchases]) => (
                  <div key={date}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    
                    <div className="space-y-4">
                      {dayPurchases.map(purchase => (
                        <div key={purchase.id} className="card">
                          <div className="flex flex-col md:flex-row">
                            {/* Product Image */}
                            <div className="md:w-32 md:h-32 w-full h-48 md:flex-shrink-0">
                              <img
                                src={purchase.product?.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={purchase.productTitle}
                                className="w-full h-full object-cover rounded-l-lg md:rounded-l-lg md:rounded-r-none"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                }}
                              />
                            </div>

                            {/* Purchase Details */}
                            <div className="flex-1 p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-semibold text-gray-800">
                                  {purchase.productTitle}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                                  {purchase.status}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <strong>Quantity:</strong> {purchase.quantity}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Price per item:</strong> {formatPrice(purchase.productPrice)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <strong>Seller:</strong> {purchase.sellerEmail}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Purchased:</strong> {formatDate(purchase.purchasedAt)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="text-xl font-bold text-green-600">
                                  Total: {formatPrice(purchase.totalAmount)}
                                </div>
                                
                                {purchase.product && (
                                  <Link
                                    to={`/product/${purchase.productId}`}
                                    className="btn btn-outline btn-sm"
                                  >
                                    <i className="fas fa-eye mr-1"></i>
                                    View Product
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div>
            <SalesHistory />
          </div>
        )}
      </div>
    </div>
  );
};

// Sales History Component
const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/purchases/sales/history');
      setSales(response.data);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      setError('Failed to load sales history');
    } finally {
      setLoading(false);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Loading sales history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <i className="fas fa-exclamation-circle mr-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div>
      {sales.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-dollar-sign text-6xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No sales yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start selling to see your sales history here.
          </p>
          <Link to="/add-product" className="btn btn-primary">
            <i className="fas fa-plus mr-2"></i>
            List Your First Product
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map(sale => (
            <div key={sale.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {sale.productTitle}
                </h4>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Sold
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Buyer:</strong> {sale.buyerEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Quantity:</strong> {sale.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Price per item:</strong> {formatPrice(sale.productPrice)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Sold on:</strong> {formatDate(sale.purchasedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    Earned: {formatPrice(sale.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousPurchases;
