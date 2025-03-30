const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController'); // Importa el controlador de eventos
const authMiddleware = require('../middlewares/authMiddleware'); // Si utilizas un middleware de autenticación

// Crear un nuevo evento (requiere autenticación)
router.post('/', authMiddleware.verifyToken, eventController.createEvent); 

// Obtener todos los eventos
router.get('/', eventController.getAllEvents); 

// Obtener un evento específico por ID
router.get('/:id', eventController.getEventById);

// Actualizar un evento
router.put('/:id', authMiddleware.verifyToken, eventController.updateEvent);

// Eliminar un evento
router.delete('/:id', authMiddleware.verifyToken, eventController.deleteEvent);

module.exports = router;