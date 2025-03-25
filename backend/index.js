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

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://eventastic-two.vercel.app' // ← este es el que importa ahora
  ],
  credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Asegúrate de que `eventRoutes` tiene el prefijo `/api`
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); // ✅ Debe incluir `/api`

app.get('/', (req, res) => {
  res.send('🚀 API de Eventastic corriendo correctamente...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});