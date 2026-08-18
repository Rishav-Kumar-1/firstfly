// server.js — This is the ENTRY POINT of the backend application
// When you run "npm run dev", Node.js starts reading from this file

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Initialize the Express application
// Think of "app" as your web server object
const app = express();

// ─────────────────────────────────────────────
// MIDDLEWARE SETUP
// Middleware = functions that run on EVERY request before it reaches your route
// Think of it as a security checkpoint at an airport
// ─────────────────────────────────────────────

// helmet() adds security-related HTTP headers automatically
// Example: it prevents clickjacking, sets content-type options, etc.
app.use(helmet());

// cors() allows our React frontend to make requests to this backend
// Without this, the browser would block all requests from localhost:5173
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // allow cookies/auth headers
}));

// express.json() lets Express read JSON data sent in request bodies
// Example: when the frontend sends { "email": "user@example.com" }, this parses it
app.use(express.json());

// express.urlencoded() parses form data (like HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// morgan('dev') logs every HTTP request to the console
// Example output: GET /api/vehicles 200 15ms
app.use(morgan('dev'));

// ─────────────────────────────────────────────
// ROUTES
// Routes define what happens when someone visits a specific URL
// We'll add more routes as we build each module
// ─────────────────────────────────────────────

// Health check route — visit http://localhost:5000/api/health to verify the server is running
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TravelGo API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to TravelGo Backend API',
    docs: 'Visit /api/health to check server status',
  });
});

// ─────────────────────────────────────────────
// 404 HANDLER
// If no route matched, this runs and returns a "not found" response
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// If any route throws an error, this catches it
// The "err" parameter is the error object
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : err.message, // In development, show the real error
  });
});

// ─────────────────────────────────────────────
// START THE SERVER
// process.env.PORT reads the PORT value from .env file
// || 5000 means "use 5000 if PORT is not set"
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 TravelGo Backend Server is running!');
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

module.exports = app;
