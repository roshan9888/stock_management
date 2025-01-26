const express = require('express');
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/auth');
const { searchStocks } = require('../utils/stockSearch');

const router = express.Router();

router.get('/', authMiddleware, stockController.getStocks);
router.post('/add', authMiddleware, stockController.addStock);
router.put('/:id', authMiddleware, stockController.updateStock);
router.delete('/:id', authMiddleware, stockController.deleteStock);
router.get('/portfolio', authMiddleware, stockController.calculatePortfolioValue);

router.get('/stocks/search', searchStocks);

module.exports = router;
