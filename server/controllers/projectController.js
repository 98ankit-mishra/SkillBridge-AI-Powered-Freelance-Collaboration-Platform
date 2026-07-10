const Project = require('../models/Project');
const Application = require('../models/Application');

exports.getProjects = async (req, res, next) => {
  try {
    const { category, experience, page = 1, limit = 10 } = req.query;
    let query = { status: 'open' };
    
    if (category) query.category = category;
    if (experience) query.experienceLevel = experience;
    
    const projects = await Project.find(query)
      .populate('client', 'name avatarUrl')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
      
    const total = await Project.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        items: projects,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name avatarUrl')
      .populate('hiredStudent', 'name avatarUrl');
      
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ success: false, message: 'Only clients can create projects' });
    
    const projectData = { ...req.body, client: req.user._id };
    const project = await Project.create(projectData);
    
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Only open projects can be edited' });
    }
    
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await project.remove();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
