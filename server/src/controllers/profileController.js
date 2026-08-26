const Profile = require('../models/Profile');

/**
 * @desc    Get portfolio profile data (hero, about, social links)
 * @route   GET /api/profile
 * @access  Public
 */
const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();

    // If no profile exists in DB yet, create a default one
    if (!profile) {
      profile = await Profile.create({
        name: 'Bishal Biswas',
        title: 'Full-Stack MERN & C Developer',
        tagline: 'Crafting Robust Web Solutions with Core Logic Passion',
        aboutText:
          'Passionate Full-Stack Developer with deep expertise in the MERN stack (MongoDB, Express.js, React, Node.js) and low-level systems programming in C. I build high-performance, scalable web applications and intuitive user interfaces backed by solid architectural principles.',
        photoUrl: '/ME.jpg',
        aboutPhotoUrl: '/ME.jpg',
        resumeUrl: '',
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          email: 'bishal@example.com',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update portfolio profile data
 * @route   PUT /api/profile
 * @access  Private/Admin
 */
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }

    const updatedProfile = await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
