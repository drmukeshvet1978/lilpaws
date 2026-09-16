const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');

// Protect routes - verifies JWT and attaches admin to req
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      res.status(401);
      throw new Error('Not authorized, admin not found or inactive');
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, invalid or expired token');
  }
});

// Restrict to specific roles
const authorize = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    res.status(403);
    throw new Error('Not authorized to perform this action');
  }
  next();
};

module.exports = { protect, authorize };
