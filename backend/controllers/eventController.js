const Event = require('../models/Event')

// Crear un nuevo evento
const createEvent = async (req, res) => {
  try {
    const { title, date, location, description } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null

    const event = new Event({
      title,
      date,
      location,
      description,
      image,
      createdBy: req.user.id
    })

    await event.save()
    res.status(201).json({ msg: 'Evento creado con éxito', event })
  } catch (error) {
    console.error('Error al crear el evento:', error.message)
    res.status(500).json({ msg: 'Error al crear el evento' })
  }
}

// Obtener todos los eventos
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email avatar')
      .populate('attendees', 'name avatar')
    res.status(200).json(events)
  } catch (error) {
    console.error('Error al obtener los eventos:', error.message)
    res.status(500).json({ msg: 'Error al obtener los eventos' })
  }
}

// Obtener un evento por su ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('attendees', 'name avatar')

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' })
    }

    res.status(200).json(event)
  } catch (error) {
    console.error('Error al obtener el evento:', error.message)
    res.status(500).json({ msg: 'Error al obtener el evento' })
  }
}

// Actualizar un evento
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const { title, date, location, description } = req.body

    const event = await Event.findById(id)

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' })
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: 'No autorizado para actualizar este evento' })
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : event.image

    event.title = title || event.title
    event.date = date || event.date
    event.location = location || event.location
    event.description = description || event.description
    event.image = imagePath

    await event.save()
    res.status(200).json({ msg: 'Evento actualizado con éxito', event })
  } catch (error) {
    console.error('Error al actualizar el evento:', error.message)
    res.status(500).json({ msg: 'Error al actualizar el evento' })
  }
}

// Eliminar un evento
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params

    const event = await Event.findById(id)

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' })
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: 'No autorizado para eliminar este evento' })
    }

    await event.deleteOne()
    res.status(200).json({ msg: 'Evento eliminado con éxito' })
  } catch (error) {
    console.error('Error al eliminar el evento:', error.message)
    res.status(500).json({ msg: 'Error al eliminar el evento' })
  }
}

// Unirse a un evento
const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' })
    }

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Ya estás unido a este evento' })
    }

    event.attendees.push(req.user.id)
    await event.save()
    res.status(200).json({ msg: 'Te has unido al evento', event })
  } catch (error) {
    console.error('Error al unirse al evento:', error.message)
    res.status(500).json({ msg: 'Error al unirse al evento' })
  }
}

// Salir de un evento
const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ msg: 'Evento no encontrado' })
    }

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user.id
    )

    await event.save()
    res.status(200).json({ msg: 'Has salido del evento correctamente', event })
  } catch (error) {
    console.error('Error al salir del evento:', error.message)
    res.status(500).json({ msg: 'Error al salir del evento' })
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent
}
