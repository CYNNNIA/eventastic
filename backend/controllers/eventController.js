const Event = require('../models/Event'); // Importa el modelo de evento

// Crear un nuevo evento
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    // Crea un nuevo evento
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      createdBy: req.user.id, // Suponiendo que estás usando autenticación y `req.user` tiene la información del usuario
    });

    // Guarda el evento en la base de datos
    await newEvent.save();
    res.status(201).json(newEvent); // Responde con el evento creado
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el evento' });
  }
};

// Obtener todos los eventos
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find(); // Obtén todos los eventos
    res.status(200).json(events); // Responde con los eventos
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los eventos' });
  }
};

// Obtener un evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id); // Busca el evento por ID
    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }
    res.status(200).json(event); // Responde con el evento encontrado
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el evento' });
  }
};

// Actualizar un evento por ID
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Devuelve el evento actualizado
    );
    
    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    res.status(200).json(event); // Responde con el evento actualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el evento' });
  }
};

// Eliminar un evento por ID
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id); // Elimina el evento por ID

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    res.status(200).json({ msg: 'Evento eliminado correctamente' }); // Responde que el evento ha sido eliminado
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el evento' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};