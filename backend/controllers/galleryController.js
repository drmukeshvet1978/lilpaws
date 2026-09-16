const asyncHandler = require('express-async-handler');
const GalleryImage = require('../models/GalleryImage');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get gallery images (public)
// @route   GET /api/gallery
const getGalleryImages = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const query = {};
  if (category) query.category = category;
  if (featured) query.isFeatured = true;

  const images = await GalleryImage.find(query).sort({ displayOrder: 1, createdAt: -1 });
  res.json({ success: true, images });
});

// @desc    Upload one or more gallery images
// @route   POST /api/gallery
// @access  Private
const uploadGalleryImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('At least one image file is required');
  }

  const { category, caption, altText } = req.body;

  const uploads = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'lilpaws/gallery')));

  const docs = await GalleryImage.insertMany(
    uploads.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      category: category || 'Other',
      caption: caption || '',
      altText: altText || '',
    }))
  );

  res.status(201).json({ success: true, images: docs });
});

// @desc    Update gallery image metadata
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Gallery image not found');
  }

  const fields = ['category', 'caption', 'altText', 'isFeatured', 'displayOrder'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) image[f] = req.body[f];
  });

  // Replace image file
  if (req.file) {
    await deleteFromCloudinary(image.publicId);
    const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/gallery');
    image.url = result.secure_url;
    image.publicId = result.public_id;
  }

  await image.save();
  res.json({ success: true, image });
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Gallery image not found');
  }
  await deleteFromCloudinary(image.publicId);
  await image.deleteOne();
  res.json({ success: true, message: 'Gallery image deleted' });
});

module.exports = { getGalleryImages, uploadGalleryImages, updateGalleryImage, deleteGalleryImage };
