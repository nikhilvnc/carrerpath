/**
 * CareerPath AI - Main Server Application Entry Point
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const { initializeDatabase } = require('./config/db');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// 1. Security Middleware
app.use(helmet());
app.use(cors({
  origin: config.clientUrl || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Request Parsing & Logging
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (config.env !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// 3. Global Rate Limiter
app.use('/api', apiLimiter);

// 4. Mount Master API Routes
app.use('/api', apiRoutes);

// 5. 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// 6. Centralized Error Handler
app.use(errorHandler);

// 7. Initialize Database & Start Server
const startServer = async () => {
  try {
    await initializeDatabase();
    const server = app.listen(config.port, () => {
      logger.info(`CareerPath AI Server running in ${config.env} mode on http://localhost:${config.port}`);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      logger.info('Shutting down CareerPath AI server gracefully...');
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return server;
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

// Export app for integration tests, or start if run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
