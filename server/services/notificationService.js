const Notification = require('../models/Notification');

exports.createNotification = async ({ user, type, message, link }) => {
  try {
    const notification = await Notification.create({ user, type, message, link });
    
    // Broadcast via socket if available
    if (global.io) {
      global.io.to(user.toString()).emit('notification:new', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};
