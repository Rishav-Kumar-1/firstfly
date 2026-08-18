// bookingController.js — Booking creation and management

const db = require('../config/database');
const { calculateFare, generateBookingReference } = require('../services/pricingService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/bookings/calculate-price
 * Calculates fare without creating a booking
 * Used on the booking form to show price before user confirms
 */
const calculatePrice = async (req, res) => {
  try {
    const { vehicle_id, distance_km, trip_type, travel_date, return_date } = req.body;

    // Fetch the vehicle's actual price from DB — never trust frontend prices
    const [vehicles] = await db.query(
      'SELECT price_per_km, driver_charge, status FROM vehicles WHERE id = ?',
      [vehicle_id]
    );

    if (vehicles.length === 0) return sendError(res, 'Vehicle not found', 404);
    if (vehicles[0].status !== 'AVAILABLE') return sendError(res, 'Vehicle is not available', 400);

    const fare = calculateFare({
      distance_km,
      price_per_km: vehicles[0].price_per_km,
      driver_charge: vehicles[0].driver_charge,
      trip_type,
      travel_date,
      return_date,
    });

    return sendSuccess(res, fare, 'Price calculated successfully');
  } catch (error) {
    console.error('calculatePrice error:', error);
    return sendError(res, 'Price calculation failed', 500);
  }
};

/**
 * POST /api/bookings
 * Creates a new booking
 * Requires: authenticateUser
 */
const createBooking = async (req, res) => {
  try {
    const {
      vehicle_id, from_location, to_location, travel_date,
      return_date, passengers, trip_type, distance_km, notes
    } = req.body;

    const userId = req.user.userId;

    // Fetch vehicle from DB — calculate price server-side
    const [vehicles] = await db.query(
      'SELECT id, price_per_km, driver_charge, status, seating_capacity FROM vehicles WHERE id = ?',
      [vehicle_id]
    );

    if (vehicles.length === 0) return sendError(res, 'Vehicle not found', 404);
    const vehicle = vehicles[0];

    if (vehicle.status !== 'AVAILABLE') {
      return sendError(res, 'This vehicle is not available for booking', 400);
    }

    if (passengers > vehicle.seating_capacity) {
      return sendError(res, `This vehicle has only ${vehicle.seating_capacity} seats`, 400);
    }

    // Calculate fare on the backend
    const fare = calculateFare({
      distance_km,
      price_per_km: vehicle.price_per_km,
      driver_charge: vehicle.driver_charge,
      trip_type,
      travel_date,
      return_date,
    });

    // Insert booking — reference will be updated after insert (we need the ID first)
    const [result] = await db.query(`
      INSERT INTO bookings (
        booking_reference, user_id, vehicle_id, from_location, to_location,
        travel_date, return_date, passengers, trip_type, distance_km,
        base_fare, driver_charge, toll_charge, parking_charge, night_charge,
        discount, total_amount, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'TG-TEMP',  // temporary — we update this right after
      userId, vehicle_id, from_location, to_location,
      travel_date, return_date || null, passengers, trip_type,
      fare.distance_km, fare.base_fare, fare.driver_charge,
      fare.toll_charge, fare.parking_charge, fare.night_charge,
      fare.discount, fare.total_amount, notes || null
    ]);

    const bookingId = result.insertId;
    const bookingRef = generateBookingReference(bookingId);

    // Update with the real booking reference
    await db.query('UPDATE bookings SET booking_reference = ? WHERE id = ?', [bookingRef, bookingId]);

    // Fetch the complete booking to return
    const [bookings] = await db.query(`
      SELECT b.*, v.name AS vehicle_name, v.vehicle_type, v.image_url
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = ?
    `, [bookingId]);

    return sendSuccess(res, { ...bookings[0], fare_breakdown: fare.breakdown },
      'Booking created successfully', 201);

  } catch (error) {
    console.error('createBooking error:', error);
    return sendError(res, 'Failed to create booking', 500);
  }
};

/**
 * GET /api/bookings/my
 * Returns all bookings for the logged-in user
 */
const getMyBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*,
        v.name AS vehicle_name, v.vehicle_type, v.image_url AS vehicle_image,
        d.name AS driver_name, d.phone AS driver_phone
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.userId]);

    return sendSuccess(res, bookings, `${bookings.length} booking(s) found`);
  } catch (error) {
    console.error('getMyBookings error:', error);
    return sendError(res, 'Failed to fetch bookings', 500);
  }
};

/**
 * GET /api/bookings/:id
 * Returns a single booking (only if it belongs to the user)
 */
const getBookingById = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*,
        v.name AS vehicle_name, v.vehicle_type, v.seating_capacity, v.image_url,
        d.name AS driver_name, d.phone AS driver_phone, d.license_number,
        u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (bookings.length === 0) return sendError(res, 'Booking not found', 404);

    const booking = bookings[0];

    // Users can only see their own bookings (admins can see all)
    if (req.user.role !== 'ADMIN' && booking.user_id !== req.user.userId) {
      return sendError(res, 'Access denied', 403);
    }

    return sendSuccess(res, booking, 'Booking retrieved successfully');
  } catch (error) {
    console.error('getBookingById error:', error);
    return sendError(res, 'Failed to fetch booking', 500);
  }
};

/**
 * PUT /api/bookings/:id/cancel
 * Customer cancels their own booking
 */
const cancelBooking = async (req, res) => {
  try {
    const [bookings] = await db.query(
      'SELECT id, user_id, booking_status, travel_date FROM bookings WHERE id = ?',
      [req.params.id]
    );

    if (bookings.length === 0) return sendError(res, 'Booking not found', 404);
    const booking = bookings[0];

    if (booking.user_id !== req.user.userId) {
      return sendError(res, 'Access denied', 403);
    }

    const cancellableStatuses = ['PENDING', 'CONFIRMED'];
    if (!cancellableStatuses.includes(booking.booking_status)) {
      return sendError(res, `Cannot cancel a booking with status: ${booking.booking_status}`, 400);
    }

    await db.query(
      "UPDATE bookings SET booking_status = 'CANCELLED' WHERE id = ?",
      [booking.id]
    );

    return sendSuccess(res, null, 'Booking cancelled successfully');
  } catch (error) {
    console.error('cancelBooking error:', error);
    return sendError(res, 'Failed to cancel booking', 500);
  }
};

module.exports = { calculatePrice, createBooking, getMyBookings, getBookingById, cancelBooking };
