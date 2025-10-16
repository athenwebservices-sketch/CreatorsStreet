// routes/razorpayRoutes.js
const express = require('express');
const router = express.Router();
const { requireApiKey, protect } = require('../middleware/authMiddleware');
const { createRazorpayOrder, verifyPayment } = require('../controllers/razorPayController');

// Create Razorpay order
router.post('/create-order', requireApiKey, protect, createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify-payment', requireApiKey, protect, verifyPayment);

module.exports = router;
