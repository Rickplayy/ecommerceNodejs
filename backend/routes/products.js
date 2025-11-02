const express = require('express');
const { Op } = require('sequelize');
const Product = require('../models/Product');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.findAll({ where: { category: req.params.category } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Search products
router.get('/search', async (req, res) => {
    const { q } = req.query;
    console.log('Searching for:', q);
    try {
        if (!q) {
            console.log('No query provided.');
            return res.json([]);
        }
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${q}%` } },
                    { description: { [Op.like]: `%${q}%` } }
                ]
            }
        });
        console.log('Found products:', products.length);
        res.json(products);
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Create a new product (admin only - add authentication middleware as needed)
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;