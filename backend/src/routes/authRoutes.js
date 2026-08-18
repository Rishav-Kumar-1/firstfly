// authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

router.post('/register', register);
router.post('/login',    login);

// Protected — must be logged in
router.get('/profile',    authenticateUser, getProfile);
router.put('/profile',    authenticateUser, updateProfile);
router.put('/change-password', authenticateUser, changePassword);

module.exports = router;
