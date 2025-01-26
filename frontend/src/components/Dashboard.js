// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Dashboard = () => {
//   const [stocks, setStocks] = useState([]);
//   const [stockName, setStockName] = useState('');
//   const [ticker, setTicker] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [buyPrice, setBuyPrice] = useState('');
//   const [editMode, setEditMode] = useState(false); // Track if we are editing
//   const [editStockId, setEditStockId] = useState(null); // Track the stock being edited
//   const [totalValue, setTotalValue] = useState(0); // Track total portfolio value
//   const [searchQuery, setSearchQuery] = useState(''); // For searching stocks
//   const [searchResults, setSearchResults] = useState([]); // Store search results

  
//   const fetchStocks = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:4000/api/stocks', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStocks(response.data);
//       calculateTotalValue(response.data);
//     } catch (error) {
//       alert('Error fetching stocks.');
//     }
//   };

//   const calculateTotalValue = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:4000/api/stocks/portfolio', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if(!response.data.portfolioValue) {
//         throw new Error('Portfolio value not found');
//         }
//         console.log('Portfolio Value:', response.data.portfolioValue); // Display portfolio value
//         setTotalValue(response.data.portfolioValue);
//       console.log('Portfolio Value:', response.data.portfolioValue); // Display portfolio value
//     } catch (error) {
//       console.error('Error fetching portfolio value:', error); // Handle errors
//     }
//   };

//     // Search for stocks using Alpha Vantage API
//     const searchStocks = async () => {
//         try {
//           const response = await axios.get(
//             `http://localhost:4000/api/stocks/search?query=${searchQuery}`
//           );
//           setSearchResults(response.data);
//         } catch (error) {
//           console.error('Error searching stocks:', error);
//         }
//       };

//   const deleteStock = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:4000/api/stocks/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Stock deleted!');
//       fetchStocks();
//     } catch (error) {
//       alert('Error deleting stock.');
//     }
//   };

//   const addStock = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         'http://localhost:4000/api/stocks/add',
//         { stockName, ticker, quantity, buyPrice },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Stock added!');
//       resetForm();
//       fetchStocks();
//     } catch (error) {
//       alert('Error adding stock.');
//     }
//   };

//   const updateStock = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:4000/api/stocks/${editStockId}`,
//         { stockName, ticker, quantity, buyPrice },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Stock updated!');
//       resetForm();
//       fetchStocks();
//     } catch (error) {
//       alert('Error updating stock.');
//     }
//   };

//   const startEditing = (stock) => {
//     setEditMode(true);
//     setEditStockId(stock.id);
//     setStockName(stock.stockName);
//     setTicker(stock.ticker);
//     setQuantity(stock.quantity);
//     setBuyPrice(stock.buyPrice);
//   };

//   const resetForm = () => {
//     setEditMode(false);
//     setEditStockId(null);
//     setStockName('');
//     setTicker('');
//     setQuantity('');
//     setBuyPrice('');
//   };

//   useEffect(() => {
//     fetchStocks();
//   }, []);

//   return (
//     <div>
//       <h2>Stock Dashboard</h2>
//       <h3>Total Portfolio Value: ${totalValue.toFixed(2)}</h3>

//       {/* Add/Update Stock Form */}
//       <form onSubmit={editMode ? updateStock : addStock}>
//         <h3>{editMode ? 'Update Stock' : 'Add Stock'}</h3>
//         <input
//           type="text"
//           placeholder="Stock Name"
//           value={stockName}
//           onChange={(e) => setStockName(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Ticker"
//           value={ticker}
//           onChange={(e) => setTicker(e.target.value)}
//           required
//         />
//         <input
//           type="number"
//           placeholder="Quantity"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//           required
//         />
//         <input
//           type="number"
//           placeholder="Buy Price"
//           value={buyPrice}
//           onChange={(e) => setBuyPrice(e.target.value)}
//           required
//         />
//         <button type="submit">{editMode ? 'Update Stock' : 'Add Stock'}</button>
//         {editMode && <button onClick={resetForm}>Cancel</button>}
//       </form>
      
//        {/* Search Bar */}
//        <div>
//         <h3>Search Stocks</h3>
//         <input
//           type="text"
//           placeholder="Search by name or ticker"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button onClick={searchStocks}>Search</button>
//         {searchResults.length > 0 && (
//           <div>
//             <h4>Search Results:</h4>
//             <ul>
//               {searchResults.map((result, index) => (
//                 <li key={index}>
//                   {result.symbol} - {result.name} ({result.currency})
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Stock Table */}
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Ticker</th>
//             <th>Quantity</th>
//             <th>Buy Price</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stocks.map((stock) => (
//             <tr key={stock.id}>
//               <td>{stock.stockName}</td>
//               <td>{stock.ticker}</td>
//               <td>{stock.quantity}</td>
//               <td>{stock.buyPrice}</td>
//               <td>
//                 <button onClick={() => deleteStock(stock.id)}>Delete</button>
//                 <button onClick={() => startEditing(stock)}>Edit</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Dashboard;


