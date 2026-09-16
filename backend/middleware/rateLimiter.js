const rateLimit = require('express-rate-limit');

// Limits public appointment submissions to prevent spam/abuse
const appointmentLimiter = rateLimit({
  windowMs: (parseInt(process.env.APPOINTMENT_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.APPOINTMENT_RATE_LIMIT_MAX) || 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many appointment requests from this device. Please try again later.',
  },
});

// General limiter for public-facing read APIs (generous, mostly anti-abuse)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for admin login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in a few minutes.',
  },
});

module.exports = { appointmentLimiter, generalLimiter, loginLimiter };
