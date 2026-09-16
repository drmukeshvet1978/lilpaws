const express = require('express');
const router = express.Router();
const { getBusinessHours, updateBusinessHours } = require('../controllers/businessHoursController');
const { protect } = require('../middleware/auth');

router.get('/', getBusinessHours);
router.put('/', protect, updateBusinessHours);

module.exports = router;
