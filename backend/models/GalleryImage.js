const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    altText: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Clinic', 'Pets', 'Team', 'Events', 'Products', 'Other'],
      default: 'Other',
    },
    caption: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

galleryImageSchema.index({ category: 1 });
galleryImageSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
