/**
 * Authentication Controller
 */

const authService = require('../services/authService');
const ApiResponse = require('../utils/responseFormatter');

const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return ApiResponse.created(res, result, 'Registration successful! Welcome to CareerPath AI.');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return ApiResponse.success(res, result, 'Login successful! Welcome back.');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return ApiResponse.success(res, { user: req.user }, 'User profile retrieved.');
  } catch (error) {
    next(error);
  }
};

const demoLogin = async (req, res, next) => {
  try {
    const result = await authService.getDemoUser();
    return ApiResponse.success(res, result, 'Logged in as Demo Student. Enjoy the platform!');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  demoLogin
};
