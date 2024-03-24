// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import the Product model

// Example route to add a product
router.post('/add', async (req, res) => {
  try {
    const {
      productId,
      name,
      price,
      desc,
      theme,
      size,
      categories,
      stock,
      img,
      defaultWeight,
      bunch
    } = req.body;

    // Validate input
    if (!productId || !name || !price || !stock || !img) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check if product with the given ID exists
    const existingProduct = await Product.findOne({ productId });

    if (existingProduct) {
      // Update existing product
      existingProduct.name = name;
      existingProduct.price = price;
      existingProduct.desc = desc;
      existingProduct.theme = theme;
      existingProduct.size = size;
      existingProduct.categories = categories;
      existingProduct.stock = stock;
      existingProduct.img = img;
      existingProduct.defaultWeight = defaultWeight;
      existingProduct.bunch = bunch;
      existingProduct.updated = parseInt(stock) !== 0 ? Date.now() : existingProduct.updated
      await existingProduct.save();
    } else {
      // Create new product
      const newProduct = new Product({
        productId,
        name,
        price,
        desc,
        theme,
        size,
        categories,
        stock,
        img,
        defaultWeight,
        bunch,
        updated: Date.now()
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
      const allProducts = await Product.find().sort({"updated": -1}); // Retrieve all products from the database
      res.status(200).json({products: allProducts});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/delete', async (req, res) => {
    try {
      const { productId } = req.body; // Get the product ID from the request body
      const result = await Product.deleteOne({productId: productId})
  
      if (result) {
        res.status(200).send({ message: 'Product deleted successfully', deletedProduct: result });
      } else {
        res.status(404).send({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error deleting product', error: error.message });
    }
  });

module.exports = router;
