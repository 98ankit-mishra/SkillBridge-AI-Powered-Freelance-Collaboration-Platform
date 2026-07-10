const Review = require('../models/Review');
const Project = require('../models/Project');

exports.createReview = async (req, res, next) => {
  try {
    const { projectId, toUserId, rating, comment } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project || project.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Project must be completed to leave a review' });
    }
    
    const existing = await Review.findOne({ project: projectId, fromUser: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Review already submitted' });
    
    const review = await Review.create({
      project: projectId,
      fromUser: req.user._id,
      toUser: toUserId,
      rating,
      comment
    });
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ toUser: req.params.userId }).populate('fromUser', 'name avatarUrl').populate('project', 'title');
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
