
const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

let upload;
if (process.env.USE_LOCAL_DB === 'true') {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads/'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now().toString() + path.extname(file.originalname))
    }
  });
  upload = multer({ storage: storage });
} else {
  // Configure AWS S3
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Multer-S3 storage configuration
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + path.extname(file.originalname));
      },
    }),
  });
}

// Route to add a new product
router.post('/products', [auth, adminAuth, upload.single('image')], async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? (req.file.location || `/uploads/${req.file.filename}`) : null;

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      image: image,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Route to update a product
router.put('/products/:id', [auth, adminAuth, upload.single('image')], async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedData = {
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price : product.price,
      category: category !== undefined ? category : product.category,
    };

    if (req.file) {
      updatedData.image = req.file.location || `/uploads/${req.file.filename}`;
    }

    await product.update(updatedData);

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product' });
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
