/**
 * Student Progress Controller
 */

const profileService = require('../services/profileService');
const progressService = require('../services/progressService');
const ApiResponse = require('../utils/responseFormatter');

const getProgress = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user.id);
    const summary = await progressService.getProgressSummary(profile.id);
    return ApiResponse.success(res, summary, 'Progress summary retrieved.');
  } catch (error) {
    next(error);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const { roadmapItemId, status, notes } = req.body;
    const profile = await profileService.getProfileByUserId(req.user.id);

    const summary = await progressService.updateItemStatus(
      profile.id,
      roadmapItemId,
      status,
      notes || ''
    );

    return ApiResponse.success(res, summary, 'Progress updated.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgress,
  updateProgress
};
