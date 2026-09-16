const asyncHandler = require('express-async-handler');
const SiteSettings = require('../models/SiteSettings');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get site settings (singleton) - contact, social, seo, branding
// @route   GET /api/settings
const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  res.json({ success: true, settings });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();

  const simpleFields = [
    'address',
    'phone',
    'whatsapp',
    'email',
    'googleMapsEmbedUrl',
    'googleMapsDirectionsUrl',
    'latitude',
    'longitude',
    'siteName',
    'footerDescription',
  ];
  simpleFields.forEach((f) => {
    if (req.body[f] !== undefined) settings[f] = req.body[f];
  });

  if (req.body.socialLinks) {
    settings.socialLinks = { ...settings.socialLinks.toObject(), ...req.body.socialLinks };
  }

  if (req.body.seo) {
    settings.seo = { ...settings.seo.toObject(), ...req.body.seo, ogImage: settings.seo.ogImage };
  }

  await settings.save();
  res.json({ success: true, settings });
});

// @desc    Upload/replace site logo
// @route   POST /api/settings/logo
// @access  Private
const updateLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('An image file is required');
  }
  const settings = await SiteSettings.getSingleton();
  if (settings.logo?.publicId) await deleteFromCloudinary(settings.logo.publicId);
  const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/branding');
  settings.logo = { url: result.secure_url, publicId: result.public_id };
  await settings.save();
  res.json({ success: true, settings });
});

// @desc    Upload/replace Open Graph SEO image
// @route   POST /api/settings/og-image
// @access  Private
const updateOgImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('An image file is required');
  }
  const settings = await SiteSettings.getSingleton();
  if (settings.seo.ogImage?.publicId) await deleteFromCloudinary(settings.seo.ogImage.publicId);
  const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/seo');
  settings.seo.ogImage = { url: result.secure_url, publicId: result.public_id };
  await settings.save();
  res.json({ success: true, settings });
});

module.exports = { getSettings, updateSettings, updateLogo, updateOgImage };
