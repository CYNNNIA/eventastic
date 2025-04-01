// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { connectDB, mongoHealthCheck } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://eventastic-1.onrender.com'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/api/health', (req, res) => {
  const mongoStatus = mongoHealthCheck();
  res.status(mongoStatus.connected ? 200 : 500).json({
    status: 'ok',
    mongo: mongoStatus.status,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('🚀 API de Eventastic corriendo correctamente...');
});

if (!process.env.PORT) {
  console.error('❌ PORT no definido en entorno');
  process.exit(1);
}

const PORT = process.env.PORT;
console.log(`Puerto en producción: ${PORT}`);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
