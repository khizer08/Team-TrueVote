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

// Get user's purchase history
router.get('/', verifyToken, (req, res) => {
  try {
    const purchases = readJsonFile('purchases.json');
    const userPurchases = purchases.filter(purchase => purchase.buyerId === req.user.userId);
    
    // Get product details for each purchase
    const products = readJsonFile('products.json');
    const purchasesWithProducts = userPurchases.map(purchase => {
      const product = products.find(p => p.id === purchase.productId);
      return {
        ...purchase,
        product: product || null
      };
    });

    // Sort by purchase date (newest first)
    purchasesWithProducts.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));

    res.json(purchasesWithProducts);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a purchase (checkout from cart)
router.post('/checkout', verifyToken, (req, res) => {
  try {
    const cart = readJsonFile('cart.json');
    const products = readJsonFile('products.json');
    const purchases = readJsonFile('purchases.json');
    
    // Get user's cart items
    const userCartItems = cart.filter(item => item.userId === req.user.userId);
    
    if (userCartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const purchaseItems = [];
    const errors = [];

    // Process each cart item
    for (const cartItem of userCartItems) {
      const product = products.find(p => p.id === cartItem.productId);
      
      if (!product) {
        errors.push(`Product ${cartItem.productId} no longer exists`);
        continue;
      }

      if (!product.isAvailable) {
        errors.push(`Product ${product.title} is no longer available`);
        continue;
      }

      if (product.sellerId === req.user.userId) {
        errors.push(`Cannot purchase your own product: ${product.title}`);
        continue;
      }

      // Create purchase record
      const purchase = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        buyerId: req.user.userId,
        buyerEmail: req.user.email,
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        quantity: cartItem.quantity,
        totalAmount: product.price * cartItem.quantity,
        sellerId: product.sellerId,
        sellerEmail: product.sellerEmail,
        purchasedAt: new Date().toISOString(),
        status: 'completed'
      };

      purchaseItems.push(purchase);
      purchases.push(purchase);

      // Mark product as unavailable (sold)
      const productIndex = products.findIndex(p => p.id === product.id);
      if (productIndex !== -1) {
        products[productIndex].isAvailable = false;
        products[productIndex].soldAt = new Date().toISOString();
        products[productIndex].soldTo = req.user.userId;
      }
    }

    if (purchaseItems.length === 0) {
      return res.status(400).json({ 
        error: 'No valid items to purchase',
        details: errors
      });
    }

    // Save purchases and updated products
    writeJsonFile('purchases.json', purchases);
    writeJsonFile('products.json', products);

    // Clear purchased items from cart
    const updatedCart = cart.filter(item => 
      !userCartItems.some(userItem => userItem.id === item.id)
    );
    writeJsonFile('cart.json', updatedCart);

    const totalAmount = purchaseItems.reduce((sum, item) => sum + item.totalAmount, 0);

    res.status(201).json({
      message: 'Purchase completed successfully',
      purchases: purchaseItems,
      totalAmount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get purchase by ID
router.get('/:purchaseId', verifyToken, (req, res) => {
  try {
    const purchases = readJsonFile('purchases.json');
    const purchase = purchases.find(p => p.id === req.params.purchaseId);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Check if user owns this purchase
    if (purchase.buyerId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get product details
    const products = readJsonFile('products.json');
    const product = products.find(p => p.id === purchase.productId);

    res.json({
      ...purchase,
      product: product || null
    });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales history (for sellers)
router.get('/sales/history', verifyToken, (req, res) => {
  try {
    const purchases = readJsonFile('purchases.json');
    const userSales = purchases.filter(purchase => purchase.sellerId === req.user.userId);
    
    // Sort by sale date (newest first)
    userSales.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));

    res.json(userSales);
  } catch (error) {
    console.error('Get sales history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get purchase statistics
router.get('/stats/summary', verifyToken, (req, res) => {
  try {
    const purchases = readJsonFile('purchases.json');
    const userPurchases = purchases.filter(purchase => purchase.buyerId === req.user.userId);
    const userSales = purchases.filter(purchase => purchase.sellerId === req.user.userId);
    
    const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
    const totalEarned = userSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalItemsPurchased = userPurchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
    const totalItemsSold = userSales.reduce((sum, sale) => sum + sale.quantity, 0);

    res.json({
      purchases: {
        count: userPurchases.length,
        totalSpent,
        totalItemsPurchased
      },
      sales: {
        count: userSales.length,
        totalEarned,
        totalItemsSold
      }
    });
  } catch (error) {
    console.error('Get purchase stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
