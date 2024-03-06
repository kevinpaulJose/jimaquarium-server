// routes/carts.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Import the Cart model

// Example route to add/update cart data
router.post('/add', async (req, res) => {
  try {
    const { userId, cart } = req.body;

    // Find the cart data for the specified user
    let existingCart = await Cart.findOne({ userId });

    if (!existingCart) {
      // If cart data doesn't exist, create a new entry
      existingCart = new Cart({
        userId,
        cart,
      });
    } else {
      // If cart data exists, update it
      existingCart.cart = cart;
    }

    await existingCart.save();
    res.status(201).json({ message: 'Cart data added/updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/get', async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Find the cart data for the specified user
      const userCart = await Cart.findOne({ userId });
  
      if (!userCart) {
        return res.status(201).json({ message: 'Cart data not found for the user' });
      }
  
      res.status(200).json(userCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
