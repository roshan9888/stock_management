const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');

// Cassandra client configuration
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], // Cassandra node IP
  localDataCenter: 'datacenter1', // Replace with your datacenter name
  keyspace: 'test_keyspace' // Specify the keyspace
});

// Function to ensure the users table exists
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

// User model: CRUD functions
const User = {
  // Create a new user
  create: async (username, password) => {
    await ensureUsersTable(); // Ensure the table exists
    const query = `INSERT INTO users (id, username, password, created_at, updated_at) VALUES (?, ?, ?, toTimestamp(now()), toTimestamp(now()))`;
    const params = [uuidv4(), String(username), String(password)];
    await client.execute(query, params, { prepare: true });
  },


  findByUsername: async (username) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const result = await client.execute(query, [username], { prepare: true });
    return result.rows[0];
  },

  // Update user password
  updatePassword: async (username, newPassword) => {
    await ensureUsersTable(); // Ensure the table exists
    const query = `UPDATE users SET password = ?, updated_at = toTimestamp(now()) WHERE username = ?`;
    const params = [String(newPassword), String(username)];
    await client.execute(query, params, { prepare: true });
  },

  // Delete a user
  delete: async (username) => {
    await ensureUsersTable(); // Ensure the table exists
    const query = `DELETE FROM users WHERE username = ?`;
    await client.execute(query, [String(username)], { prepare: true });
  },
};

// Ensure the table exists upon initialization
ensureUsersTable().catch(err => console.error('Failed to ensure users table:', err));

module.exports = User;