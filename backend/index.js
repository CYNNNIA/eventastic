require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path') // Asegúrate de importar 'path'
const multer = require('multer') // Importa Multer

const authRoutes = require('./routes/authRoutes') // Ajusta la ruta según tu estructura
const eventRoutes = require('./routes/eventRoutes') // Ajusta la ruta según tu estructura
const connectDB = require('./config/db') // Conectar a MongoDB desde db.js

const app = express()

// Conectar a MongoDB
connectDB()

// Middleware para CORS
app.use(
  cors({
    origin: ['http://localhost:3000'], // Asegúrate de que sea el puerto correcto
    credentials: true // Permite el uso de cookies y cabeceras en las solicitudes
  })
)

// Middleware para JSON
app.use(express.json())

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')) // Carpeta de destino
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Nombre del archivo
  }
})

const upload = multer({ storage })

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` })
})

// Servir archivos estáticos desde 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

// Puerto
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
