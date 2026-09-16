const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Pet Food', 'Accessories', 'Toys', 'Grooming Products', 'Pet Care Products', 'Other'],
      default: 'Other',
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        altText: { type: String, default: '' },
      },
    ],
    price: { type: Number, default: null },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ displayOrder: 1 });
productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
