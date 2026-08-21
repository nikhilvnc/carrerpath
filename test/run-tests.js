/**
 * Automated Test Suite for CareerPath AI Platform
 * Executes 12 comprehensive end-to-end and integration test scenarios
 */

const { app } = require('../server/server');
const { initializeDatabase } = require('../server/config/db');
const http = require('http');

let server;
let baseUrl;
let authToken = '';
let createdUserId = '';
let testProfileId = '';
let testRecommendationId = '';
let testRoadmapItemId = '';

const tests = [];
let passedCount = 0;
let failedCount = 0;

const runTest = async (testName, fn) => {
  try {
    process.stdout.write(`\x1b[36m[TEST]\x1b[0m ${testName} ... `);
    await fn();
    console.log(`\x1b[32mPASSED\x1b[0m`);
    passedCount++;
    tests.push({ name: testName, status: 'PASSED', error: null });
  } catch (err) {
    console.log(`\x1b[31mFAILED\x1b[0m`);
    console.error(`       Error: ${err.message}`);
    failedCount++;
    tests.push({ name: testName, status: 'FAILED', error: err.message });
  }
};

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

const runAllTests = async () => {
  console.log('\n======================================================');
  console.log('  CareerPath AI - Automated Integration Test Runner');
  console.log('======================================================\n');

  // Initialize DB and spin up test server
  await initializeDatabase();
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;

  const testEmail = `test.student.${Date.now()}@university.edu`;

  // Test 1: User Registration
  await runTest('TC01: Student User Registration with Valid Inputs', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Test Student',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    assert(res.status === 201, `Expected status 201, received ${res.status}`);
    assert(res.data.success === true, 'Expected success to be true');
    assert(res.data.data.token, 'Expected JWT token to be returned');
    assert(res.data.data.user.email === testEmail, 'Email mismatch');

    authToken = res.data.data.token;
    createdUserId = res.data.data.user.id;
    testProfileId = res.data.data.profileId;
  });

  // Test 2: Duplicate Email Prevention
  await runTest('TC02: Duplicate Email Registration Rejection', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Duplicate Student',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    assert(res.status === 400, `Expected status 400 for duplicate, received ${res.status}`);
    assert(res.data.success === false, 'Expected success to be false for duplicate');
  });

  // Test 3: Password Validation
  await runTest('TC03: Password Policy Enforcement (Min 8 characters)', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      name: 'Short Pass',
      email: 'short@university.edu',
      password: 'short',
      confirmPassword: 'short'
    });

    assert(res.status === 400, `Expected status 400 for short password, received ${res.status}`);
  });

  // Test 4: User Login
  await runTest('TC04: User Login with Password Verification & JWT Issuance', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: 'Password123!'
    });

    assert(res.status === 200, `Expected status 200, received ${res.status}`);
    assert(res.data.data.token, 'Expected JWT token');
  });

  // Test 5: Unauthorized Route Guard
  await runTest('TC05: Protected Route Guard (Missing JWT)', async () => {
    const res = await makeRequest('GET', '/api/profile');
    assert(res.status === 401, `Expected status 401 Unauthorized, received ${res.status}`);
  });

  // Test 6: Profile Update & Skill Synchronization
  await runTest('TC06: Profile Update & Skill Association Persistence', async () => {
    const res = await makeRequest('PUT', '/api/profile', {
      degree: 'B.Tech',
      branch: 'Information Technology',
      graduationYear: 2026,
      desiredCareer: 'Full Stack Developer',
      experienceLevel: 'Intermediate',
      hoursPerWeek: 20,
      skills: [
        { name: 'JavaScript', category: 'Programming', proficiencyLevel: 75 },
        { name: 'React', category: 'Frontend', proficiencyLevel: 60 },
        { name: 'SQL', category: 'Database', proficiencyLevel: 70 }
      ]
    }, authToken);

    assert(res.status === 200, `Expected status 200, received ${res.status}`);
    assert(res.data.data.skills.length >= 3, 'Expected at least 3 skills persisted');
  });

  // Test 7: Save Assessment Step
  await runTest('TC07: Save Assessment Step & Response Validation', async () => {
    const res = await makeRequest('POST', '/api/assessment/save-step', {
      stepNumber: 1,
      questionKey: 'academic',
      answer: { degree: 'B.Tech', branch: 'Information Technology' }
    }, authToken);

    assert(res.status === 200, `Expected status 200, received ${res.status}`);
  });

  // Test 8: AI Career Analysis Execution
  await runTest('TC08: AI Career Analysis Pipeline & Structured JSON Schema', async () => {
    const res = await makeRequest('POST', '/api/career/analyze', {
      answers: [
        { stepNumber: 1, questionKey: 'academic', answer: 'B.Tech IT' },
        { stepNumber: 2, questionKey: 'skills', answer: ['JavaScript', 'React', 'SQL'] }
      ]
    }, authToken);

    console.log('DEBUG TC08 res.data:', JSON.stringify(res.data));
    assert(res.status === 200, `Expected status 200, received ${res.status}`);
    assert(res.data.data.recommendations.length > 0, 'Expected at least 1 career recommendation');
    
    const top = res.data.data.recommendations[0];
    assert(top.careerTitle, 'Expected careerTitle in recommendation');
    assert(top.matchScore >= 0 && top.matchScore <= 100, 'Expected matchScore between 0 and 100');
    assert(Array.isArray(top.strengths), 'Expected strengths array');
    assert(Array.isArray(top.missingSkills), 'Expected missingSkills array');

    testRecommendationId = top.id;
  });

  // Test 9: Skill Gap Analysis Retrieval
  await runTest('TC09: Skill Gap Calculation & Priority Categorization', async () => {
    const res = await makeRequest('GET', '/api/career/recommendations', null, authToken);
    assert(res.status === 200, `Expected status 200, received ${res.status}`);
    const rec = res.data.data.recommendations[0];
    assert(Array.isArray(rec.skillGaps), 'Expected skillGaps array');
    if (rec.skillGaps.length > 0) {
      assert(rec.skillGaps[0].gapPercentage !== undefined, 'Expected gapPercentage');
      assert(['High Priority', 'Medium Priority', 'Nice to Have'].includes(rec.skillGaps[0].priority), 'Valid priority level');
    }
  });

  // Test 10: 30-Day Roadmap Generation
  await runTest('TC10: 30-Day Learning Roadmap & Weekly Milestones Structure', async () => {
    const res = await makeRequest('GET', `/api/roadmap/${testRecommendationId}`, null, authToken);
    assert(res.status === 200, `Expected status 200, received ${res.status}`);
    assert(res.data.data.length > 0, 'Expected at least 1 roadmap');
    const roadmap = res.data.data[0];
    assert(Array.isArray(roadmap.weeks), 'Expected weekly breakdown');
    if (roadmap.weeks.length > 0) {
      testRoadmapItemId = roadmap.weeks[0].id;
      assert(roadmap.weeks[0].objective, 'Expected weekly objective');
    }
  });

  // Test 11: Roadmap Status Toggle & Progress Recalculation
  await runTest('TC11: Roadmap Milestone Status Update & Overall % Calculation', async () => {
    if (testRoadmapItemId) {
      const res = await makeRequest('PUT', `/api/roadmap/items/${testRoadmapItemId}`, {
        status: 'completed',
        notes: 'Finished week 1 exercises successfully'
      }, authToken);

      assert(res.status === 200, `Expected status 200, received ${res.status}`);
      assert(res.data.data.completedMilestones >= 1, 'Expected at least 1 completed milestone');
      assert(res.data.data.overallPercentage > 0, 'Expected positive progress percentage');
    }
  });

  // Test 12: 1-Click Demo Evaluation Login
  await runTest('TC12: 1-Click Hackathon Evaluator Demo Login', async () => {
    const res = await makeRequest('POST', '/api/auth/demo-login');
    assert(res.status === 200, `Expected status 200, received ${res.status}`);
    assert(res.data.data.user.email === 'demo@careerpath.ai', 'Expected demo email');
    assert(res.data.data.token, 'Expected demo JWT token');
  });

  // Cleanup
  server.close();

  console.log('\n======================================================');
  console.log(`  Test Results: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
};

runAllTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  if (server) server.close();
  process.exit(1);
});
