// packageController.js

const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

const getAllPackages = async (req, res) => {
  try {
    const [packages] = await db.query(`
      SELECT tp.*, d.name AS destination_name, d.state
      FROM tour_packages tp
      JOIN destinations d ON tp.destination_id = d.id
      WHERE tp.status = 'ACTIVE'
      ORDER BY tp.id ASC
    `);

    // Attach highlights to each package
    for (const pkg of packages) {
      const [highlights] = await db.query(
        'SELECT highlight FROM package_highlights WHERE package_id = ? ORDER BY sort_order',
        [pkg.id]
      );
      pkg.highlights = highlights.map(h => h.highlight);
    }

    return sendSuccess(res, packages, `${packages.length} package(s) found`);
  } catch (error) {
    console.error('getAllPackages error:', error);
    return sendError(res, 'Failed to fetch packages', 500);
  }
};

const getPackageById = async (req, res) => {
  try {
    const [packages] = await db.query(`
      SELECT tp.*, d.name AS destination_name, d.state, d.description AS dest_description
      FROM tour_packages tp
      JOIN destinations d ON tp.destination_id = d.id
      WHERE tp.id = ?
    `, [req.params.id]);

    if (packages.length === 0) return sendError(res, 'Package not found', 404);

    const pkg = packages[0];

    const [highlights] = await db.query(
      'SELECT highlight FROM package_highlights WHERE package_id = ? ORDER BY sort_order',
      [pkg.id]
    );
    pkg.highlights = highlights.map(h => h.highlight);

    const [itinerary] = await db.query(
      'SELECT * FROM package_itinerary WHERE package_id = ? ORDER BY day_number',
      [pkg.id]
    );
    pkg.itinerary = itinerary;

    return sendSuccess(res, pkg, 'Package retrieved successfully');
  } catch (error) {
    console.error('getPackageById error:', error);
    return sendError(res, 'Failed to fetch package', 500);
  }
};

module.exports = { getAllPackages, getPackageById };
