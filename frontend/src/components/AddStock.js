import React, { useState } from 'react';
import axios from 'axios';

const AddStock = ({ fetchStocks }) => {
  const [stockName, setStockName] = useState('');
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/api/stocks/add',
        { stockName, ticker, quantity, buyPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Stock added!');
      fetchStocks();
    } catch (error) {
      alert('Error adding stock.');
    }
  };

  return (
    <form onSubmit={handleAddStock}>
      <h2>Add Stock</h2>
      <input type="text" placeholder="Stock Name" value={stockName} onChange={(e) => setStockName(e.target.value)} required />
      <input type="text" placeholder="Ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} required />
      <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      <input type="number" placeholder="Buy Price" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} required />
      <button type="submit">Add Stock</button>
    </form>
  );
};

export default AddStock;
