/**
 * API Rate Limiting Middleware
 */

const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/responseFormatter');

// General API rate limiter: 200 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, 'Too many requests from this IP. Please wait a few minutes before trying again.', 429);
  }
});

// Strict rate limiter for Auth endpoints (login/register) to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, 'Too many authentication attempts. Please try again after 15 minutes.', 429);
  }
});

// AI analysis rate limiter to prevent API cost overages
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, 'AI analysis is currently processing multiple requests. Please wait a moment.', 429);
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter
};
