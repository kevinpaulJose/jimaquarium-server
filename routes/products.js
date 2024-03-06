// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import the Product model

// Example route to add a product
router.post('/add', async (req, res) => {
  try {
    const { id, name, price, description, theme, size, categories, stock, img } = req.body;

    // Create a new product entry
    const newProduct = new Product({
      id,
      name,
      price,
      description,
      theme,
      size,
      categories,
      stock,
      img, // Assuming img is a base64 string received in the request body
    });

    await newProduct.save();
    res.status(200).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
    try {
      const allProducts = await Product.find(); // Retrieve all products from the database
      res.status(200).json(allProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
