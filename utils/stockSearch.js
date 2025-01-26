// const axios = require('axios');

// exports.searchStocks = async (req, res) => {
//     const { query } = req.query; // Get the search query from the query parameters
  
//     if (!query) {
//       return res.status(400).json({ message: 'Query parameter is required' });
//     }
  
//     try {
//       // Call Alpha Vantage API
//       const apiKey = process.env.ALPHA_VANTAGE_API_KEY; // Add your Alpha Vantage API key to your environment variables
//       const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`;
//       const response = await axios.get(url);
//       console.log(response.data);
//       if (response.data && response.data.bestMatches) {
//         const stocks = response.data.bestMatches.map((stock) => ({
//           symbol: stock['1. symbol'],
//           name: stock['2. name'],
//           type: stock['3. type'],
//           region: stock['4. region'],
//           marketOpen: stock['5. marketOpen'],
//           marketClose: stock['6. marketClose'],
//           timezone: stock['7. timezone'],
//           currency: stock['8. currency'],
//           matchScore: stock['9. matchScore'],
//         }));
  
//         res.status(200).json(stocks);
//       } else {
//         res.status(404).json({ message: 'No stocks found' });
//       }
//     } catch (error) {
//       console.error('Error searching stocks:', error);
//       res.status(500).json({ message: 'Error searching stocks' });
//     }
//   };

const axios = require('axios');

exports.searchStocks = async (req, res) => {
  const { query } = req.query; // Get the search query from the query parameters

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    // Call Alpha Vantage API for stock search
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY; // Add your Alpha Vantage API key to your environment variables
    const searchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`;
    const searchResponse = await axios.get(searchUrl);
    console.log(searchResponse.data);
    if (searchResponse.data && searchResponse.data.bestMatches) {
      const bestMatches = searchResponse.data.bestMatches;

      // Fetch current price for each stock
      const stocksWithPrices = await Promise.all(
        bestMatches.map(async (stock) => {
          const symbol = stock['1. symbol'];

          // Call Alpha Vantage API for the current price
          const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
          const priceResponse = await axios.get(priceUrl);
            console.log(priceResponse.data);
          const currentPrice = priceResponse.data['Global Quote']
            ? priceResponse.data['Global Quote']['05. price']
            : null;

          // Return stock details along with current price
          return {
            symbol,
            name: stock['2. name'],
            type: stock['3. type'],
            region: stock['4. region'],
            marketOpen: stock['5. marketOpen'],
            marketClose: stock['6. marketClose'],
            timezone: stock['7. timezone'],
            currency: stock['8. currency'],
            matchScore: stock['9. matchScore'],
            currentPrice: currentPrice || 'N/A',
          };
        })
      );

      res.status(200).json(stocksWithPrices);
    } else {
      res.status(404).json({ message: 'No stocks found' });
    }
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ message: 'Error searching stocks' });
  }
};
