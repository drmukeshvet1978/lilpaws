const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Dr. Mukesh Tiwari' },
    designation: { type: String, default: 'Veterinary Doctor & Founder' },
    biography: { type: String, default: '' },
    photo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    aboutText: { type: String, default: '' },
    mission: { type: String, default: '' },
    vision: { type: String, default: '' },
    clinicStory: { type: String, default: '' },
  },
  { timestamps: true }
);

doctorProfileSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
