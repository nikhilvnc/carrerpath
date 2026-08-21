/**
 * Standalone Database Initialization & Seed Script
 */

const { initializeDatabase } = require('../server/config/db');
const logger = require('../server/utils/logger');

const run = async () => {
  try {
    logger.info('Starting CareerPath AI Database Initialization & Seeding...');
    await initializeDatabase();
    logger.info('Database initialized successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Database initialization failed', { error: error.message });
    process.exit(1);
  }
};

run();
