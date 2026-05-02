const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      console.log(`[AUTH] Token verified for: ${req.user.email}`);
      return next();
    } catch (error) {
      console.error(`[ERROR] Token verification failed: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.warn(`[AUTH] Access denied: No token provided`);
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
