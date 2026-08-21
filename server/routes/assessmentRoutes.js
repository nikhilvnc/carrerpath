/**
 * Assessment Routes
 */

const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { saveAssessmentStepSchema } = require('../validators/assessmentValidator');

router.post('/save-step', authenticateJWT, validate(saveAssessmentStepSchema), assessmentController.saveAssessmentStep);
router.get('/current', authenticateJWT, assessmentController.getCurrentAssessment);

module.exports = router;
