const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true, unique: true },

    ownerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },

    petName: { type: String, required: true, trim: true },
    petType: { type: String, required: true, trim: true },
    petBreed: { type: String, trim: true },
    petAge: { type: String, trim: true },

    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceName: { type: String, required: true },

    reason: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: '' },

    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "10:00-10:30"

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },

    adminNotes: { type: String, default: '' },
    rescheduleHistory: [
      {
        fromDate: String,
        fromSlot: String,
        toDate: String,
        toSlot: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],

    source: { type: String, default: 'website' },
  },
  { timestamps: true }
);

// Prevent double-booking beyond max allowed per slot; queried together with AppointmentSettings.maxPerSlot
appointmentSchema.index({ date: 1, timeSlot: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ phone: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
