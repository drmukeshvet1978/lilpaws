const express = require('express');
const router = express.Router();
const { getAppointmentSettings, updateAppointmentSettings } = require('../controllers/appointmentSettingsController');
const { protect } = require('../middleware/auth');

router.get('/', getAppointmentSettings);
router.put('/', protect, updateAppointmentSettings);

module.exports = router;
