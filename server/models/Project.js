const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  skillsRequired: [{ type: String }],
  budget: { type: Number, required: true },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  deadline: { type: Date },
  location: { type: String, default: 'Remote' },
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  hiredStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
