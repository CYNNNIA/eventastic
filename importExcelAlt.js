const { MongoClient } = require('mongodb');
const XLSX = require('xlsx');
const path = require('path');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const workbook = XLSX.readFile(path.resolve(__dirname, 'Eventastic_BBDD.xlsx'));

async function run() {
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db('eventastic');
    const usersCollection = db.collection('users');
    const eventsCollection = db.collection('events');
    const reservationsCollection = db.collection('reservations');

    // 🧹 Limpiar colecciones antes de importar
    await usersCollection.deleteMany({});
    await eventsCollection.deleteMany({});
    await reservationsCollection.deleteMany({});
    console.log('🧹 Colecciones limpiadas');

    // 📥 Leer datos del archivo Excel
    const usuarios = XLSX.utils.sheet_to_json(workbook.Sheets['Usuarios']);
    const eventos = XLSX.utils.sheet_to_json(workbook.Sheets['Eventos']);
    const reservas = XLSX.utils.sheet_to_json(workbook.Sheets['Reservas']);

    // 📥 Insertar usuarios
    if (usuarios.length) {
      await usersCollection.insertMany(usuarios);
      console.log(`📥 ${usuarios.length} usuarios importados`);
    }

    // 📥 Insertar eventos
    if (eventos.length) {
      await eventsCollection.insertMany(eventos);
      console.log(`📥 ${eventos.length} eventos importados`);
    }

    // 📥 Insertar reservas
    if (reservas.length) {
      await reservationsCollection.insertMany(reservas);
      console.log(`📥 ${reservas.length} reservas importadas`);
    }

    console.log('✅ Importación completada');
  } catch (err) {
    console.error('❌ Error al importar:', err);
  } finally {
    await client.close();
  }
}

run();