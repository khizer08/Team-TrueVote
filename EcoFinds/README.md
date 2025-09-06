# EcoFinds - Sustainable Second-Hand Marketplace

A full-stack web application for buying and selling pre-loved items to promote sustainability and reduce waste. Built with React frontend and Node.js/Express backend.

## 🌱 Features

### Frontend (React)
- **Authentication**: User registration and login with JWT tokens
- **Product Management**: Browse, search, and filter products by category and price
- **Product Listing**: Add new products with images, descriptions, and pricing
- **Shopping Cart**: Add/remove items, update quantities, and checkout
- **User Dashboard**: Manage profile, view own products, and track statistics
- **Purchase History**: View past purchases and sales
- **Responsive Design**: Works on desktop and mobile devices

### Backend (Node.js/Express)
- **RESTful API**: Complete CRUD operations for products, users, cart, and purchases
- **Authentication**: JWT-based authentication with password hashing
- **JSON Database**: File-based storage for users, products, cart, and purchases
- **Search & Filter**: Product search by title/description and category filtering
- **Cart Management**: Add/remove items, quantity updates, and checkout
- **Purchase Tracking**: Complete purchase history and sales tracking

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoFinds
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
EcoFinds/
├── backend/
│   ├── data/                 # JSON database files
│   │   ├── users.json
│   │   ├── products.json
│   │   ├── cart.json
│   │   └── purchases.json
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── products.js      # Product CRUD operations
│   │   ├── cart.js          # Shopping cart management
│   │   └── purchases.js     # Purchase history
│   ├── app.js               # Express server setup
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── ProductCard.js
│   │   ├── pages/           # Page components
│   │   │   ├── Login.js
│   │   │   ├── SignUp.js
│   │   │   ├── ProductFeed.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── AddProduct.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Cart.js
│   │   │   └── PreviousPurchases.js
│   │   ├── context/         # React context
│   │   │   └── AuthContext.js
│   │   ├── App.js           # Main app component
│   │   ├── index.js         # App entry point
│   │   └── index.css        # Global styles
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Products
- `GET /products` - Get all products (with search/filter)
- `GET /products/:id` - Get single product
- `POST /products` - Create new product (authenticated)
- `PUT /products/:id` - Update product (authenticated, owner only)
- `DELETE /products/:id` - Delete product (authenticated, owner only)
- `GET /products/categories/list` - Get all categories

### Cart
- `GET /cart` - Get user's cart
- `POST /cart` - Add item to cart
- `PUT /cart/:itemId` - Update cart item quantity
- `DELETE /cart/:itemId` - Remove item from cart
- `DELETE /cart` - Clear entire cart

### Purchases
- `GET /purchases` - Get user's purchase history
- `POST /purchases/checkout` - Complete purchase
- `GET /purchases/sales/history` - Get sales history
- `GET /purchases/stats/summary` - Get purchase/sales statistics

## 🎨 Features Overview

### For Buyers
- Browse and search products
- Filter by category and price range
- Add products to cart
- Complete purchases
- View purchase history
- Track environmental impact

### For Sellers
- List products for sale
- Manage product listings
- Track sales and earnings
- View buyer information
- Update product details

### For Everyone
- User authentication and profiles
- Responsive design for all devices
- Real-time cart updates
- Purchase and sales tracking
- Environmental impact awareness

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Starts development server with hot reload
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Protected routes for authenticated users

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🌍 Environmental Impact

EcoFinds promotes sustainability by:
- Encouraging reuse of pre-loved items
- Reducing waste through second-hand marketplace
- Promoting conscious consumption
- Building a community of eco-conscious users

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Configure SSL certificates

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve static files with a web server
3. Configure API endpoints for production
4. Set up CDN for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🎯 Future Enhancements

- Real-time messaging between buyers and sellers
- Image upload functionality
- Advanced search with filters
- Product recommendations
- User reviews and ratings
- Payment integration
- Mobile app development
- Social features and sharing

---

**Made with ❤️ for the environment** 🌱
