const express = require('express');
const { addMoney, transferMoney, getTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/credit', protect, addMoney);
router.post('/transfer', protect, transferMoney);
router.get('/', protect, getTransactions);

module.exports = router;
