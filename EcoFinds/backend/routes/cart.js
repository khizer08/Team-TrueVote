const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'ecofinds_secret_key_2024';

// Helper function to read/write JSON files
const readJsonFile = (filename) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJsonFile = (filename, data) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user's cart
router.get('/', verifyToken, (req, res) => {
  try {
    const cart = readJsonFile('cart.json');
    const userCart = cart.filter(item => item.userId === req.user.userId);
    
    // Get product details for each cart item
    const products = readJsonFile('products.json');
    const cartWithProducts = userCart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return {
        ...cartItem,
        product: product || null
      };
    }).filter(item => item.product !== null); // Remove items with deleted products

    res.json(cartWithProducts);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
router.post('/', verifyToken, (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists and is available
    const products = readJsonFile('products.json');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isAvailable) {
      return res.status(400).json({ error: 'Product is not available' });
    }

    // Check if user is trying to add their own product
    if (product.sellerId === req.user.userId) {
      return res.status(400).json({ error: 'You cannot add your own product to cart' });
    }

    const cart = readJsonFile('cart.json');
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      item => item.userId === req.user.userId && item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity
      cart[existingItemIndex].quantity += parseInt(quantity);
      cart[existingItemIndex].updatedAt = new Date().toISOString();
    } else {
      // Add new item
      const newCartItem = {
        id: Date.now().toString(),
        userId: req.user.userId,
        productId,
        quantity: parseInt(quantity),
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      cart.push(newCartItem);
    }

    writeJsonFile('cart.json', cart);

    res.json({
      message: 'Item added to cart successfully',
      cartItem: existingItemIndex !== -1 ? cart[existingItemIndex] : cart[cart.length - 1]
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/:itemId', verifyToken, (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = readJsonFile('cart.json');
    const itemIndex = cart.findIndex(
      item => item.id === req.params.itemId && item.userId === req.user.userId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      const removedItem = cart.splice(itemIndex, 1)[0];
      writeJsonFile('cart.json', cart);
      return res.json({
        message: 'Item removed from cart',
        removedItem
      });
    }

    // Update quantity
    cart[itemIndex].quantity = parseInt(quantity);
    cart[itemIndex].updatedAt = new Date().toISOString();
    writeJsonFile('cart.json', cart);

    res.json({
      message: 'Cart item updated successfully',
      cartItem: cart[itemIndex]
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/:itemId', verifyToken, (req, res) => {
  try {
    const cart = readJsonFile('cart.json');
    const itemIndex = cart.findIndex(
      item => item.id === req.params.itemId && item.userId === req.user.userId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const removedItem = cart.splice(itemIndex, 1)[0];
    writeJsonFile('cart.json', cart);

    res.json({
      message: 'Item removed from cart successfully',
      removedItem
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear entire cart
router.delete('/', verifyToken, (req, res) => {
  try {
    const cart = readJsonFile('cart.json');
    const userCartItems = cart.filter(item => item.userId === req.user.userId);
    const updatedCart = cart.filter(item => item.userId !== req.user.userId);
    
    writeJsonFile('cart.json', updatedCart);

    res.json({
      message: 'Cart cleared successfully',
      removedItems: userCartItems
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cart count
router.get('/count', verifyToken, (req, res) => {
  try {
    const cart = readJsonFile('cart.json');
    const userCart = cart.filter(item => item.userId === req.user.userId);
    const totalItems = userCart.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ count: totalItems });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
