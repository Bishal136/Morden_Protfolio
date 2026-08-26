const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyAccessToken, requireAdmin } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { loginValidator, validate } = require('../middleware/validators');

// Public endpoints
router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/google', authLimiter, authController.googleLogin);
router.post('/refresh', authLimiter, authController.refreshToken);
router.post('/logout', authController.logout);

// Protected endpoints
router.get('/me', verifyAccessToken, requireAdmin, authController.getMe);

module.exports = router;
