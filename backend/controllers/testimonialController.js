const asyncHandler = require('express-async-handler');
const Testimonial = require('../models/Testimonial');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const getTestimonials = asyncHandler(async (req, res) => {
  const { all } = req.query;
  const query = all ? {} : { isActive: true };
  const testimonials = await Testimonial.find(query).sort({ displayOrder: 1, createdAt: -1 });
  res.json({ success: true, testimonials });
});

const createTestimonial = asyncHandler(async (req, res) => {
  const { customerName, petName, review, rating, isActive, displayOrder, isDemo } = req.body;

  if (!customerName || !review || !rating) {
    res.status(400);
    throw new Error('Customer name, review, and rating are required');
  }

  let photo = {};
  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/testimonials');
    photo = { url: result.secure_url, publicId: result.public_id };
  }

  const testimonial = await Testimonial.create({
    customerName,
    petName,
    review,
    rating,
    photo,
    isActive: isActive !== undefined ? isActive : true,
    displayOrder: displayOrder || 0,
    isDemo: isDemo || false,
  });

  res.status(201).json({ success: true, testimonial });
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  const fields = ['customerName', 'petName', 'review', 'rating', 'isActive', 'displayOrder', 'isDemo'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) testimonial[f] = req.body[f];
  });

  if (req.file) {
    if (testimonial.photo?.publicId) await deleteFromCloudinary(testimonial.photo.publicId);
    const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/testimonials');
    testimonial.photo = { url: result.secure_url, publicId: result.public_id };
  }

  await testimonial.save();
  res.json({ success: true, testimonial });
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  if (testimonial.photo?.publicId) await deleteFromCloudinary(testimonial.photo.publicId);
  await testimonial.deleteOne();
  res.json({ success: true, message: 'Testimonial deleted' });
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
