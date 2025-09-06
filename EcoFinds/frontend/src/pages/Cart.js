import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      setUpdating(true);
      await axios.put(`/cart/${itemId}`, { quantity: newQuantity });
      await fetchCartItems(); // Refresh cart
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdating(true);
      await axios.delete(`/cart/${itemId}`);
      await fetchCartItems(); // Refresh cart
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      setUpdating(true);
      await axios.delete('/cart');
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setCheckingOut(true);
      const response = await axios.post('/purchases/checkout');
      
      // Show success message
      alert(`Purchase completed successfully! Total: ${formatPrice(response.data.totalAmount)}`);
      
      // Clear cart and redirect
      setCartItems([]);
      navigate('/purchases');
    } catch (error) {
      console.error('Checkout failed:', error);
      const message = error.response?.data?.error || 'Checkout failed';
      setError(message);
    } finally {
      setCheckingOut(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const calculateItemTotal = (item) => {
    return item.product.price * item.quantity;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Loading cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            Review your items before checkout.
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-shopping-cart text-6xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-4">
              Start shopping to add items to your cart.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="card">
                    <div className="flex flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="md:w-32 md:h-32 w-full h-48 md:flex-shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded-l-lg md:rounded-l-lg md:rounded-r-none"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.product.title}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={updating}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={updating}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <i className="fas fa-minus text-xs"></i>
                              </button>
                              <span className="px-3 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updating}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <i className="fas fa-plus text-xs"></i>
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatPrice(calculateItemTotal(item))}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatPrice(item.product.price)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6">
                <button
                  onClick={clearCart}
                  disabled={updating}
                  className="btn btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold">{formatPrice(calculateTotal())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={checkingOut || cartItems.length === 0}
                      className="btn btn-primary w-full btn-lg"
                    >
                      {checkingOut ? (
                        <>
                          <div className="spinner mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-credit-card mr-2"></i>
                          Proceed to Checkout
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => navigate('/')}
                      className="btn btn-outline w-full"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-6 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center text-sm text-green-800">
                      <i className="fas fa-shield-alt mr-2"></i>
                      <span>Secure checkout with EcoFinds</span>
                    </div>
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

export default Cart;
