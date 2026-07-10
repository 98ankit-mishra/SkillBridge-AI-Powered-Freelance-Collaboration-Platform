const express = require('express');
const router = express.Router({ mergeParams: true });
const applicationController = require('../controllers/applicationController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, applicationController.applyToProject);
router.get('/', requireAuth, applicationController.getProjectApplications);

module.exports = router;
