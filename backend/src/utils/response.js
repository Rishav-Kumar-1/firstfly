// response.js — Helper functions for sending consistent API responses
// Every response from our API will follow the same structure

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {*} data - The data to return
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message shown to user
 * @param {number} statusCode - HTTP status code
 * @param {Array} errors - Optional array of validation errors
 */
const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
