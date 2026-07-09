const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Helper to send JWT cookie + response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedToken();

  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  const userPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    avatar: user.avatar,
    status: user.status,
    createdAt: user.createdAt,
  };

  res.cookie('token', token, cookieOptions).status(statusCode).json({
    success: true,
    token,
    data: userPayload,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if email already in use
    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 400, 'Email is already registered.');
    }

    const user = await User.create({ name, email, password, role: role || 'member', department });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    if (user.status === 'inactive') {
      return sendError(res, 403, 'Your account has been deactivated.');
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Logout — clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  sendSuccess(res, 200, null, 'Logged out successfully.');
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, 200, user);
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, 'Current password is incorrect.');
    }

    user.password = newPassword;
    await user.save();
    sendSuccess(res, 200, null, 'Password changed successfully.');
  } catch (err) {
    next(err);
  }
};
