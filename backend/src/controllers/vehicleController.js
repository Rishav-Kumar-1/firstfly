// vehicleController.js
// Handles all vehicle-related API logic

const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/vehicles
 * Returns all vehicles with optional filters
 * Public — no authentication required
 */
const getAllVehicles = async (req, res) => {
  try {
    // req.query contains URL parameters like ?status=AVAILABLE&ac=true
    const {
      status,
      vehicle_type,
      ac,
      min_seats,
      min_price,
      max_price,
      sort = 'id',
      order = 'ASC',
    } = req.query;

    // Build query dynamically based on which filters were provided
    // We use parameterized queries (?) to prevent SQL injection
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];

    if (status)       { query += ' AND status = ?';            params.push(status); }
    if (vehicle_type) { query += ' AND vehicle_type = ?';      params.push(vehicle_type); }
    if (ac !== undefined && ac !== '') {
                        query += ' AND ac = ?';                params.push(ac === 'true' ? 1 : 0); }
    if (min_seats)    { query += ' AND seating_capacity >= ?'; params.push(parseInt(min_seats)); }
    if (min_price)    { query += ' AND price_per_km >= ?';     params.push(parseFloat(min_price)); }
    if (max_price)    { query += ' AND price_per_km <= ?';     params.push(parseFloat(max_price)); }

    // Whitelist sortable columns to prevent injection via sort param
    const allowedSortColumns = ['id', 'name', 'seating_capacity', 'price_per_km'];
    const safeSort = allowedSortColumns.includes(sort) ? sort : 'id';
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${safeSort} ${safeOrder}`;

    // db.query() returns [rows, fields] — we destructure to get just rows
    const [vehicles] = await db.query(query, params);

    return sendSuccess(res, vehicles, `${vehicles.length} vehicle(s) found`);
  } catch (error) {
    console.error('getAllVehicles error:', error);
    return sendError(res, 'Failed to fetch vehicles', 500);
  }
};

/**
 * GET /api/vehicles/:id
 * Returns a single vehicle by ID
 * Public — no authentication required
 */
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params; // :id from the URL

    const [rows] = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);

    if (rows.length === 0) {
      return sendError(res, 'Vehicle not found', 404);
    }

    // Also fetch approved reviews for this vehicle
    const [reviews] = await db.query(`
      SELECT r.*, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.vehicle_id = ? AND r.status = 'APPROVED'
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [id]);

    const vehicle = rows[0];
    vehicle.reviews = reviews;

    return sendSuccess(res, vehicle, 'Vehicle retrieved successfully');
  } catch (error) {
    console.error('getVehicleById error:', error);
    return sendError(res, 'Failed to fetch vehicle', 500);
  }
};

/**
 * POST /api/vehicles
 * Creates a new vehicle
 * ADMIN only
 */
const createVehicle = async (req, res) => {
  try {
    const {
      name, vehicle_type, registration_number, seating_capacity,
      price_per_km, driver_charge, ac, pushback_seats, music_system,
      luggage_capacity, description, image_url, status
    } = req.body;

    // Check if registration number already exists
    const [existing] = await db.query(
      'SELECT id FROM vehicles WHERE registration_number = ?',
      [registration_number]
    );
    if (existing.length > 0) {
      return sendError(res, 'A vehicle with this registration number already exists', 409);
    }

    const [result] = await db.query(`
      INSERT INTO vehicles
        (name, vehicle_type, registration_number, seating_capacity, price_per_km,
         driver_charge, ac, pushback_seats, music_system, luggage_capacity,
         description, image_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, vehicle_type, registration_number, seating_capacity, price_per_km,
      driver_charge || 0, ac ? 1 : 0, pushback_seats ? 1 : 0, music_system ? 1 : 0,
      luggage_capacity, description, image_url, status || 'AVAILABLE'
    ]);

    // Fetch and return the newly created vehicle
    const [newVehicle] = await db.query('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);

    return sendSuccess(res, newVehicle[0], 'Vehicle created successfully', 201);
  } catch (error) {
    console.error('createVehicle error:', error);
    return sendError(res, 'Failed to create vehicle', 500);
  }
};

/**
 * PUT /api/vehicles/:id
 * Updates an existing vehicle
 * ADMIN only
 */
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check vehicle exists
    const [existing] = await db.query('SELECT id FROM vehicles WHERE id = ?', [id]);
    if (existing.length === 0) {
      return sendError(res, 'Vehicle not found', 404);
    }

    const {
      name, vehicle_type, seating_capacity, price_per_km, driver_charge,
      ac, pushback_seats, music_system, luggage_capacity, description, image_url, status
    } = req.body;

    await db.query(`
      UPDATE vehicles SET
        name = ?, vehicle_type = ?, seating_capacity = ?, price_per_km = ?,
        driver_charge = ?, ac = ?, pushback_seats = ?, music_system = ?,
        luggage_capacity = ?, description = ?, image_url = ?, status = ?
      WHERE id = ?
    `, [
      name, vehicle_type, seating_capacity, price_per_km, driver_charge,
      ac ? 1 : 0, pushback_seats ? 1 : 0, music_system ? 1 : 0,
      luggage_capacity, description, image_url, status, id
    ]);

    const [updated] = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    return sendSuccess(res, updated[0], 'Vehicle updated successfully');
  } catch (error) {
    console.error('updateVehicle error:', error);
    return sendError(res, 'Failed to update vehicle', 500);
  }
};

/**
 * DELETE /api/vehicles/:id
 * Deletes a vehicle (only if no active bookings)
 * ADMIN only
 */
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for active bookings before deleting
    const [activeBookings] = await db.query(`
      SELECT id FROM bookings
      WHERE vehicle_id = ? AND booking_status NOT IN ('COMPLETED', 'CANCELLED')
    `, [id]);

    if (activeBookings.length > 0) {
      return sendError(res, 'Cannot delete vehicle with active bookings', 400);
    }

    const [result] = await db.query('DELETE FROM vehicles WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return sendError(res, 'Vehicle not found', 404);
    }

    return sendSuccess(res, null, 'Vehicle deleted successfully');
  } catch (error) {
    console.error('deleteVehicle error:', error);
    return sendError(res, 'Failed to delete vehicle', 500);
  }
};

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
