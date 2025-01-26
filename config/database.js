// require('dotenv').config();
// const { Sequelize } = require('sequelize');


// console.log(process.env.DATABASE_URL);
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'mysql',
//   logging: false,  // Disable logging for production
// });

// module.exports = { sequelize };

const cassandra = require('cassandra-driver');

// Define Cassandra client configuration
const client = new cassandra.Client({
  contactPoints: ['localhost'], // Replace with your Cassandra node IP
  localDataCenter: 'datacenter1', // Replace with your datacenter name
  keyspace: 'test_keyspace', // Specify your keyspace
});

// Connect to Cassandra
client.connect()
  .then(() => console.log('Connected to Cassandra'))
  .catch(err => console.error('Connection failed:', err));

module.exports = { client };