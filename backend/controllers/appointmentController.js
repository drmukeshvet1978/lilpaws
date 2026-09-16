const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { getAvailabilityForDate, isSlotStillAvailable } = require('../utils/availabilityHelper');

const generateAppointmentId = () => {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `LP-${datePart}-${rand}`;
};

// @desc    Get availability (open slots) for a given date
// @route   GET /api/availability?date=YYYY-MM-DD
// @access  Public
const getAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) {
    res.status(400);
    throw new Error('date query parameter is required (YYYY-MM-DD)');
  }
  const result = await getAvailabilityForDate(date);
  res.json({ success: true, ...result });
});

// @desc    Create a new appointment (public booking)
// @route   POST /api/appointments
// @access  Public
const createAppointment = asyncHandler(async (req, res) => {
  const {
    ownerName,
    phone,
    email,
    petName,
    petType,
    petBreed,
    petAge,
    serviceId,
    reason,
    date,
    timeSlot,
    message,
  } = req.body;

  // Field validation - backend is authoritative, never trust frontend alone
  const required = { ownerName, phone, petName, petType, serviceId, reason, date, timeSlot };
  for (const [key, val] of Object.entries(required)) {
    if (!val || String(val).trim() === '') {
      res.status(400);
      throw new Error(`Field "${key}" is required`);
    }
  }

  const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
  if (!phoneRegex.test(phone)) {
    res.status(400);
    throw new Error('Invalid phone number');
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Invalid email address');
    }
  }

  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    res.status(400);
    throw new Error('Selected service is not available');
  }

  // Re-validate the date/slot is not in the past and still exists on the schedule
  const dayAvailability = await getAvailabilityForDate(date);
  const slotObj = dayAvailability.slots.find((s) => s.slot === timeSlot);
  if (!slotObj) {
    res.status(400);
    throw new Error('Selected date/time slot is not valid');
  }

  // Authoritative re-check right before insert to minimize race conditions
  const check = await isSlotStillAvailable(date, timeSlot);
  if (!check.ok) {
    res.status(409);
    throw new Error(check.reason);
  }

  const appointment = await Appointment.create({
    appointmentId: generateAppointmentId(),
    ownerName: ownerName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : undefined,
    petName: petName.trim(),
    petType: petType.trim(),
    petBreed: petBreed ? petBreed.trim() : undefined,
    petAge: petAge ? petAge.trim() : undefined,
    service: service._id,
    serviceName: service.name,
    reason: reason.trim(),
    message: message ? message.trim() : '',
    date,
    timeSlot,
    status: 'pending',
  });

  res.status(201).json({ success: true, appointment });
});

// @desc    Public lookup of a single appointment by appointmentId + phone (for confirmation screen re-visits)
// @route   GET /api/appointments/lookup/:appointmentId
// @access  Public
const lookupAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { phone } = req.query;

  if (!phone) {
    res.status(400);
    throw new Error('phone query parameter is required to look up an appointment');
  }

  const appointment = await Appointment.findOne({ appointmentId, phone }).populate('service', 'name');
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  res.json({ success: true, appointment });
});

// ------------------- ADMIN -------------------

// @desc    Get all appointments with filters/search/pagination
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const { status, date, service, search, page = 1, limit = 20, from, to } = req.query;

  const query = {};
  if (status) query.status = status;
  if (date) query.date = date;
  if (service) query.service = service;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = from;
    if (to) query.date.$lte = to;
  }
  if (search) {
    query.$or = [
      { ownerName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { petName: { $regex: search, $options: 'i' } },
      { appointmentId: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.min(parseInt(limit) || 20, 100);

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('service', 'name category')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Appointment.countDocuments(query),
  ]);

  res.json({
    success: true,
    appointments,
    pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('service', 'name category');
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  res.json({ success: true, appointment });
});

// @desc    Update appointment status (confirm, cancel, complete, no-show)
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const validStatuses = ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no-show'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = status;
  if (adminNotes !== undefined) appointment.adminNotes = adminNotes;
  await appointment.save();

  res.json({ success: true, appointment });
});

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { date, timeSlot } = req.body;

  if (!date || !timeSlot) {
    res.status(400);
    throw new Error('date and timeSlot are required');
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check new slot availability (exclude current appointment from the count by checking before update)
  const check = await isSlotStillAvailable(date, timeSlot);
  if (!check.ok) {
    res.status(409);
    throw new Error(check.reason);
  }

  appointment.rescheduleHistory.push({
    fromDate: appointment.date,
    fromSlot: appointment.timeSlot,
    toDate: date,
    toSlot: timeSlot,
  });

  appointment.date = date;
  appointment.timeSlot = timeSlot;
  appointment.status = 'rescheduled';

  await appointment.save();
  res.json({ success: true, appointment });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  await appointment.deleteOne();
  res.json({ success: true, message: 'Appointment deleted' });
});

// @desc    Dashboard stats
// @route   GET /api/appointments/stats/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [
    total,
    pending,
    confirmed,
    completed,
    cancelled,
    noShow,
    todayCount,
    upcoming,
  ] = await Promise.all([
    Appointment.countDocuments({}),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({ status: 'confirmed' }),
    Appointment.countDocuments({ status: 'completed' }),
    Appointment.countDocuments({ status: 'cancelled' }),
    Appointment.countDocuments({ status: 'no-show' }),
    Appointment.countDocuments({ date: todayStr, status: { $nin: ['cancelled'] } }),
    Appointment.countDocuments({ date: { $gt: todayStr }, status: { $nin: ['cancelled', 'completed'] } }),
  ]);

  res.json({
    success: true,
    stats: {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      noShow,
      today: todayCount,
      upcoming,
    },
  });
});

module.exports = {
  getAvailability,
  createAppointment,
  lookupAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  deleteAppointment,
  getDashboardStats,
};
