const Workspace = require('../models/Workspace');
const Message = require('../models/Message');
const messageService = require('../services/messageService');

exports.getMyWorkspaces = async (req, res, next) => {
  try {
    const query = req.user.role === 'client' ? { client: req.user._id } : { student: req.user._id };
    const workspaces = await Workspace.find(query)
      .populate('project', 'title status')
      .populate('client', 'name avatarUrl')
      .populate('student', 'name avatarUrl')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: workspaces });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('project')
      .populate('client', 'name avatarUrl')
      .populate('student', 'name avatarUrl');
      
    if (!workspace) return res.status(404).json({ success: false, message: 'Workspace not found' });
    
    if (workspace.client._id.toString() !== req.user._id.toString() && 
        workspace.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace || (workspace.client.toString() !== req.user._id.toString() && workspace.student.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const messages = await Message.find({ workspace: req.params.id })
      .populate('sender', 'name avatarUrl')
      .sort({ createdAt: 1 });
      
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.createMessage(req.params.id, req.user._id, req.body.content, req.body.attachmentUrl);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    if (error.message.includes('Not authorized')) return res.status(403).json({ success: false, message: error.message });
    next(error);
  }
};
