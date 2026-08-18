// auth.js — Authentication and authorization middleware

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

/**
 * authenticateUser
 * Checks that the request has a valid JWT token.
 * If valid: attaches the decoded user (id, role) to req.user
 * If invalid/missing: returns 401 Unauthorized
 *
 * Usage: app.get('/protected', authenticateUser, controller)
 */
const authenticateUser = (req, res, next) => {
  // JWT is sent in the Authorization header as: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Access denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1]; // Extract the token part

  try {
    // jwt.verify() decodes the token and checks it's not expired
    // If the token is tampered with or expired, it throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next(); // move on to the actual route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please login again.', 401);
    }
    return sendError(res, 'Invalid token. Please login again.', 401);
  }
};

/**
 * authorizeAdmin
 * Checks that the authenticated user has ADMIN role.
 * Always use AFTER authenticateUser middleware.
 *
 * Usage: app.post('/admin/vehicles', authenticateUser, authorizeAdmin, controller)
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return sendError(res, 'Access denied. Admin privileges required.', 403);
    // 403 = Forbidden (authenticated but not allowed)
  }
  next();
};

/**
 * optionalAuth
 * Attaches user to req.user IF a valid token is present,
 * but doesn't block the request if there's no token.
 * Useful for endpoints that show extra info to logged-in users.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // Token invalid — that's fine, just continue without user
    }
  }
  next();
};

module.exports = { authenticateUser, authorizeAdmin, optionalAuth };
