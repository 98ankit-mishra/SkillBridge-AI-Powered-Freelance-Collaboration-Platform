const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { requireAuth } = require('../middleware/auth');
const applicationRouter = require('./applications');

router.use('/:id/applications', applicationRouter);

router.get('/', projectController.getProjects);
router.get('/mine', requireAuth, projectController.getMyProjects);
router.get('/:id', projectController.getProjectById);

router.post('/', requireAuth, projectController.createProject);
router.put('/:id', requireAuth, projectController.updateProject);
router.delete('/:id', requireAuth, projectController.deleteProject);

module.exports = router;
