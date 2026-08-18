// vehicleRoutes.js
const express = require('express');
const router = express.Router();
const { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// Public routes — anyone can view vehicles
router.get('/',    getAllVehicles);
router.get('/:id', getVehicleById);

// Admin-only routes
router.post('/',    authenticateUser, authorizeAdmin, createVehicle);
router.put('/:id',  authenticateUser, authorizeAdmin, updateVehicle);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteVehicle);

module.exports = router;
