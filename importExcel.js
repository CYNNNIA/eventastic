const { MongoClient, ObjectId } = require('mongodb')
const XLSX = require('xlsx')
const path = require('path')

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)

const workbook = XLSX.readFile(path.resolve(__dirname, 'eventastic_data.xlsx'))

async function run() {
  try {
    await client.connect()
    console.log('✅ Conectado a MongoDB')

    const db = client.db('eventastic')
    const usersCollection = db.collection('users')
    const eventsCollection = db.collection('events')
    const reservationsCollection = db.collection('reservations')

    // 🧹 Limpiar colecciones antes de importar
    await usersCollection.deleteMany({})
    await eventsCollection.deleteMany({})
    await reservationsCollection.deleteMany({})
    console.log('🧹 Colecciones limpiadas')

    // 📥 Leer datos del archivo Excel
    const usuarios = XLSX.utils.sheet_to_json(workbook.Sheets['Users'])
    const eventos = XLSX.utils.sheet_to_json(workbook.Sheets['Events'])
    const reservas = XLSX.utils.sheet_to_json(workbook.Sheets['Reservations'])

    console.log('📢 Eventos leídos desde el Excel:', eventos)

    // 📥 Insertar usuarios
    if (usuarios.length) {
      await usersCollection.insertMany(usuarios)
      console.log(`📥 ${usuarios.length} usuarios importados`)
    }

    // 📥 Formatear e insertar eventos
    if (eventos.length) {
      const formattedEvents = eventos.map((event) => ({
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        location: event.location,
        createdBy: new ObjectId(), // Generar un ObjectId aleatorio
        attendees: [],
        image: ''
      }))

      console.log('📢 Eventos antes de insertar:', formattedEvents)

      await eventsCollection.insertMany(formattedEvents)
      console.log(
        `📥 ${formattedEvents.length} eventos importados correctamente`
      )
    }

    // 📥 Insertar reservas
    if (reservas.length) {
      await reservationsCollection.insertMany(reservas)
      console.log(`📥 ${reservas.length} reservas importadas`)
    }

    console.log('✅ Importación completada')
  } catch (err) {
    console.error('❌ Error al importar:', err)
  } finally {
    await client.close()
  }
}

run()
