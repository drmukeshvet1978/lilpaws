const express = require('express');
const router = express.Router();
const { getAvailability } = require('../controllers/appointmentController');

router.get('/', getAvailability);

module.exports = router;
