const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      altText: { type: String, default: '' },
    },
    icon: { type: String, default: 'stethoscope' }, // lucide-react icon name
    category: {
      type: String,
      enum: [
        'Veterinary Consultation',
        'General Pet Care',
        'Preventive Care',
        'Diagnostics',
        'Vaccination',
        'Grooming / Hygiene',
        'Other',
      ],
      default: 'Other',
    },
    price: { type: Number, default: null },
    priceLabel: { type: String, default: '' }, // e.g. "Starting from" for flexibility, optional
    duration: { type: String, default: '' }, // e.g. "30 mins"
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ displayOrder: 1 });
serviceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
