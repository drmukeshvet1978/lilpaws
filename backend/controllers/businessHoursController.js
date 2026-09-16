const asyncHandler = require('express-async-handler');
const BusinessHours = require('../models/BusinessHours');

const getBusinessHours = asyncHandler(async (req, res) => {
  const hours = await BusinessHours.getSingleton();
  res.json({ success: true, hours });
});

// @desc    Update the full weekly schedule
// @route   PUT /api/business-hours
// @access  Private
const updateBusinessHours = asyncHandler(async (req, res) => {
  const { weeklySchedule } = req.body;
  if (!weeklySchedule || !Array.isArray(weeklySchedule)) {
    res.status(400);
    throw new Error('weeklySchedule array is required');
  }

  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const day of weeklySchedule) {
    if (!validDays.includes(day.day)) {
      res.status(400);
      throw new Error(`Invalid day: ${day.day}`);
    }
  }

  const hours = await BusinessHours.getSingleton();
  hours.weeklySchedule = weeklySchedule;
  await hours.save();

  res.json({ success: true, hours });
});

module.exports = { getBusinessHours, updateBusinessHours };
