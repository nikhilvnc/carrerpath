-- ============================================================================
-- CareerPath AI - Database Seed Data (PostgreSQL DML)
-- Master Careers, Skills, Career-Skills Matrix, Portfolio Projects, Demo Account
-- ============================================================================

-- 1. SEED SKILLS
INSERT INTO skills (id, name, category, description) VALUES
-- Programming Languages
('s0000001-0000-0000-0000-000000000001', 'JavaScript', 'Programming', 'Core language of the web for client and server side'),
('s0000001-0000-0000-0000-000000000002', 'TypeScript', 'Programming', 'Typed superset of JavaScript offering type safety and scalability'),
('s0000001-0000-0000-0000-000000000003', 'Python', 'Programming', 'Versatile language for backend, data science, automation, and AI'),
('s0000001-0000-0000-0000-000000000004', 'Java', 'Programming', 'Enterprise object-oriented language for robust backend microservices'),
('s0000001-0000-0000-0000-000000000005', 'C++', 'Programming', 'High-performance systems programming language'),
('s0000001-0000-0000-0000-000000000006', 'Go', 'Programming', 'Concurrent, lightweight cloud and backend microservices language'),
('s0000001-0000-0000-0000-000000000007', 'SQL', 'Programming', 'Declarative relational database query language'),

-- Frontend
('s0000002-0000-0000-0000-000000000001', 'React', 'Frontend', 'Declarative component-based UI library'),
('s0000002-0000-0000-0000-000000000002', 'HTML5/CSS3', 'Frontend', 'Foundational semantic web markup and modern styling'),
('s0000002-0000-0000-0000-000000000003', 'Tailwind CSS', 'Frontend', 'Utility-first CSS framework for rapid UI styling'),
('s0000002-0000-0000-0000-000000000004', 'Next.js', 'Frontend', 'React framework for server-side rendering and static web apps'),
('s0000002-0000-0000-0000-000000000005', 'Vue.js', 'Frontend', 'Progressive JavaScript framework for user interfaces'),

-- Backend
('s0000003-0000-0000-0000-000000000001', 'Node.js', 'Backend', 'Asynchronous event-driven JavaScript runtime for servers'),
('s0000003-0000-0000-0000-000000000002', 'Express.js', 'Backend', 'Fast, unopinionated minimalist web framework for Node.js'),
('s0000003-0000-0000-0000-000000000003', 'Spring Boot', 'Backend', 'Enterprise Java framework for building stand-alone production microservices'),
('s0000003-0000-0000-0000-000000000004', 'Django/FastAPI', 'Backend', 'High-performance Python web frameworks for APIs and data services'),
('s0000003-0000-0000-0000-000000000005', 'REST APIs', 'Backend', 'Architectural style for designing networked web APIs'),
('s0000003-0000-0000-0000-000000000006', 'GraphQL', 'Backend', 'Query language and server runtime for APIs with flexible schemas'),

-- Databases
('s0000004-0000-0000-0000-000000000001', 'PostgreSQL', 'Database', 'Powerful open-source object-relational database system'),
('s0000004-0000-0000-0000-000000000002', 'MongoDB', 'Database', 'NoSQL document database designed for high availability and JSON data'),
('s0000004-0000-0000-0000-000000000003', 'Redis', 'Database', 'In-memory data structure store used as a cache and message broker'),
('s0000004-0000-0000-0000-000000000004', 'Data Modeling', 'Database', 'Schema normalization, indexing, and query optimization strategy'),

-- Cloud & DevOps
('s0000005-0000-0000-0000-000000000001', 'Docker', 'Cloud & DevOps', 'Containerization platform for packaging application dependencies'),
('s0000005-0000-0000-0000-000000000002', 'Kubernetes', 'Cloud & DevOps', 'Container orchestration engine for automated deployment and scaling'),
('s0000005-0000-0000-0000-000000000003', 'AWS/GCP/Azure', 'Cloud & DevOps', 'Major cloud infrastructure service platforms'),
('s0000005-0000-0000-0000-000000000004', 'CI/CD Pipelines', 'Cloud & DevOps', 'Automated integration, testing, and continuous deployment workflows'),
('s0000005-0000-0000-0000-000000000005', 'Linux & Bash', 'Cloud & DevOps', 'Unix operating system fundamentals and shell scripting'),

