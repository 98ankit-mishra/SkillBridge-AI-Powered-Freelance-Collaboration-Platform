const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, notificationController.getNotifications);
router.patch('/read-all', requireAuth, notificationController.markAllAsRead);
router.patch('/:id/read', requireAuth, notificationController.markAsRead);

module.exports = router;
