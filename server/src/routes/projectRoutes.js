const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const commentController = require('../controllers/commentController');
const { verifyAccessToken, requireAdmin } = require('../middleware/authMiddleware');
const { commentLimiter } = require('../middleware/rateLimiter');
const {
  projectValidator,
  projectUpdateValidator,
  commentValidator,
  validate,
} = require('../middleware/validators');

// Public routes
router.get('/', projectController.getProjects);
router.get('/id/:id', projectController.getProjectById);
router.get('/:slug', projectController.getProjectBySlug);

// Project comments routes (PRD specified)
router.get('/:id/comments', commentController.getCommentsByProject);
router.post(
  '/:id/comments',
  commentLimiter,
  commentValidator,
  validate,
  commentController.createComment
);

// Admin routes
router.get('/admin/all', verifyAccessToken, requireAdmin, projectController.getAllProjectsAdmin);
router.post(
  '/',
  verifyAccessToken,
  requireAdmin,
  projectValidator,
  validate,
  projectController.createProject
);
router.put(
  '/:id',
  verifyAccessToken,
  requireAdmin,
  projectUpdateValidator,
  validate,
  projectController.updateProject
);
router.delete('/:id', verifyAccessToken, requireAdmin, projectController.deleteProject);

module.exports = router;
