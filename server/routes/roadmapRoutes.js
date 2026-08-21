/**
 * Roadmap Routes
 */

const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { updateRoadmapItemStatusSchema } = require('../validators/assessmentValidator');

router.get('/:recommendationId', authenticateJWT, roadmapController.getRoadmapByRecommendationId);
router.put('/items/:itemId', authenticateJWT, validate(updateRoadmapItemStatusSchema), roadmapController.updateRoadmapItem);

module.exports = router;
