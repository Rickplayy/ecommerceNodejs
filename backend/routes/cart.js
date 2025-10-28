
const express = require('express');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Add item to cart
router.post('/add', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userData.userId;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let cart = await Cart.findOne({ where: { UserId: userId } });

    if (!cart) {
      cart = await Cart.create({ UserId: userId });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      await CartItem.create({
        CartId: cart.id,
        ProductId: productId,
        quantity,
      });
    }

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's cart
router.get('/', auth, async (req, res) => {
  const userId = req.userData.userId;

  try {
    const cart = await Cart.findOne({
      where: { UserId: userId },
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  const userId = req.userData.userId;

  try {
    const cart = await Cart.findOne({ where: { UserId: userId } });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Cart item quantity updated', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  const userId = req.userData.userId;

  try {
    const cart = await Cart.findOne({ where: { UserId: userId } });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
