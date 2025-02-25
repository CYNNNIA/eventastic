const express = require('express');
const { protect } = require('../middlewares/authMiddlewares');
const {
  createEvent,
  getEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  deleteEvent,
  upload
} = require('../controllers/eventController'); // Incluye upload

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, upload.single('image'), createEvent); // Usa Multer aquí
router.post('/:id/join', protect, joinEvent);
router.post('/:id/leave', protect, leaveEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;