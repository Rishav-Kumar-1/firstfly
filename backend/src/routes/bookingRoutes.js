// bookingRoutes.js
const express = require('express');
const router = express.Router();
const { calculatePrice, createBooking, getMyBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const { authenticateUser } = require('../middleware/auth');

// All booking routes require authentication
router.post('/calculate-price', authenticateUser, calculatePrice);
router.post('/',                authenticateUser, createBooking);
router.get('/my',               authenticateUser, getMyBookings);
router.get('/:id',              authenticateUser, getBookingById);
router.put('/:id/cancel',       authenticateUser, cancelBooking);

module.exports = router;
