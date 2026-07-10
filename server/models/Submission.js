const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zipFileUrl: { type: String },
  githubRepoUrl: { type: String },
  liveDemoUrl: { type: String },
  documentationUrl: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['submitted', 'revision_requested', 'approved'], default: 'submitted' },
  revisionNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
