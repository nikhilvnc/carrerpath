/**
 * Student Progress Routes
 */

const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/summary', authenticateJWT, progressController.getProgress);
router.post('/update', authenticateJWT, progressController.updateProgress);

module.exports = router;
