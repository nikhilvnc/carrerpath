/**
 * Environment configuration loader and validator
 */
const path = require('path');
const dotenv = require('dotenv');

// Load .env from root or server dir
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Database configuration
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/careerpath_db',
  
  // Authentication & Security
  jwtSecret: process.env.JWT_SECRET || 'careerpath_ai_super_secret_jwt_key_hackathon_demo_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // LLM Configuration
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  
  // Rate Limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 200, // limit each IP to 200 requests per window
};

module.exports = config;
