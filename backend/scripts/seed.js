// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Event = require('../models/Event');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

if (!MONGO_URI || !MONGO_DB_NAME) {
  console.error('❌ Faltan variables de entorno MONGO_URI o MONGO_DB_NAME');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  dbName: MONGO_DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });

const filePath = path.join(__dirname, '../../eventastic_data.xlsx');
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

console.log('📋 Datos crudos del Excel:');
console.log(data.slice(0, 3));

async function importEvents() {
  try {
    await Event.deleteMany();
    console.log('🧹 Colección de eventos limpiada');

    const formattedEvents = data.map((item) => ({
      title: item.title || item.Titulo,
      description: item.description || item.Descripcion,
      date: new Date(item.date || item.Fecha),
      location: item.location || item.Lugar,
      createdBy: new mongoose.Types.ObjectId(),
      attendees: [],
      image: item.image || '',
    }));

    await Event.insertMany(formattedEvents);
    console.log(`✅ ${formattedEvents.length} eventos importados con éxito.`);
    console.log('🎉 Eventos importados:');
    formattedEvents.forEach((e, i) => console.log(`${i + 1}. ${e.title}`));

  } catch (err) {
    console.error('❌ Error al importar eventos:', err);
  } finally {
    mongoose.connection.close();
  }
}

importEvents();
