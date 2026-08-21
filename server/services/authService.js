/**
 * Authentication Service
 * Manages user registration, secure password hashing, and JWT token issuance
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/env');
const db = require('../config/db');
const logger = require('../utils/logger');

const SALT_ROUNDS = 10;

/**
 * Generate signed JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * Register a new student user
 */
const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check if email is already registered
  const existingUserRes = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existingUserRes.rowCount > 0) {
    const error = new Error('An account with this email address already exists.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Hash password with bcrypt
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = uuidv4();
  const profileId = uuidv4();

  // 3. Insert user record
  const userRes = await db.query(
    'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, created_at',
    [userId, name.trim(), normalizedEmail, passwordHash, 'student']
  );

  const newUser = userRes.rows[0];

  // 4. Create associated student profile record
  await db.query(
    'INSERT INTO student_profiles (id, user_id, degree, branch, college, graduation_year, experience_level, bio, desired_career, preferred_job_type, target_industry, preferred_location, hours_per_week) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
    [profileId, userId, '', '', '', 2026, 'Beginner', '', '', 'Full-time', '', '', 10]
  );

  const token = generateToken(newUser);

  logger.info('Student registered successfully', { userId: newUser.id, email: newUser.email });

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    profileId,
    token
  };
};

/**
 * Log in an existing user
 */
const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Fetch user by email
  const userRes = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
  if (userRes.rowCount === 0) {
    const error = new Error('Invalid email address or password.');
    error.statusCode = 401;
    throw error;
  }

  const user = userRes.rows[0];

  // 2. Verify password hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email address or password.');
    error.statusCode = 401;
    throw error;
  }

  if (user.is_active === false) {
    const error = new Error('Your account has been deactivated. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  // 3. Fetch profile
  const profileRes = await db.query('SELECT id, degree, branch, college, desired_career FROM student_profiles WHERE user_id = $1', [user.id]);
  const profile = profileRes.rows[0] || null;

  const token = generateToken(user);

  logger.info('Student logged in successfully', { userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    profile,
    token
  };
};

/**
 * 1-Click Demo Login for hackathon evaluators
 */
const getDemoUser = async () => {
  const demoEmail = 'demo@careerpath.ai';
  let userRes = await db.query('SELECT * FROM users WHERE email = $1', [demoEmail]);

  if (userRes.rowCount === 0) {
    // Register demo user if not present
    return registerUser({
      name: 'Demo Student',
      email: demoEmail,
      password: 'Password123!'
    });
  }

  const user = userRes.rows[0];
  const profileRes = await db.query('SELECT * FROM student_profiles WHERE user_id = $1', [user.id]);
  const profile = profileRes.rows[0] || null;
  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    profile,
    token
  };
};

module.exports = {
  registerUser,
  loginUser,
  getDemoUser,
  generateToken
};
