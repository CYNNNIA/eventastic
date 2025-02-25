const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Usa la URI desde el .env
    console.log('✅ MongoDB conectado correctamente...');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err);
    process.exit(1); // Sale si falla la conexión
  }
};

module.exports = connectDB;