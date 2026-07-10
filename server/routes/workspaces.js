const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const submissionController = require('../controllers/submissionController');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinaryConfig');

router.get('/mine', requireAuth, workspaceController.getMyWorkspaces);
router.get('/:id', requireAuth, workspaceController.getWorkspaceById);
router.get('/:id/messages', requireAuth, workspaceController.getMessages);
router.post('/:id/messages', requireAuth, workspaceController.sendMessage);

router.post('/:workspaceId/submissions', requireAuth, upload.single('file'), submissionController.submitWork);
router.get('/:workspaceId/submissions', requireAuth, submissionController.getWorkspaceSubmissions);

module.exports = router;
