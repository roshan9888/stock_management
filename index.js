const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
// const { sequelize } = require('./config/database');
const { searchStocks } = require('./utils/stockSearch');
const { client } = require('../backend/config/database');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stocks/search', searchStocks);

const PORT = process.env.PORT || 4000;
// const cassandra = require('cassandra-driver');

// // Cassandra client setup
// const client = new cassandra.Client({
//   contactPoints: ['127.0.0.1:9042'], // Replace with your Cassandra node IPs
//   localDataCenter: 'datacenter1', // Replace with your datacenter name
//   keyspace: 'test_keyspace', // Replace with your keyspace
// });

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    // Test Cassandra connection
    await client.connect();
    console.log('Connected to Cassandra successfully');
  } catch (err) {
    console.error('Unable to connect to Cassandra:', err);
  }
});

// module.exports = { client };

// app.listen(PORT, async () => {
//   console.log(`Server is running on port ${PORT}`);
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected successfully');
//   } catch (err) {
//     console.error('Unable to connect to the database:', err);
//   }
// });

// const Stock = require('./models/Stock'); // Adjust the path to your model

// Sync the table with the database
// Stock.sync({ force: false }) // Change to `force: true` if you want to drop and recreate the table
//   .then(() => {
//     console.log('Stocks table created successfully.');
//   })
//   .catch((err) => {
//     console.error('Error creating stocks table:', err);
//   });
