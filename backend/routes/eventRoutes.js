const express = require('express');
const {
  getEvents,
  createEvent,
  getEventById,
  joinEvent,
  leaveEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configurar almacenamiento de imágenes con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.get('/', getEvents);
router.post('/', protect, upload.single('image'), createEvent);
router.get('/:id', getEventById);
router.post('/:id/join', protect, joinEvent);
router.post('/:id/leave', protect, leaveEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;