-- AI, ML & Data
('s0000006-0000-0000-0000-000000000001', 'Pandas & NumPy', 'AI & ML', 'Python libraries for data manipulation and numerical computation'),
('s0000006-0000-0000-0000-000000000002', 'Scikit-Learn', 'AI & ML', 'Machine learning algorithms for classification, regression, and clustering'),
('s0000006-0000-0000-0000-000000000003', 'TensorFlow/PyTorch', 'AI & ML', 'Deep learning frameworks for neural network training and inference'),
('s0000006-0000-0000-0000-000000000004', 'LLMs & Prompt Eng', 'AI & ML', 'Generative AI APIs, prompt templates, function calling, and RAG architectures'),
('s0000006-0000-0000-0000-000000000005', 'Data Visualization', 'AI & ML', 'Transforming data insights with PowerBI, Tableau, Matplotlib, or D3.js'),

-- QA & Security
('s0000007-0000-0000-0000-000000000001', 'Automated Testing', 'QA & Testing', 'Unit, integration, and E2E testing with Jest, PyTest, or Cypress'),
('s0000007-0000-0000-0000-000000000002', 'Application Security', 'Cybersecurity', 'OWASP Top 10, authentication protocols, cryptography, and input sanitization'),
('s0000007-0000-0000-0000-000000000003', 'Network Security', 'Cybersecurity', 'TCP/IP, firewalls, threat hunting, SIEM, and vulnerability scanning')
ON CONFLICT (name) DO NOTHING;


-- 2. SEED 12 CAREER PATHS
INSERT INTO career_paths (id, title, slug, category, description, market_outlook, avg_salary_range, difficulty_level, icon_name, interview_focus, future_growth_outlook) VALUES
('c0000001-0000-0000-0000-000000000001', 'Full Stack Developer', 'full-stack-developer', 'Software Engineering', 'Builds complete end-to-end web applications covering user interface, backend business logic, API integrations, and database architectures.', 'Very High (22% CAGR)', '$75,000 - $135,000', 'Moderate to High', 'Layers', 'System design, REST/GraphQL APIs, React state management, Database query optimization, Auth flows', 'High versatility across startups and enterprises transitioning to modern cloud-native web architectures.'),

('c0000001-0000-0000-0000-000000000002', 'Backend Developer', 'backend-developer', 'Software Engineering', 'Architects robust server-side systems, microservices, databases, authentication, caching, and scalable APIs.', 'High (18% CAGR)', '$80,000 - $140,000', 'Moderate to High', 'Server', 'Data structures & algorithms, concurrency, microservices architecture, SQL optimization, caching strategies', 'Crucial demand for backend scaling, distributed systems, and real-time streaming architectures.'),

('c0000001-0000-0000-0000-000000000003', 'Frontend Developer', 'frontend-developer', 'Software Engineering', 'Crafts highly responsive, accessible, interactive, and visually stunning web experiences using modern client frameworks.', 'High (16% CAGR)', '$70,000 - $125,000', 'Moderate', 'Layout', 'Component lifecycle, CSS architecture, Core Web Vitals, state management, client performance optimization', 'Continuous evolution with Next.js, WebAssembly, and AI-assisted conversational interfaces.'),

('c0000001-0000-0000-0000-000000000004', 'Data Scientist', 'data-scientist', 'Data & AI', 'Extracts actionable intelligence from complex structured and unstructured datasets using statistical modeling and machine learning.', 'Extremely High (35% CAGR)', '$90,000 - $155,000', 'High', 'BarChart3', 'Statistical hypothesis testing, feature engineering, predictive modeling, Python data stack, business communication', 'Essential for data-driven enterprise decision-making and predictive analytics across healthcare, finance, and tech.'),

