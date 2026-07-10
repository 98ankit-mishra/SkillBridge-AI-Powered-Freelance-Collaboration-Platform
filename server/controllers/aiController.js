const aiService = require('../services/aiService');
const Project = require('../models/Project');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Workspace = require('../models/Workspace');
const Message = require('../models/Message');

exports.enhanceProject = async (req, res, next) => {
  try {
    const { title, category, skills, description } = req.body;
    
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }
    
    const enhancedDescription = await aiService.enhanceProjectDescription(
      title || 'Untitled', 
      category || 'Uncategorized', 
      skills || [], 
      description
    );
    
    res.json({ success: true, enhancedDescription });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(503).json({ success: false, message: 'AI Error: ' + (error.message || 'Unknown error') });
  }
};

exports.generateProposal = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const profile = await StudentProfile.findOne({ user: req.user._id });
    const studentData = {
      name: req.user.name,
      profile
    };
    
    const proposal = await aiService.generateProposal(project, studentData);
    
    res.json({ success: true, proposal });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(503).json({ success: false, message: 'AI Error: ' + (error.message || 'Unknown error') });
  }
};

exports.summarizeChat = async (req, res, next) => {
  try {
    const { workspaceId } = req.body;
    
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'Workspace ID is required' });
    }
    
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || (workspace.client.toString() !== req.user._id.toString() && workspace.student.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const messages = await Message.find({ workspace: workspaceId }).populate('sender', 'name').sort({ createdAt: 1 });
    
    if (messages.length === 0) {
      return res.json({ success: true, summary: 'No conversation history found to summarize.' });
    }
    
    const summary = await aiService.summarizeChat(messages);
    
    res.json({ success: true, summary });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(503).json({ success: false, message: 'AI Error: ' + (error.message || 'Unknown error') });
  }
};
