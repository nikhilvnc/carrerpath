/**
 * Career Path Service
 */

const db = require('../config/db');

/**
 * Get all available career paths
 */
const getAllCareerPaths = async () => {
  const res = await db.query('SELECT * FROM career_paths ORDER BY category, title ASC');
  return res.rows;
};

/**
 * Get career path by ID or slug with required skills
 */
const getCareerByIdOrSlug = async (identifier) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
  
  const careerRes = isUuid
    ? await db.query('SELECT * FROM career_paths WHERE id = $1', [identifier])
    : await db.query('SELECT * FROM career_paths WHERE slug = $1', [identifier]);

  if (careerRes.rowCount === 0) {
    const error = new Error('Career path not found.');
    error.statusCode = 404;
    throw error;
  }

  const career = careerRes.rows[0];

  // Fetch career required skills
  const skillsRes = await db.query(
    `SELECT cs.importance, cs.min_proficiency, s.id as skill_id, s.name, s.category, s.description
     FROM career_skills cs
     JOIN skills s ON cs.skill_id = s.id
     WHERE cs.career_path_id = $1
     ORDER BY cs.min_proficiency DESC`,
    [career.id]
  );

  return {
    ...career,
    requiredSkills: skillsRes.rows
  };
};

module.exports = {
  getAllCareerPaths,
  getCareerByIdOrSlug
};
