const mongoose = require('mongoose')
const XLSX = require('xlsx')
const path = require('path')
const User = require('./backend/models/User')
const Event = require('./backend/models/Event')

// Desactiva el buffer de comandos de Mongoose para evitar errores
mongoose.set('bufferCommands', false)

// Función para conectar a MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventastic', {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Conectado a MongoDB')
  } catch (err) {
    console.error('❌ Error al conectar:', err)
    process.exit(1)
  }
}

// Función para eliminar documentos uno por uno (para evitar problemas de buffering)
const deleteAllDocs = async (model) => {
  try {
    const docs = await model.find({})
    for (const doc of docs) {
      await model.deleteOne({ _id: doc._id })
    }
    console.log(
      `✅ Todos los documentos eliminados de ${model.collection.collectionName}`
    )
  } catch (err) {
    console.error(
      `❌ Error al eliminar documentos de ${model.collection.collectionName}:`,
      err
    )
  }
}

// Leer el archivo Excel
const workbook = XLSX.readFile(path.resolve(__dirname, 'Eventastic_BBDD.xlsx'))

const importData = async () => {
  try {
    await connectDB() // Conexión a MongoDB

    // 🧹 Limpiar colecciones antes de importar
    console.log('🧹 Limpiando colecciones...')
    await deleteAllDocs(User)
    await deleteAllDocs(Event)

    // 📥 Leer hojas del Excel
    const usuarios = XLSX.utils.sheet_to_json(workbook.Sheets['Usuarios'])
    const eventos = XLSX.utils.sheet_to_json(workbook.Sheets['Eventos'])
    const reservas = XLSX.utils.sheet_to_json(workbook.Sheets['Reservas'])

    console.log('📥 Importando usuarios...')
    const userMap = {}
    for (let user of usuarios) {
      const newUser = new User({
        name: user.Nombre,
        email: user.Email,
        password: user.Contraseña // En producción, usa bcrypt para hashear
      })
      const savedUser = await newUser.save()
      userMap[user.ID_Usuario] = savedUser._id
    }

    console.log('📥 Importando eventos...')
    const eventMap = {}
    for (let event of eventos) {
      const createdById =
        userMap[Math.floor(Math.random() * usuarios.length) + 1]
      const newEvent = new Event({
        title: event.Titulo,
        description: event.Descripcion,
        date: new Date(event.Fecha),
        location: event.Ubicacion,
        createdBy: createdById,
        image: event.Imagen_URL
      })
      const savedEvent = await newEvent.save()
      eventMap[event.ID_Evento] = savedEvent._id
    }

    console.log('📥 Importando reservas...')
    for (let reserva of reservas) {
      const userId = userMap[reserva.ID_Usuario]
      const eventId = eventMap[reserva.ID_Evento]

      if (userId && eventId) {
        // Añadir el usuario como asistente al evento
        await Event.findByIdAndUpdate(eventId, {
          $addToSet: { attendees: userId }
        })
        // Añadir el evento a los eventos unidos del usuario
        await User.findByIdAndUpdate(userId, {
          $addToSet: { joinedEvents: eventId }
        })
      }
    }

    console.log('✅ Datos importados correctamente')
    mongoose.connection.close()
  } catch (err) {
    console.error('❌ Error al importar:', err)
    mongoose.connection.close()
  }
}

importData()
