const Project = require('../models/Project');
const Comment = require('../models/Comment');

// Helper to generate url-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * @desc    Get all published projects
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res, next) => {
  try {
    const { tag, featured } = req.query;
    const query = { isPublished: true };

    if (tag && tag !== 'All') {
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.techStack = { $regex: new RegExp(escapedTag, 'i') };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects (including unpublished) for admin
 * @route   GET /api/projects/admin
 * @access  Private/Admin
 */
const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by slug + comments
 * @route   GET /api/projects/:slug
 * @access  Public
 */
const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with slug '${slug}' not found`,
      });
    }

    // Fetch approved comments for this project
    const comments = await Comment.find({
      project: project._id,
      approved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...project.toObject(),
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/id/:id
 * @access  Public / Admin
 */
const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
const createProject = async (req, res, next) => {
  try {
    let {
      title,
      slug,
      shortDescription,
      fullDescription,
      coverImageUrl,
      demoVideoUrl,
      role,
      duration,
      liveSiteUrl,
      githubRepoUrl,
      techStack,
      features,
      order,
      isFeatured,
      isPublished,
    } = req.body;

    // Auto-generate slug if not specified
    if (!slug || slug.trim() === '') {
      slug = slugify(title);
    } else {
      slug = slugify(slug);
    }

    // Ensure unique slug
    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      slug = `${slug}-${Date.now()}`;
    }

    // Order auto-assignment
    if (order === undefined) {
      const highestProject = await Project.findOne().sort({ order: -1 });
      order = highestProject ? highestProject.order + 1 : 0;
    }

    const project = await Project.create({
      title,
      slug,
      shortDescription,
      fullDescription,
      coverImageUrl: coverImageUrl || '',
      demoVideoUrl: demoVideoUrl || '',
      role: role || 'Full-Stack Developer',
      duration: duration || '',
      liveSiteUrl: liveSiteUrl || '',
      githubRepoUrl: githubRepoUrl || '',
      techStack: Array.isArray(techStack) ? techStack : [],
      features: Array.isArray(features) ? features : [],
      order,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.body.slug) {
      req.body.slug = slugify(req.body.slug);
      const duplicate = await Project.findOne({
        slug: req.body.slug,
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'A project with this slug already exists',
        });
      }
    }

    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a project and its comments
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Clean up associated comments
    await Comment.deleteMany({ project: id });

    res.status(200).json({
      success: true,
      message: 'Project and associated comments deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getAllProjectsAdmin,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
