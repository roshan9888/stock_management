import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({
    stockName: '',
    ticker: '',
    quantity: 1,
    buyPrice: 0,
  });

  const getStocks = async () => {
    const response = await api.get('/stocks');
    setStocks(response.data);
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    await api.post('/stocks', newStock);
    getStocks();  // Refresh the stock list
  };

  const handleDeleteStock = async (id) => {
    await api.delete(`/stocks/${id}`);
    getStocks();  // Refresh the stock list
  };

  useEffect(() => {
    getStocks();
  }, []);

  return (
    <div>
      <h2>Your Stock Portfolio</h2>

      <form onSubmit={handleAddStock}>
        <input
          type="text"
          placeholder="Stock Name"
          value={newStock.stockName}
          onChange={(e) => setNewStock({ ...newStock, stockName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Ticker"
          value={newStock.ticker}
          onChange={(e) => setNewStock({ ...newStock, ticker: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newStock.quantity}
          onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Buy Price"
          value={newStock.buyPrice}
          onChange={(e) => setNewStock({ ...newStock, buyPrice: e.target.value })}
        />
        <button type="submit">Add Stock</button>
      </form>

      <ul>
        {stocks.map((stock) => (
          <li key={stock.id}>
            {stock.stockName} - {stock.ticker} - {stock.quantity} - ${stock.currentPrice}
            <button onClick={() => handleDeleteStock(stock.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stocks;
