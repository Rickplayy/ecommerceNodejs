
const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});

const upload = multer({ storage: storage });

// Route to add a new product
router.post('/products', [auth, adminAuth, upload.single('image')], async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = 'uploads/' + req.file.filename; // Get file path from multer

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      image: image
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Route to delete a product
router.delete('/products/:id', [auth, adminAuth], async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedRows = await Product.destroy({ where: { id: productId } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
