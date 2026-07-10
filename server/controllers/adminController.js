const User = require('../models/User');
const Project = require('../models/Project');
const Report = require('../models/Report');

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'student' });
    const clientsCount = await User.countDocuments({ role: 'client' });
    
    const projectsOpen = await Project.countDocuments({ status: 'open' });
    const projectsInProgress = await Project.countDocuments({ status: 'in_progress' });
    const projectsCompleted = await Project.countDocuments({ status: 'completed' });
    
    const openReports = await Report.countDocuments({ status: 'open' });
    
    res.json({
      success: true,
      data: {
        users: { total: totalUsers, students: studentsCount, clients: clientsCount },
        projects: { open: projectsOpen, in_progress: projectsInProgress, completed: projectsCompleted },
        reports: { open: openReports }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('reportedBy', 'name email role').sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
