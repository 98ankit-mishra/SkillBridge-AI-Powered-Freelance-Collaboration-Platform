const Submission = require('../models/Submission');
const Project = require('../models/Project');
const Workspace = require('../models/Workspace');
const notificationService = require('../services/notificationService');

exports.submitWork = async (req, res, next) => {
  try {
    const { link, notes } = req.body;
    const workspaceId = req.params.workspaceId;
    
    const workspace = await Workspace.findById(workspaceId).populate('project');
    if (!workspace || workspace.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const submission = await Submission.create({
      workspace: workspaceId,
      project: workspace.project._id,
      submittedBy: req.user._id,
      link,
      notes,
      fileUrl: req.file ? req.file.path : null
    });
    
    await notificationService.createNotification({
      user: workspace.client,
      type: 'submission_update',
      message: `A new deliverable was submitted for ${workspace.project.title}.`,
      link: `/workspace/${workspace._id}`
    });
    
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ workspace: req.params.workspaceId }).sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

exports.reviewSubmission = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    const submission = await Submission.findById(req.params.id).populate('workspace').populate('project');
    
    if (!submission || submission.workspace.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    submission.status = status;
    if (feedback) submission.notes += `\n\nClient Feedback: ${feedback}`;
    await submission.save();
    
    if (status === 'accepted') {
      submission.project.status = 'completed';
      await submission.project.save();
      
      await notificationService.createNotification({
        user: submission.workspace.student,
        type: 'project_completed',
        message: `Your deliverable for ${submission.project.title} was accepted! The project is now complete.`,
        link: `/workspace/${submission.workspace._id}`
      });
    } else {
      await notificationService.createNotification({
        user: submission.workspace.student,
        type: 'submission_update',
        message: `Your deliverable for ${submission.project.title} was reviewed (Status: ${status}).`,
        link: `/workspace/${submission.workspace._id}`
      });
    }
    
    res.json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};
