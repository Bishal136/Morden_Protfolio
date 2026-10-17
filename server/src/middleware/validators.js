const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware that checks for validation errors from express-validator schemas
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validator schema for Admin Login
 */
const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Validator schema for Profile Update
 */
const profileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('tagline').optional().trim(),
  body('aboutText').optional().trim(),
  body('socialLinks.email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Valid email address required'),
  body('socialLinks.github')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Valid GitHub URL required'),
  body('socialLinks.linkedin')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Valid LinkedIn URL required'),
];

/**
 * Validator schema for Skill Creation
 */
const skillValidator = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('proficiency')
    .notEmpty()
    .withMessage('Proficiency percentage is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('Proficiency must be an integer between 0 and 100'),
  body('category')
    .optional({ checkFalsy: true })
    .isIn(['Frontend', 'Backend', 'Database', 'Language', 'Tools', 'Other'])
    .withMessage('Category must be one of: Frontend, Backend, Database, Language, Tools, Other'),
  body('order')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];

/**
 * Validator schema for Skill Update (fields optional)
 */
const skillUpdateValidator = [
  body('name').optional().trim().notEmpty().withMessage('Skill name cannot be empty'),
  body('proficiency')
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 100 })
    .withMessage('Proficiency must be an integer between 0 and 100'),
  body('category')
    .optional({ checkFalsy: true })
    .isIn(['Frontend', 'Backend', 'Database', 'Language', 'Tools', 'Other'])
    .withMessage('Category must be one of: Frontend, Backend, Database, Language, Tools, Other'),
  body('order')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
];

/**
 * Validator schema for Project Creation
 */
const projectValidator = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
  body('fullDescription').trim().notEmpty().withMessage('Full description is required'),
  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must consist of lowercase alphanumeric characters and hyphens only'),
  body('coverImageUrl').optional().trim(),
  body('demoVideoUrl').optional().trim(),
  body('techStack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array of strings'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of image URLs'),
  body('videos')
    .optional()
    .isArray()
    .withMessage('Videos must be an array of video URLs'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array of feature objects'),
];

/**
 * Validator schema for Project Update (fields optional)
 */
const projectUpdateValidator = [
  body('title').optional().trim().notEmpty().withMessage('Project title cannot be empty'),
  body('shortDescription').optional().trim().notEmpty().withMessage('Short description cannot be empty'),
  body('fullDescription').optional().trim().notEmpty().withMessage('Full description cannot be empty'),
  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must consist of lowercase alphanumeric characters and hyphens only'),
  body('coverImageUrl').optional().trim(),
  body('demoVideoUrl').optional().trim(),
  body('techStack')
    .optional()
    .isArray()
    .withMessage('Tech stack must be an array of strings'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of image URLs'),
  body('videos')
    .optional()
    .isArray()
    .withMessage('Videos must be an array of video URLs'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array of feature objects'),
];

/**
 * Validator schema for Comment Creation
 */
const commentValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('role')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Role cannot exceed 100 characters'),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
];

/**
 * Validator schema for Contact Message Creation
 */
const messageValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 3000 })
    .withMessage('Message must be between 10 and 3000 characters'),
];

module.exports = {
  validate,
  loginValidator,
  profileValidator,
  skillValidator,
  skillUpdateValidator,
  projectValidator,
  projectUpdateValidator,
  commentValidator,
  messageValidator,
};
