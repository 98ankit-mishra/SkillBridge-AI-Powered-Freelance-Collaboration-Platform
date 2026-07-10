const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/enhance-project', aiController.enhanceProject);
router.post('/generate-proposal', aiController.generateProposal);
router.post('/summarize-chat', aiController.summarizeChat);

module.exports = router;
