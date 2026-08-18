const express = require('express');
const router = express.Router();
const { getDashboard, getAllBookings, updateBookingStatus, getAllCustomers } = require('../controllers/adminController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(authenticateUser, authorizeAdmin);

router.get('/dashboard',              getDashboard);
router.get('/bookings',               getAllBookings);
router.put('/bookings/:id/status',    updateBookingStatus);
router.get('/customers',              getAllCustomers);

module.exports = router;
