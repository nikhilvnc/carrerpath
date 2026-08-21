/**
 * Database Connection & Query Interface
 * Provides native PostgreSQL connectivity via pg.Pool, with automatic
 * schema initialization and an embedded zero-configuration fallback
 * store to ensure 100% demo reliability even if local Postgres is inactive.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('./env');
const logger = require('../utils/logger');

let pool = null;
let isPgConnected = false;

// In-memory fallback dataset for instant zero-dependency execution
let fallbackStore = {
  users: [],
  student_profiles: [],
  skills: [],
  student_skills: [],
  career_paths: [],
  career_skills: [],
  assessments: [],
  assessment_answers: [],
  career_recommendations: [],
  skill_gap_analysis: [],
  roadmaps: [],
  roadmap_items: [],
  projects: [],
  project_recommendations: [],
  progress_tracking: []
};

// Initialize PostgreSQL Pool
const initPool = () => {
  if (!pool && config.databaseUrl) {
    try {
      pool = new Pool({
        connectionString: config.databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      pool.on('error', (err) => {
        logger.error('Unexpected PostgreSQL client error', { error: err.message });
      });
    } catch (err) {
      logger.warn('Failed to initialize PostgreSQL pool, using fallback adapter', { error: err.message });
    }
  }
};

/**
 * Universal query runner
 * @param {string} text - SQL Query text
 * @param {Array} params - Query parameters ($1, $2...)
 */
const query = async (text, params = []) => {
  const start = Date.now();
  if (isPgConnected && pool) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed PostgreSQL query', { text: text.substring(0, 80), duration, rows: res.rowCount });
      return res;
    } catch (err) {
      logger.error('PostgreSQL Query Error', { text: text.substring(0, 100), error: err.message });
      throw err;
    }
  } else {
    // Execute through resilient memory/JSON adapter
    return executeFallbackQuery(text, params);
  }
};

/**
 * Load and execute schema and seeds
 */
const initializeDatabase = async () => {
  initPool();
  try {
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query('SELECT NOW()');
        isPgConnected = true;
        logger.info('Connected successfully to PostgreSQL database');

        // Check if schema needs to be applied
        const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
        const seedPath = path.resolve(__dirname, '../../database/seed.sql');

        if (fs.existsSync(schemaPath)) {
          const schemaSql = fs.readFileSync(schemaPath, 'utf8');
          await client.query(schemaSql);
          logger.info('PostgreSQL schema applied successfully');
        }

        // Check if careers exist
        const checkCareers = await client.query('SELECT COUNT(*) FROM career_paths');
        if (parseInt(checkCareers.rows[0].count, 10) === 0 && fs.existsSync(seedPath)) {
          const seedSql = fs.readFileSync(seedPath, 'utf8');
          await client.query(seedSql);
          logger.info('PostgreSQL seed data inserted successfully');
        }
      } finally {
        client.release();
      }
    }
  } catch (err) {
    isPgConnected = false;
    logger.warn(`PostgreSQL unavailable (${err.message}). Activating local high-resilience memory store.`);
    seedFallbackStore();
  }
};

/**
 * Seed data for fallback memory store
 */
