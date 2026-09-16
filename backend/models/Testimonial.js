const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    petName: { type: String, trim: true, default: '' },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    photo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isDemo: { type: Boolean, default: false }, // marks seed/demo content clearly
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
