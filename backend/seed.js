const sequelize = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const bcrypt = require('bcrypt');

const products = [
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
