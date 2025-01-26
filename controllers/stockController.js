// const Stock = require('../models/Stock');
// const axios = require('axios');
// const { getStockPrice } = require('../utils/stockPrice');

// // Get all stocks for a user
// exports.getStocks = async (req, res) => {
//   try {
//     const stocks = await Stock.findAll();
//     res.status(200).json(stocks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching stocks' });
//   }
// };

// // Add a new stock

// exports.addStock = async (req, res) => {
//   const { stockName, ticker, quantity, buyPrice} = req.body;
//   try {
//     const stock = await Stock.create({ stockName, ticker, quantity, buyPrice});
//     res.status(201).json(stock);
//   } catch (error) {
//     console.error('Error adding stock:', error);
//     res.status(500).json({ message: 'Error adding stock' });
//   }
// };

// // Update stock
// exports.updateStock = async (req, res) => {
//   const { id } = req.params;
//   const { stockName, ticker, quantity, buyPrice } = req.body;
//   try {
//     const stock = await Stock.findByPk(id);
//     if (!stock) return res.status(404).json({ message: 'Stock not found' });

//     stock.stockName = stockName;
//     stock.ticker = ticker;
//     stock.quantity = quantity;
//     stock.buyPrice = buyPrice;
//     await stock.save();

//     res.status(200).json(stock);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating stock' });
//   }
// };

// // Delete stock
// exports.deleteStock = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const stock = await Stock.findByPk(id);
//     if (!stock) return res.status(404).json({ message: 'Stock not found' });

//     await stock.destroy();
//     res.status(200).json({ message: 'Stock deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting stock' });
//   }
// };

// // Calculate portfolio value
// exports.calculatePortfolioValue = async (req, res) => {
//   try {
//     const stocks = await Stock.findAll();
//     let totalValue = 0;

//     for (const stock of stocks) {
//       const currentPrice = await getStockPrice(stock.ticker);
//       totalValue += currentPrice * stock.quantity;
//     }

//     res.status(200).json({ portfolioValue: totalValue });
//   } catch (error) {
//     res.status(500).json({ message: 'Error calculating portfolio value' });
//   }
// };


const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');
const { getStockPrice } = require('../utils/stockPrice');

// Cassandra client setup
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'], // Update with your Cassandra node IP
  localDataCenter: 'datacenter1', // Replace with your datacenter
  keyspace: 'test_keyspace', // Replace with your keyspace
});

// Get all stocks for a user
exports.getStocks = async (req, res) => {
  try {
    const query = 'SELECT * FROM stocks';
    const result = await client.execute(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ message: 'Error fetching stocks' });
  }
};

// Add a new stock
exports.addStock = async (req, res) => {
  const { stockName, ticker, quantity, buyPrice } = req.body;
  const id = uuidv4();
  try {
    const query = `
      INSERT INTO stocks (id, stock_name, ticker, quantity, buy_price, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()))
    `;
    const params = [id, stockName, ticker, quantity, buyPrice];
    await client.execute(query, params, { prepare: true });

    res.status(201).json({ id, stockName, ticker, quantity, buyPrice });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ message: 'Error adding stock' });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { stockName, ticker, quantity, buyPrice } = req.body;

  try {
    // Check if the stock exists
    const selectQuery = 'SELECT * FROM stocks WHERE id = ?';
    const result = await client.execute(selectQuery, [id], { prepare: true });
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const updateQuery = `
      UPDATE stocks
      SET stock_name = ?, ticker = ?, quantity = ?, buy_price = ?, updated_at = toTimestamp(now())
      WHERE id = ?
    `;
    const params = [stockName, ticker, quantity, buyPrice, id];
    await client.execute(updateQuery, params, { prepare: true });

    res.status(200).json({ id, stockName, ticker, quantity, buyPrice });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Error updating stock' });
  }
};

// Delete stock
exports.deleteStock = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM stocks WHERE id = ?';
    await client.execute(query, [id], { prepare: true });
    res.status(200).json({ message: 'Stock deleted' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ message: 'Error deleting stock' });
  }
};

// Calculate portfolio value
exports.calculatePortfolioValue = async (req, res) => {
  try {
    const query = 'SELECT * FROM stocks';
    const result = await client.execute(query);
    const stocks = result.rows;

    let totalValue = 0;

    for (const stock of stocks) {
      const currentPrice = await getStockPrice(stock.ticker);
      totalValue += currentPrice * stock.quantity;
    }

    res.status(200).json({ portfolioValue: totalValue });
  } catch (error) {
    console.error('Error calculating portfolio value:', error);
    res.status(500).json({ message: 'Error calculating portfolio value' });
  }
};