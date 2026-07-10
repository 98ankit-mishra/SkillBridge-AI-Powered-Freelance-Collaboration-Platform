const Report = require('../models/Report');

exports.createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason } = req.body;
    
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const report = await Report.create({
      reportedBy: req.user._id,
      targetType,
      targetId,
      reason
    });
    
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
