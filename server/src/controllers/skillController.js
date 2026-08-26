const Skill = require('../models/Skill');

/**
 * @desc    Get all public visible skills
 * @route   GET /api/skills
 * @access  Public
 */
const getSkills = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isVisible: true };

    if (category) {
      query.category = category;
    }

    const skills = await Skill.find(query).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all skills including hidden ones for Admin
 * @route   GET /api/skills/admin
 * @access  Private/Admin
 */
const getAllSkillsAdmin = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new skill
 * @route   POST /api/skills
 * @access  Private/Admin
 */
const createSkill = async (req, res, next) => {
  try {
    const { name, icon, proficiency, category, order, isVisible } = req.body;

    // Default order to highest existing order + 1 if not provided
    let calculatedOrder = order;
    if (calculatedOrder === undefined) {
      const highestSkill = await Skill.findOne().sort({ order: -1 });
      calculatedOrder = highestSkill ? highestSkill.order + 1 : 0;
    }

    const skill = await Skill.create({
      name,
      icon: icon || '',
      proficiency,
      category: category || 'Frontend',
      order: calculatedOrder,
      isVisible: isVisible !== undefined ? isVisible : true,
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a skill
 * @route   PUT /api/skills/:id
 * @access  Private/Admin
 */
const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a skill
 * @route   DELETE /api/skills/:id
 * @access  Private/Admin
 */
const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reorder skills batch
 * @route   PUT /api/skills/reorder
 * @access  Private/Admin
 */
const reorderSkills = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { id, order }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array of { id, order } objects',
      });
    }

    const updates = items.map((item) =>
      Skill.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updates);

    const skills = await Skill.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: 'Skills reordered successfully',
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  getAllSkillsAdmin,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
};
