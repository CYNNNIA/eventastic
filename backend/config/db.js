const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI // Usa la base de datos en la nube en producción
      : 'mongodb://localhost:27017/eventastic'; // Usa la base de datos local en desarrollo

    await mongoose.connect(mongoURI);
    console.log(`✅ Conectado a MongoDB: ${mongoURI}`);
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;