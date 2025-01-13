const express = require('express')
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent
} = require('../controllers/eventController') // Controladores de eventos
const { protect } = require('../middlewares/authMiddlewares') // Middleware para proteger rutas
const upload = require('../middlewares/fileUpload') // Middleware para subir imágenes de eventos

const router = express.Router()

// Rutas públicas
router.get('/', getEvents) // Obtener todos los eventos
router.get('/:id', getEventById) // Obtener un evento específico por ID

// Rutas protegidas (requieren autenticación)
router.post('/', protect, upload.single('image'), createEvent) // Crear un nuevo evento
router.put('/:id', protect, upload.single('image'), updateEvent) // Actualizar un evento
router.delete('/:id', protect, deleteEvent) // Eliminar un evento
router.post('/:id/join', protect, joinEvent) // Unirse a un evento
router.post('/:id/leave', protect, leaveEvent) // Dejar un evento

module.exports = router
