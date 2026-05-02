const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Add money to account (Credit)
// @route   POST /api/transactions/credit
// @access  Private
const addMoney = async (req, res) => {
  const { amount, description } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    user.currentBalance += numAmount;
    await user.save();

    const transaction = await Transaction.create({
      senderId: user.userId,
      type: 'credit',
      amount: numAmount,
      status: 'success',
      description: description || 'Added money to wallet',
    });

    console.log(`[TRANSACTION] Credit success: ${user.email}, Amount: ${numAmount}`);

    return res.status(201).json({
      message: 'Money added successfully',
      balance: user.currentBalance,
      transaction
    });
  } catch (error) {
    console.error(`[ERROR] addMoney: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Transfer money to another user
// @route   POST /api/transactions/transfer
// @access  Private
const transferMoney = async (req, res) => {
  const { receiverIdOrEmail, amount, description } = req.body;

  try {
    const sender = await User.findById(req.user._id);
    const receiver = await User.findOne({
      $or: [{ userId: receiverIdOrEmail }, { email: receiverIdOrEmail }]
    });

    const numAmount = Number(amount);

    if (!receiver) {
      console.warn(`[TRANSACTION] Transfer failed (User not found): Sender ${sender.email}, Target ${receiverIdOrEmail}`);
      await Transaction.create({
        senderId: sender.userId,
        receiverId: receiverIdOrEmail,
        type: 'transfer',
        amount: numAmount,
        status: 'failed',
        description: description || 'Transfer',
        reason: 'User not found'
      });
      return res.status(404).json({ message: 'Receiver not found' });
    }

    if (sender.userId === receiver.userId) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (sender.currentBalance < numAmount) {
      console.warn(`[TRANSACTION] Transfer failed (Insufficient balance): Sender ${sender.email}, Amount ${numAmount}`);
      await Transaction.create({
        senderId: sender.userId,
        receiverId: receiver.userId,
        type: 'transfer',
        amount: numAmount,
        status: 'failed',
        description: description || 'Transfer',
        reason: 'Insufficient balance'
      });
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Atomic-like update
    sender.currentBalance -= numAmount;
    receiver.currentBalance += numAmount;

    await sender.save();
    await receiver.save();

    const transaction = await Transaction.create({
      senderId: sender.userId,
      receiverId: receiver.userId,
      type: 'transfer',
      amount: numAmount,
      status: 'success',
      description: description || 'Fund transfer'
    });

    console.log(`[TRANSACTION] Transfer success: ${sender.email} -> ${receiver.email}, Amount: ${numAmount}`);

    return res.status(201).json({
      message: 'Transfer successful',
      balance: sender.currentBalance,
      transaction
    });
  } catch (error) {
    console.error(`[ERROR] transferMoney: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const transactions = await Transaction.find({
      $or: [{ senderId: user.userId }, { receiverId: user.userId }]
    }).sort({ createdAt: -1 });

    return res.json(transactions);
  } catch (error) {
    console.error(`[ERROR] getTransactions: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMoney,
  transferMoney,
  getTransactions
};
