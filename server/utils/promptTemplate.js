/**
 * Prompt Engineering Module for CareerPath AI
 * Constructs structured, hardened prompts for LLM career analysis
 */

const SYSTEM_INSTRUCTION = `
You are an expert AI Career Guidance Counselor and Senior Technical Talent Architect with deep knowledge of technology careers, engineering competencies, and modern industry requirements.

Your mission is to analyze a college student's profile (education, skills, interests, work preferences, and career goals) and generate:
1. Top 3 Most Compatible Career Recommendations with match scores (0-100) and rationale.
2. Granular Skill Gap Analysis with categorized priorities (High Priority, Medium Priority, Nice to Have).
3. Personalized 30-Day, 60-Day, and 90-Day Learning Roadmaps broken into actionable weekly milestones.
4. Recommended Real-World Portfolio Projects designed to close specific skill gaps.

CONSTRAINTS & RULES:
- Analyze ONLY the information provided in the student profile and assessment answers.
- Avoid making unsupported career claims or guaranteeing employment outcomes.
- Provide realistic, objective, and honest compatibility assessments.
- Highlight specific strengths and clearly enumerate missing technical skills.
- Structure roadmaps with concrete, achievable weekly topics, exercises, and mini-projects.
- You MUST respond strictly in valid JSON format matching the exact schema requested below. Do NOT output markdown code blocks (\`\`\`json) outside the JSON object.
`;

