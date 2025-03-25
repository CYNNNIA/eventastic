const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno desde .env

const connectDB = async () => {
  try {
    const dbURI = process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI  // Producción: Conectar a Mongo Atlas
      : 'mongodb://localhost:27017/eventastic'; // Local

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ Conectado a MongoDB en ${dbURI}`);
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;