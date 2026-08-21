/**
 * Roadmap Controller
 */

const profileService = require('../services/profileService');
const progressService = require('../services/progressService');
const db = require('../config/db');
const ApiResponse = require('../utils/responseFormatter');

const getRoadmapByRecommendationId = async (req, res, next) => {
  try {
    const { recommendationId } = req.params;
    const roadmapsRes = await db.query(
      'SELECT * FROM roadmaps WHERE recommendation_id = $1 ORDER BY duration_days ASC',
      [recommendationId]
    );

    const roadmaps = [];
    for (const r of roadmapsRes.rows) {
      const itemsRes = await db.query(
        'SELECT * FROM roadmap_items WHERE roadmap_id = $1 ORDER BY week_number ASC',
        [r.id]
      );

      roadmaps.push({
        ...r,
        weeks: itemsRes.rows.map(item => ({
          ...item,
          topics: typeof item.topics_json === 'string' ? JSON.parse(item.topics_json) : (item.topics_json || []),
          exercises: typeof item.exercises_json === 'string' ? JSON.parse(item.exercises_json) : (item.exercises_json || []),
          miniProject: typeof item.mini_project_json === 'string' ? JSON.parse(item.mini_project_json) : (item.mini_project_json || {})
        }))
      });
    }

    return ApiResponse.success(res, roadmaps, 'Roadmaps retrieved.');
  } catch (error) {
    next(error);
  }
};

const updateRoadmapItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { status, notes } = req.body;
    const profile = await profileService.getProfileByUserId(req.user.id);

    const updatedSummary = await progressService.updateItemStatus(
      profile.id,
      itemId,
      status,
      notes || ''
    );

    return ApiResponse.success(res, updatedSummary, 'Roadmap milestone status updated.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmapByRecommendationId,
  updateRoadmapItem
};
