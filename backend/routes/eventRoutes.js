// backend/routes/eventRoutes.js

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Event = require('../models/Event');
const router = express.Router();

// Crear evento
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('❌ Error al crear evento:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('❌ Error al obtener eventos:', error.message);
    res.status(500).json({ error: 'No se pudieron obtener los eventos' });
  }
});

// Obtener eventos creados por el usuario
router.get('/my-events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id });
    res.status(200).json(events);
  } catch (error) {
    console.error('❌ Error al obtener eventos del usuario:', error.message);
    res.status(500).json({ error: 'No se pudieron obtener tus eventos' });
  }
});

// Unirse a un evento
router.post('/join/:eventId', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ msg: 'Ya te has unido a este evento' });
    }

    event.attendees.push(req.user._id);
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error('❌ Error al unirse a evento:', error.message);
    res.status(500).json({ error: 'No se pudo unir al evento' });
  }
});

// Obtener eventos unidos por el usuario
router.get('/joined-events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user._id });
    res.status(200).json(events);
  } catch (error) {
    console.error('❌ Error al obtener eventos unidos:', error.message);
    res.status(500).json({ error: 'No se pudieron obtener los eventos' });
  }
});

module.exports = router;