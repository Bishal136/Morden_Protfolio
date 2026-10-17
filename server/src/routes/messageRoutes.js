const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const { verifyAccessToken, requireAdmin } = require('../middleware/authMiddleware');
const { messageLimiter } = require('../middleware/rateLimiter');
const { messageValidator, validate } = require('../middleware/validators');

// Public route: Submit a direct contact message
router.post(
  '/',
  messageLimiter,
  messageValidator,
  validate,
  messageController.createMessage
);

// Admin protected routes
router.get(
  '/',
  verifyAccessToken,
  requireAdmin,
  messageController.getAllMessages
);

router.get(
  '/:id',
  verifyAccessToken,
  requireAdmin,
  messageController.getMessageById
);

router.patch(
  '/:id/read',
  verifyAccessToken,
  requireAdmin,
  messageController.toggleMessageRead
);

router.delete(
  '/:id',
  verifyAccessToken,
  requireAdmin,
  messageController.deleteMessage
);

module.exports = router;
