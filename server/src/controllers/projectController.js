const Project = require('../models/Project');
const Comment = require('../models/Comment');
const { normalizeTag, normalizeTags } = require('../utils/tagNormalizer');

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

// Helper to format project documents with normalized tags and guaranteed media arrays
const formatProjectDoc = (projectDoc) => {
  if (!projectDoc) return null;
  const doc = typeof projectDoc.toObject === 'function' ? projectDoc.toObject() : { ...projectDoc };
  doc.techStack = normalizeTags(doc.techStack);
  if (!Array.isArray(doc.images) || doc.images.length === 0) {
    doc.images = doc.coverImageUrl ? [doc.coverImageUrl] : [];
  }
  if (!Array.isArray(doc.videos) || doc.videos.length === 0) {
    doc.videos = doc.demoVideoUrl ? [doc.demoVideoUrl] : [];
  }
  return doc;
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
      const canonicalTag = normalizeTag(tag);
      const escapedTag = canonicalTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.techStack = { $regex: new RegExp(escapedTag, 'i') };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    const formattedProjects = projects.map(formatProjectDoc);

    res.status(200).json({
      success: true,
      count: formattedProjects.length,
      data: formattedProjects,
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
    const formattedProjects = projects.map(formatProjectDoc);

    res.status(200).json({
      success: true,
      count: formattedProjects.length,
      data: formattedProjects,
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

    const projectObj = formatProjectDoc(project);

    res.status(200).json({
      success: true,
      data: {
        ...projectObj,
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

    const projectObj = formatProjectDoc(project);

    res.status(200).json({
      success: true,
      data: projectObj,
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
      images,
      demoVideoUrl,
      videos,
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

    // Process multiple images
    let processedImages = Array.isArray(images)
      ? images.map((img) => (typeof img === 'string' ? img.trim() : '')).filter(Boolean)
      : [];

    if (coverImageUrl && coverImageUrl.trim()) {
      coverImageUrl = coverImageUrl.trim();
      if (!processedImages.includes(coverImageUrl)) {
        processedImages = [coverImageUrl, ...processedImages];
      }
    } else if (processedImages.length > 0) {
      coverImageUrl = processedImages[0];
    }

    // Process multiple videos
    let processedVideos = Array.isArray(videos)
      ? videos.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean)
      : [];

    if (demoVideoUrl && demoVideoUrl.trim()) {
      demoVideoUrl = demoVideoUrl.trim();
      if (!processedVideos.includes(demoVideoUrl)) {
        processedVideos = [demoVideoUrl, ...processedVideos];
      }
    } else if (processedVideos.length > 0) {
      demoVideoUrl = processedVideos[0];
    }

    const project = await Project.create({
      title,
      slug,
      shortDescription,
      fullDescription,
      coverImageUrl: coverImageUrl || '',
      images: processedImages,
      demoVideoUrl: demoVideoUrl || '',
      videos: processedVideos,
      role: role || 'Full-Stack Developer',
      duration: duration || '',
      liveSiteUrl: liveSiteUrl || '',
      githubRepoUrl: githubRepoUrl || '',
      techStack: normalizeTags(techStack),
      features: Array.isArray(features) ? features : [],
      order,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    const projectObj = formatProjectDoc(project);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: projectObj,
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

    if (req.body.techStack) {
      req.body.techStack = normalizeTags(req.body.techStack);
    }

    // Process multiple images if passed
    if (req.body.images !== undefined) {
      let processedImages = Array.isArray(req.body.images)
        ? req.body.images.map((img) => (typeof img === 'string' ? img.trim() : '')).filter(Boolean)
        : [];

      if (req.body.coverImageUrl && req.body.coverImageUrl.trim()) {
        req.body.coverImageUrl = req.body.coverImageUrl.trim();
        if (!processedImages.includes(req.body.coverImageUrl)) {
          processedImages = [req.body.coverImageUrl, ...processedImages];
        }
      } else if (processedImages.length > 0 && !req.body.coverImageUrl) {
        req.body.coverImageUrl = processedImages[0];
      }
      req.body.images = processedImages;
    }

    // Process multiple videos if passed
    if (req.body.videos !== undefined) {
      let processedVideos = Array.isArray(req.body.videos)
        ? req.body.videos.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean)
        : [];

      if (req.body.demoVideoUrl && req.body.demoVideoUrl.trim()) {
        req.body.demoVideoUrl = req.body.demoVideoUrl.trim();
        if (!processedVideos.includes(req.body.demoVideoUrl)) {
          processedVideos = [req.body.demoVideoUrl, ...processedVideos];
        }
      } else if (processedVideos.length > 0 && !req.body.demoVideoUrl) {
        req.body.demoVideoUrl = processedVideos[0];
      }
      req.body.videos = processedVideos;
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

    const projectObj = formatProjectDoc(project);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: projectObj,
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
