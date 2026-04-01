const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT authentication middleware.
 * Expects: Authorization: Bearer <token>
 * Attaches the full User document (sans password) to req.user on success.
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({
      success: false,
      error:   { code: 'NO_TOKEN', message: 'No token provided' },
    });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive)
      return res.status(401).json({
        success: false,
        error:   { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error:   { code: 'TOKEN_EXPIRED', message: 'Token expired' },
    });
  }
};
