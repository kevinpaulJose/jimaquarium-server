// routes/carts.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart"); // Import the Cart model
const Product = require("../models/Product");

router.post("/add", async (req, res) => {
  try {
    const { userId, cart } = req.body;
    let outOfStock = false;
    let stockFlag = false;

    // Validate input
    if (!userId || !cart || !Array.isArray(cart)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Fetch products from the database based on cart items
    const productIds = cart.map((item) => item.productId);
    const products = await Product.find({ id: { $in: productIds } });

    // Check stock and update cart
    const updatedCart = cart.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (item.quantity > product.stock) {
        stockFlag = true;
        outOfStock = true;
      }
      if(outOfStock) {
        outOfStock = false;
        return {
          ...item,
          quantity: product.stock,
        };
      }
      return {
        ...item
      };
    });

    // Update or insert cart data in MongoDB
    const existingUser = await Cart.findOne({ userId });

    if (existingUser) {
      // Update existing cart
      existingUser.cart = updatedCart;
      await existingUser.save();
    } else {
      // Create new user record
      const newCart = new Cart({
        userId,
        cart: updatedCart,
      });
      await newCart.save();
    }

    if(stockFlag) {
      return res.status(201).json({ updatedCart });
    } else {
      return res.status(200).json({ updatedCart });
    }
    
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/get", async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the cart data for the specified user
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res
        .status(201)
        .json({ message: "Cart data not found for the user" });
    }

    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
