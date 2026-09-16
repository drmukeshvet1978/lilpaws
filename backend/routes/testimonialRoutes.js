const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getTestimonials);
router.post('/', protect, upload.single('photo'), createTestimonial);
router.put('/:id', protect, upload.single('photo'), updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
