const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { requireAuth } = require('../middleware/auth');

router.patch('/:id/review', requireAuth, submissionController.reviewSubmission);

module.exports = router;
