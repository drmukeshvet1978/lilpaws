const asyncHandler = require('express-async-handler');
const DoctorProfile = require('../models/DoctorProfile');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get doctor/about profile (singleton)
// @route   GET /api/about
const getAbout = asyncHandler(async (req, res) => {
  const profile = await DoctorProfile.getSingleton();
  res.json({ success: true, profile });
});

// @desc    Update doctor/about profile
// @route   PUT /api/about
// @access  Private
const updateAbout = asyncHandler(async (req, res) => {
  const profile = await DoctorProfile.getSingleton();

  const fields = ['name', 'designation', 'biography', 'aboutText', 'mission', 'vision', 'clinicStory'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) profile[f] = req.body[f];
  });

  if (req.file) {
    if (profile.photo?.publicId) await deleteFromCloudinary(profile.photo.publicId);
    const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/doctor');
    profile.photo = { url: result.secure_url, publicId: result.public_id };
  }

  await profile.save();
  res.json({ success: true, profile });
});

module.exports = { getAbout, updateAbout };
