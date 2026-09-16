const mongoose = require('mongoose');

const dayScheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    isOpen: { type: Boolean, default: true },
    openTime: { type: String, default: '10:00' }, // 24hr HH:mm
    closeTime: { type: String, default: '20:00' },
    breaks: [
      {
        start: String, // HH:mm
        end: String,
      },
    ],
  },
  { _id: false }
);

const businessHoursSchema = new mongoose.Schema(
  {
    weeklySchedule: {
      type: [dayScheduleSchema],
      default: () =>
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
          day,
          isOpen: day !== 'Sunday',
          openTime: '10:00',
          closeTime: '20:00',
          breaks: [{ start: '14:00', end: '15:00' }],
        })),
    },
  },
  { timestamps: true }
);

businessHoursSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('BusinessHours', businessHoursSchema);
