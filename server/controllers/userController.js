const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      console.log(`[USER] Profile accessed: ${user.email}`);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        currentBalance: user.currentBalance,
        createdAt: user.createdAt,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`[ERROR] getUserProfile: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const verifyPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(`[AUTH] Password verified for: ${user.email}`);
      return res.json({ success: true, balance: user.currentBalance });
    } else {
      console.warn(`[AUTH] Password verification failed for: ${user?.email || 'Unknown'}`);
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error(`[ERROR] verifyPassword: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const changeEmail = async (req, res) => {
  const { newEmail } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const oldEmail = user.email;
    user.email = newEmail;
    await user.save();
    console.log(`[USER] Email updated: ${oldEmail} -> ${newEmail}`);
    return res.json({ message: 'Email updated successfully', email: user.email });
  } catch (error) {
    console.error(`[ERROR] changeEmail: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      console.log(`[AUTH] Password updated for: ${user.email}`);
      return res.json({ message: 'Password updated successfully' });
    } else {
      return res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    console.error(`[ERROR] changePassword: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const uId = user.userId;
      const uEmail = user.email;
      // Delete transactions
      const deletedTransactions = await Transaction.deleteMany({
        $or: [{ senderId: uId }, { receiverId: uId }]
      });
      await User.findByIdAndDelete(req.user._id);
      console.log(`[USER] Account deleted: ${uEmail} (${uId}). Transactions cleared: ${deletedTransactions.deletedCount}`);
      return res.json({ message: 'Account deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`[ERROR] deleteAccount: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getUserProfile, 
  verifyPassword, 
  changeEmail, 
  changePassword, 
  deleteAccount 
};
