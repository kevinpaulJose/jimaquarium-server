// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Adjust the path to your Order model

// POST route to create an order
router.post('/add', async (req, res) => {
    try {
      const {
        userId,
        orderId,
        products,
        paymentStatus,
        total,
        status,
        shipping,
        box,
      } = req.body;
  
      // Validate input
      if (!userId || !orderId || !products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      // Check if order with the given ID already exists
      const existingOrder = await Order.findOne({ orderId });
  
      if (existingOrder) {
        return res.status(409).json({ message: 'Order with the same ID already exists' });
      }
  
      // Create a new order
      const newOrder = new Order({
        userId,
        orderId,
        products,
        paymentStatus,
        total,
        status,
        shipping,
        box,
      });
  
      await newOrder.save();
  
      return res.status(200).json({ message: 'Order saved successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
router.post('/update', async (req, res) => {
    try {
      const { orderId, paymentStatus, status } = req.body;
  
      // Validate input
      if (!orderId) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      // Find and update the order
      const existingOrder = await Order.findOne({ orderId });
  
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if(paymentStatus) {
        existingOrder.paymentStatus = paymentStatus;
      }
      if(status) {
        existingOrder.status = status;
      }
      
      await existingOrder.save();
  
      return res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post('/get', async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Validate input
      if (!userId) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      // Find orders by userId
      const userOrders = await Order.find({ userId }).sort({'orderId': -1});
  
      return res.status(200).json({ orders: userOrders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