import React, { use, useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [stockName, setStockName] = useState('');
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [editMode, setEditMode] = useState(false); // Track if we are editing
  const [editStockId, setEditStockId] = useState(null); // Track the stock being edited
  const [totalValue, setTotalValue] = useState(0); // Track total portfolio value
  const [searchQuery, setSearchQuery] = useState(''); // For searching stocks
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [nifty, setNifty] = useState(null); // Track live Nifty rating
  const [sensex, setSensex] = useState(null); // Track live Sensex rating

  
  const fetchLiveRatings = async () => {
    try {
      const apiKey = 'UTUMXKH7O9Z0CR4Z';
      
      // Fetch Nifty data
      // const niftyResponse = await axios.get(
      //   `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^NSEI&apikey=${apiKey}`
      // );

      const niftyResponse = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^NSEI&apikey=${apiKey}`
      );
      console.log(niftyResponse.data);
      // Fetch Sensex data
      const sensexResponse = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^BSESN&apikey=${apiKey}`
      );

      const niftyData = niftyResponse.data['Global Quote'];
      const sensexData = sensexResponse.data['Global Quote'];

      setNifty(niftyData['05. price']);
      setSensex(sensexData['05. price']);
    } catch (error) {
      console.error('Error fetching live ratings:', error);
    }
  };

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/stocks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(response.data);
      calculateTotalValue(response.data);
    } catch (error) {
      alert('Error fetching stocks.');
    }
  };

  const calculateTotalValue = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/stocks/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.portfolioValue) {
        throw new Error('Portfolio value not found');
      }
      setTotalValue(response.data.portfolioValue);
    } catch (error) {
      console.error('Error fetching portfolio value:', error);
    }
  };

  const searchStocks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/stocks/search?query=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching stocks:', error);
    }
  };

  const deleteStock = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/stocks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Stock deleted!');
      fetchStocks();
    } catch (error) {
      alert('Error deleting stock.');
    }
  };

  const addStock = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/api/stocks/add',
        { stockName, ticker, quantity, buyPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Stock added!');
      resetForm();
      fetchStocks();
    } catch (error) {
      alert('Error adding stock.');
    }
  };

  const updateStock = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/api/stocks/${editStockId}`,
        { stockName, ticker, quantity, buyPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Stock updated!');
      resetForm();
      fetchStocks();
    } catch (error) {
      alert('Error updating stock.');
    }
  };

  const startEditing = (stock) => {
    setEditMode(true);
    setEditStockId(stock.id);
    setStockName(stock.stockName);
    setTicker(stock.ticker);
    setQuantity(stock.quantity);
    setBuyPrice(stock.buyPrice);
  };

  const resetForm = () => {
    setEditMode(false);
    setEditStockId(null);
    setStockName('');
    setTicker('');
    setQuantity('');
    setBuyPrice('');
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    fetchLiveRatings();
  }
  , []);

  return (
    <div className="min-h-screen bg-[#155c7f] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Stock Portfolio Dashboard</h2>
        <div className="flex space-x-6 justify-end -mb-6">
            <div className="text-green-500">
              <h4 className="font-semibold">Nifty</h4>
              <p className="text-xl">{nifty ? `₹${parseFloat(nifty).toFixed(2)}` : 'Loading...'}</p>
            </div>
            <div className="text-green-500">
              <h4 className="font-semibold">Sensex</h4>
              <p className="text-xl">{sensex ? `₹${parseFloat(sensex).toFixed(2)}` : 'Loading...'}</p>
            </div>
          </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Total Portfolio Value: <span className="text-green-600">${totalValue.toFixed(2)}</span>
        </h3>

        {/* Add/Update Stock Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editMode ? 'Update Stock' : 'Add Stock'}
          </h3>
          <form onSubmit={editMode ? updateStock : addStock} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Stock Name"
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Buy Price"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                {editMode ? 'Update Stock' : 'Add Stock'}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Search Stocks</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name or ticker"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={searchStocks}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Search
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-700">Search Results:</h4>
              <ul className="list-disc list-inside">
                {searchResults.map((result, index) => (
                  <li key={index} className="text-gray-800">
                    {result.symbol} - {result.name} ({result.currency})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Stock Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Stocks</h3>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Ticker</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Buy Price</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{stock.stockName}</td>
                  <td className="px-4 py-2 border">{stock.ticker}</td>
                  <td className="px-4 py-2 border">{stock.quantity}</td>
                  <td className="px-4 py-2 border">${stock.buyPrice}</td>
                  <td className="px-4 py-2 border flex flex-row gap-2 justify-center">
                    <button
                      onClick={() => deleteStock(stock.id)}
                      className="text-red-500 hover:underline border border-red-500 px-2 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => startEditing(stock)}
                      className="text-blue-500 hover:underline ml-2 border border-blue-500 px-2 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
