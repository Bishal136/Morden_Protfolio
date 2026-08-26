const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Middleware to verify short-lived Access Token in Authorization header
 */
const verifyAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No bearer token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'dev_access_token_secret_bishal_portfolio_2026_secure'
    );

    const admin = await Admin.findById(decoded.id).select('-passwordHash -refreshTokenHash');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or session invalid.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired.',
        isTokenExpired: true,
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid access token.',
    });
  }
};

/**
 * Middleware to ensure request is made by an authorized Admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin privileges required.',
    });
  }
  next();
};

module.exports = {
  verifyAccessToken,
  requireAdmin,
};
