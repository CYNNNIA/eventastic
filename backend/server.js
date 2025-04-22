// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { connectDB, mongoHealthCheck } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

// 📦 Configuración de variables de entorno
dotenv.config();

// 🔌 Conectar a la base de datos
connectDB();

// 🚀 Crear la app de Express
const app = express();

// 🌍 CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://eventastic-1.onrenderhttps://eventastic-api.onrender.com',
    'https://eventastic.vercel.app' // ✅ Añade tu frontend en Vercel si lo usas
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsOptions));

// 🧠 Middleware para leer JSON
app.use(express.json());

// 📁 Servir imágenes subidas (avatares, banners, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🛣️ Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// ❤️ Health Check (opcional pero útil para Render)
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoHealthCheck();
  res.status(mongoStatus.connected ? 200 : 500).json({
    status: 'ok',
    mongo: mongoStatus.status,
    dbName: process.env.MONGO_DB_NAME || 'no definido',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 🏠 Ruta base
app.get('/', (req, res) => {
  res.send('🚀 API de Eventastic corriendo correctamente...');
});

// 🌐 Puerto
const PORT = process.env.PORT || 5001;

// 🟢 Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});