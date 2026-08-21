/**
 * Career Assessment Controller
 */

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const ApiResponse = require('../utils/responseFormatter');

const saveAssessmentStep = async (req, res, next) => {
  try {
    const { stepNumber, questionKey, answer } = req.body;
    const userId = req.user.id;

    // Get student profile
    const profileRes = await db.query('SELECT id FROM student_profiles WHERE user_id = $1', [userId]);
    if (profileRes.rowCount === 0) {
      return ApiResponse.error(res, 'Student profile not found.', 404);
    }
    const profileId = profileRes.rows[0].id;

    // Find active assessment or create new
    let assessmentId;
    const activeAssRes = await db.query(
      'SELECT id FROM assessments WHERE student_profile_id = $1 AND is_completed = false ORDER BY created_at DESC LIMIT 1',
      [profileId]
    );

    if (activeAssRes.rowCount > 0) {
      assessmentId = activeAssRes.rows[0].id;
      await db.query('UPDATE assessments SET current_step = $1 WHERE id = $2', [stepNumber, assessmentId]);
    } else {
      assessmentId = uuidv4();
      await db.query(
        'INSERT INTO assessments (id, student_profile_id, total_steps, current_step, is_completed) VALUES ($1, $2, $3, $4, $5)',
        [assessmentId, profileId, 5, stepNumber, false]
      );
    }

    // Save answer
    await db.query(
      'INSERT INTO assessment_answers (id, assessment_id, step_number, question_key, answer_json) VALUES ($1, $2, $3, $4, $5)',
      [uuidv4(), assessmentId, stepNumber, questionKey, JSON.stringify(answer)]
    );

    return ApiResponse.success(res, { assessmentId, stepNumber }, 'Assessment step saved.');
  } catch (error) {
    next(error);
  }
};

const getCurrentAssessment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileRes = await db.query('SELECT id FROM student_profiles WHERE user_id = $1', [userId]);
    if (profileRes.rowCount === 0) {
      return ApiResponse.error(res, 'Student profile not found.', 404);
    }
    const profileId = profileRes.rows[0].id;

    const assRes = await db.query(
      'SELECT * FROM assessments WHERE student_profile_id = $1 ORDER BY created_at DESC LIMIT 1',
      [profileId]
    );

    if (assRes.rowCount === 0) {
      return ApiResponse.success(res, null, 'No assessment found.');
    }

    const assessment = assRes.rows[0];
    const answersRes = await db.query(
      'SELECT * FROM assessment_answers WHERE assessment_id = $1 ORDER BY step_number ASC',
      [assessment.id]
    );

    const answers = answersRes.rows.map(a => ({
      stepNumber: a.step_number,
      questionKey: a.question_key,
      answer: JSON.parse(a.answer_json)
    }));

    return ApiResponse.success(res, { ...assessment, answers }, 'Assessment retrieved.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveAssessmentStep,
  getCurrentAssessment
};
