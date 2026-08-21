/**
 * Recommendation & Skill Gap Service
 * Stores and retrieves AI recommendations, skill gaps, roadmaps, and projects
 */

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const logger = require('../utils/logger');
const { generateCareerAnalysis, generateProfileHash } = require('./llmService');

/**
 * Execute AI Career Analysis and persist all resulting entities to database
 */
const analyzeAndSaveRecommendations = async (studentProfile, assessmentData = {}) => {
  const profileId = studentProfile.id;
  const promptHash = generateProfileHash(studentProfile, assessmentData);

  // 1. Check if an analysis with the exact same profile hash was recently generated (Caching)
  const cachedRecRes = await db.query(
    `SELECT * FROM career_recommendations 
     WHERE student_profile_id = $1 AND prompt_hash = $2 
     ORDER BY created_at DESC LIMIT 3`,
    [profileId, promptHash]
  );

  if (cachedRecRes.rowCount > 0) {
    logger.info('Returning cached career analysis from database', { profileId, promptHash });
    return getRecommendationsByProfileId(profileId);
  }

  // 2. Generate new AI Analysis
  const { result } = await generateCareerAnalysis(studentProfile, assessmentData);

  // 3. Save recommendations into database
  const createdRecommendations = [];

  for (const rec of result.recommendations) {
    const recommendationId = uuidv4();

    // Look up career_path_id by slug if possible
    let careerPathId = null;
    if (rec.slug) {
      const cpRes = await db.query('SELECT id FROM career_paths WHERE slug = $1', [rec.slug]);
      if (cpRes.rowCount > 0) {
        careerPathId = cpRes.rows[0].id;
      }
    }

    await db.query(
      `INSERT INTO career_recommendations (
        id, student_profile_id, career_path_id, career_title, match_score, match_rank,
        reason, strengths_json, missing_skills_json, recommended_tech_json,
        learning_difficulty, next_steps_json, raw_llm_response, prompt_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        recommendationId,
        profileId,
        careerPathId,
        rec.careerTitle,
        rec.matchScore,
        rec.rank || 1,
        rec.reason,
        JSON.stringify(rec.strengths || []),
        JSON.stringify(rec.missingSkills || []),
        JSON.stringify(rec.recommendedTechnologies || []),
        rec.learningDifficulty || 'Moderate',
        JSON.stringify(rec.nextSteps || []),
        JSON.stringify(rec),
        promptHash
      ]
    );

    // Save Skill Gap Analysis for top recommendation
    if (rec.skillGaps && Array.isArray(rec.skillGaps)) {
      for (const gap of rec.skillGaps) {
        await db.query(
          `INSERT INTO skill_gap_analysis (
            id, recommendation_id, skill_name, current_proficiency, required_proficiency,
            gap_percentage, priority, learning_recommendation, estimated_hours_to_bridge
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            uuidv4(),
            recommendationId,
            gap.skillName,
            gap.currentProficiency || 0,
            gap.requiredProficiency || 80,
            gap.gapPercentage || 50,
            gap.priority || 'High Priority',
            gap.learningRecommendation || 'Follow targeted learning exercises',
            gap.estimatedHoursToBridge || 20
          ]
        );
      }
    }

    // Save Roadmaps for top recommendation
    if (rec.roadmaps && rec.roadmaps.thirtyDay) {
      const roadmapId = uuidv4();
      const thirtyDay = rec.roadmaps.thirtyDay;

      await db.query(
        `INSERT INTO roadmaps (id, recommendation_id, duration_days, title, overview)
         VALUES ($1, $2, $3, $4, $5)`,
        [roadmapId, recommendationId, 30, thirtyDay.title, thirtyDay.overview]
      );

      if (thirtyDay.weeks && Array.isArray(thirtyDay.weeks)) {
        for (const week of thirtyDay.weeks) {
          const itemId = uuidv4();
          await db.query(
            `INSERT INTO roadmap_items (
              id, roadmap_id, week_number, week_title, objective,
              topics_json, exercises_json, mini_project_json, expected_outcome, status, order_index
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              itemId,
              roadmapId,
              week.weekNumber,
              week.title,
              week.objective,
              JSON.stringify(week.topics || []),
              JSON.stringify(week.exercises || []),
              JSON.stringify(week.miniProject || {}),
              week.expectedOutcome,
              'not_started',
              week.weekNumber
            ]
          );

          // Initialize progress tracking row
          await db.query(
            `INSERT INTO progress_tracking (id, student_profile_id, roadmap_item_id, status)
             VALUES ($1, $2, $3, $4)`,
            [uuidv4(), profileId, itemId, 'not_started']
          );
        }
      }
    }

    // Save Recommended Projects for top recommendation
    if (rec.recommendedProjects && Array.isArray(rec.recommendedProjects)) {
      for (const proj of rec.recommendedProjects) {
        // Find or create project
        let projectId = uuidv4();
        const existingProj = await db.query('SELECT id FROM projects WHERE slug = $1', [proj.slug]);
        if (existingProj.rowCount > 0) {
          projectId = existingProj.rows[0].id;
        } else {
          await db.query(
            `INSERT INTO projects (
              id, title, slug, difficulty, description,
              technologies_json, skills_developed_json, expected_outcome, portfolio_value
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              projectId,
              proj.title,
              proj.slug,
              proj.difficulty || 'Intermediate',
              proj.description,
              JSON.stringify(proj.technologies || []),
              JSON.stringify(proj.skillsDeveloped || []),
              proj.expectedOutcome || '',
              proj.portfolioValue || ''
            ]
          );
        }

        await db.query(
          `INSERT INTO project_recommendations (id, recommendation_id, project_id, why_recommended)
           VALUES ($1, $2, $3, $4)`,
          [uuidv4(), recommendationId, projectId, `Tailored to accelerate ${rec.careerTitle} readiness.`]
        );
      }
    }

    createdRecommendations.push(recommendationId);
  }

  logger.info('Career recommendations and roadmaps saved to database', { profileId, count: createdRecommendations.length });

  return getRecommendationsByProfileId(profileId);
};

