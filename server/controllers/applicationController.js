const Application = require('../models/Application');
const Project = require('../models/Project');
const Workspace = require('../models/Workspace');
const notificationService = require('../services/notificationService');

exports.applyToProject = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: 'Only students can apply' });
    
    const { id: projectId } = req.params;
    const { proposal, expectedBudget, estimatedCompletionDays } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project || project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Project is not open for applications' });
    }
    
    const existing = await Application.findOne({ project: projectId, student: req.user._id });
    if (existing) return res.status(409).json({ success: false, message: 'You have already applied to this project' });
    
    const application = await Application.create({
      project: projectId,
      student: req.user._id,
      proposal,
      expectedBudget,
      estimatedCompletionDays
    });
    
    await notificationService.createNotification({
      user: project.client,
      type: 'new_application',
      message: `${req.user.name} submitted a proposal for ${project.title}.`,
      link: `/projects/${project._id}/manage`
    });
    
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.getProjectApplications = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const project = await Project.findById(projectId);
    
    if (!project || project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const applications = await Application.find({ project: projectId }).populate('student', 'name avatarUrl');
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id }).populate('project', 'title status');
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

exports.acceptApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id).populate('project');
    
    if (!application || application.project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (application.project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Project is no longer open' });
    }
    
    application.status = 'accepted';
    await application.save();
    
    const rejectedApps = await Application.find({ project: application.project._id, _id: { $ne: application._id }, status: 'pending' });
    
    await Application.updateMany(
      { project: application.project._id, _id: { $ne: application._id }, status: 'pending' },
      { $set: { status: 'rejected' } }
    );
    
    for (const rejApp of rejectedApps) {
      await notificationService.createNotification({
        user: rejApp.student,
        type: 'application_rejected',
        message: `Your proposal for ${application.project.title} was declined.`,
        link: `/student-dashboard`
      });
    }
    
    application.project.status = 'in_progress';
    application.project.hiredStudent = application.student;
    await application.project.save();
    
    const workspace = await Workspace.create({
      project: application.project._id,
      client: application.project.client,
      student: application.student
    });
    
    await notificationService.createNotification({
      user: application.student,
      type: 'application_accepted',
      message: `Your proposal for ${application.project.title} was accepted! Workspace initialized.`,
      link: `/workspace/${workspace._id}`
    });
    
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
