// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/database');

// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
// }, {
//   timestamps: true, // Adds createdAt and updatedAt fields automatically
// });

// module.exports = User;


const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');
// import  client  from '../config/database';
// import { client } from '../config/database';
console.log(require.resolve('../config/database'));
// Cassandra client configuration
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], // Cassandra node IP
  localDataCenter: 'datacenter1', // Replace with your datacenter name
  keyspace: 'test_keyspace' // Specify the keyspace
});

// User model: CRUD functions
const User = {
  // Create a new user
  create: async (username, password) => {
    
    const query = `INSERT INTO test_keyspace.users (id, username, password, created_at, updated_at) VALUES (?, ?, ?, toTimestamp(now()), toTimestamp(now()))`;
    const params = [uuidv4(), username, password];
    await client.execute(query, params, { prepare: true });
  },

  // Find a user by username
  findByUsername: async (username) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    const result = await client.execute(query, [username], { prepare: true });
    return result.rows[0];
  },

  // Update user password
  updatePassword: async (username, newPassword) => {
    const query = `UPDATE users SET password = ?, updated_at = toTimestamp(now()) WHERE username = ?`;
    const params = [newPassword, username];
    await client.execute(query, params, { prepare: true });
  },

  // Delete a user
  delete: async (username) => {
    const query = `DELETE FROM users WHERE username = ?`;
    await client.execute(query, [username], { prepare: true });
  },
};

module.exports = User;