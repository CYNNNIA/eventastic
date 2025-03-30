const express = require('express');
const {
  getEvents,
  createEvent,
  getEventById,
  joinEvent,
  leaveEvent,
  deleteEvent
} = require('../controllers/eventController');
const { verifyToken } = require('../controllers/authController');  // Importamos el middleware para verificar el token
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Rutas de eventos
router.get('/', getEvents);
router.post('/', verifyToken, upload.single('image'), createEvent);  // Proteger la creación de eventos
router.get('/:id', getEventById);
router.post('/:id/join', verifyToken, joinEvent);  // Proteger la inscripción en eventos
router.post('/:id/leave', verifyToken, leaveEvent);  // Proteger la salida de eventos
router.delete('/:id', verifyToken, deleteEvent);  // Proteger la eliminación de eventos

module.exports = router;