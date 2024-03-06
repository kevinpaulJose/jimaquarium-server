// Assuming you have already set up your MongoDB connection and User model (as shown in previous responses)

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// Example route to handle the POST request
router.post('/setUser', async (req, res) => {
  const { username, email } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      // User already exists, do nothing
      return res.status(200).json({ message: 'User already exists' });
    }

    // Create a new user entry
    const newUser = new User({
      username,
      email,
      // Add other properties as needed (e.g., password)
    });

    await newUser.save();
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
