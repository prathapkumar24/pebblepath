const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res, next) => {
  try {
    const userData = req.body;

    const user = new User(userData);
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).reduce((acc, val) => {
          acc[val.path] = val.message;
          return acc;
        }, {}),
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number already exists',
      });
    }
    next(error);
  }
};

// Login user
exports.loginUser = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Mobile and password are required',
        errors: {
          mobile: !mobile ? 'Mobile is required' : undefined,
          password: !password ? 'Password is required' : undefined,
        },
      });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile or password',
        errors: {
          mobile: 'Invalid Mobile number',
        },
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password',
        errors: {
          password: 'Invalid Password',
        },
      });
    }

    // Generate token (optional)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user:{ id: user._id,
        name: user.name,
        mobile: user.mobile},
        token,
    });
  } catch (error) {
    next(error);
  }
};