const buildAnalysisPrompt = (studentProfile, assessmentData = {}) => {
  const profileSummary = {
    personal: {
      name: studentProfile.name || 'Student',
      degree: studentProfile.degree || 'Not specified',
      branch: studentProfile.branch || 'Not specified',
      college: studentProfile.college || 'Not specified',
      graduationYear: studentProfile.graduation_year || studentProfile.graduationYear || 'Not specified',
      experienceLevel: studentProfile.experience_level || studentProfile.experienceLevel || 'Beginner',
      bio: studentProfile.bio || ''
    },
    currentSkills: studentProfile.skills || [],
    interests: {
      desiredCareer: studentProfile.desired_career || studentProfile.desiredCareer || '',
      preferredJobType: studentProfile.preferred_job_type || studentProfile.preferredJobType || 'Full-time',
      targetIndustry: studentProfile.target_industry || studentProfile.targetIndustry || 'Tech / Software',
      preferredLocation: studentProfile.preferred_location || studentProfile.preferredLocation || 'Any',
      hoursPerWeekForLearning: studentProfile.hours_per_week || studentProfile.hoursPerWeek || 10
    },
    assessmentAnswers: assessmentData.answers || []
  };

  return `
[STUDENT PROFILE CONTEXT]
${JSON.stringify(profileSummary, null, 2)}

[TASK]
Analyze the student's profile and generate the top 3 best-fit technology career recommendations. For the top #1 recommended career, provide an in-depth skill gap breakdown, multi-duration roadmap (30-day, 60-day, 90-day), and portfolio projects.

[OUTPUT FORMAT - STRICT JSON]
Return a single JSON object with this exact structure:
{
  "recommendations": [
    {
      "rank": 1,
      "careerTitle": "Full Stack Developer",
      "slug": "full-stack-developer",
      "matchScore": 88,
      "reason": "Clear explanation grounded in student's current skills and aspirations...",
      "strengths": ["Strong foundational Java and SQL", "Basic understanding of web technologies"],
      "missingSkills": ["React state management", "Node.js REST architecture", "Docker containerization"],
      "recommendedTechnologies": ["React", "Node.js", "Express", "PostgreSQL", "Docker"],
      "learningDifficulty": "Moderate",
      "nextSteps": [
        "Master modern JavaScript (ES6+) and asynchronous programming",
        "Build a full-stack CRUD application with React and Express",
        "Learn database indexing and schema design"
      ],
      "skillGaps": [
        {
          "skillName": "React & Modern Frontend",
          "currentProficiency": 40,
          "requiredProficiency": 85,
          "gapPercentage": 45,
          "priority": "High Priority",
          "learningRecommendation": "Focus on hooks, context API, and component composition",
          "estimatedHoursToBridge": 25
        },
        {
          "skillName": "Node.js & Express REST APIs",
          "currentProficiency": 30,
          "requiredProficiency": 80,
          "gapPercentage": 50,
          "priority": "High Priority",
          "learningRecommendation": "Build secure JWT-authenticated endpoints and handle error routing",
          "estimatedHoursToBridge": 30
        },
        {
          "skillName": "Docker & Container Basics",
          "currentProficiency": 10,
          "requiredProficiency": 65,
          "gapPercentage": 55,
          "priority": "Medium Priority",
          "learningRecommendation": "Learn containerizing Node.js and PostgreSQL apps with Docker Compose",
          "estimatedHoursToBridge": 15
        }
      ],
      "roadmaps": {
        "thirtyDay": {
          "title": "30-Day Accelerated Foundation Roadmap",
          "overview": "Fast-track essential full-stack core competencies and build first integrated project.",
          "weeks": [
            {
              "weekNumber": 1,
              "title": "Core Foundations & Modern JavaScript",
              "objective": "Solidify ES6+, Async/Await, and DOM manipulation",
              "topics": ["ES6 Modules", "Promises & Async/Await", "Fetch API & JSON handling"],
              "exercises": ["Build a dynamic Weather fetch app", "Implement custom array utilities"],
              "miniProject": {
                "title": "Interactive Task Tracker",
                "description": "Vanilla JS app with local storage persistence and state filters"
              },
              "expectedOutcome": "Fluency with modern asynchronous JavaScript"
            },
            {
              "weekNumber": 2,
              "title": "Frontend Component Architecture with React",
              "objective": "Master React fundamentals, state, and API consumption",
              "topics": ["React Hooks (useState, useEffect)", "Tailwind CSS styling", "Component hierarchy"],
              "exercises": ["Create reusable modal and table components", "Connect React app to public REST API"],
              "miniProject": {
                "title": "E-Commerce Product Catalog",
                "description": "Product catalog with instant search, category filters, and cart state"
              },
              "expectedOutcome": "Ability to architect interactive React user interfaces"
            },
            {
              "weekNumber": 3,
              "title": "Backend Services & Database Integration",
              "objective": "Build Express.js REST API with PostgreSQL persistence",
              "topics": ["Express routing & middleware", "PostgreSQL DDL/DML", "JWT Auth & bcrypt"],
              "exercises": ["Design relational database schema", "Write protected CRUD endpoints"],
              "miniProject": {
                "title": "Auth & Notes Backend API",
                "description": "Token-authenticated REST service with relational schema"
              },
              "expectedOutcome": "Working secure backend API with database connection"
            },
            {
              "weekNumber": 4,
              "title": "Full-Stack Integration & Portfolio Deployment",
              "objective": "Integrate React client with Express backend and prepare interview talking points",
              "topics": ["Full-stack deployment", "CORS & Environment configurations", "Basic Git CI/CD"],
              "exercises": ["Deploy backend and frontend to cloud platform", "Write README with architecture diagrams"],
              "miniProject": {
                "title": "End-to-End Career Tracking Dashboard",
                "description": "Full-stack web application with complete auth, database, and responsive UI"
              },
              "expectedOutcome": "Live deployed portfolio project ready for resume"
            }
          ]
        },
        "sixtyDay": {
          "title": "60-Day Comprehensive Developer Roadmap",
          "overview": "Deepens architectural knowledge, state management, Docker containers, and test coverage."
        },
        "ninetyDay": {
          "title": "90-Day Industry Readiness & System Design Roadmap",
          "overview": "Advanced microservices, Redis caching, CI/CD pipelines, and technical interview mastery."
        }
      },
      "recommendedProjects": [
        {
          "title": "AI-Powered Resume & Skill Gap Matcher",
          "slug": "ai-resume-matcher",
          "difficulty": "Intermediate",
          "description": "Full-stack application that parses resumes, highlights technical missing skills against job descriptions, and renders interactive progress roadmaps.",
          "technologies": ["React", "Node.js", "Express", "PostgreSQL", "Gemini LLM API", "Tailwind CSS"],
          "skillsDeveloped": ["REST API Architecture", "Relational Modeling", "LLM Integration", "JWT Security"],
          "expectedOutcome": "Production-deployed web application with live demo and GitHub repository",
          "portfolioValue": "High - Demonstrates practical AI integration and full-stack competence"
        },
        {
          "title": "High-Throughput Collaborative Workspace API",
          "slug": "collaborative-workspace-api",
          "difficulty": "Intermediate",
          "description": "Backend API supporting multi-tenant workspaces, role-based access control, relational PostgreSQL transactions, and Redis caching.",
          "technologies": ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "Jest"],
          "skillsDeveloped": ["ACID Transactions", "Caching", "Unit Testing", "Containerization"],
          "expectedOutcome": "Tested API with Swagger/OpenAPI documentation and 85%+ test coverage",
          "portfolioValue": "High - Proves backend architectural rigor and performance optimization"
        }
      ]
    },
    {
      "rank": 2,
      "careerTitle": "Backend Developer",
      "slug": "backend-developer",
      "matchScore": 82,
      "reason": "Strong alignment with student's Java and database foundations...",
      "strengths": ["Java knowledge", "Relational database concepts"],
      "missingSkills": ["Spring Boot microservices", "Docker", "Redis caching"],
      "recommendedTechnologies": ["Java", "Spring Boot", "PostgreSQL", "Docker", "Redis"],
      "learningDifficulty": "Moderate",
      "nextSteps": ["Deepen Spring Boot REST APIs", "Learn containerization with Docker"]
    },
    {
      "rank": 3,
      "careerTitle": "Data Analyst",
      "slug": "data-analyst",
      "matchScore": 76,
      "reason": "Leverages existing SQL proficiency and analytical problem-solving interests...",
      "strengths": ["SQL query writing", "Logical problem solving"],
      "missingSkills": ["Python Pandas", "Data Visualization (Tableau/PowerBI)", "Statistical Analysis"],
      "recommendedTechnologies": ["Python", "Pandas", "SQL", "Tableau", "PowerBI"],
      "learningDifficulty": "Moderate",
      "nextSteps": ["Learn Python data wrangling", "Build interactive analytics dashboards"]
    }
  ]
}
`;
};

module.exports = {
  SYSTEM_INSTRUCTION,
  buildAnalysisPrompt
};
