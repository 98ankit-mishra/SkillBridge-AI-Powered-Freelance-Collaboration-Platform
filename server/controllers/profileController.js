const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const ClientProfile = require('../models/ClientProfile');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let profile = null;
    
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'client') {
      profile = await ClientProfile.findOne({ user: user._id });
    }
    
    res.json({ success: true, data: { user, profile } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, college, skills, companyName, description, website } = req.body;
    
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }
    
    let profile = null;
    
    if (req.user.role === 'student') {
      const updateData = {};
      if (bio !== undefined) updateData.bio = bio;
      if (college !== undefined) updateData.college = college;
      if (skills !== undefined) updateData.skills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
      
      profile = await StudentProfile.findOneAndUpdate(
        { user: req.user._id },
        updateData,
        { new: true, upsert: true }
      );
    } else if (req.user.role === 'client') {
      const updateData = {};
      if (companyName !== undefined) updateData.companyName = companyName;
      if (description !== undefined) updateData.description = description;
      if (website !== undefined) updateData.website = website;
      
      profile = await ClientProfile.findOneAndUpdate(
        { user: req.user._id },
        updateData,
        { new: true, upsert: true }
      );
    }
    
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file' });
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: req.file.path },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.uploadResume = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Only students can upload a resume' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file' });
    
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { resumeUrl: req.file.path },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    let profile = null;
    let projects = [];
    let reviews = [];
    
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
      const Project = require('../models/Project');
      const Review = require('../models/Review');
      
      projects = await Project.find({ hiredStudent: user._id, status: 'completed' })
        .populate('client', 'name avatarUrl')
        .sort({ updatedAt: -1 });
        
      reviews = await Review.find({ toUser: user._id })
        .populate('fromUser', 'name avatarUrl')
        .sort({ createdAt: -1 });
    } else if (user.role === 'client') {
      profile = await ClientProfile.findOne({ user: user._id });
    }
    
    res.json({ success: true, data: { user, profile, projects, reviews } });
  } catch (error) {
    next(error);
  }
};
