const jwt             = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User            = require('../models/User');

const signAccess  = (id) => jwt.sign({ id }, process.env.JWT_SECRET,         { expiresIn: process.env.JWT_EXPIRES_IN });
const signRefresh = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET,  { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

// POST /api/v1/auth/register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: errors.array() } });

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ success: false, error: { code: 'EMAIL_EXISTS', message: 'Email already registered' } });

    const user         = await User.create({ name, email, password });
    const accessToken  = signAccess(user._id);
    const refreshToken = signRefresh(user._id);

    res.status(201).json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (err) { next(err); }
};

// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: errors.array() } });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });

    const accessToken  = signAccess(user._id);
    const refreshToken = signRefresh(user._id);

    res.json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (err) { next(err); }
};

// POST /api/v1/auth/refresh
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'Refresh token required' } });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user || !user.isActive)
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });

    res.json({ success: true, data: { accessToken: signAccess(user._id) } });
  } catch (err) {
    res.status(401).json({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Refresh token expired' } });
  }
};

// POST /api/v1/auth/logout
// Stateless JWT — client must drop both tokens.
exports.logout = (req, res) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
};
