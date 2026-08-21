/**
 * Projects & Portfolio Controller
 */

const db = require('../config/db');
const ApiResponse = require('../utils/responseFormatter');

const getProjectsByRecommendation = async (req, res, next) => {
  try {
    const { recommendationId } = req.params;
    const projRes = await db.query(
      `SELECT p.*, pr.why_recommended 
       FROM project_recommendations pr
       JOIN projects p ON pr.project_id = p.id
       WHERE pr.recommendation_id = $1`,
      [recommendationId]
    );

    const projects = projRes.rows.map(p => ({
      ...p,
      technologies: typeof p.technologies_json === 'string' ? JSON.parse(p.technologies_json) : (p.technologies_json || []),
      skillsDeveloped: typeof p.skills_developed_json === 'string' ? JSON.parse(p.skills_developed_json) : (p.skills_developed_json || [])
    }));

    return ApiResponse.success(res, projects, 'Recommended projects retrieved.');
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const projRes = await db.query('SELECT * FROM projects ORDER BY difficulty ASC');
    const projects = projRes.rows.map(p => ({
      ...p,
      technologies: typeof p.technologies_json === 'string' ? JSON.parse(p.technologies_json) : (p.technologies_json || []),
      skillsDeveloped: typeof p.skills_developed_json === 'string' ? JSON.parse(p.skills_developed_json) : (p.skills_developed_json || [])
    }));

    return ApiResponse.success(res, projects, 'All master projects retrieved.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectsByRecommendation,
  getAllProjects
};
