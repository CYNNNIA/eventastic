// backend/scripts/importExcel.js
const { MongoClient, ObjectId } = require('mongodb');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

const client = new MongoClient(uri);
const workbook = XLSX.readFile(path.resolve(__dirname, '../eventastic_data.xlsx'));

// 📂 uploads dir
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function downloadImage(url, filename) {
  const filePath = path.join(uploadsDir, filename);
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(`/uploads/${filename}`));
    writer.on('error', reject);
  });
}

async function run() {
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const eventsCollection = db.collection('events');
    const reservationsCollection = db.collection('reservations');

    await usersCollection.deleteMany({});
    await eventsCollection.deleteMany({});
    await reservationsCollection.deleteMany({});
    console.log('🧹 Colecciones limpiadas');

    const usuarios = XLSX.utils.sheet_to_json(workbook.Sheets['Users']);
    const eventos = XLSX.utils.sheet_to_json(workbook.Sheets['Events']);
    const reservas = XLSX.utils.sheet_to_json(workbook.Sheets['Reservations']);

    console.log('📥 Importando usuarios...');
    const result = await usersCollection.insertMany(usuarios);
    const userIds = result.insertedIds;
    console.log(`📥 ${usuarios.length} usuarios importados`);

    console.log('📥 Importando eventos...');
    const formattedEvents = await Promise.all(
      eventos.map(async (event, index) => {
        const imageUrl = `https://picsum.photos/500/300?random=${index}`;
        const filename = `event_${index}.jpg`;
        const localImagePath = await downloadImage(imageUrl, filename);
        const creatorIndex = index % Object.keys(userIds).length;

        return {
          title: event.title,
          description: event.description,
          date: new Date(event.date),
          location: event.location,
          createdBy: userIds[creatorIndex],
          attendees: [],
          image: localImagePath,
          source: 'import',
        };
      })
    );

    await eventsCollection.insertMany(formattedEvents);
    console.log(`📥 ${formattedEvents.length} eventos importados`);

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