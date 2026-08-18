// destinationController.js

const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

const getAllDestinations = async (req, res) => {
  try {
    const [destinations] = await db.query(
      "SELECT * FROM destinations WHERE status = 'ACTIVE' ORDER BY name ASC"
    );
    return sendSuccess(res, destinations, `${destinations.length} destination(s) found`);
  } catch (error) {
    console.error('getAllDestinations error:', error);
    return sendError(res, 'Failed to fetch destinations', 500);
  }
};

const getDestinationById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM destinations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return sendError(res, 'Destination not found', 404);

    const dest = rows[0];
    const [packages] = await db.query(
      "SELECT * FROM tour_packages WHERE destination_id = ? AND status = 'ACTIVE'",
      [req.params.id]
    );
    dest.packages = packages;

    return sendSuccess(res, dest, 'Destination retrieved successfully');
  } catch (error) {
    console.error('getDestinationById error:', error);
    return sendError(res, 'Failed to fetch destination', 500);
  }
};

module.exports = { getAllDestinations, getDestinationById };
