/**
 * Student Profile Routes
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { updateProfileSchema } = require('../validators/profileValidator');

router.get('/', authenticateJWT, profileController.getProfile);
router.put('/', authenticateJWT, validate(updateProfileSchema), profileController.updateProfile);
router.get('/skills/master', profileController.getMasterSkills);

module.exports = router;
