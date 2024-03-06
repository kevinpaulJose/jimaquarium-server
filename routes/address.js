// routes/addresses.js
const express = require('express');
const router = express.Router();
const Address = require('../models/Address'); // Adjust the path to your Address model

// POST route to create or update an address
router.post('/add', async (req, res) => {
  try {
    const { userId, address } = req.body;

    // Validate input
    if (!userId || !address || !Array.isArray(address)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check if address with the given ID exists
    const existingAddress = await Address.findOne({ userId });

    if (existingAddress) {
      // Update existing address
      existingAddress.address = address;
      await existingAddress.save();
    } else {
      // Create new address
      const newAddress = new Address({
        userId,
        address,
      });
      await newAddress.save();
    }

    return res.status(200).json({ message: 'Address saved successfully' });
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
  
      // Find address by userId
      const userAddress = await Address.findOne({ userId });
  
      if (!userAddress) {
        return res.status(200).json({ address: [] });
      }
  
      return res.status(200).json({ address: userAddress.address });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
