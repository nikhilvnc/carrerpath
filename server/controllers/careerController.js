/**
 * Career Recommendations Controller
 */

const profileService = require('../services/profileService');
const careerService = require('../services/careerService');
const recommendationService = require('../services/recommendationService');
const ApiResponse = require('../utils/responseFormatter');

const analyzeCareer = async (req, res, next) => {
  try {
    const studentProfile = await profileService.getProfileByUserId(req.user.id);
    const assessmentData = req.body || {};

    const recommendations = await recommendationService.analyzeAndSaveRecommendations(
      studentProfile,
      assessmentData
    );

    return ApiResponse.success(res, recommendations, 'AI career analysis completed successfully.');
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user.id);
    const recommendations = await recommendationService.getRecommendationsByProfileId(profile.id);
    return ApiResponse.success(res, recommendations, 'Recommendations retrieved.');
  } catch (error) {
    next(error);
  }
};

const getAllCareers = async (req, res, next) => {
  try {
    const careers = await careerService.getAllCareerPaths();
    return ApiResponse.success(res, careers, 'All career paths retrieved.');
  } catch (error) {
    next(error);
  }
};

const getCareerDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const career = await careerService.getCareerByIdOrSlug(id);
    return ApiResponse.success(res, career, 'Career details retrieved.');
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user.id);
    const history = await recommendationService.getRecommendationHistory(profile.id);
    return ApiResponse.success(res, history, 'Career analysis history retrieved.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeCareer,
  getRecommendations,
  getAllCareers,
  getCareerDetail,
  getHistory
};
