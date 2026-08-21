/**
 * Centralized Error Handling Middleware
 */

const logger = require('../utils/logger');
const ApiResponse = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`, {
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Handle specific known error types
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid or expired authentication credentials.', 401);
  }

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return ApiResponse.error(res, 'Malformed JSON in request body.', 400);
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected server error occurred. Please try again later.'
    : err.message || 'Internal Server Error';

  return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
