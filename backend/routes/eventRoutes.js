const express = require('express');
const { getEvents, createEvent, getEventById, joinEvent, leaveEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuración de multer para subir imágenes
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
router.get('/', getEvents);  // Obtener todos los eventos
router.post('/', protect, upload.single('image'), createEvent);  // Crear un evento, requiere autenticación
router.get('/:id', getEventById);  // Obtener un evento por ID
router.post('/:id/join', protect, joinEvent);  // Unirse a un evento, requiere autenticación
router.post('/:id/leave', protect, leaveEvent);  // Salir de un evento, requiere autenticación
router.delete('/:id', protect, deleteEvent);  // Eliminar un evento, requiere autenticación

module.exports = router;