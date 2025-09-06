const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const purchaseRoutes = require('./routes/purchases');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize JSON files if they don't exist
const initDataFiles = () => {
  const files = [
    { name: 'users.json', default: [] },
    { name: 'products.json', default: [] },
    { name: 'cart.json', default: [] },
    { name: 'purchases.json', default: [] }
  ];

  files.forEach(file => {
    const filePath = path.join(dataDir, file.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(file.default, null, 2));
    }
  });
};

// Initialize data files
initDataFiles();

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/purchases', purchaseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'EcoFinds API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`EcoFinds API server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
