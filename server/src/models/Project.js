const mongoose = require('mongoose');

const projectFeatureSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    demoVideoUrl: {
      type: String,
      default: '',
    },
    videos: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      default: 'Full-Stack Developer',
      trim: true,
    },
    duration: {
      type: String,
      default: '',
      trim: true,
    },
    liveSiteUrl: {
      type: String,
      default: '',
    },
    githubRepoUrl: {
      type: String,
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
    features: {
      type: [projectFeatureSchema],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ order: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
