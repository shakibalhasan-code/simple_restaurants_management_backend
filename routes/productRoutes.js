const express = require('express');
const router = express.Router();
const db = require('../models');
const moment = require('moment-timezone'); // Add moment-timezone

// Create a new product
router.post('/createProduct', async (req, res) => {
  try {
    const { productName, productPrice, productImage } = req.body;

    // Fetch the timezone from the settings table
    const timezoneSetting = await db.Setting.findOne({ where: { key: 'timezone' } });
    const timezone = timezoneSetting ? timezoneSetting.value : 'UTC'; // Default to UTC if not found

    const product = await db.Product.create({
      productName,
      productPrice,
      productImage,
      // Use the timezone from the settings table
      createdAt: moment().tz(timezone).toDate(),
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});



// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await db.Product.findAll({
      attributes: ['productName', 'productPrice', 'productImage', 'id'], // Include productImage
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});


// Edit a product by ID
router.put('/editProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, productPrice, productImage } = req.body;

    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.productName = productName || product.productName;
    product.productPrice = productPrice || product.productPrice;
    product.productImage = productImage || product.productImage;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error editing product', error: error.message });
  }
});

// Delete a product by ID
router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});


module.exports = router;
