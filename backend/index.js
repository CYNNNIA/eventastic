require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path') // Importa 'path'
const multer = require('multer') // Importa Multer

const authRoutes = require('./routes/authRoutes') // Rutas de autenticación
const eventRoutes = require('./routes/eventRoutes') // Rutas de eventos
const connectDB = require('./config/db') // Conexión a MongoDB

const app = express()

// Conectar a MongoDB
connectDB()

// Middleware para CORS
app.use(
  cors({
    origin: ['http://localhost:3000'], // Puerto del frontend
    credentials: true // Permitir cookies y cabeceras
  })
)

// Middleware para JSON
app.use(express.json())

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')) // Carpeta de destino
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Nombre único para cada archivo
  }
})

const upload = multer({ storage })

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` })
})

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas principales
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

// Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🚀')
})

// Puerto del servidor
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
