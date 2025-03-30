// backend/routes/eventRoutes.js

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');  // Asegúrate de que la ruta sea correcta
const Event = require('../models/Event');
const router = express.Router();

// Ruta para crear un evento, requiere autenticación
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id,  // Usando el usuario decodificado del token
    });
    await event.save();
    res.status(201).send(event);  // Responde con el evento creado
  } catch (error) {
    res.status(400).send(error);  // Si ocurre un error, lo capturamos y respondemos
  }
});

// Ruta para obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();  // Encuentra todos los eventos en la base de datos
    res.status(200).send(events);  // Responde con la lista de eventos
  } catch (error) {
    res.status(500).send(error);  // En caso de error en la consulta
  }
});

// Ruta para obtener los eventos creados por el usuario autenticado
router.get('/my-events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id });  // Filtra los eventos creados por el usuario autenticado
    res.status(200).send(events);  // Responde con los eventos encontrados
  } catch (error) {
    res.status(500).send(error);  // En caso de error en la consulta
  }
});

// Ruta para unirse a un evento
router.post('/join/:eventId', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);  // Busca el evento por ID
    if (!event) {
      return res.status(404).send({ msg: 'Evento no encontrado' });  // Si no se encuentra el evento, responde con error
    }

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).send({ msg: 'Ya te has unido a este evento' });  // Verifica si el usuario ya está en el evento
    }

    event.attendees.push(req.user._id);  // Añade el ID del usuario al array de asistentes
    await event.save();  // Guarda los cambios en la base de datos
    res.status(200).send(event);  // Responde con el evento actualizado
  } catch (error) {
    res.status(500).send(error);  // Si ocurre algún error
  }
});

// Ruta para obtener los eventos a los que el usuario se ha unido
router.get('/joined-events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user._id });  // Busca los eventos donde el usuario está en los asistentes
    res.status(200).send(events);  // Responde con los eventos encontrados
  } catch (error) {
    res.status(500).send(error);  // En caso de error en la consulta
  }
});

module.exports = router;