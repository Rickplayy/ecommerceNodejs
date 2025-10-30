
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

module.exports = router;
