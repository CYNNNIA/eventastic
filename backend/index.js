require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')

const app = express()

// Conectar a MongoDB
connectDB()

// Middleware para CORS
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true
  })
)

// Middleware para JSON
app.use(express.json())

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` })
})

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas principales
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

// Ruta raíz para verificar el estado del servidor
app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🚀')
})

// Puerto del servidor
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
