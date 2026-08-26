const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Profile name is required'],
      trim: true,
      default: 'Bishal Biswas',
    },
    title: {
      type: String,
      required: [true, 'Profile title is required'],
      trim: true,
      default: 'Full-Stack MERN & C Developer',
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Crafting Robust Web Solutions with Core Logic Passion',
    },
    photoUrl: {
      type: String,
      default: '/ME.jpg',
    },
    aboutPhotoUrl: {
      type: String,
      default: '/ME.jpg',
    },
    aboutText: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    socialLinks: {
      github: {
        type: String,
        default: 'https://github.com',
      },
      linkedin: {
        type: String,
        default: 'https://linkedin.com',
      },
      email: {
        type: String,
        default: 'bishal@example.com',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
