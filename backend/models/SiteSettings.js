const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    // Contact
    address: { type: String, default: 'Kolar Road, Bhopal, Madhya Pradesh, India' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    googleMapsEmbedUrl: { type: String, default: '' },
    googleMapsDirectionsUrl: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    // Social links
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },

    // Branding
    siteName: { type: String, default: 'Lil Paws Dog Clinic & Pet Shop' },
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },

    // SEO
    seo: {
      metaTitle: { type: String, default: 'Lil Paws Dog Clinic & Pet Shop | Kolar Road, Bhopal' },
      metaDescription: {
        type: String,
        default: 'Lil Paws Dog Clinic & Pet Shop by Dr. Mukesh Tiwari, Kolar Road, Bhopal. Veterinary care and pet shop under one roof.',
      },
      keywords: { type: [String], default: [] },
      ogImage: {
        url: { type: String, default: '' },
        publicId: { type: String, default: '' },
      },
      robots: { type: String, default: 'index, follow' },
    },

    // Footer
    footerDescription: {
      type: String,
      default: 'Caring for your dogs and pets with a modern clinic and a well-stocked pet shop, on Kolar Road, Bhopal.',
    },
  },
  { timestamps: true }
);

// Enforce singleton document
siteSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
