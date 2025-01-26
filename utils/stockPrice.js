const axios = require('axios');
const { config } = require('dotenv');

// Fetch stock price from Alpha Vantage API (or any other stock price API)
exports.getStockPrice = async (ticker) => {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: ticker,
        interval: '1min',
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      },
    });
    console.log("this",response.data);
    const latestData = response.data['Time Series (1min)'];
    const latestTime = Object.keys(latestData)[0];
    const latestClose = latestData[latestTime]['4. close'];

    return parseFloat(latestClose);
  } catch (error) {
    console.error('Error fetching stock price:', error);
    throw new Error('Unable to fetch stock price');
  }
};
