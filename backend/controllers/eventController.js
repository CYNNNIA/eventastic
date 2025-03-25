const mongoose = require('mongoose');
const Event = require('../models/Event');

// Obtener todos los eventos
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    console.error('❌ Error al obtener eventos:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Crear un nuevo evento
const createEvent = async (req, res) => {
  try {
    console.log('📢 Datos recibidos en el backend:', req.body);

    const { title, description, date, location } = req.body;
    const createdBy = req.user ? req.user.id : null;

    if (!title || !description || !date || !location || !createdBy) {
      console.error('🚨 Datos faltantes:', { title, description, date, location, createdBy });
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    // Convertir la fecha a un objeto Date válido
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ msg: 'Fecha inválida, revisa el formato (YYYY-MM-DD)' });
    }

    const newEvent = new Event({
      title,
      description,
      date: formattedDate, // Guardamos la fecha correctamente formateada
      location,
      createdBy,
      attendees: [],
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    await newEvent.save();
    console.log('✅ Evento creado con éxito:', newEvent);
    res.status(201).json({ msg: 'Evento creado con éxito', event: newEvent });
  } catch (error) {
    console.error('❌ Error al crear evento:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Obtener un evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    res.json(event);
  } catch (error) {
    console.error('❌ Error al obtener evento:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Unirse a un evento
const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Ya estás unido a este evento' });
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.json({ msg: 'Te has unido al evento', event });
  } catch (error) {
    console.error('❌ Error al unirse al evento:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Salir de un evento
const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user.id
    );

    await event.save();
    res.json({ msg: 'Has salido del evento', event });
  } catch (error) {
    console.error('❌ Error al salir del evento:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Eliminar un evento
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No tienes permiso para eliminar este evento' });
    }

    await event.deleteOne();
    res.json({ msg: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar el evento:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  getEventById,
  joinEvent,
  leaveEvent,
  deleteEvent
};