import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    purchases: { count: 0, totalSpent: 0, totalItemsPurchased: 0 },
    sales: { count: 0, totalEarned: 0, totalItemsSold: 0 }
  });
  
  // User's products
  const [userProducts, setUserProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchUserProducts();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/purchases/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUserProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await axios.get(`/products/user/${user.id}`);
      setUserProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch user products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateProfile(profileForm.username, profileForm.email);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`/products/${productId}`);
      setUserProducts(userProducts.filter(p => p.id !== productId));
      setSuccess('Product deleted successfully!');
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product');
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
      month: 'short',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
    { id: 'products', label: 'My Products', icon: 'fas fa-box' },
    { id: 'stats', label: 'Statistics', icon: 'fas fa-chart-bar' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">
            Manage your profile, products, and view your marketplace activity.
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="alert alert-success mb-6">
            <i className="fas fa-check-circle mr-2"></i>
            {success}
          </div>
        )}
        
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
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <>
                        <div className="spinner mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Update Profile
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Products</h2>
              <a href="/add-product" className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Add New Product
              </a>
            </div>

            {productsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="spinner"></div>
                <span className="ml-3 text-gray-600">Loading products...</span>
              </div>
            ) : userProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <i className="fas fa-box text-6xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start selling by listing your first product.
                </p>
                <a href="/add-product" className="btn btn-primary">
                  <i className="fas fa-plus mr-2"></i>
                  List Your First Product
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProducts.map(product => (
                  <div key={product.id} className="card">
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
                    
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-green-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Listed on {formatDate(product.createdAt)}
                      </div>
                      
                      <div className="flex space-x-2">
                        <a
                          href={`/product/${product.id}`}
                          className="btn btn-outline btn-sm flex-1"
                        >
                          <i className="fas fa-eye mr-1"></i>
                          View
                        </a>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Purchase Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-800">
                  <i className="fas fa-shopping-cart text-blue-600 mr-2"></i>
                  Purchase Statistics
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Purchases</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.purchases.count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(stats.purchases.totalSpent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items Purchased</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.purchases.totalItemsPurchased}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-800">
                  <i className="fas fa-dollar-sign text-green-600 mr-2"></i>
                  Sales Statistics
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.sales.count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Earned</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(stats.sales.totalEarned)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items Sold</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.sales.totalItemsSold}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
