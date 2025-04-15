// scripts/importExcel.js
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

mongoose.set('strictQuery', true);
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

const filePath = path.join(__dirname, '../eventastic_data.xlsx');
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

console.log('📋 Datos crudos del Excel:', data);

async function importEvents() {
  try {
    await Event.deleteMany();
    console.log('🧹 Colección de eventos limpiada');

    const formattedEvents = data.map((item) => ({
      title: item.title || item.Title || item.titulo,
      description: item.description || item.Description || item.descripcion,
      date: new Date(item.date || item.Date || item.fecha),
      location: item.location || item.Location || item.ubicacion,
      createdBy: new mongoose.Types.ObjectId(),
      attendees: [],
      image: item.image || ''
    })).filter(event => event.title && event.description && !isNaN(event.date));

    await Event.insertMany(formattedEvents);
    console.log(`✅ ${formattedEvents.length} eventos importados con éxito.`);
  } catch (err) {
    console.error('❌ Error al importar eventos:', err);
  } finally {
    mongoose.connection.close();
  }
}

importEvents();
