const express = require('express');
const { 
  getUserProfile, 
  verifyPassword, 
  changeEmail, 
  changePassword, 
  deleteAccount 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/verify-password', protect, verifyPassword);
router.put('/change-email', protect, changeEmail);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
