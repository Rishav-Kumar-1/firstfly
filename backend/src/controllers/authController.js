// authController.js — Registration, Login, and Profile

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/auth/register
 * Creates a new customer account
 */
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if email already registered
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return sendError(res, 'An account with this email already exists', 409);
    }

    // Hash the password — bcrypt.hash(password, saltRounds)
    // saltRounds = 12 means it runs 2^12 = 4096 hashing operations — very secure
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user — role defaults to 'CUSTOMER'
    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), phone.trim(), hashedPassword]
    );

    // Create JWT token — this is what the user uses to authenticate future requests
    // jwt.sign(payload, secret, options)
    const token = jwt.sign(
      { userId: result.insertId, role: 'CUSTOMER' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return sendSuccess(res, {
      id: result.insertId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'CUSTOMER',
      token,
    }, 'Account created successfully', 201);

  } catch (error) {
    console.error('register error:', error);
    return sendError(res, 'Registration failed. Please try again.', 500);
  }
};

/**
 * POST /api/auth/login
 * Authenticates user and returns a JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [users] = await db.query(
      'SELECT id, name, email, phone, password, role, is_active FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      // Generic error — don't tell attacker whether email exists
      return sendError(res, 'Invalid email or password', 401);
    }

    const user = users[0];

    if (!user.is_active) {
      return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    // bcrypt.compare() checks if the plain password matches the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Never send the password back to the frontend
    return sendSuccess(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    }, 'Login successful');

  } catch (error) {
    console.error('login error:', error);
    return sendError(res, 'Login failed. Please try again.', 500);
  }
};

/**
 * GET /api/auth/profile
 * Returns the logged-in user's profile
 * Requires: authenticateUser middleware
 */
const getProfile = async (req, res) => {
  try {
    // req.user.userId was set by the authenticateUser middleware
    const [users] = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, users[0], 'Profile retrieved successfully');
  } catch (error) {
    console.error('getProfile error:', error);
    return sendError(res, 'Failed to get profile', 500);
  }
};

/**
 * PUT /api/auth/profile
 * Updates name and phone of logged-in user
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await db.query(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name.trim(), phone.trim(), req.user.userId]
    );
    return sendSuccess(res, null, 'Profile updated successfully');
  } catch (error) {
    console.error('updateProfile error:', error);
    return sendError(res, 'Failed to update profile', 500);
  }
};

/**
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const [users] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.userId]);
    const isValid = await bcrypt.compare(current_password, users[0].password);
    if (!isValid) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    const hashed = await bcrypt.hash(new_password, 12);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.userId]);

    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('changePassword error:', error);
    return sendError(res, 'Failed to change password', 500);
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword };
