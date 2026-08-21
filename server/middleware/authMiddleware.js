/**
 * JWT Authentication & Authorization Middleware
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const db = require('../config/db');
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 'Authentication required. Please log in to continue.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return ApiResponse.error(res, 'Authentication token missing.', 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return ApiResponse.error(res, 'Your session has expired. Please log in again.', 401);
      }
      return ApiResponse.error(res, 'Invalid authentication token.', 401);
    }

    // Retrieve user from database
    const userRes = await db.query('SELECT id, name, email, role, is_active FROM users WHERE id = $1', [decoded.id]);
    
    if (userRes.rowCount === 0) {
      return ApiResponse.error(res, 'User account not found or deactivated.', 401);
    }

    const user = userRes.rows[0];
    if (user.is_active === false) {
      return ApiResponse.error(res, 'This account is currently disabled.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    return ApiResponse.error(res, 'Internal authentication verification error.', 500);
  }
};

module.exports = {
  authenticateJWT
};
