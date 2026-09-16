const express = require('express');
const router = express.Router();
const {
  createAppointment,
  lookupAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  deleteAppointment,
  getDashboardStats,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { appointmentLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/', appointmentLimiter, createAppointment);
router.get('/lookup/:appointmentId', lookupAppointment);

// Private (admin)
router.get('/stats/dashboard', protect, getDashboardStats);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/reschedule', protect, rescheduleAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
