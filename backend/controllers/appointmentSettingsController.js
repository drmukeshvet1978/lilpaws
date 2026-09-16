const asyncHandler = require('express-async-handler');
const AppointmentSettings = require('../models/AppointmentSettings');

const getAppointmentSettings = asyncHandler(async (req, res) => {
  const settings = await AppointmentSettings.getSingleton();
  res.json({ success: true, settings });
});

// @desc    Update appointment settings (slot duration, max per slot, holidays, blocked dates/slots)
// @route   PUT /api/appointment-settings
// @access  Private
const updateAppointmentSettings = asyncHandler(async (req, res) => {
  const settings = await AppointmentSettings.getSingleton();

  const fields = [
    'slotDurationMinutes',
    'maxAppointmentsPerSlot',
    'minAdvanceBookingHours',
    'maxAdvanceBookingDays',
    'holidays',
    'blockedDates',
    'blockedSlots',
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) settings[f] = req.body[f];
  });

  await settings.save();
  res.json({ success: true, settings });
});

module.exports = { getAppointmentSettings, updateAppointmentSettings };
