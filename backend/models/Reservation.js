const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
  ID_Reserva: Number,
  ID_Usuario: Number,
  ID_Evento: Number,
  Fecha_Reserva: String
})

module.exports = mongoose.model('Reservation', reservationSchema)
