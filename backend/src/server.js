// server.js — TravelGo Backend Entry Point

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────
app.use(helmet());
// CORS — allow the frontend to talk to this backend
// In development we allow all localhost ports so port conflicts don't break things
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    // Allow localhost in development
    if (origin.startsWith('http://localhost')) return callback(null, true);
    // Allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // Allow configured frontend URL
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─────────────────────────────────────────────
// ROUTES
// Each module has its own route file
// app.use('/api/vehicles', vehicleRoutes) means:
//   all routes in vehicleRoutes.js are prefixed with /api/vehicles
// ─────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes');
const vehicleRoutes     = require('./routes/vehicleRoutes');
const bookingRoutes     = require('./routes/bookingRoutes');
const packageRoutes     = require('./routes/packageRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const enquiryRoutes     = require('./routes/enquiryRoutes');
const adminRoutes       = require('./routes/adminRoutes');
const paymentRoutes     = require('./routes/paymentRoutes');

app.use('/api/auth',         authRoutes);
app.use('/api/vehicles',     vehicleRoutes);
app.use('/api/bookings',     bookingRoutes);
app.use('/api/packages',     packageRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/enquiries',    enquiryRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/payments',     paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TravelGo API is running successfully',
    data: {
      project: 'TravelGo — Travel Vehicle & Tour Booking Platform',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'TravelGo Backend API', docs: '/api/health' });
});

// ─────────────────────────────────────────────
// 404 HANDLER
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 TravelGo Backend Server is running!');
  console.log(`📡 Server URL:    http://localhost:${PORT}`);
  console.log(`🔍 Health Check:  http://localhost:${PORT}/api/health`);
  console.log(`🚌 Vehicles API:  http://localhost:${PORT}/api/vehicles`);
  console.log(`🌍 Environment:   ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

module.exports = app;
