// enquiryController.js

const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const [result] = await db.query(
      'INSERT INTO enquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), phone?.trim(), subject?.trim(), message.trim()]
    );

    return sendSuccess(res, { id: result.insertId }, 'Your message has been sent. We will get back to you shortly.', 201);
  } catch (error) {
    console.error('submitEnquiry error:', error);
    return sendError(res, 'Failed to send message', 500);
  }
};

const getAllEnquiries = async (req, res) => {
  try {
    const [enquiries] = await db.query(
      'SELECT * FROM enquiries ORDER BY created_at DESC'
    );
    return sendSuccess(res, enquiries, `${enquiries.length} enquiry(s) found`);
  } catch (error) {
    return sendError(res, 'Failed to fetch enquiries', 500);
  }
};

module.exports = { submitEnquiry, getAllEnquiries };
