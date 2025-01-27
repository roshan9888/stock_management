const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid')

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'test_keyspace'
});

const ensureUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username TEXT,
      password TEXT,
      created_at TIMESTAMP,
      updated_at TIMESTAMP
    );
  `;
  await client.execute(createTableQuery);
};
exports.register = async (req, res) => {
  try {
    // Ensure the request body contains the expected properties
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Generate a new UUID for the user ID
    const userId = uuidv4();

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const query = 'INSERT INTO users (id, username, password, created_at, updated_at) VALUES (?, ?, ?, toTimestamp(now()), toTimestamp(now()))';
    const params = [userId, username, hashedPassword];
    await client.execute(query, params, { prepare: true });

    // Return a success response
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error('Failed to register user:', error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};

// Ensure the table exists upon initialization
ensureUsersTable().catch(err => console.error('Failed to ensure users table:', err));


exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Log the received username and password for debugging purposes
  console.log('Received login request:', { username, password });

  try {
    // Find the user by username
    const user = await User.findByUsername(username);
    console.log('User found:', user);

    // If user is not found, return an error
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the input password with the stored hashed password using bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPassword);

    // If password is not valid, return an error
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};