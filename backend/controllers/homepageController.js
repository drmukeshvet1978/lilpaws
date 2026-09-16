const asyncHandler = require('express-async-handler');
const HomepageContent = require('../models/HomepageContent');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get homepage content (singleton)
// @route   GET /api/homepage
const getHomepage = asyncHandler(async (req, res) => {
  const content = await HomepageContent.getSingleton();
  res.json({ success: true, content });
});

// @desc    Update hero text/CTAs, quickInfo list, whyChooseUs list, featuredServiceIds
// @route   PUT /api/homepage
// @access  Private
const updateHomepage = asyncHandler(async (req, res) => {
  const content = await HomepageContent.getSingleton();

  if (req.body.hero) {
    const heroUpdates = req.body.hero;
    content.hero = { ...content.hero.toObject(), ...heroUpdates, images: content.hero.images };
  }
  if (req.body.quickInfo) content.quickInfo = req.body.quickInfo;
  if (req.body.whyChooseUs) content.whyChooseUs = req.body.whyChooseUs;
  if (req.body.featuredServiceIds) content.featuredServiceIds = req.body.featuredServiceIds;

  await content.save();
  res.json({ success: true, content });
});

// @desc    Add hero image
// @route   POST /api/homepage/hero-image
// @access  Private
const addHeroImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('An image file is required');
  }
  const content = await HomepageContent.getSingleton();
  const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/homepage');
  content.hero.images.push({ url: result.secure_url, publicId: result.public_id, altText: req.body.altText || 'Lil Paws' });
  await content.save();
  res.status(201).json({ success: true, content });
});

// @desc    Remove hero image
// @route   DELETE /api/homepage/hero-image/:publicId
// @access  Private
const removeHeroImage = asyncHandler(async (req, res) => {
  const content = await HomepageContent.getSingleton();
  const { publicId } = req.params;
  await deleteFromCloudinary(publicId);
  content.hero.images = content.hero.images.filter((img) => img.publicId !== publicId);
  await content.save();
  res.json({ success: true, content });
});

module.exports = { getHomepage, updateHomepage, addHeroImage, removeHeroImage };
