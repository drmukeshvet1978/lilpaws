const Appointment = require('../models/Appointment');
const BusinessHours = require('../models/BusinessHours');
const AppointmentSettings = require('../models/AppointmentSettings');

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Converts "HH:mm" to minutes since midnight
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const toHHMM = (minutes) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// Checks if a given time range overlaps any break window
const overlapsBreak = (slotStart, slotEnd, breaks = []) => {
  return breaks.some((b) => {
    if (!b.start || !b.end) return false;
    const bStart = toMinutes(b.start);
    const bEnd = toMinutes(b.end);
    return slotStart < bEnd && slotEnd > bStart;
  });
};

/**
 * Generates all theoretical slots for a given date based on business hours + slot duration,
 * then removes: holidays, blocked dates, breaks, past slots (if today), and blocked slots.
 * Finally annotates each slot with current booking count vs. maxAppointmentsPerSlot.
 *
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {Promise<{available: boolean, reason: string|null, slots: Array<{slot: string, available: boolean, remaining: number}>}>}
 */
const getAvailabilityForDate = async (dateStr) => {
  const businessHours = await BusinessHours.getSingleton();
  const settings = await AppointmentSettings.getSingleton();

  // Validate date format
  const requestedDate = new Date(`${dateStr}T00:00:00`);
  if (isNaN(requestedDate.getTime())) {
    return { available: false, reason: 'Invalid date format', slots: [] };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (requestedDate < today) {
    return { available: false, reason: 'Cannot book a date in the past', slots: [] };
  }

  const maxAdvanceDays = settings.maxAdvanceBookingDays || 30;
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxAdvanceDays);
  if (requestedDate > maxDate) {
    return { available: false, reason: `Bookings are only open up to ${maxAdvanceDays} days in advance`, slots: [] };
  }

  if (settings.holidays.includes(dateStr) || settings.blockedDates.includes(dateStr)) {
    return { available: false, reason: 'Clinic is closed on this date', slots: [] };
  }

  const dayName = DAY_NAMES[requestedDate.getDay()];
  const daySchedule = businessHours.weeklySchedule.find((d) => d.day === dayName);

  if (!daySchedule || !daySchedule.isOpen) {
    return { available: false, reason: `Clinic is closed on ${dayName}`, slots: [] };
  }

  const slotDuration = settings.slotDurationMinutes || 30;
  const maxPerSlot = settings.maxAppointmentsPerSlot || 1;

  const openMin = toMinutes(daySchedule.openTime);
  const closeMin = toMinutes(daySchedule.closeTime);

  const isToday = requestedDate.getTime() === today.getTime();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const minAdvanceMinutes = (settings.minAdvanceBookingHours || 0) * 60;

  // Generate candidate slots
  const candidateSlots = [];
  for (let start = openMin; start + slotDuration <= closeMin; start += slotDuration) {
    const end = start + slotDuration;

    if (overlapsBreak(start, end, daySchedule.breaks)) continue;

    if (isToday && start < nowMinutes + minAdvanceMinutes) continue;

    const slotLabel = `${toHHMM(start)}-${toHHMM(end)}`;

    const isBlockedSlot = settings.blockedSlots.some((b) => b.date === dateStr && b.slot === slotLabel);
    if (isBlockedSlot) continue;

    candidateSlots.push(slotLabel);
  }

  if (candidateSlots.length === 0) {
    return { available: false, reason: 'No slots available for this date', slots: [] };
  }

  // Count existing bookings per slot (excluding cancelled)
  const existingAppointments = await Appointment.find({
    date: dateStr,
    timeSlot: { $in: candidateSlots },
    status: { $nin: ['cancelled'] },
  }).select('timeSlot');

  const bookedCounts = {};
  existingAppointments.forEach((appt) => {
    bookedCounts[appt.timeSlot] = (bookedCounts[appt.timeSlot] || 0) + 1;
  });

  const slots = candidateSlots.map((slot) => {
    const bookedCount = bookedCounts[slot] || 0;
    const remaining = Math.max(maxPerSlot - bookedCount, 0);
    return { slot, available: remaining > 0, remaining };
  });

  const anyAvailable = slots.some((s) => s.available);

  return { available: anyAvailable, reason: anyAvailable ? null : 'All slots are fully booked for this date', slots };
};

/**
 * Authoritative check used at appointment-creation time to prevent race conditions:
 * re-verifies the specific requested slot still has room.
 */
const isSlotStillAvailable = async (dateStr, slot) => {
  const settings = await AppointmentSettings.getSingleton();
  const maxPerSlot = settings.maxAppointmentsPerSlot || 1;

  if (settings.holidays.includes(dateStr) || settings.blockedDates.includes(dateStr)) {
    return { ok: false, reason: 'Clinic is closed on this date' };
  }

  const isBlockedSlot = settings.blockedSlots.some((b) => b.date === dateStr && b.slot === slot);
  if (isBlockedSlot) {
    return { ok: false, reason: 'This time slot is not available' };
  }

  const count = await Appointment.countDocuments({
    date: dateStr,
    timeSlot: slot,
    status: { $nin: ['cancelled'] },
  });

  if (count >= maxPerSlot) {
    return { ok: false, reason: 'This time slot has just been booked. Please choose another slot.' };
  }

  return { ok: true, reason: null };
};

module.exports = { getAvailabilityForDate, isSlotStillAvailable, toMinutes, toHHMM, DAY_NAMES };
