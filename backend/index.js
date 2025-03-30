const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Configuración CORS para permitir solicitudes de localhost y Vercel
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Permitir localhost en desarrollo
    'https://eventastic-1.onrender.com',  // Permitir Vercel en producción
  ],
  credentials: true,  // Permitir cookies o encabezados de autorización si se están usando
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); // Asegúrate que el prefijo /api está en todas las rutas.

app.get('/', (req, res) => {
  res.send('🚀 API de Eventastic corriendo correctamente...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});