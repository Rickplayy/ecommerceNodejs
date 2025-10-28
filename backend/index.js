
console.log('--- Executing index.js (DEBUG) ---');

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

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');

const app = express();
const port = 3001;

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

app.use(cors());
app.use(bodyParser.json());

// POST /api/cart/add route


// GET /api/cart route


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // Sync all models
    sequelize.sync({ alter: true }).then(() => { // Use { alter: true } to update tables
      console.log('All models were synchronized successfully.');
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
