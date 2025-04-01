// backend/scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');

mongoose.set('strictQuery', true);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Crea un usuario de prueba (si no existe)
    let user = await User.findOne({ email: 'testuser@example.com' });
    if (!user) {
      user = new User({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashed_dummy', // Solo para pruebas, asegúrate de hashearlo si vas a usarlo
      });
      await user.save();
    }

    const events = [
      {
        title: 'Taller React Básico',
        description: 'Aprende los fundamentos de React.',
        date: new Date('2025-04-10'),
        location: 'Madrid',
        createdBy: user._id,
        attendees: [],
        image: ''
      },
      {
        title: 'Node.js Intermedio',
        description: 'Construye una API REST con Express y Mongo.',
        date: new Date('2025-05-01'),
        location: 'Barcelona',
        createdBy: user._id,
        attendees: [],
        image: ''
      }
    ];

    await Event.deleteMany();
    await Event.insertMany(events);
    console.log('✅ Eventos insertados');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al insertar:', err);
    process.exit(1);
  }
};

seedData();