('c0000001-0000-0000-0000-000000000005', 'Machine Learning Engineer', 'machine-learning-engineer', 'Data & AI', 'Researches, trains, fine-tunes, and deploys production machine learning, deep learning, and generative AI models at scale.', 'Extremely High (40% CAGR)', '$105,000 - $175,000', 'High', 'Cpu', 'Deep learning theory, PyTorch/TensorFlow, model serving/quantization, LLM fine-tuning, MLOps pipelines', 'Pinnacle demand as companies integrate GenAI, autonomous agents, and computer vision into production products.'),

('c0000001-0000-0000-0000-000000000006', 'Cloud Engineer', 'cloud-engineer', 'Infrastructure', 'Designs, provisions, and manages secure, scalable multi-cloud infrastructure and serverless cloud architectures.', 'Very High (24% CAGR)', '$85,000 - $145,000', 'Moderate to High', 'Cloud', 'Cloud networking, IAM security, Terraform / Infrastructure as Code, container orchestration, disaster recovery', 'Enterprise digital migration ensures long-term career stability and continuous multi-cloud architectural demands.'),

('c0000001-0000-0000-0000-000000000007', 'DevOps Engineer', 'devops-engineer', 'Infrastructure', 'Bridges software engineering and IT operations by automating CI/CD pipelines, container orchestration, and system reliability.', 'Very High (21% CAGR)', '$90,000 - $150,000', 'Moderate to High', 'GitBranch', 'CI/CD automation, Kubernetes manifests, Linux troubleshooting, monitoring/observability (Prometheus/Grafana), Docker', 'Fundamental to modern agile engineering organizations seeking rapid and reliable deployment cycles.'),

('c0000001-0000-0000-0000-000000000008', 'Cybersecurity Analyst', 'cybersecurity-analyst', 'Security', 'Protects organization systems, networks, and data assets from vulnerabilities, unauthorized intrusions, and security breaches.', 'Extremely High (32% CAGR)', '$80,000 - $140,000', 'Moderate to High', 'ShieldCheck', 'Threat detection, incident response, vulnerability assessment, cryptography, SIEM tooling, OWASP principles', 'Universal organizational priority driven by strict compliance standards and increasing threat surfaces.'),

('c0000001-0000-0000-0000-000000000009', 'Data Analyst', 'data-analyst', 'Data & AI', 'Transforms raw transactional data into intuitive visualizations, executive dashboards, and statistical reports to drive business strategy.', 'High (19% CAGR)', '$60,000 - $105,000', 'Moderate', 'PieChart', 'Complex SQL joins & aggregations, dashboard design (PowerBI/Tableau), data cleansing, storytelling with numbers', 'Broad entry point into tech with rapid advancement opportunities into Analytics Engineering and Data Science.'),

('c0000001-0000-0000-0000-000000000010', 'Software Developer', 'software-developer', 'Software Engineering', 'Solves core algorithmic problems and builds scalable desktop, web, or mobile software applications with clean modular code.', 'High (17% CAGR)', '$75,000 - $130,000', 'Moderate', 'Code', 'Data structures & algorithms, OOP design patterns, unit testing, Git version control, problem-solving', 'Foundational software engineering role with versatile career branches into systems, apps, and architecture.'),

('c0000001-0000-0000-0000-000000000011', 'Database Developer', 'database-developer', 'Database', 'Designs relational schemas, writes complex stored procedures, tunes query execution plans, and ensures transactional integrity.', 'Moderate (12% CAGR)', '$75,000 - $130,000', 'Moderate to High', 'Database', 'Advanced SQL tuning, indexing strategies, ACID transactions, partitioning, backup and migration strategies', 'Vital for high-throughput transaction processing, fintech, healthcare, and enterprise ERP systems.'),

('c0000001-0000-0000-0000-000000000012', 'QA Engineer', 'qa-engineer', 'Quality Assurance', 'Develops automated testing frameworks, executes regression test suites, and ensures exceptional software quality and performance.', 'Moderate to High (14% CAGR)', '$65,000 - $115,000', 'Moderate', 'CheckCircle2', 'Test automation frameworks (Selenium/Playwright/Cypress), API testing (Postman), CI test integration, bug tracking', 'Essential for agile delivery and mission-critical software reliability.')
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  market_outlook = EXCLUDED.market_outlook,
  avg_salary_range = EXCLUDED.avg_salary_range,
  difficulty_level = EXCLUDED.difficulty_level,
  icon_name = EXCLUDED.icon_name;


