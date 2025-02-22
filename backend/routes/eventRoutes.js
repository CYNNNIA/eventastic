const express = require('express')
const { protect } = require('../middlewares/authMiddlewares')
const {
  createEvent,
  getEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  deleteEvent
} = require('../controllers/eventController') // Asegúrate que las funciones están bien exportadas

const router = express.Router()

// ✅ Rutas definidas correctamente
router.get('/', getEvents) // Obtener todos los eventos
router.get('/:id', getEventById) // Obtener evento por ID
router.post('/', protect, createEvent) // Crear evento
router.post('/:id/join', protect, joinEvent) // Unirse al evento
router.post('/:id/leave', protect, leaveEvent) // Salir del evento
router.delete('/:id', protect, deleteEvent) // Eliminar evento

module.exports = router
