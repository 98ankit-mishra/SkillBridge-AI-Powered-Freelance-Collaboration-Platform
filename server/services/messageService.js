const Message = require('../models/Message');
const Workspace = require('../models/Workspace');
const notificationService = require('./notificationService');

exports.createMessage = async (workspaceId, senderId, content, attachmentUrl = null) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace || (workspace.client.toString() !== senderId.toString() && workspace.student.toString() !== senderId.toString())) {
    throw new Error('Not authorized to send message in this workspace');
  }
  
  const message = await Message.create({
    workspace: workspaceId,
    sender: senderId,
    content,
    attachmentUrl
  });
  
  const recipientId = workspace.client.toString() === senderId.toString() ? workspace.student : workspace.client;
  
  // Create a notification for the recipient
  await notificationService.createNotification({
    user: recipientId,
    type: 'new_message',
    message: `New message in workspace.`,
    link: `/workspace/${workspaceId}`
  });
  
  return await message.populate('sender', 'name avatarUrl');
};
