// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/database');

// const Stock = sequelize.define('Stock', {
//   stockName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   ticker: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     defaultValue: 1,
//   },
//   buyPrice: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
// });

// module.exports = Stock;

// const cassandra = require('cassandra-driver');
// const { v4: uuidv4 } = require('uuid');

// // Cassandra client setup
// const client = new cassandra.Client({
//   contactPoints: ['127.0.0.1'], // Replace with your Cassandra node IP
//   localDataCenter: 'datacenter1', // Replace with your data center name
//   keyspace: 'your_keyspace_name', // Replace with your keyspace
// });

// Stock model with CRUD operations
const Stock = {
  // Add a new stock
  create: async ({ stockName, ticker, quantity = 1, buyPrice }) => {
    const query = `
      INSERT INTO stocks (id, stock_name, ticker, quantity, buy_price, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()))
    `;
    const params = [uuidv4(), stockName, ticker, quantity, buyPrice];
    await client.execute(query, params, { prepare: true });
  },

  // Get all stocks
  findAll: async () => {
    const query = 'SELECT * FROM stocks';
    const result = await client.execute(query);
    return result.rows;
  },

  // Get a single stock by ID
  findById: async (id) => {
    const query = 'SELECT * FROM stocks WHERE id = ?';
    const result = await client.execute(query, [id], { prepare: true });
    return result.rows[0];
  },

  // Update a stock
  update: async (id, { stockName, ticker, quantity, buyPrice }) => {
    const query = `
      UPDATE stocks
      SET stock_name = ?, ticker = ?, quantity = ?, buy_price = ?, updated_at = toTimestamp(now())
      WHERE id = ?
    `;
    const params = [stockName, ticker, quantity, buyPrice, id];
    await client.execute(query, params, { prepare: true });
  },

  // Delete a stock
  delete: async (id) => {
    const query = 'DELETE FROM stocks WHERE id = ?';
    await client.execute(query, [id], { prepare: true });
  },
};

module.exports = Stock;