/**
 * Student Profile & Skills Service
 */

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const logger = require('../utils/logger');

/**
 * Get student profile by user ID with associated skills
 */
const getProfileByUserId = async (userId) => {
  const profileRes = await db.query(
    `SELECT sp.*, u.name, u.email 
     FROM student_profiles sp 
     JOIN users u ON sp.user_id = u.id 
     WHERE sp.user_id = $1`,
    [userId]
  );

  if (profileRes.rowCount === 0) {
    const error = new Error('Student profile not found.');
    error.statusCode = 404;
    throw error;
  }

  const profile = profileRes.rows[0];

  // Fetch associated skills
  const skillsRes = await db.query(
    `SELECT ss.id as student_skill_id, ss.skill_id, ss.proficiency_level, ss.verified_by_assessment,
            s.name, s.category, s.description
     FROM student_skills ss
     JOIN skills s ON ss.skill_id = s.id
     WHERE ss.student_profile_id = $1`,
    [profile.id]
  );

  return {
    ...profile,
    skills: skillsRes.rows
  };
};

/**
 * Update student profile and synchronize skills
 */
const updateProfile = async (userId, profileData) => {
  // 1. Get existing profile ID
  const existingProfileRes = await db.query('SELECT id FROM student_profiles WHERE user_id = $1', [userId]);
  if (existingProfileRes.rowCount === 0) {
    const error = new Error('Student profile not found.');
    error.statusCode = 404;
    throw error;
  }

  const profileId = existingProfileRes.rows[0].id;

  // 2. Update user name if provided
  if (profileData.name) {
    await db.query('UPDATE users SET name = $1 WHERE id = $2', [profileData.name.trim(), userId]);
  }

  // 3. Update student profile details
  await db.query(
    `UPDATE student_profiles SET 
      degree = $1, 
      branch = $2, 
      college = $3, 
      graduation_year = $4, 
      experience_level = $5, 
      bio = $6, 
      desired_career = $7, 
      preferred_job_type = $8, 
      target_industry = $9, 
      preferred_location = $10, 
      hours_per_week = $11,
      updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $12`,
    [
      profileData.degree || '',
      profileData.branch || '',
      profileData.college || '',
      profileData.graduationYear || 2026,
      profileData.experienceLevel || 'Beginner',
      profileData.bio || '',
      profileData.desiredCareer || '',
      profileData.preferredJobType || 'Full-time',
      profileData.targetIndustry || '',
      profileData.preferredLocation || '',
      profileData.hoursPerWeek || 10,
      userId
    ]
  );

  // 4. Update student skills if provided
  if (profileData.skills && Array.isArray(profileData.skills)) {
    // Delete existing student skills
    await db.query('DELETE FROM student_skills WHERE student_profile_id = $1', [profileId]);

    // Insert new skills
    for (const skill of profileData.skills) {
      let skillId = skill.skillId;

      // If skill does not exist in master table, insert it
      if (!skillId) {
        const skillName = skill.name.trim();
        const existingSkillRes = await db.query('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [skillName]);
        if (existingSkillRes.rowCount > 0) {
          skillId = existingSkillRes.rows[0].id;
        } else {
          skillId = uuidv4();
          await db.query(
            'INSERT INTO skills (id, name, category, description) VALUES ($1, $2, $3, $4)',
            [skillId, skillName, skill.category || 'General', 'User submitted skill']
          );
        }
      }

      await db.query(
        'INSERT INTO student_skills (id, student_profile_id, skill_id, proficiency_level) VALUES ($1, $2, $3, $4)',
        [uuidv4(), profileId, skillId, skill.proficiencyLevel || 50]
      );
    }
  }

  logger.info('Profile updated successfully', { userId, profileId });
  return getProfileByUserId(userId);
};

/**
 * Get all master skills
 */
const getMasterSkills = async () => {
  const res = await db.query('SELECT * FROM skills ORDER BY category, name ASC');
  return res.rows;
};

module.exports = {
  getProfileByUserId,
  updateProfile,
  getMasterSkills
};
