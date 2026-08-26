const jwt = require('jsonwebtoken');

/**
 * Generate short-lived Access Token (JWT)
 * @param {string} adminId
 * @param {string} email
 * @returns {string} Signed JWT
 */
const generateAccessToken = (adminId, email) => {
  return jwt.sign(
    { id: adminId, email },
    process.env.ACCESS_TOKEN_SECRET || 'dev_access_token_secret_bishal_portfolio_2026_secure',
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    }
  );
};

/**
 * Generate long-lived Refresh Token (JWT)
 * @param {string} adminId
 * @returns {string} Signed JWT
 */
const generateRefreshToken = (adminId) => {
  return jwt.sign(
    { id: adminId },
    process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_token_secret_bishal_portfolio_2026_secure',
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    }
  );
};

/**
 * Send Refresh Token as HttpOnly, Secure cookie
 * @param {object} res - Express response object
 * @param {string} refreshToken - JWT Refresh Token
 */
const sendRefreshTokenCookie = (res, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

/**
 * Clear Refresh Token Cookie
 * @param {object} res - Express response object
 */
const clearRefreshTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
};
