/**
 * Progress Tracking Service
 * Calculates roadmap completion percentages and milestone tracking
 */

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const logger = require('../utils/logger');

/**
 * Update the status of a specific roadmap item
 */
const updateItemStatus = async (studentProfileId, itemId, status, notes = '') => {
  // Update roadmap_items table status
  await db.query(
    'UPDATE roadmap_items SET status = $1 WHERE id = $2',
    [status, itemId]
  );

  // Check if progress_tracking record exists
  const trackRes = await db.query(
    'SELECT id FROM progress_tracking WHERE student_profile_id = $1 AND roadmap_item_id = $2',
    [studentProfileId, itemId]
  );

  const completedAt = status === 'completed' ? new Date().toISOString() : null;

  if (trackRes.rowCount > 0) {
    await db.query(
      `UPDATE progress_tracking SET status = $1, completed_at = $2, notes = $3, updated_at = CURRENT_TIMESTAMP
       WHERE student_profile_id = $4 AND roadmap_item_id = $5`,
      [status, completedAt, notes, studentProfileId, itemId]
    );
  } else {
    await db.query(
      `INSERT INTO progress_tracking (id, student_profile_id, roadmap_item_id, status, completed_at, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), studentProfileId, itemId, status, completedAt, notes]
    );
  }

  logger.info('Roadmap milestone progress updated', { studentProfileId, itemId, status });
  return getProgressSummary(studentProfileId);
};

/**
 * Get comprehensive progress summary
 */
const getProgressSummary = async (studentProfileId) => {
  // Fetch all roadmap items for student's active recommendations
  const res = await db.query(
    `SELECT ri.id, ri.status, ri.week_number, ri.week_title, r.duration_days, r.title as roadmap_title
     FROM roadmap_items ri
     JOIN roadmaps r ON ri.roadmap_id = r.id
     JOIN career_recommendations cr ON r.recommendation_id = cr.id
     WHERE cr.student_profile_id = $1`,
    [studentProfileId]
  );

  const items = res.rows;
  const total = items.length;
  const completed = items.filter(i => i.status === 'completed').length;
  const inProgress = items.filter(i => i.status === 'in_progress').length;
  const notStarted = items.filter(i => i.status === 'not_started' || !i.status).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    totalMilestones: total,
    completedMilestones: completed,
    inProgressMilestones: inProgress,
    notStartedMilestones: notStarted,
    overallPercentage: percentage,
    items
  };
};

module.exports = {
  updateItemStatus,
  getProgressSummary
};
