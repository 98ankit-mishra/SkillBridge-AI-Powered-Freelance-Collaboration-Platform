const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth } = require('../middleware/auth');

router.get('/mine', requireAuth, applicationController.getMyApplications);
router.patch('/:id/accept', requireAuth, applicationController.acceptApplication);

module.exports = router;