-- 3. SEED CAREER-SKILL REQUIREMENTS (N:N Matrix)
-- Full Stack Developer
INSERT INTO career_skills (career_path_id, skill_id, importance, min_proficiency) VALUES
('c0000001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000001', 'High Priority', 85), -- JS
('c0000001-0000-0000-0000-000000000001', 's0000002-0000-0000-0000-000000000001', 'High Priority', 80), -- React
('c0000001-0000-0000-0000-000000000001', 's0000003-0000-0000-0000-000000000001', 'High Priority', 80), -- Node.js
('c0000001-0000-0000-0000-000000000001', 's0000004-0000-0000-0000-000000000001', 'High Priority', 75), -- PostgreSQL
('c0000001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000002', 'Medium Priority', 70), -- TypeScript
('c0000001-0000-0000-0000-000000000001', 's0000005-0000-0000-0000-000000000001', 'Nice to Have', 60), -- Docker

-- Backend Developer
('c0000001-0000-0000-0000-000000000002', 's0000001-0000-0000-0000-000000000004', 'High Priority', 80), -- Java
('c0000001-0000-0000-0000-000000000002', 's0000003-0000-0000-0000-000000000003', 'High Priority', 75), -- Spring Boot
('c0000001-0000-0000-0000-000000000002', 's0000004-0000-0000-0000-000000000001', 'High Priority', 80), -- PostgreSQL
('c0000001-0000-0000-0000-000000000002', 's0000003-0000-0000-0000-000000000005', 'High Priority', 85), -- REST APIs
('c0000001-0000-0000-0000-000000000002', 's0000005-0000-0000-0000-000000000001', 'Medium Priority', 65), -- Docker
('c0000001-0000-0000-0000-000000000002', 's0000004-0000-0000-0000-000000000003', 'Medium Priority', 65), -- Redis

-- Frontend Developer
('c0000001-0000-0000-0000-000000000003', 's0000001-0000-0000-0000-000000000001', 'High Priority', 90), -- JS
('c0000001-0000-0000-0000-000000000003', 's0000002-0000-0000-0000-000000000001', 'High Priority', 85), -- React
('c0000001-0000-0000-0000-000000000003', 's0000002-0000-0000-0000-000000000002', 'High Priority', 90), -- HTML/CSS
('c0000001-0000-0000-0000-000000000003', 's0000002-0000-0000-0000-000000000003', 'Medium Priority', 80), -- Tailwind
('c0000001-0000-0000-0000-000000000003', 's0000001-0000-0000-0000-000000000002', 'Medium Priority', 75), -- TypeScript

-- Data Analyst
('c0000001-0000-0000-0000-000000000009', 's0000001-0000-0000-0000-000000000007', 'High Priority', 85), -- SQL
('c0000001-0000-0000-0000-000000000009', 's0000001-0000-0000-0000-000000000003', 'High Priority', 75), -- Python
('c0000001-0000-0000-0000-000000000009', 's0000006-0000-0000-0000-000000000001', 'High Priority', 80), -- Pandas
('c0000001-0000-0000-0000-000000000009', 's0000006-0000-0000-0000-000000000005', 'High Priority', 85), -- Data Viz
('c0000001-0000-0000-0000-000000000009', 's0000004-0000-0000-0000-000000000004', 'Medium Priority', 70)  -- Data Modeling
ON CONFLICT (career_path_id, skill_id) DO UPDATE SET 
  importance = EXCLUDED.importance,
  min_proficiency = EXCLUDED.min_proficiency;


-- 4. SEED PORTFOLIO PROJECTS
INSERT INTO projects (id, title, slug, difficulty, description, technologies_json, skills_developed_json, expected_outcome, portfolio_value) VALUES
('p0000001-0000-0000-0000-000000000001', 'AI-Powered Resume & Career Matcher', 'ai-resume-matcher', 'Intermediate', 'Build a full-stack SaaS that ingests PDF resumes, computes skill gaps against live tech job postings, and generates tailored cover letters with LLM streaming.', '["React", "Node.js", "Express", "PostgreSQL", "Gemini API", "Tailwind CSS"]', '["LLM Integration", "REST APIs", "Relational Database Design", "JWT Auth", "Prompt Engineering"]', 'Deployable web app with PDF parsing, real-time AI critique, and downloadable PDF action plan.', 'High - Demonstrates practical GenAI orchestration and full-stack product engineering.'),

