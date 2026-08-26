const express = require('express');
const router = express.Router();

const skillController = require('../controllers/skillController');
const { verifyAccessToken, requireAdmin } = require('../middleware/authMiddleware');
const { skillValidator, skillUpdateValidator, validate } = require('../middleware/validators');

// Public route: list visible skills
router.get('/', skillController.getSkills);

// Admin route: list all skills (including hidden)
router.get('/admin', verifyAccessToken, requireAdmin, skillController.getAllSkillsAdmin);

// Admin route: reorder skills batch
router.put('/reorder', verifyAccessToken, requireAdmin, skillController.reorderSkills);

// Admin route: create skill
router.post(
  '/',
  verifyAccessToken,
  requireAdmin,
  skillValidator,
  validate,
  skillController.createSkill
);

// Admin route: update skill
router.put(
  '/:id',
  verifyAccessToken,
  requireAdmin,
  skillUpdateValidator,
  validate,
  skillController.updateSkill
);

// Admin route: delete skill
router.delete('/:id', verifyAccessToken, requireAdmin, skillController.deleteSkill);

module.exports = router;
