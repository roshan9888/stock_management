// // Stock model with CRUD operations
// // const {client} = require('../config/database');
// const {v4: uuidv4} = require('uuid');
// const client = new cassandra.Client({
//   contactPoints: ['127.0.0.1'], // Cassandra node IP
//   localDataCenter: 'datacenter1', // Replace with your datacenter name
//   keyspace: 'test_keyspace' // Specify the keyspace
// });

// const ensureStocksTable = async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS stocks (
//       user_id UUID,
//       stock_id UUID,
//       stock_name TEXT,
//       ticker TEXT,
//       quantity INT,
//       buy_price DECIMAL,
//       created_at TIMESTAMP,
//       updated_at TIMESTAMP,
//       PRIMARY KEY (user_id, stock_id)
//     );
//   `;
//   try {
//     await client.execute(createTableQuery);
//     console.log('Stocks table ensured');
//   } catch (error) {
//     console.error('Failed to ensure stocks table:', error);
//   }
// };

// const Stock = {
//   // Add a new stock
//   create: async ({ stockName, ticker, quantity = 1, buyPrice }) => {
//     await ensureStocksTable(); // Ensure the table exists
//     const query = `
//       INSERT INTO stocks (id, stock_name, ticker, quantity, buy_price, created_at, updated_at)
//       VALUES (?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()))
//     `;
//     const params = [uuidv4(), stockName, ticker, quantity, buyPrice];
//     await client.execute(query, params, { prepare: true });
//   },

//   // Get all stocks
//   findAll: async () => {
//     await ensureStocksTable(); // Ensure the table exists
//     const query = 'SELECT * FROM stocks';
//     const result = await client.execute(query);
//     return result.rows;
//   },

//   // Get a single stock by ID
//   findById: async (id) => {
//     await ensureStocksTable(); // Ensure the table exists
//     const query = 'SELECT * FROM stocks WHERE id = ?';
//     const result = await client.execute(query, [id], { prepare: true });
//     return result.rows[0];
//   },

//   // Update a stock
//   update: async (id, { stockName, ticker, quantity, buyPrice }) => {
//     await ensureStocksTable(); // Ensure the table exists
//     const query = `
//       UPDATE stocks
//       SET stock_name = ?, ticker = ?, quantity = ?, buy_price = ?, updated_at = toTimestamp(now())
//       WHERE id = ?
//     `;
//     const params = [stockName, ticker, quantity, buyPrice, id];
//     await client.execute(query, params, { prepare: true });
//   },

//   // Delete a stock
//   delete: async (id) => {
//     const query = 'DELETE FROM stocks WHERE id = ?';
//     await client.execute(query, [id], { prepare: true });
//   },
// };

// ensureStocksTable().catch(err => console.error('Failed to ensure users table:', err));

// module.exports = Stock;

const { v4: uuidv4 } = require('uuid');
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], // Cassandra node IP
  localDataCenter: 'datacenter1', // Replace with your datacenter name
  keyspace: 'test_keyspace', // Specify the keyspace
});

const ensureStocksTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS stocks (
      user_id UUID,
      stock_id UUID,
      stock_name TEXT,
      ticker TEXT,
      quantity INT,
      buy_price DECIMAL,
      created_at TIMESTAMP,
      updated_at TIMESTAMP,
      PRIMARY KEY (user_id, stock_id)
    );
  `;
  try {
    await client.execute(createTableQuery);
    console.log('Stocks table ensured.');
  } catch (error) {
    console.error('Failed to ensure stocks table:', error);
  }
};

const Stock = {
  // Add a new stock
  create: async ({ userId, stockName, ticker, quantity = 1, buyPrice }) => {
    await ensureStocksTable(); // Ensure the table exists
    const query = `
      INSERT INTO stocks (user_id, stock_id, stock_name, ticker, quantity, buy_price, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()))
    `;
    const params = [userId, uuidv4(), stockName, ticker, quantity, buyPrice];
    await client.execute(query, params, { prepare: true });
  },

  // Get all stocks
  findAll: async (userId) => {
    const query = 'SELECT * FROM stocks WHERE user_id = ?';
    const result = await client.execute(query, [userId], { prepare: true });
    return result.rows;
  },

  // Get a single stock by ID
  findById: async (userId, stockId) => {
    const query = 'SELECT * FROM stocks WHERE user_id = ? AND stock_id = ?';
    const result = await client.execute(query, [userId, stockId], { prepare: true });
    return result.rows[0];
  },

  // Update a stock
  update: async (userId, stockId, { stockName, ticker, quantity, buyPrice }) => {
    const query = `
      UPDATE stocks
      SET stock_name = ?, ticker = ?, quantity = ?, buy_price = ?, updated_at = toTimestamp(now())
      WHERE user_id = ? AND stock_id = ?
    `;
    const params = [stockName, ticker, quantity, buyPrice, userId, stockId];
    await client.execute(query, params, { prepare: true });
  },

  // Delete a stock
  delete: async (userId, stockId) => {
    const query = 'DELETE FROM stocks WHERE user_id = ? AND stock_id = ?';
    await client.execute(query, [userId, stockId], { prepare: true });
  },
};

module.exports = Stock;