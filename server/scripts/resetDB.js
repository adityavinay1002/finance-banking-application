const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from one level up
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Transaction = require('../models/Transaction');

const resetDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    console.log('Clearing Users...');
    await User.deleteMany({});
    
    console.log('Clearing Transactions...');
    await Transaction.deleteMany({});

    console.log('Database reset successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error.message);
    process.exit(1);
  }
};

resetDB();
