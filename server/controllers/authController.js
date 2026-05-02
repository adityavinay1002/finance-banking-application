const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.warn(`[AUTH] Registration failed: Email ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate unique userId: USER + 5 random digits
    const userId = 'USER' + Math.floor(10000 + Math.random() * 90000);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      userId,
      currentBalance: 0
    });

    if (user) {
      console.log(`[AUTH] User registered: ${email} (${userId})`);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        currentBalance: user.currentBalance,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(`[ERROR] registerUser: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(`[AUTH] User logged in: ${email}`);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId,
        currentBalance: user.currentBalance,
        token: generateToken(user._id),
      });
    } else {
      console.warn(`[AUTH] Login failed: Invalid credentials for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`[ERROR] loginUser: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = { registerUser, loginUser };
