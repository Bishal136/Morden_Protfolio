const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: '',
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency percentage is required'],
      min: [0, 'Proficiency cannot be less than 0'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 80,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Language', 'Tools', 'Other'],
      default: 'Frontend',
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ order: 1 });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
