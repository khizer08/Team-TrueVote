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

// Get all products with search and filter
router.get('/', (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let products = readJsonFile('products.json');

    // Apply search filter
    if (search) {
      products = products.filter(product => 
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category && category !== 'all') {
      products = products.filter(product => product.category === category);
    }

    // Apply price filters
    if (minPrice) {
      products = products.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(product => product.price <= parseFloat(maxPrice));
    }

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product by ID
router.get('/:id', (req, res) => {
  try {
    const products = readJsonFile('products.json');
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product (requires authentication)
router.post('/', verifyToken, (req, res) => {
  try {
    const { title, description, category, price, imageUrl } = req.body;

    // Validate input
    if (!title || !description || !category || !price) {
      return res.status(400).json({ error: 'Title, description, category, and price are required' });
    }

    const products = readJsonFile('products.json');
    
    const newProduct = {
      id: Date.now().toString(),
      title,
      description,
      category,
      price: parseFloat(price),
      imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image',
      sellerId: req.user.userId,
      sellerEmail: req.user.email,
      createdAt: new Date().toISOString(),
      isAvailable: true
    };

    products.push(newProduct);
    writeJsonFile('products.json', products);

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product (requires authentication and ownership)
router.put('/:id', verifyToken, (req, res) => {
  try {
    const { title, description, category, price, imageUrl, isAvailable } = req.body;
    const products = readJsonFile('products.json');
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user owns the product
    if (products[productIndex].sellerId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only update your own products' });
    }

    // Update product
    if (title) products[productIndex].title = title;
    if (description) products[productIndex].description = description;
    if (category) products[productIndex].category = category;
    if (price) products[productIndex].price = parseFloat(price);
    if (imageUrl) products[productIndex].imageUrl = imageUrl;
    if (typeof isAvailable === 'boolean') products[productIndex].isAvailable = isAvailable;

    writeJsonFile('products.json', products);

    res.json({
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product (requires authentication and ownership)
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const products = readJsonFile('products.json');
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user owns the product
    if (products[productIndex].sellerId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    // Remove product
    const deletedProduct = products.splice(productIndex, 1)[0];
    writeJsonFile('products.json', products);

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's products
router.get('/user/:userId', verifyToken, (req, res) => {
  try {
    const products = readJsonFile('products.json');
    const userProducts = products.filter(p => p.sellerId === req.params.userId);
    
    res.json(userProducts);
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get categories
router.get('/categories/list', (req, res) => {
  try {
    const products = readJsonFile('products.json');
    const categories = [...new Set(products.map(p => p.category))];
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
