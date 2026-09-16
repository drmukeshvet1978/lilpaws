const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin || !admin.isActive) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  admin.lastLogin = new Date();
  await admin.save();

  res.json({
    success: true,
    token: generateToken(admin._id),
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
    },
  });
});

// @desc    Get current logged-in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @desc    Update own profile (name, avatar)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  if (req.body.name) admin.name = req.body.name;

  if (req.file) {
    if (admin.avatar?.publicId) await deleteFromCloudinary(admin.avatar.publicId);
    const result = await uploadBufferToCloudinary(req.file.buffer, 'lilpaws/admin');
    admin.avatar = { url: result.secure_url, publicId: result.public_id };
  }

  await admin.save();
  res.json({ success: true, admin });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400);
    throw new Error('Current password and a new password (min 8 chars) are required');
  }

  const admin = await Admin.findById(req.admin._id).select('+password');
  const isMatch = await admin.comparePassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { login, getMe, updateProfile, changePassword };