/**
 * Fetch all recommendations and complete details for a student profile
 */
const getRecommendationsByProfileId = async (profileId) => {
  const recRes = await db.query(
    `SELECT * FROM career_recommendations 
     WHERE student_profile_id = $1 
     ORDER BY match_rank ASC, created_at DESC LIMIT 3`,
    [profileId]
  );

  if (recRes.rowCount === 0) {
    logger.warn('getRecommendationsByProfileId found 0 rows for profileId', { profileId });
    return { recommendations: [] };
  }

  const recommendations = [];

  for (const row of recRes.rows) {
    // Parse JSON fields safely
    const rec = {
      id: row.id,
      studentProfileId: row.student_profile_id,
      careerPathId: row.career_path_id,
      careerTitle: row.career_title,
      matchScore: row.match_score,
      matchRank: row.match_rank,
      reason: row.reason,
      strengths: typeof row.strengths_json === 'string' ? JSON.parse(row.strengths_json) : (row.strengths_json || []),
      missingSkills: typeof row.missing_skills_json === 'string' ? JSON.parse(row.missing_skills_json) : (row.missing_skills_json || []),
      recommendedTechnologies: typeof row.recommended_tech_json === 'string' ? JSON.parse(row.recommended_tech_json) : (row.recommended_tech_json || []),
      learningDifficulty: row.learning_difficulty,
      nextSteps: typeof row.next_steps_json === 'string' ? JSON.parse(row.next_steps_json) : (row.next_steps_json || []),
      createdAt: row.created_at
    };

    // Load Skill Gap Analysis
    const gapRes = await db.query(
      `SELECT * FROM skill_gap_analysis WHERE recommendation_id = $1 ORDER BY gap_percentage DESC`,
      [row.id]
    );
    rec.skillGaps = gapRes.rows.map(g => ({
      id: g.id,
      skillName: g.skill_name,
      currentProficiency: g.current_proficiency,
      requiredProficiency: g.required_proficiency,
      gapPercentage: g.gap_percentage,
      priority: g.priority,
      learningRecommendation: g.learning_recommendation,
      estimatedHoursToBridge: g.estimated_hours_to_bridge
    }));

    // Load Roadmaps
    const roadmapsRes = await db.query(
      `SELECT * FROM roadmaps WHERE recommendation_id = $1 ORDER BY duration_days ASC`,
      [row.id]
    );

    const roadmaps = [];
    for (const r of roadmapsRes.rows) {
      const itemsRes = await db.query(
        `SELECT * FROM roadmap_items WHERE roadmap_id = $1 ORDER BY week_number ASC`,
        [r.id]
      );

      roadmaps.push({
        id: r.id,
        durationDays: r.duration_days,
        title: r.title,
        overview: r.overview,
        weeks: itemsRes.rows.map(item => ({
          id: item.id,
          weekNumber: item.week_number,
          title: item.week_title,
          objective: item.objective,
          topics: typeof item.topics_json === 'string' ? JSON.parse(item.topics_json) : (item.topics_json || []),
          exercises: typeof item.exercises_json === 'string' ? JSON.parse(item.exercises_json) : (item.exercises_json || []),
          miniProject: typeof item.mini_project_json === 'string' ? JSON.parse(item.mini_project_json) : (item.mini_project_json || {}),
          expectedOutcome: item.expected_outcome,
          status: item.status
        }))
      });
    }
    rec.roadmaps = roadmaps;

    // Load Projects
    const projRes = await db.query(
      `SELECT p.*, pr.why_recommended 
       FROM project_recommendations pr
       JOIN projects p ON pr.project_id = p.id
       WHERE pr.recommendation_id = $1`,
      [row.id]
    );
    rec.projects = projRes.rows.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      description: p.description,
      technologies: typeof p.technologies_json === 'string' ? JSON.parse(p.technologies_json) : (p.technologies_json || []),
      skillsDeveloped: typeof p.skills_developed_json === 'string' ? JSON.parse(p.skills_developed_json) : (p.skills_developed_json || []),
      expectedOutcome: p.expected_outcome,
      portfolioValue: p.portfolio_value,
      whyRecommended: p.why_recommended
    }));

    recommendations.push(rec);
  }

  return { recommendations };
};

/**
 * Get historical analysis snapshots
 */
const getRecommendationHistory = async (profileId) => {
  const res = await db.query(
    `SELECT id, career_title, match_score, match_rank, learning_difficulty, created_at
     FROM career_recommendations
     WHERE student_profile_id = $1
     ORDER BY created_at DESC`,
    [profileId]
  );
  return res.rows;
};

module.exports = {
  analyzeAndSaveRecommendations,
  getRecommendationsByProfileId,
  getRecommendationHistory
};
