/**
 * Career Routes
 */

const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/analyze', authenticateJWT, aiLimiter, careerController.analyzeCareer);
router.get('/recommendations', authenticateJWT, careerController.getRecommendations);
router.get('/paths', careerController.getAllCareers);
router.get('/paths/:id', careerController.getCareerDetail);
router.get('/history', authenticateJWT, careerController.getHistory);

module.exports = router;
