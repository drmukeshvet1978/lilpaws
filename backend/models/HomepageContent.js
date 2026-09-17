const mongoose = require('mongoose');

const homepageContentSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Because Every Paw Deserves the Best Care' },
      subtitle: {
        type: String,
        default:
          'Lil Paws Dog Clinic & Pet Shop brings veterinary care and everyday pet essentials together, across our Minal and Kolar Road locations in Bhopal.',
      },
      primaryCtaText: { type: String, default: 'Book an Appointment' },
      primaryCtaLink: { type: String, default: '/appointments' },
      secondaryCtaText: { type: String, default: 'Explore Services' },
      secondaryCtaLink: { type: String, default: '/services' },
      images: [
        {
          url: String,
          publicId: String,
          altText: String,
        },
      ],
    },

    quickInfo: [
      {
        title: { type: String },
        description: { type: String },
        icon: { type: String, default: 'heart-pulse' },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
      },
    ],

    whyChooseUs: [
      {
        title: { type: String },
        description: { type: String },
        icon: { type: String, default: 'shield-check' },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
      },
    ],

    featuredServiceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  },
  { timestamps: true }
);

homepageContentSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('HomepageContent', homepageContentSchema);