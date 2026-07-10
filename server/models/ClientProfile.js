const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  logoUrl: { type: String },
  websiteUrl: { type: String },
  contactPhone: { type: String },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('ClientProfile', clientProfileSchema);
