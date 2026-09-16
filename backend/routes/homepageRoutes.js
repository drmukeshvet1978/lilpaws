const express = require('express');
const router = express.Router();
const { getHomepage, updateHomepage, addHeroImage, removeHeroImage } = require('../controllers/homepageController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getHomepage);
router.put('/', protect, updateHomepage);
router.post('/hero-image', protect, upload.single('image'), addHeroImage);
router.delete('/hero-image/:publicId', protect, removeHeroImage);

module.exports = router;
