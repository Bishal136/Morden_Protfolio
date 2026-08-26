const Comment = require('../models/Comment');
const Project = require('../models/Project');

/**
 * @desc    Get approved comments for a specific project
 * @route   GET /api/projects/:id/comments
 * @access  Public
 */
const getCommentsByProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if `id` is a MongoDB ObjectId or a slug
    let projectId = id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const project = await Project.findOne({ slug: id });
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }
      projectId = project._id;
    }

    const comments = await Comment.find({
      project: projectId,
      approved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a comment to a project
 * @route   POST /api/projects/:id/comments
 * @access  Public (Rate limited)
 */
const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, text } = req.body;

    let projectId = id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const project = await Project.findOne({ slug: id });
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }
      projectId = project._id;
    } else {
      const projectExists = await Project.findById(id);
      if (!projectExists) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }
    }

    const comment = await Comment.create({
      project: projectId,
      name: name.trim(),
      role: (role && role.trim()) || 'Visitor',
      text: text.trim(),
      approved: true, // auto-approve so visitor sees immediate feedback
    });

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all comments for Admin moderation
 * @route   GET /api/comments/admin
 * @access  Private/Admin
 */
const getAllCommentsAdmin = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate('project', 'title slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle comment approval
 * @route   PATCH /api/comments/:id/approve
 * @access  Private/Admin
 */
const toggleCommentApproval = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    comment.approved = !comment.approved;
    await comment.save();

    res.status(200).json({
      success: true,
      message: `Comment ${comment.approved ? 'approved' : 'hidden'} successfully`,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private/Admin
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByProject,
  createComment,
  getAllCommentsAdmin,
  toggleCommentApproval,
  deleteComment,
};
