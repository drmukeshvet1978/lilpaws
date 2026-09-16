const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, updateLogo, updateOgImage } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getSettings);
router.put('/', protect, updateSettings);
router.post('/logo', protect, upload.single('logo'), updateLogo);
router.post('/og-image', protect, upload.single('image'), updateOgImage);

module.exports = router;
