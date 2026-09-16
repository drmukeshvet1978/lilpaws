const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getServices);
router.get('/:idOrSlug', getServiceByIdOrSlug);
router.post('/', protect, upload.single('image'), createService);
router.put('/:id', protect, upload.single('image'), updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
