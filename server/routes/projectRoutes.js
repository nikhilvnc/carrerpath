/**
 * Projects Routes
 */

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/', projectController.getAllProjects);
router.get('/recommendation/:recommendationId', authenticateJWT, projectController.getProjectsByRecommendation);

module.exports = router;
