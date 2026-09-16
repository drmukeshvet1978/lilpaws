const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAbout);
router.put('/', protect, upload.single('photo'), updateAbout);

module.exports = router;
