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

// Permitir solicitudes desde localhost en desarrollo y Vercel en producción
app.use(cors({
  origin: [
    'http://localhost:3000',        // Permitir localhost en desarrollo
    'https://eventastic-two.vercel.app' // Permitir Vercel en producción
  ],
  credentials: true, // Permitir cookies o encabezados de autorización si los estás utilizando
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Las rutas deben incluir /api
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); // Asegúrate que el prefijo /api está en todas las rutas.

app.get('/', (req, res) => {
  res.send('🚀 API de Eventastic corriendo correctamente...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});