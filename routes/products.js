// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import the Product model

// Example route to add a product
router.post('/add', async (req, res) => {
  try {
    const {
      id,
      name,
      price,
      description,
      theme,
      size,
      categories,
      stock,
      img,
    } = req.body;

    // Validate input
    if (!id || !name || !price || !stock || !img) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check if product with the given ID exists
    const existingProduct = await Product.findOne({ id });

    if (existingProduct) {
      // Update existing product
      existingProduct.name = name;
      existingProduct.price = price;
      existingProduct.description = description;
      existingProduct.theme = theme;
      existingProduct.size = size;
      existingProduct.categories = categories;
      existingProduct.stock = stock;
      existingProduct.img = img;
      await existingProduct.save();
    } else {
      // Create new product
      const newProduct = new Product({
        id,
        name,
        price,
        description,
        theme,
        size,
        categories,
        stock,
        img,
      });
      await newProduct.save();
    }

    return res.status(200).json({ message: 'Product saved successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
