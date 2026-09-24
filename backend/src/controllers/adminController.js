// adminController.js — Admin dashboard stats and management

const db = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/admin/dashboard
 * Returns stats for the admin dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [[totalBookings]]   = await db.query('SELECT COUNT(*) AS count FROM bookings');
    const [[todayBookings]]   = await db.query('SELECT COUNT(*) AS count FROM bookings WHERE DATE(created_at) = ?', [today]);
    const [[pendingBookings]] = await db.query("SELECT COUNT(*) AS count FROM bookings WHERE booking_status = 'PENDING'");
    const [[confirmedBookings]] = await db.query("SELECT COUNT(*) AS count FROM bookings WHERE booking_status = 'CONFIRMED'");
    const [[completedBookings]] = await db.query("SELECT COUNT(*) AS count FROM bookings WHERE booking_status = 'COMPLETED'");
    const [[cancelledBookings]] = await db.query("SELECT COUNT(*) AS count FROM bookings WHERE booking_status = 'CANCELLED'");
    const [[totalCustomers]]  = await db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'CUSTOMER'");
    const [[totalVehicles]]   = await db.query('SELECT COUNT(*) AS count FROM vehicles');
    const [[revenue]]         = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM bookings WHERE payment_status = 'PAID'");
    const [[newEnquiries]]    = await db.query("SELECT COUNT(*) AS count FROM enquiries WHERE status = 'NEW'");
    const [[totalEnquiries]]  = await db.query("SELECT COUNT(*) AS count FROM enquiries");

    // Monthly bookings for chart (last 6 months)
    const [monthlyBookings] = await db.query(`
      SELECT
        DATE_FORMAT(created_at, '%b %Y') AS month,
        COUNT(*) AS bookings,
        COALESCE(SUM(total_amount), 0) AS revenue
      FROM bookings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
      ORDER BY MIN(created_at) ASC
    `);

    // Popular vehicles (by booking count)
    const [popularVehicles] = await db.query(`
      SELECT v.name, COUNT(b.id) AS booking_count
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      GROUP BY v.id, v.name
      ORDER BY booking_count DESC
      LIMIT 5
    `);

    return sendSuccess(res, {
      stats: {
        total_bookings:     totalBookings.count,
        today_bookings:     todayBookings.count,
        pending_bookings:   pendingBookings.count,
        confirmed_bookings: confirmedBookings.count,
        completed_bookings: completedBookings.count,
        cancelled_bookings: cancelledBookings.count,
        total_customers:    totalCustomers.count,
        total_vehicles:     totalVehicles.count,
        total_revenue:      parseFloat(revenue.total),
        new_enquiries:      newEnquiries.count,
        total_enquiries:    totalEnquiries.count,
      },
      monthly_bookings: monthlyBookings,
      popular_vehicles: popularVehicles,
    }, 'Dashboard data retrieved');
  } catch (error) {
    console.error('getDashboard error:', error);
    return sendError(res, 'Failed to load dashboard', 500);
  }
};

/**
 * GET /api/admin/bookings
 * Returns all bookings with optional filters
 */
const getAllBookings = async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = `
      SELECT b.*,
        v.name AS vehicle_name,
        u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
        d.name AS driver_name
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (status) { query += ' AND b.booking_status = ?'; params.push(status); }
    if (date)   { query += ' AND DATE(b.travel_date) = ?'; params.push(date); }

    query += ' ORDER BY b.created_at DESC';

    const [bookings] = await db.query(query, params);
    return sendSuccess(res, bookings, `${bookings.length} booking(s) found`);
  } catch (error) {
    console.error('getAllBookings error:', error);
    return sendError(res, 'Failed to fetch bookings', 500);
  }
};

/**
 * PUT /api/admin/bookings/:id/status
 * Admin updates booking status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { status, driver_id } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'ASSIGNED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid booking status', 400);
    }

    const updateFields = ['booking_status = ?'];
    const params = [status];

    if (driver_id) {
      updateFields.push('driver_id = ?');
      params.push(driver_id);
    }

    params.push(req.params.id);
    await db.query(`UPDATE bookings SET ${updateFields.join(', ')} WHERE id = ?`, params);

    // If assigning a driver, update driver status to ON_TRIP
    if (driver_id && status === 'ASSIGNED') {
      await db.query("UPDATE drivers SET status = 'ON_TRIP' WHERE id = ?", [driver_id]);
    }

    return sendSuccess(res, null, 'Booking status updated successfully');
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    return sendError(res, 'Failed to update booking status', 500);
  }
};

/**
 * GET /api/admin/customers
 */
const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
        COUNT(b.id) AS total_bookings
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      WHERE u.role = 'CUSTOMER'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    return sendSuccess(res, customers, `${customers.length} customer(s) found`);
  } catch (error) {
    return sendError(res, 'Failed to fetch customers', 500);
  }
};

module.exports = { getDashboard, getAllBookings, updateBookingStatus, getAllCustomers };
