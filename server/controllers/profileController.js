/**
 * Student Profile Controller
 */

const profileService = require('../services/profileService');
const ApiResponse = require('../utils/responseFormatter');

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user.id);
    return ApiResponse.success(res, profile, 'Profile retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedProfile = await profileService.updateProfile(req.user.id, req.body);
    return ApiResponse.success(res, updatedProfile, 'Profile updated successfully.');
  } catch (error) {
    next(error);
  }
};

const getMasterSkills = async (req, res, next) => {
  try {
    const skills = await profileService.getMasterSkills();
    return ApiResponse.success(res, skills, 'Master skills list retrieved.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMasterSkills
};