const seedFallbackStore = () => {
  const bcrypt = require('bcryptjs');
  const demoPasswordHash = bcrypt.hashSync('Password123!', 10);

  const demoUserId = 'u0000001-0000-0000-0000-000000000001';
  const demoProfileId = 'f0000001-0000-0000-0000-000000000001';

  fallbackStore.users = [
    {
      id: demoUserId,
      name: 'Demo Student',
      email: 'demo@careerpath.ai',
      password_hash: demoPasswordHash,
      role: 'student',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  fallbackStore.student_profiles = [
    {
      id: demoProfileId,
      user_id: demoUserId,
      degree: 'B.Tech',
      branch: 'Computer Science and Engineering',
      college: 'National Institute of Technology',
      graduation_year: 2026,
      experience_level: 'Intermediate',
      bio: 'Passionate CS undergrad with strong algorithmic foundation and web basics looking to specialize as a Full Stack Developer.',
      desired_career: 'Full Stack Developer',
      preferred_job_type: 'Full-time',
      target_industry: 'Information Technology / SaaS',
      preferred_location: 'Hybrid / Remote',
      hours_per_week: 15,
      created_at: new Date().toISOString()
    }
  ];

  // Skills
  fallbackStore.skills = [
    { id: 's001', name: 'JavaScript', category: 'Programming', description: 'Core web language' },
    { id: 's002', name: 'TypeScript', category: 'Programming', description: 'Typed superset of JS' },
    { id: 's003', name: 'Python', category: 'Programming', description: 'Language for backend and AI' },
    { id: 's004', name: 'Java', category: 'Programming', description: 'Enterprise backend language' },
    { id: 's005', name: 'SQL', category: 'Programming', description: 'Relational database query language' },
    { id: 's006', name: 'React', category: 'Frontend', description: 'UI component library' },
    { id: 's007', name: 'HTML5/CSS3', category: 'Frontend', description: 'Web structuring & styling' },
    { id: 's008', name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first styling' },
    { id: 's009', name: 'Node.js', category: 'Backend', description: 'Server-side runtime' },
    { id: 's010', name: 'Express.js', category: 'Backend', description: 'Web framework for Node' },
    { id: 's011', name: 'PostgreSQL', category: 'Database', description: 'Relational database' },
    { id: 's012', name: 'Docker', category: 'Cloud & DevOps', description: 'Containerization engine' },
    { id: 's013', name: 'Pandas & NumPy', category: 'AI & ML', description: 'Data analysis libraries' },
    { id: 's014', name: 'REST APIs', category: 'Backend', description: 'API architecture' }
  ];

  fallbackStore.student_skills = [
    { id: 'ss1', student_profile_id: demoProfileId, skill_id: 's004', skill_name: 'Java', proficiency_level: 70 },
    { id: 'ss2', student_profile_id: demoProfileId, skill_id: 's005', skill_name: 'SQL', proficiency_level: 65 },
    { id: 'ss3', student_profile_id: demoProfileId, skill_id: 's007', skill_name: 'HTML5/CSS3', proficiency_level: 80 },
    { id: 'ss4', student_profile_id: demoProfileId, skill_id: 's001', skill_name: 'JavaScript', proficiency_level: 60 },
    { id: 'ss5', student_profile_id: demoProfileId, skill_id: 's006', skill_name: 'React', proficiency_level: 50 }
  ];

  // 12 Career Paths
  fallbackStore.career_paths = [
    {
      id: 'c001',
      title: 'Full Stack Developer',
      slug: 'full-stack-developer',
      category: 'Software Engineering',
      description: 'Builds complete end-to-end web applications covering user interface, backend business logic, API integrations, and database architectures.',
      market_outlook: 'Very High (22% CAGR)',
      avg_salary_range: '$75,000 - $135,000',
      difficulty_level: 'Moderate to High',
      icon_name: 'Layers',
      interview_focus: 'System design, REST/GraphQL APIs, React state management, Database query optimization, Auth flows',
      future_growth_outlook: 'High versatility across startups and enterprises transitioning to modern cloud-native web architectures.'
    },
    {
      id: 'c002',
      title: 'Backend Developer',
      slug: 'backend-developer',
      category: 'Software Engineering',
      description: 'Architects robust server-side systems, microservices, databases, authentication, caching, and scalable APIs.',
      market_outlook: 'High (18% CAGR)',
      avg_salary_range: '$80,000 - $140,000',
      difficulty_level: 'Moderate to High',
      icon_name: 'Server',
      interview_focus: 'Data structures & algorithms, concurrency, microservices architecture, SQL optimization, caching strategies',
      future_growth_outlook: 'Crucial demand for backend scaling, distributed systems, and real-time streaming architectures.'
    },
    {
      id: 'c003',
      title: 'Frontend Developer',
      slug: 'frontend-developer',
      category: 'Software Engineering',
      description: 'Crafts highly responsive, accessible, interactive, and visually stunning web experiences using modern client frameworks.',
      market_outlook: 'High (16% CAGR)',
      avg_salary_range: '$70,000 - $125,000',
      difficulty_level: 'Moderate',
      icon_name: 'Layout',
      interview_focus: 'Component lifecycle, CSS architecture, Core Web Vitals, state management, client performance optimization',
      future_growth_outlook: 'Continuous evolution with Next.js, WebAssembly, and AI-assisted conversational interfaces.'
    },
    {
      id: 'c004',
      title: 'Data Analyst',
      slug: 'data-analyst',
      category: 'Data & AI',
      description: 'Transforms raw transactional data into intuitive visualizations, executive dashboards, and statistical reports to drive business strategy.',
      market_outlook: 'High (19% CAGR)',
      avg_salary_range: '$60,000 - $105,000',
      difficulty_level: 'Moderate',
      icon_name: 'PieChart',
      interview_focus: 'Complex SQL joins & aggregations, dashboard design (PowerBI/Tableau), data cleansing, storytelling with numbers',
      future_growth_outlook: 'Broad entry point into tech with rapid advancement opportunities into Analytics Engineering and Data Science.'
    },
    {
      id: 'c005',
      title: 'Data Scientist',
      slug: 'data-scientist',
      category: 'Data & AI',
      description: 'Extracts actionable intelligence from complex structured and unstructured datasets using statistical modeling and machine learning.',
      market_outlook: 'Extremely High (35% CAGR)',
      avg_salary_range: '$90,000 - $155,000',
      difficulty_level: 'High',
      icon_name: 'BarChart3',
      interview_focus: 'Statistical hypothesis testing, feature engineering, predictive modeling, Python data stack, business communication',
      future_growth_outlook: 'Essential for data-driven enterprise decision-making and predictive analytics.'
    },
    {
      id: 'c006',
      title: 'Machine Learning Engineer',
      slug: 'machine-learning-engineer',
      category: 'Data & AI',
      description: 'Researches, trains, fine-tunes, and deploys production machine learning, deep learning, and generative AI models at scale.',
      market_outlook: 'Extremely High (40% CAGR)',
      avg_salary_range: '$105,000 - $175,000',
      difficulty_level: 'High',
      icon_name: 'Cpu',
      interview_focus: 'Deep learning theory, PyTorch/TensorFlow, model serving/quantization, LLM fine-tuning, MLOps pipelines',
      future_growth_outlook: 'Pinnacle demand as companies integrate GenAI and autonomous agents into products.'
    },
    {
      id: 'c007',
      title: 'Cloud Engineer',
      slug: 'cloud-engineer',
      category: 'Infrastructure',
      description: 'Designs, provisions, and manages secure, scalable multi-cloud infrastructure and serverless cloud architectures.',
      market_outlook: 'Very High (24% CAGR)',
      avg_salary_range: '$85,000 - $145,000',
      difficulty_level: 'Moderate to High',
      icon_name: 'Cloud',
      interview_focus: 'Cloud networking, IAM security, Terraform, container orchestration, disaster recovery',
      future_growth_outlook: 'Enterprise digital migration ensures long-term career stability.'
    },
    {
      id: 'c008',
      title: 'DevOps Engineer',
      slug: 'devops-engineer',
      category: 'Infrastructure',
      description: 'Bridges software engineering and IT operations by automating CI/CD pipelines, container orchestration, and system reliability.',
      market_outlook: 'Very High (21% CAGR)',
      avg_salary_range: '$90,000 - $150,000',
      difficulty_level: 'Moderate to High',
      icon_name: 'GitBranch',
      interview_focus: 'CI/CD automation, Kubernetes manifests, Linux troubleshooting, monitoring/observability, Docker',
      future_growth_outlook: 'Fundamental to modern agile engineering organizations.'
    },
    {
      id: 'c009',
      title: 'Cybersecurity Analyst',
      slug: 'cybersecurity-analyst',
      category: 'Security',
      description: 'Protects organization systems, networks, and data assets from vulnerabilities, unauthorized intrusions, and security breaches.',
      market_outlook: 'Extremely High (32% CAGR)',
      avg_salary_range: '$80,000 - $140,000',
      difficulty_level: 'Moderate to High',
      icon_name: 'ShieldCheck',
      interview_focus: 'Threat detection, incident response, vulnerability assessment, cryptography, SIEM tooling',
      future_growth_outlook: 'Universal organizational priority driven by strict compliance standards.'
    },
    {
      id: 'c010',
      title: 'Software Developer',
      slug: 'software-developer',
      category: 'Software Engineering',
      description: 'Solves core algorithmic problems and builds scalable desktop, web, or mobile software applications with clean modular code.',
      market_outlook: 'High (17% CAGR)',
      avg_salary_range: '$75,000 - $130,000',
      difficulty_level: 'Moderate',
      icon_name: 'Code',
      interview_focus: 'Data structures & algorithms, OOP design patterns, unit testing, Git version control',
      future_growth_outlook: 'Foundational software engineering role with versatile career branches.'
    },
    {
      id: 'c011',
      title: 'Database Developer',
      slug: 'database-developer',
      category: 'Database',
      description: 'Designs relational schemas, writes complex stored procedures, tunes query execution plans, and ensures transactional integrity.',
      market_outlook: 'Moderate (12% CAGR)',
      avg_salary_range: '$75,000 - $130,000',
      difficulty_level: 'Moderate to High',
      icon_name: 'Database',
      interview_focus: 'Advanced SQL tuning, indexing strategies, ACID transactions, partitioning, backups',
      future_growth_outlook: 'Vital for high-throughput transaction processing, fintech, and ERP systems.'
    },
    {
      id: 'c012',
      title: 'QA Engineer',
      slug: 'qa-engineer',
      category: 'Quality Assurance',
      description: 'Develops automated testing frameworks, executes regression test suites, and ensures exceptional software quality and performance.',
      market_outlook: 'Moderate to High (14% CAGR)',
      avg_salary_range: '$65,000 - $115,000',
      difficulty_level: 'Moderate',
      icon_name: 'CheckCircle2',
      interview_focus: 'Test automation frameworks (Selenium/Playwright/Cypress), API testing, CI integration',
      future_growth_outlook: 'Essential for agile delivery and mission-critical software reliability.'
    }
  ];

  // Portfolio projects
  fallbackStore.projects = [
    {
      id: 'p001',
      title: 'AI-Powered Resume & Career Matcher',
      slug: 'ai-resume-matcher',
      difficulty: 'Intermediate',
      description: 'Build a full-stack SaaS that ingests PDF resumes, computes skill gaps against live tech job postings, and generates tailored cover letters with LLM streaming.',
      technologies_json: JSON.stringify(['React', 'Node.js', 'Express', 'PostgreSQL', 'Gemini API', 'Tailwind CSS']),
      skills_developed_json: JSON.stringify(['LLM Integration', 'REST APIs', 'Relational Database Design', 'JWT Auth', 'Prompt Engineering']),
      expected_outcome: 'Deployable web app with PDF parsing, real-time AI critique, and downloadable PDF action plan.',
      portfolio_value: 'High - Demonstrates practical GenAI orchestration and full-stack product engineering.'
    },
    {
      id: 'p002',
      title: 'High-Throughput E-Commerce API Microservice',
      slug: 'ecommerce-backend-api',
      difficulty: 'Intermediate',
      description: 'Engineered resilient RESTful backend with JWT authentication, inventory concurrency control, Stripe checkout webhooks, and Redis caching.',
      technologies_json: JSON.stringify(['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'Jest']),
      skills_developed_json: JSON.stringify(['ACID Transactions', 'Caching Strategies', 'Unit/Integration Testing', 'Dockerization']),
      expected_outcome: 'Production-grade API with OpenAPI documentation, 90%+ test coverage, and automated Postman collection.',
      portfolio_value: 'High - Proves backend architecture rigor and database transaction safety.'
    }
  ];

  logger.info('Fallback in-memory database store seeded successfully with 12 careers and demo student.');
};

/**
 * Executes queries against fallback in-memory store
 */
const executeFallbackQuery = (text, params = []) => {
  const upper = text.toUpperCase().trim();
  const { v4: uuidv4 } = require('uuid');

  // Handle USERS table
  if (upper.includes('FROM USERS WHERE EMAIL =') || (upper.includes('FROM USERS') && upper.includes('EMAIL = $1'))) {
    const email = params[0]?.toLowerCase();
    const user = fallbackStore.users.find(u => u.email.toLowerCase() === email);
    return { rows: user ? [{ ...user }] : [], rowCount: user ? 1 : 0 };
  }

  if (upper.includes('FROM USERS WHERE ID =') || (upper.includes('FROM USERS') && upper.includes('ID = $1'))) {
    const id = params[0];
    const user = fallbackStore.users.find(u => u.id === id);
    return { rows: user ? [{ ...user }] : [], rowCount: user ? 1 : 0 };
  }

  if (upper.includes('INSERT INTO USERS')) {
    const id = params[0] || uuidv4();
    const name = params[1];
    const email = params[2];
    const password_hash = params[3];
    const role = params[4] || 'student';
    const newUser = { id, name, email, password_hash, role, is_active: true, created_at: new Date().toISOString() };
    fallbackStore.users.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // Handle STUDENT_PROFILES table
  if (upper.includes('FROM STUDENT_PROFILES') && (upper.includes('USER_ID =') || upper.includes('USER_ID = $1') || upper.includes('SP.USER_ID'))) {
    const userId = params[0];
    const profile = fallbackStore.student_profiles.find(p => p.user_id === userId);
    if (profile) {
      const user = fallbackStore.users.find(u => u.id === profile.user_id) || {};
      return { rows: [{ ...profile, name: user.name || '', email: user.email || '' }], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  if (upper.includes('FROM STUDENT_PROFILES') && (upper.includes('WHERE ID =') || upper.includes('ID = $1') || upper.includes('SP.ID'))) {
    const id = params[0];
    const profile = fallbackStore.student_profiles.find(p => p.id === id);
    if (profile) {
      const user = fallbackStore.users.find(u => u.id === profile.user_id) || {};
      return { rows: [{ ...profile, name: user.name || '', email: user.email || '' }], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  if (upper.includes('INSERT INTO STUDENT_PROFILES')) {
    const id = params[0] || uuidv4();
    const user_id = params[1];
    const newProfile = {
      id,
      user_id,
      degree: params[2] || '',
      branch: params[3] || '',
      college: params[4] || '',
      graduation_year: params[5] || 2026,
      experience_level: params[6] || 'Beginner',
      bio: params[7] || '',
      desired_career: params[8] || '',
      preferred_job_type: params[9] || 'Full-time',
      target_industry: params[10] || '',
      preferred_location: params[11] || '',
      hours_per_week: params[12] || 10,
      created_at: new Date().toISOString()
    };
    fallbackStore.student_profiles.push(newProfile);
    return { rows: [newProfile], rowCount: 1 };
  }

  if (upper.includes('UPDATE STUDENT_PROFILES')) {
    const userId = params[params.length - 1]; // usually WHERE user_id = $X
    let profile = fallbackStore.student_profiles.find(p => p.user_id === userId || p.id === userId);
    if (profile) {
      if (params[0] !== undefined) profile.degree = params[0];
      if (params[1] !== undefined) profile.branch = params[1];
      if (params[2] !== undefined) profile.college = params[2];
      if (params[3] !== undefined) profile.graduation_year = params[3];
      if (params[4] !== undefined) profile.experience_level = params[4];
      if (params[5] !== undefined) profile.bio = params[5];
      if (params[6] !== undefined) profile.desired_career = params[6];
      if (params[7] !== undefined) profile.preferred_job_type = params[7];
      if (params[8] !== undefined) profile.target_industry = params[8];
      if (params[9] !== undefined) profile.preferred_location = params[9];
      if (params[10] !== undefined) profile.hours_per_week = params[10];
      profile.updated_at = new Date().toISOString();
      return { rows: [profile], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // Handle SKILLS & STUDENT_SKILLS
  if (upper.includes('DELETE FROM STUDENT_SKILLS')) {
    const profileId = params[0];
    fallbackStore.student_skills = fallbackStore.student_skills.filter(s => s.student_profile_id !== profileId);
    return { rows: [], rowCount: 1 };
  }

  if (upper.includes('INSERT INTO SKILLS')) {
    const id = params[0] || uuidv4();
    const name = params[1];
    const category = params[2] || 'General';
    const description = params[3] || '';
    const newSkill = { id, name, category, description };
    fallbackStore.skills.push(newSkill);
    return { rows: [newSkill], rowCount: 1 };
  }

  if (upper.includes('INSERT INTO STUDENT_SKILLS')) {
    const id = params[0] || uuidv4();
    const student_profile_id = params[1];
    const skill_id = params[2];
    const proficiency_level = params[3] || 50;
    const skillObj = fallbackStore.skills.find(s => s.id === skill_id);
    const newSS = {
      id,
      student_skill_id: id,
      student_profile_id,
      skill_id,
      proficiency_level,
      skill_name: skillObj ? skillObj.name : '',
      name: skillObj ? skillObj.name : '',
      category: skillObj ? skillObj.category : 'General',
      description: skillObj ? skillObj.description : '',
      verified_by_assessment: false
    };
    fallbackStore.student_skills.push(newSS);
    return { rows: [newSS], rowCount: 1 };
  }

  if (upper.includes('FROM SKILLS WHERE LOWER(NAME) =')) {
    const name = params[0]?.toLowerCase();
    const skill = fallbackStore.skills.find(s => s.name.toLowerCase() === name);
    return { rows: skill ? [{ ...skill }] : [], rowCount: skill ? 1 : 0 };
  }

  if (upper.includes('FROM SKILLS')) {
    return { rows: [...fallbackStore.skills], rowCount: fallbackStore.skills.length };
  }

  if (upper.includes('FROM STUDENT_SKILLS')) {
    const profileId = params[0];
    const skills = fallbackStore.student_skills
      .filter(s => s.student_profile_id === profileId)
      .map(ss => {
        const master = fallbackStore.skills.find(s => s.id === ss.skill_id) || {};
        return {
          ...ss,
          student_skill_id: ss.id,
          name: ss.name || master.name || ss.skill_name || 'Skill',
          category: ss.category || master.category || 'General',
          description: master.description || ''
        };
      });
    return { rows: skills, rowCount: skills.length };
  }

  // Handle CAREER_PATHS table
  if (upper.includes('FROM CAREER_PATHS WHERE SLUG =') || upper.includes('SLUG = $1')) {
    const slug = params[0];
    const career = fallbackStore.career_paths.find(c => c.slug === slug);
    return { rows: career ? [{ ...career }] : [], rowCount: career ? 1 : 0 };
  }

  if (upper.includes('FROM CAREER_PATHS WHERE ID =') || upper.includes('ID = $1')) {
    const id = params[0];
    const career = fallbackStore.career_paths.find(c => c.id === id);
    return { rows: career ? [{ ...career }] : [], rowCount: career ? 1 : 0 };
  }

  if (upper.includes('FROM CAREER_PATHS')) {
    return { rows: [...fallbackStore.career_paths], rowCount: fallbackStore.career_paths.length };
  }

  // Handle CAREER_SKILLS table
  if (upper.includes('FROM CAREER_SKILLS')) {
    return { rows: [], rowCount: 0 };
  }

  // Handle ASSESSMENTS & ASSESSMENT_ANSWERS
  if (upper.includes('INSERT INTO ASSESSMENTS')) {
    const newAss = {
      id: params[0] || uuidv4(),
      student_profile_id: params[1],
      total_steps: params[2] || 5,
      current_step: params[3] || 1,
      is_completed: params[4] || false,
      created_at: new Date().toISOString()
    };
    fallbackStore.assessments.push(newAss);
    return { rows: [newAss], rowCount: 1 };
  }

  if (upper.includes('FROM ASSESSMENTS WHERE STUDENT_PROFILE_ID =')) {
    const profileId = params[0];
    const ass = fallbackStore.assessments.find(a => a.student_profile_id === profileId);
    return { rows: ass ? [{ ...ass }] : [], rowCount: ass ? 1 : 0 };
  }

  if (upper.includes('INSERT INTO ASSESSMENT_ANSWERS')) {
    const newAns = {
      id: params[0] || uuidv4(),
      assessment_id: params[1],
      step_number: params[2],
      question_key: params[3],
      answer_json: params[4],
      created_at: new Date().toISOString()
    };
    fallbackStore.assessment_answers.push(newAns);
    return { rows: [newAns], rowCount: 1 };
  }

  // Handle RECOMMENDATIONS
  if (upper.includes('INSERT INTO CAREER_RECOMMENDATIONS')) {
    const newRec = {
      id: params[0] || uuidv4(),
      student_profile_id: params[1],
      career_path_id: params[2],
      career_title: params[3],
      match_score: params[4],
      match_rank: params[5] || 1,
      reason: params[6],
      strengths_json: params[7],
      missing_skills_json: params[8],
      recommended_tech_json: params[9],
      learning_difficulty: params[10],
      next_steps_json: params[11],
      raw_llm_response: params[12],
      prompt_hash: params[13],
      created_at: new Date().toISOString()
    };
    fallbackStore.career_recommendations.push(newRec);
    return { rows: [newRec], rowCount: 1 };
  }

  if (upper.includes('FROM CAREER_RECOMMENDATIONS') && upper.includes('PROMPT_HASH')) {
    const profileId = params[0];
    const hash = params[1] || params[0];
    const recs = fallbackStore.career_recommendations.filter(r => String(r.student_profile_id) === String(profileId) && r.prompt_hash === hash);
    return { rows: recs, rowCount: recs.length };
  }

  if (upper.includes('FROM CAREER_RECOMMENDATIONS') && (upper.includes('STUDENT_PROFILE_ID =') || upper.includes('STUDENT_PROFILE_ID = $1') || upper.includes('STUDENT_PROFILE_ID'))) {
    const profileId = params[0];
    const recs = fallbackStore.career_recommendations
      .filter(r => String(r.student_profile_id) === String(profileId))
      .sort((a, b) => (a.match_rank || 1) - (b.match_rank || 1));
    console.log('DEBUG FROM CAREER_RECOMMENDATIONS:', { profileId, storeCount: fallbackStore.career_recommendations.length, allIds: fallbackStore.career_recommendations.map(r => r.student_profile_id), matched: recs.length });
    return { rows: recs, rowCount: recs.length };
  }

  if (upper.includes('FROM CAREER_RECOMMENDATIONS') && (upper.includes('ID =') || upper.includes('ID = $1'))) {
    const recId = params[0];
    const rec = fallbackStore.career_recommendations.find(r => r.id === recId);
    return { rows: rec ? [{ ...rec }] : [], rowCount: rec ? 1 : 0 };
  }

  // Handle SKILL_GAP_ANALYSIS
  if (upper.includes('INSERT INTO SKILL_GAP_ANALYSIS')) {
    const newGap = {
      id: params[0] || uuidv4(),
      recommendation_id: params[1],
      skill_name: params[2],
      current_proficiency: params[3],
      required_proficiency: params[4],
      gap_percentage: params[5],
      priority: params[6],
      learning_recommendation: params[7],
      estimated_hours_to_bridge: params[8] || 20,
      created_at: new Date().toISOString()
    };
    fallbackStore.skill_gap_analysis.push(newGap);
    return { rows: [newGap], rowCount: 1 };
  }

  if (upper.includes('FROM SKILL_GAP_ANALYSIS')) {
    const recId = params[0];
    const gaps = fallbackStore.skill_gap_analysis.filter(g => g.recommendation_id === recId);
    return { rows: gaps, rowCount: gaps.length };
  }

  // Handle ROADMAPS & ROADMAP_ITEMS
  if (upper.includes('INSERT INTO ROADMAPS')) {
    const newRoadmap = {
      id: params[0] || uuidv4(),
      recommendation_id: params[1],
      duration_days: params[2] || 30,
      title: params[3],
      overview: params[4],
      created_at: new Date().toISOString()
    };
    fallbackStore.roadmaps.push(newRoadmap);
    return { rows: [newRoadmap], rowCount: 1 };
  }

  if (upper.includes('INSERT INTO ROADMAP_ITEMS')) {
    const newItem = {
      id: params[0] || uuidv4(),
      roadmap_id: params[1],
      week_number: params[2],
      week_title: params[3],
      objective: params[4],
      topics_json: params[5],
      exercises_json: params[6],
      mini_project_json: params[7],
      expected_outcome: params[8],
      status: params[9] || 'not_started',
      order_index: params[10] || 0,
      created_at: new Date().toISOString()
    };
    fallbackStore.roadmap_items.push(newItem);
    return { rows: [newItem], rowCount: 1 };
  }

  if (upper.includes('FROM ROADMAPS') && (upper.includes('RECOMMENDATION_ID =') || upper.includes('RECOMMENDATION_ID = $1'))) {
    const recId = params[0];
    const roadmaps = fallbackStore.roadmaps.filter(r => r.recommendation_id === recId);
    return { rows: roadmaps, rowCount: roadmaps.length };
  }

  if (upper.includes('FROM ROADMAP_ITEMS') && (upper.includes('ROADMAP_ID =') || upper.includes('ROADMAP_ID = $1'))) {
    const rId = params[0];
    const items = fallbackStore.roadmap_items
      .filter(i => i.roadmap_id === rId)
      .sort((a, b) => a.week_number - b.week_number);
    return { rows: items, rowCount: items.length };
  }

  if (upper.startsWith('UPDATE ROADMAP_ITEMS SET STATUS =')) {
    const status = params[0];
    const itemId = params[1];
    const item = fallbackStore.roadmap_items.find(i => i.id === itemId);
    if (item) {
      item.status = status;
      return { rows: [item], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // Handle PROJECTS & PROJECT_RECOMMENDATIONS
  if (upper.startsWith('INSERT INTO PROJECTS')) {
    const newProj = {
      id: params[0] || uuidv4(),
      title: params[1],
      slug: params[2],
      difficulty: params[3],
      description: params[4],
      technologies_json: params[5],
      skills_developed_json: params[6],
      expected_outcome: params[7],
      portfolio_value: params[8],
      created_at: new Date().toISOString()
    };
    fallbackStore.projects.push(newProj);
    return { rows: [newProj], rowCount: 1 };
  }

  if (upper.startsWith('INSERT INTO PROJECT_RECOMMENDATIONS')) {
    const newPr = {
      id: params[0] || uuidv4(),
      recommendation_id: params[1],
      project_id: params[2],
      why_recommended: params[3],
      created_at: new Date().toISOString()
    };
    fallbackStore.project_recommendations.push(newPr);
    return { rows: [newPr], rowCount: 1 };
  }

  if (upper.includes('FROM PROJECT_RECOMMENDATIONS PR') || upper.includes('PROJECT_RECOMMENDATIONS')) {
    const recId = params[0];
    const prs = fallbackStore.project_recommendations.filter(pr => pr.recommendation_id === recId);
    const rows = prs.map(pr => {
      const p = fallbackStore.projects.find(proj => proj.id === pr.project_id) || {};
      return { ...p, ...pr };
    });
    return { rows, rowCount: rows.length };
  }

  if (upper.includes('FROM PROJECTS')) {
    return { rows: [...fallbackStore.projects], rowCount: fallbackStore.projects.length };
  }

  // Handle PROGRESS_TRACKING queries
  if (upper.includes('FROM PROGRESS_TRACKING')) {
    const profileId = params[0];
    const rows = fallbackStore.progress_tracking.filter(pt => pt.student_profile_id === profileId);
    return { rows, rowCount: rows.length };
  }

  if (upper.startsWith('INSERT INTO PROGRESS_TRACKING')) {
    const newPt = {
      id: params[0] || uuidv4(),
      student_profile_id: params[1],
      roadmap_item_id: params[2],
      status: params[3] || 'not_started',
      completed_at: params[4] || null,
      notes: params[5] || '',
      updated_at: new Date().toISOString()
    };
    fallbackStore.progress_tracking.push(newPt);
    return { rows: [newPt], rowCount: 1 };
  }

  if (upper.startsWith('UPDATE PROGRESS_TRACKING')) {
    const status = params[0];
    const completed_at = params[1];
    const notes = params[2];
    const profileId = params[3];
    const itemId = params[4];
    const pt = fallbackStore.progress_tracking.find(p => p.student_profile_id === profileId && p.roadmap_item_id === itemId);
    if (pt) {
      pt.status = status;
      pt.completed_at = completed_at;
      pt.notes = notes;
      pt.updated_at = new Date().toISOString();
      return { rows: [pt], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // Handle Progress summary join query
  if (upper.includes('FROM ROADMAP_ITEMS RI') && upper.includes('JOIN ROADMAPS R')) {
    const profileId = params[0];
    const activeRecs = fallbackStore.career_recommendations.filter(r => r.student_profile_id === profileId);
    const recIds = activeRecs.map(r => r.id);
    const activeRoadmaps = fallbackStore.roadmaps.filter(rm => recIds.includes(rm.recommendation_id));
    const rmIds = activeRoadmaps.map(rm => rm.id);
    const items = fallbackStore.roadmap_items.filter(ri => rmIds.includes(ri.roadmap_id)).map(ri => {
      const rm = activeRoadmaps.find(r => r.id === ri.roadmap_id) || {};
      return {
        id: ri.id,
        status: ri.status,
        week_number: ri.week_number,
        week_title: ri.week_title,
        duration_days: rm.duration_days || 30,
        roadmap_title: rm.title || 'Roadmap'
      };
    });
    return { rows: items, rowCount: items.length };
  }

  // Generic fallback
  return { rows: [], rowCount: 0 };
};

module.exports = {
  query,
  initializeDatabase,
  getIsPgConnected: () => isPgConnected,
  fallbackStore
};
