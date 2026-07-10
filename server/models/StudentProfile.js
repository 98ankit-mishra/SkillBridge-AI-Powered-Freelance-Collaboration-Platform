const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  resumeUrl: { type: String }, // Cloudinary file URL
  portfolioLinks: [{ type: String }],
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  completedProjectsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
