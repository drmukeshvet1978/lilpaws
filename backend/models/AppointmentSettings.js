const mongoose = require('mongoose');

const appointmentSettingsSchema = new mongoose.Schema(
  {
    slotDurationMinutes: { type: Number, default: 30 },
    maxAppointmentsPerSlot: { type: Number, default: 1 },
    minAdvanceBookingHours: { type: Number, default: 1 }, // how soon before slot can it be booked
    maxAdvanceBookingDays: { type: Number, default: 30 }, // how far in future can you book

    holidays: [{ type: String }], // array of YYYY-MM-DD
    blockedDates: [{ type: String }], // array of YYYY-MM-DD (fully blocked)
    blockedSlots: [
      {
        date: String, // YYYY-MM-DD
        slot: String, // e.g. "10:00-10:30"
      },
    ],
  },
  { timestamps: true }
);

appointmentSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('AppointmentSettings', appointmentSettingsSchema);
