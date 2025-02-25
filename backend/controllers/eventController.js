const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const multer = require('multer');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// 📂 Configuración de Multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // ✅ Guarda las imágenes en la carpeta uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // ✅ Nombre único para cada imagen
  }
});

const upload = multer({ storage });

// ✅ Exportamos el middleware de Multer para usarlo en las rutas
exports.upload = upload;

// 📥 Obtener todos los eventos
exports.getEvents = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('eventastic');
    const events = await db.collection('events').find().toArray();
    res.json(events);
  } catch (err) {
    console.error('❌ Error al obtener eventos:', err);
    res.status(500).json({ error: 'Error al obtener eventos' });
  } finally {
    await client.close();
  }
};

// 📥 Obtener evento por ID
exports.getEventById = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('eventastic');
    const event = await db.collection('events').findOne({ _id: new ObjectId(req.params.id) });

    if (!event) return res.status(404).json({ msg: 'Evento no encontrado' });

    res.json(event);
  } catch (err) {
    console.error('❌ Error al obtener el evento:', err);
    res.status(500).json({ error: 'Error al obtener el evento' });
  } finally {
    await client.close();
  }
};

// ➕ Crear un nuevo evento
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !date || !location) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
    }

    await client.connect();
    const db = client.db('eventastic');

    const newEvent = {
      title,
      description,
      date,
      location,
      image: imagePath,
      attendees: []
    };

    const result = await db.collection('events').insertOne(newEvent);

    res.status(201).json({ msg: 'Evento creado con éxito.', event: result.ops[0] });
  } catch (err) {
    console.error('❌ Error al crear el evento:', err);
    res.status(500).json({ error: 'Error al crear el evento' });
  } finally {
    await client.close();
  }
};

// ✅ Unirse al evento
exports.joinEvent = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('eventastic');
    const eventId = new ObjectId(req.params.id);
    const userId = req.user.id;

    const result = await db.collection('events').updateOne(
      { _id: eventId },
      { $addToSet: { attendees: userId } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    res.json({ msg: 'Te has unido al evento con éxito.' });
  } catch (err) {
    console.error('❌ Error al unirse al evento:', err);
    res.status(500).json({ error: 'Error al unirse al evento' });
  } finally {
    await client.close();
  }
};

// 🚪 Salir del evento
exports.leaveEvent = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('eventastic');
    const eventId = new ObjectId(req.params.id);
    const userId = req.user.id;

    const result = await db.collection('events').updateOne(
      { _id: eventId },
      { $pull: { attendees: userId } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    res.json({ msg: 'Has salido del evento con éxito.' });
  } catch (err) {
    console.error('❌ Error al salir del evento:', err);
    res.status(500).json({ error: 'Error al salir del evento' });
  } finally {
    await client.close();
  }
};

// ❌ Eliminar evento
exports.deleteEvent = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('eventastic');
    const eventId = new ObjectId(req.params.id);

    const result = await db.collection('events').deleteOne({ _id: eventId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    res.json({ msg: 'Evento eliminado' });
  } catch (err) {
    console.error('❌ Error al eliminar el evento:', err);
    res.status(500).json({ error: 'Error al eliminar el evento' });
  } finally {
    await client.close();
  }
};