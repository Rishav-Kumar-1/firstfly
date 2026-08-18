const express = require('express');
const router = express.Router();
const { submitEnquiry, getAllEnquiries } = require('../controllers/enquiryController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

router.post('/', submitEnquiry);  // Public — anyone can contact us
router.get('/',  authenticateUser, authorizeAdmin, getAllEnquiries);  // Admin only

module.exports = router;
