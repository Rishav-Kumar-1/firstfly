// paymentRoutes.js
const express = require('express');
const router  = express.Router();
const { createOrder, verifyPayment, handleWebhook, getPaymentStatus } = require('../controllers/paymentController');
const { authenticateUser } = require('../middleware/auth');

// Webhook — NO auth (Razorpay calls this, not the user)
// Must use raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes — user must be logged in
router.post('/create-order',       authenticateUser, createOrder);
router.post('/verify',             authenticateUser, verifyPayment);
router.get('/booking/:id',         authenticateUser, getPaymentStatus);

module.exports = router;
