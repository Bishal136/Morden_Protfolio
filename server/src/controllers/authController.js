const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/generateToken');
const { verifyGoogleIdToken, getGoogleUserFromCode } = require('../utils/googleAuth');

/**
 * @desc    Admin login with password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      const remainingMinutes = Math.ceil((admin.lockUntil - Date.now()) / (60 * 1000));
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked due to repeated failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
      });
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      await admin.incrementLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Reset failed login attempts on successful login
    await admin.resetLoginAttempts();

    // Update last login timestamp
    admin.lastLoginAt = new Date();

    // Generate tokens
    const accessToken = generateAccessToken(admin._id, admin.email);
    const refreshToken = generateRefreshToken(admin._id);

    // Hash and store refresh token for token revocation capability
    const salt = await bcrypt.genSalt(10);
    admin.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await admin.save();

    // Send refresh token as HttpOnly cookie
    sendRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        accessToken,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          avatarUrl: admin.avatarUrl,
          authProvider: admin.authProvider,
          lastLoginAt: admin.lastLoginAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Google OAuth Login
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = async (req, res, next) => {
  try {
    const { credential, idToken, code, redirectUri } = req.body;
    const token = credential || idToken;

    let googleUser;

    if (token) {
      googleUser = await verifyGoogleIdToken(token);
    } else if (code) {
      googleUser = await getGoogleUserFromCode(code, redirectUri);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Google credential (idToken) or authorization code is required.',
      });
    }

    const { googleId, email, name, avatarUrl } = googleUser;

    // Find existing admin by email or googleId
    let admin = await Admin.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId }],
    });

    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminCount = await Admin.countDocuments();

    if (!admin) {
      // Authorize creation only if email matches ADMIN_EMAIL or no admin exists in the system
      if ((configuredAdminEmail && email.toLowerCase() === configuredAdminEmail) || adminCount === 0) {
        admin = await Admin.create({
          email: email.toLowerCase(),
          name,
          avatarUrl,
          googleId,
          authProvider: 'google',
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your Google account is not authorized as an administrator.',
        });
      }
    } else {
      // Link Google credentials if not already linked
      if (!admin.googleId) {
        admin.googleId = googleId;
        admin.authProvider = admin.passwordHash ? 'both' : 'google';
      }
      if (!admin.name && name) {
        admin.name = name;
      }
      if (!admin.avatarUrl && avatarUrl) {
        admin.avatarUrl = avatarUrl;
      }
    }

    // Reset lockout and update login time
    admin.failedLoginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLoginAt = new Date();

    // Generate tokens
    const accessToken = generateAccessToken(admin._id, admin.email);
    const refreshToken = generateRefreshToken(admin._id);

    // Hash and store refresh token
    const salt = await bcrypt.genSalt(10);
    admin.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await admin.save();

    // Send refresh token cookie
    sendRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful.',
      data: {
        accessToken,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          avatarUrl: admin.avatarUrl,
          authProvider: admin.authProvider,
          lastLoginAt: admin.lastLoginAt,
        },
      },
    });
  } catch (error) {
    if (error.message && (error.message.includes('Google') || error.message.includes('token') || error.message.includes('code'))) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Exchange refresh token for new access token
 * @route   POST /api/auth/refresh
 * @access  Public (via HttpOnly Cookie)
 */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided in request cookies.',
      });
    }

    // Verify refresh token signature
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_token_secret_bishal_portfolio_2026_secure'
      );
    } catch (err) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired or invalid.',
      });
    }

    // Find admin associated with token
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.refreshTokenHash) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh session or admin not found.',
      });
    }

    // Verify stored refresh token hash matches received token
    const isTokenMatch = await bcrypt.compare(token, admin.refreshTokenHash);

    if (!isTokenMatch) {
      // Possible token reuse attack detected: invalidate stored hash
      admin.refreshTokenHash = null;
      await admin.save();
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Refresh token mismatch detected. Session invalidated.',
      });
    }

    // Generate fresh tokens (token rotation)
    const newAccessToken = generateAccessToken(admin._id, admin.email);
    const newRefreshToken = generateRefreshToken(admin._id);

    // Update stored refresh token hash
    const salt = await bcrypt.genSalt(10);
    admin.refreshTokenHash = await bcrypt.hash(newRefreshToken, salt);
    await admin.save();

    // Send updated cookie
    sendRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully.',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin logout / clear session
 * @route   POST /api/auth/logout
 * @access  Private / Public
 */
const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (req.admin) {
      await Admin.findByIdAndUpdate(req.admin._id, { refreshTokenHash: null });
    } else if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_token_secret_bishal_portfolio_2026_secure'
        );
        await Admin.findByIdAndUpdate(decoded.id, { refreshTokenHash: null });
      } catch (err) {
        // Ignore token decode errors on logout
      }
    }

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in admin profile
 * @route   GET /api/auth/me
 * @access  Private (Admin)
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: req.admin._id,
          email: req.admin.email,
          name: req.admin.name,
          avatarUrl: req.admin.avatarUrl,
          authProvider: req.admin.authProvider,
          lastLoginAt: req.admin.lastLoginAt,
          createdAt: req.admin.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  googleLogin,
  refreshToken,
  logout,
  getMe,
};
