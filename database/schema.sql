-- ============================================================================
-- CareerPath AI - Database Schema (PostgreSQL DDL)
-- Production-Ready Schema for AI Student Career Guidance Platform
-- ============================================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'student',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    degree VARCHAR(150),
    branch VARCHAR(150),
    college VARCHAR(250),
    graduation_year INTEGER,
    experience_level VARCHAR(50) DEFAULT 'Beginner',
    bio TEXT,
    desired_career VARCHAR(150),
    preferred_job_type VARCHAR(50) DEFAULT 'Full-time',
    target_industry VARCHAR(150),
    preferred_location VARCHAR(150),
    hours_per_week INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);

-- 3. SKILLS MASTER TABLE
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);

-- 4. STUDENT SKILLS JUNCTION TABLE (N:N)
CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER NOT NULL DEFAULT 50 CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
    verified_by_assessment BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_profile_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_student_skills_profile_id ON student_skills(student_profile_id);

-- 5. CAREER PATHS MASTER TABLE
CREATE TABLE IF NOT EXISTS career_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    market_outlook VARCHAR(100),
    avg_salary_range VARCHAR(100),
    difficulty_level VARCHAR(50) DEFAULT 'Moderate',
    icon_name VARCHAR(50) DEFAULT 'Briefcase',
    interview_focus TEXT,
    future_growth_outlook TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_paths_slug ON career_paths(slug);
CREATE INDEX IF NOT EXISTS idx_career_paths_category ON career_paths(category);

-- 6. CAREER SKILLS JUNCTION TABLE (N:N with Weights)
CREATE TABLE IF NOT EXISTS career_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_path_id UUID NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    importance VARCHAR(30) DEFAULT 'High', -- 'High Priority', 'Medium Priority', 'Nice to Have'
    min_proficiency INTEGER DEFAULT 75 CHECK (min_proficiency >= 0 AND min_proficiency <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(career_path_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_career_skills_career_id ON career_skills(career_path_id);

-- 7. ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    total_steps INTEGER DEFAULT 5,
    current_step INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_assessments_profile_id ON assessments(student_profile_id);

-- 8. ASSESSMENT ANSWERS TABLE
CREATE TABLE IF NOT EXISTS assessment_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    question_key VARCHAR(100) NOT NULL,
    answer_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_answers_assessment_id ON assessment_answers(assessment_id);

-- 9. CAREER RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS career_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    career_path_id UUID REFERENCES career_paths(id) ON DELETE SET NULL,
    career_title VARCHAR(150) NOT NULL,
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    match_rank INTEGER DEFAULT 1,
    reason TEXT NOT NULL,
    strengths_json TEXT NOT NULL,       -- JSON Array
    missing_skills_json TEXT NOT NULL,  -- JSON Array
    recommended_tech_json TEXT NOT NULL,-- JSON Array
    learning_difficulty VARCHAR(50) DEFAULT 'Moderate',
    next_steps_json TEXT NOT NULL,      -- JSON Array
    raw_llm_response TEXT,              -- Full JSON returned from AI
    prompt_hash VARCHAR(64),            -- SHA-256 hash for AI response caching
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_rec_profile_id ON career_recommendations(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_career_rec_prompt_hash ON career_recommendations(prompt_hash);

-- 10. SKILL GAP ANALYSIS TABLE
CREATE TABLE IF NOT EXISTS skill_gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES career_recommendations(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    current_proficiency INTEGER DEFAULT 0 CHECK (current_proficiency >= 0 AND current_proficiency <= 100),
    required_proficiency INTEGER DEFAULT 80 CHECK (required_proficiency >= 0 AND required_proficiency <= 100),
    gap_percentage INTEGER DEFAULT 80,
    priority VARCHAR(40) DEFAULT 'High Priority', -- 'High Priority', 'Medium Priority', 'Nice to Have'
    learning_recommendation TEXT,
    estimated_hours_to_bridge INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_gap_recommendation_id ON skill_gap_analysis(recommendation_id);

-- 11. ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES career_recommendations(id) ON DELETE CASCADE,
    duration_days INTEGER DEFAULT 30, -- 30, 60, 90
    title VARCHAR(200) NOT NULL,
    overview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roadmaps_recommendation_id ON roadmaps(recommendation_id);

-- 12. ROADMAP ITEMS / MILESTONES TABLE
CREATE TABLE IF NOT EXISTS roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    week_title VARCHAR(200) NOT NULL,
    objective TEXT NOT NULL,
    topics_json TEXT NOT NULL,        -- JSON Array
    exercises_json TEXT NOT NULL,     -- JSON Array
    mini_project_json TEXT NOT NULL,  -- JSON Object
    expected_outcome TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap_id ON roadmap_items(roadmap_id);

-- 13. PROJECTS MASTER TABLE
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Intermediate', -- 'Beginner', 'Intermediate', 'Advanced'
    description TEXT NOT NULL,
    technologies_json TEXT NOT NULL,   -- JSON Array
    skills_developed_json TEXT NOT NULL, -- JSON Array
    expected_outcome TEXT NOT NULL,
    portfolio_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- 14. PROJECT RECOMMENDATIONS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS project_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES career_recommendations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    why_recommended TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(recommendation_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_proj_rec_recommendation_id ON project_recommendations(recommendation_id);

-- 15. PROGRESS TRACKING TABLE
CREATE TABLE IF NOT EXISTS progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    roadmap_item_id UUID NOT NULL REFERENCES roadmap_items(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_profile_id, roadmap_item_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_profile_id ON progress_tracking(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_progress_roadmap_item_id ON progress_tracking(roadmap_item_id);
