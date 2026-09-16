const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Service = require('../models/Service');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all active services (public) or all (admin, via ?all=true)
// @route   GET /api/services
// @access  Public / Private
const getServices = asyncHandler(async (req, res) => {
  const { category, all } = req.query;
  const query = {};
  if (!all) query.isActive = true;
  if (category) query.category = category;

  const services = await Service.find(query).sort({ displayOrder: 1, createdAt: -1 });
  res.json({ success: true, services });
});

// @desc    Get single service by slug or id
// @route   GET /api/services/:idOrSlug
// @access  Public
const getServiceByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const service = await Service.findOne({
    $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
  });

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, service });
});

// @desc    Create service
// @route   POST /api/services
// @access  Private
const createService = asyncHandler(async (req, res) => {
  const { name, shortDescription, fullDescription, icon, category, price, priceLabel, duration, isActive, displayOrder } = req.body;

  if (!name || !shortDescription) {
    res.status(400);
    throw new Error('Name and short description are required');
  }

  let slug = slugify(name, { lower: true, strict: true });
  const existing = await Service.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  let image = {};
  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/services');
    image = { url: result.secure_url, publicId: result.public_id, altText: name };
  }

  const service = await Service.create({
    name,
    slug,
    shortDescription,
    fullDescription,
    icon,
    category,
    price: price || null,
    priceLabel,
    duration,
    isActive: isActive !== undefined ? isActive : true,
    displayOrder: displayOrder || 0,
    image,
  });

  res.status(201).json({ success: true, service });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const fields = ['name', 'shortDescription', 'fullDescription', 'icon', 'category', 'price', 'priceLabel', 'duration', 'isActive', 'displayOrder'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) service[f] = req.body[f];
  });

  if (req.body.name && req.body.name !== service.name) {
    let slug = slugify(req.body.name, { lower: true, strict: true });
    const existing = await Service.findOne({ slug, _id: { $ne: service._id } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;
    service.slug = slug;
  }

  if (req.file) {
    if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId);
    const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/services');
    service.image = { url: result.secure_url, publicId: result.public_id, altText: service.name };
  }

  await service.save();
  res.json({ success: true, service });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId);
  await service.deleteOne();
  res.json({ success: true, message: 'Service deleted' });
});

module.exports = { getServices, getServiceByIdOrSlug, createService, updateService, deleteService };
