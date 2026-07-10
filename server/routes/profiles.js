const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinaryConfig');

router.get('/', requireAuth, profileController.getProfile);
router.get('/public/:id', profileController.getPublicProfile);
router.put('/', requireAuth, profileController.updateProfile);
router.post('/avatar', requireAuth, upload.single('avatar'), profileController.uploadAvatar);
router.post('/resume', requireAuth, upload.single('resume'), profileController.uploadResume);

module.exports = router;
