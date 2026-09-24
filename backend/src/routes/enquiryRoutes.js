const express = require('express');
const router = express.Router();
const { submitEnquiry, getAllEnquiries, markEnquiryRead } = require('../controllers/enquiryController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

router.post('/', submitEnquiry);
router.get('/',  authenticateUser, authorizeAdmin, getAllEnquiries);
router.put('/:id/read', authenticateUser, authorizeAdmin, markEnquiryRead);

module.exports = router;
