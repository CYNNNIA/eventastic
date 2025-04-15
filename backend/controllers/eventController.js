const Event = require('../models/Event');
const User = require('../models/User');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      createdBy: req.user.id,
    });

    await newEvent.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdEvents: newEvent._id },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el evento' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los eventos' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el evento' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el evento' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }
    res.status(200).json({ msg: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el evento' });
  }
};

const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!event || !user) return res.status(404).json({ msg: 'Evento o usuario no encontrado' });

    if (event.attendees.includes(user._id)) {
      return res.status(400).json({ msg: 'Ya estás inscrito en este evento' });
    }

    event.attendees.push(user._id);
    user.joinedEvents.push(event._id);

    await event.save();
    await user.save();

    res.status(200).json({ msg: 'Te uniste al evento', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al unirse al evento' });
  }
};

const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!event || !user) return res.status(404).json({ msg: 'Evento o usuario no encontrado' });

    event.attendees.pull(user._id);
    user.joinedEvents.pull(event._id);

    await event.save();
    await user.save();

    res.status(200).json({ msg: 'Saliste del evento', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al salir del evento' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent
};
