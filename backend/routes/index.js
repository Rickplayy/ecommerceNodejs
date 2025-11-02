const express = require('express');
const router = express.Router();

// Ruta de health check
router.get('/health', async (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Ruta de debug para verificar datos
router.get('/debug', async (req, res) => {
  try {
    const { Product, User } = require('../models');
    const products = await Product.findAll();
    const users = await User.findAll();
    
    res.json({
      productsCount: products.length,
      usersCount: users.length,
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;