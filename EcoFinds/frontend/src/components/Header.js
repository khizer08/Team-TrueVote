import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch cart count
  useEffect(() => {
    if (user) {
      const fetchCartCount = async () => {
        try {
          const response = await axios.get('/cart/count');
          setCartCount(response.data.count);
        } catch (error) {
          console.error('Failed to fetch cart count:', error);
        }
      };
      fetchCartCount();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <i className="fas fa-leaf text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-800">EcoFinds</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for sustainable products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">
              <i className="fas fa-home mr-1"></i>
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/add-product" className="nav-link">
                  <i className="fas fa-plus mr-1"></i>
                  Sell
                </Link>
                
                <Link to="/cart" className="nav-link relative">
                  <i className="fas fa-shopping-cart mr-1"></i>
                  Cart
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
                
                <Link to="/purchases" className="nav-link">
                  <i className="fas fa-history mr-1"></i>
                  Purchases
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
                  >
                    <i className="fas fa-user-circle text-xl"></i>
                    <span className="hidden lg:block">{user.username}</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="fas fa-user mr-2"></i>
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  <i className="fas fa-sign-in-alt mr-1"></i>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  <i className="fas fa-user-plus mr-1"></i>
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-green-600"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-home mr-2"></i>
                Home
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/add-product"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Sell Product
                  </Link>
                  
                  <Link
                    to="/cart"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  
                  <Link
                    to="/purchases"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-history mr-2"></i>
                    My Purchases
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-user mr-2"></i>
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