('p0000001-0000-0000-0000-000000000002', 'High-Throughput E-Commerce API Microservice', 'ecommerce-backend-api', 'Intermediate', 'Engineered resilient RESTful backend with JWT authentication, inventory concurrency control, Stripe checkout webhooks, and Redis caching.', '["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "Jest"]', '["ACID Transactions", "Caching Strategies", "Unit/Integration Testing", "Dockerization"]', 'Production-grade API with OpenAPI documentation, 90%+ test coverage, and automated Postman collection.', 'High - Proves backend architecture rigor and database transaction safety.'),

('p0000001-0000-0000-0000-000000000003', 'Interactive Financial Analytics & Stock Dashboard', 'fintech-analytics-dashboard', 'Intermediate', 'Real-time financial analytics dashboard displaying historical market trends, candlestick charts, and sentiment analysis on market news.', '["React", "TypeScript", "Tailwind CSS", "Recharts", "Node.js", "PostgreSQL"]', '["TypeScript Type Safety", "Data Visualization", "WebSocket/REST Ingestion", "Performance Optimization"]', 'Responsive dashboard featuring multi-stock comparisons, KPI metrics, and exportable CSV reports.', 'Medium to High - Highlights modern UI engineering and data visual storytelling.'),

('p0000001-0000-0000-0000-000000000004', 'Automated Cloud CI/CD & Infrastructure Pipeline', 'cloud-devops-pipeline', 'Advanced', 'Multi-stage continuous delivery pipeline provisioning cloud infrastructure with Terraform, containerizing microservices with Docker, and deploying to Kubernetes.', '["Docker", "Kubernetes", "AWS/GCP", "GitHub Actions", "Prometheus", "Grafana"]', '["CI/CD Automation", "Infrastructure as Code", "Container Orchestration", "Cloud Observability"]', 'Automated zero-downtime rolling deployment pipeline with real-time metric dashboards.', 'Extremely High - Demonstrates enterprise DevOps and cloud reliability engineering skills.')
ON CONFLICT (slug) DO NOTHING;


-- 5. SEED DEMO STUDENT USER AND PROFILE
-- Password is 'Password123!' (bcrypt hash with salt rounds 10: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
INSERT INTO users (id, name, email, password_hash, role) VALUES
('u0000001-0000-0000-0000-000000000001', 'Demo Student', 'demo@careerpath.ai', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student')
ON CONFLICT (email) DO NOTHING;

INSERT INTO student_profiles (id, user_id, degree, branch, college, graduation_year, experience_level, bio, desired_career, preferred_job_type, target_industry, preferred_location, hours_per_week) VALUES
('f0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'B.Tech', 'Computer Science and Engineering', 'National Institute of Technology', 2026, 'Intermediate', 'Passionate CS undergrad with strong algorithmic foundation and web basics looking to specialize as a Full Stack Developer.', 'Full Stack Developer', 'Full-time', 'Information Technology / SaaS', 'Hybrid / Remote', 15)
ON CONFLICT (user_id) DO NOTHING;

-- Demo Student Skills
INSERT INTO student_skills (student_profile_id, skill_id, proficiency_level, verified_by_assessment) VALUES
('f0000001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000004', 70, true), -- Java (70%)
('f0000001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000007', 65, true), -- SQL (65%)
('f0000001-0000-0000-0000-000000000001', 's0000002-0000-0000-0000-000000000002', 80, true), -- HTML/CSS (80%)
('f0000001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000001', 60, true), -- JavaScript (60%)
('f0000001-0000-0000-0000-000000000001', 's0000002-0000-0000-0000-000000000001', 50, true)  -- React (50%)
ON CONFLICT (student_profile_id, skill_id) DO NOTHING;
