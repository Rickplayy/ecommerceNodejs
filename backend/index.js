console.log('--- Executing index.js (DEBUG) ---');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');

// Import middleware
const auth = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

const app = express();
const port = process.env.PORT || 3001;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define associations
User.hasOne(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);
CartItem.belongsTo(Product);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Configure CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  next();
});
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://ecommerce-rockpa-frontend.s3-website.us-east-2.amazonaws.com',
    'http://ecommerce-rockpa-frontend.s3-website.us-east-2.amazonaws.com'
  ],
  credentials: true
}));

// Middlewares
app.use(bodyParser.json());
app.use(express.json()); // Alternative to bodyParser

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '¡Backend funcionando correctamente!', 
    timestamp: new Date() 
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date() 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// Start server function
async function startServer() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true }); // Use { alter: true } to update tables
    console.log('✅ All models were synchronized successfully.');
    
    // Create sample products if database is empty
    const productsCount = await Product.count();
    if (productsCount === 0) {
      await Product.bulkCreate([
        {
          name: 'Camiseta Básica',
          description: 'Camiseta de algodón 100%',
          price: 29.99,
          image: '/images/tshirt.jpg',
          category: 'men'
        },
        {
          name: 'Jeans Clásicos',
          description: 'Jeans ajustados para mujer',
          price: 79.99,
          image: '/images/jeans.jpg', 
          category: 'women'
        },
        {
          name: 'Gorra Deportiva',
          description: 'Gorra ajustable',
          price: 24.99,
          image: '/images/cap.jpg',
          category: 'accessories'
        }
      ]);
      console.log('✅ Sample products created');
    }
    
    // Start listening
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📚 API available at: http://localhost:${port}/api`);
      console.log(`🏥 Health check: http://localhost:${port}/api/health`);
    });
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    console.error('❌ Server startup error:', error);
    process.exit(1); // Exit if can't connect to database
  }
}

// Start the server
startServer();