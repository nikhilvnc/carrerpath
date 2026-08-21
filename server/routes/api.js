/**
 * Master API Router
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const careerRoutes = require('./careerRoutes');
const roadmapRoutes = require('./roadmapRoutes');
const projectRoutes = require('./projectRoutes');
const progressRoutes = require('./progressRoutes');

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/career', careerRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/projects', projectRoutes);
router.use('/progress', progressRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CareerPath AI REST API',
    version: '1.0.0'
  });
});

module.exports = router;
