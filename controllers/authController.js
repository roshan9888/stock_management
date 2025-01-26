const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const user = await User.create({ username, password: hashedPassword });
    console.log(user);

    // Create a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ message: 'User registered', token });
  } catch (error) {
    console.error(error);  // Log the error to understand what went wrong
    res.status(500).json({ message: 'Error during registration' });
  }
};

// Login User
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    console.log(user);
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    
     // Compare the input password with the stored hashed password using bcrypt
     const validPassword = await bcrypt.compare(password, user.password);
     console.log('valid', validPassword);
 
     // If password is not valid, return error
     if (!validPassword) {
       return res.status(400).json({ message: 'Invalid username or password' });
     }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error during login' });
  }
};
