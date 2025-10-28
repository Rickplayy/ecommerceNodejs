
const sequelize = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const bcrypt = require('bcrypt');

const products = [
  {
    name: 'Men\'s T-Shirt',
    description: 'A classic cotton t-shirt for men.',
    price: 25,
    image: 'https://via.placeholder.com/300',
    category: 'men',
  },
  {
    name: 'Men\'s Jeans',
    description: 'Stylish and comfortable jeans for men.',
    price: 75,
    image: 'https://via.placeholder.com/300',
    category: 'men',
  },
  {
    name: 'Women\'s Dress',
    description: 'A beautiful summer dress for women.',
    price: 60,
    image: 'https://via.placeholder.com/300',
    category: 'women',
  },
  {
    name: 'Women\'s Blouse',
    description: 'An elegant blouse for women.',
    price: 45,
    image: 'https://via.placeholder.com/300',
    category: 'women',
  },
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Drop tables in reverse dependency order
    await CartItem.drop();
    await Cart.drop();
    await Product.drop();
    await User.drop();
    console.log('All tables dropped.');

    // Recreate tables
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    // Insert the products
    await Product.bulkCreate(products);
    console.log('Products have been seeded.');

    // Create an admin user
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    await Cart.create({ UserId: adminUser.id });
    console.log('Admin user has been created.');

  } catch (error) {
    console.error('Unable to seed the database:', error);
  } finally {
    await sequelize.close();
    console.log('Connection closed.');
  }
};

seedDatabase();
