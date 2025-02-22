const Event = require('../models/Event')

// Obtener todos los eventos
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
    res.status(200).json(events)
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    res.status(500).json({ msg: 'Error al obtener eventos' })
  }
}

// Obtener evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ msg: 'Evento no encontrado' })
    res.status(200).json(event)
  } catch (error) {
    console.error('Error al obtener evento:', error)
    res.status(500).json({ msg: 'Error al obtener evento' })
  }
}

// Crear evento
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      createdBy: req.user.id
    })
    await newEvent.save()
    res.status(201).json(newEvent)
  } catch (error) {
    console.error('Error al crear evento:', error)
    res.status(500).json({ msg: 'Error al crear evento' })
  }
}

// Unirse al evento
const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ msg: 'Evento no encontrado' })

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Ya estás unido a este evento' })
    }

    event.attendees.push(req.user.id)
    await event.save()
    res.status(200).json({ msg: 'Te has unido al evento' })
  } catch (error) {
    console.error('Error al unirse al evento:', error)
    res.status(500).json({ msg: 'Error al unirse al evento' })
  }
}

// Salir del evento
const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ msg: 'Evento no encontrado' })

    if (!event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'No estás unido a este evento' })
    }

    event.attendees = event.attendees.filter(
      (attendeeId) => attendeeId.toString() !== req.user.id
    )
    await event.save()
    res.status(200).json({ msg: 'Has salido del evento' })
  } catch (error) {
    console.error('Error al salir del evento:', error)
    res.status(500).json({ msg: 'Error al salir del evento' })
  }
}

// Eliminar evento
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ msg: 'Evento no encontrado' })

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' })
    }

    await event.deleteOne()
    res.status(200).json({ msg: 'Evento eliminado' })
  } catch (error) {
    console.error('Error al eliminar evento:', error)
    res.status(500).json({ msg: 'Error al eliminar evento' })
  }
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  joinEvent,
  leaveEvent,
  deleteEvent
}
