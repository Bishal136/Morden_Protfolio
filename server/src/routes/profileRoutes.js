const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const { verifyAccessToken, requireAdmin } = require('../middleware/authMiddleware');
const { profileValidator, validate } = require('../middleware/validators');

// Public route: get profile details
router.get('/', profileController.getProfile);

// Admin route: update profile details
router.put(
  '/',
  verifyAccessToken,
  requireAdmin,
  profileValidator,
  validate,
  profileController.updateProfile
);

module.exports = router;
