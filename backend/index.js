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

const corsOptions = {
  origin: [
    'http://ecommerce-rockpa-frontend.s3-website.us-east-2.amazonaws.com',
    'http://localhost:3000',
    'https://spontaneous-brigadeiros-39d714.netlify.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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
    console.log('Connection has been established successfully.');

    // Sync all models safely without dropping tables
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    // Create initial catalog products if database is empty
    const productsCount = await Product.count();
    if (productsCount === 0) {
      await Product.bulkCreate([
        {
          name: 'Anillo chapado en oro',
          description: 'Anillo chapado en oro con zirconia',
          price: 600,
          image: '/uploads/1787087273690.jpg',
          category: 'accessories'
        },
        {
          name: 'Playera sin mangas',
          description: 'Playera sin mangas de verano',
          price: 300,
          image: '/uploads/1787087304210.jpg',
          category: 'men'
        },
        {
          name: 'Camisa para playa',
          description: 'Camisa para playa azul con blanco',
          price: 400,
          image: '/uploads/1787087379179.jpg',
          category: 'men'
        },
        {
          name: 'Camisa para playa cuadros',
          description: 'Camisa para playa de cuadros',
          price: 500,
          image: '/uploads/1787087413991.jpg',
          category: 'men'
        },
        {
          name: 'Vestido rojo',
          description: 'Vestido de noche',
          price: 800,
          image: '/uploads/1787087448374.jpg',
          category: 'women'
        },
        {
          name: 'Vestido blanco',
          description: 'Vestido para verano',
          price: 800,
          image: '/uploads/1787087465392.jpg',
          category: 'women'
        },
        {
          name: 'Vestido beige',
          description: 'Vestido para verano',
          price: 800,
          image: '/uploads/1787087489262.jpg',
          category: 'women'
        },
        {
          name: 'Cadena de plata',
          description: 'Cadena de plata .925',
          price: 1800,
          image: '/uploads/1787087529113.jpg',
          category: 'accessories'
        },
        {
          name: 'Pulsera de plata',
          description: 'Pulsera de plata .925',
          price: 800,
          image: '/uploads/1787087548515.jpg',
          category: 'accessories'
        }
      ]);
      console.log('Initial catalog products seeded successfully.');
    }

    // Ensure default admin user exists if empty
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await Cart.create({ UserId: adminUser.id });
      console.log('Admin user initialized.');
    }

    // Start listening
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API available at: http://localhost:${port}/api`);
      console.log(`Health check: http://localhost:${port}/api/health`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('Server startup error:', error);
    process.exit(1); // Exit if can't connect to database
  }
}

// Start the server
startServer();