// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const dbURI = process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI
      : 'mongodb://localhost:27017/eventastic';

    await mongoose.connect(dbURI);

    console.log(`✅ Conectado a MongoDB en ${dbURI}`);
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1); // Termina la app si no se conecta
  }
};

const mongoHealthCheck = () => {
  const status = mongoose.connection.readyState;
  const message = {
    0: '🟥 Desconectado',
    1: '🟩 Conectado',
    2: '🟨 Conectando...',
    3: '🟧 Desconectando...'
  }[status] || '❓ Estado desconocido';

  return {
    connected: status === 1,
    status: message,
    raw: status
  };
};

module.exports = { connectDB, mongoHealthCheck };