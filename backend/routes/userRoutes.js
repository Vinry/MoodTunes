const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // First check if the user already exists
  const existingUser = await User.findUser(username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password before storing in database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Create the new user
    await User.createUser(username, hashedPassword);
    res.status(200).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findUser(username);

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
