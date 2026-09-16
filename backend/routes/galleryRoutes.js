const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  uploadGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getGalleryImages);
router.post('/', protect, upload.array('images', 10), uploadGalleryImages);
router.put('/:id', protect, upload.single('image'), updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;
