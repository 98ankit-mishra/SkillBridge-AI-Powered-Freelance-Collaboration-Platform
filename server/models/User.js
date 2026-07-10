const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['student', 'client', 'admin'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  avatarUrl: { type: String },
  status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
