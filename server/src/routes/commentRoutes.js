const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const { verifyAccessToken, requireAdmin } = require('../middleware/authMiddleware');
const { commentLimiter } = require('../middleware/rateLimiter');
const { commentValidator, validate } = require('../middleware/validators');

// Public route: Get comments for project
router.get('/project/:id', commentController.getCommentsByProject);

// Public route: Add comment for project (rate-limited)
router.post(
  '/project/:id',
  commentLimiter,
  commentValidator,
  validate,
  commentController.createComment
);

// Admin routes
router.get('/admin', verifyAccessToken, requireAdmin, commentController.getAllCommentsAdmin);
router.patch('/:id/approve', verifyAccessToken, requireAdmin, commentController.toggleCommentApproval);
router.delete('/:id', verifyAccessToken, requireAdmin, commentController.deleteComment);

module.exports = router;
