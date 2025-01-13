const express = require('express')
const {
  register,
  login,
  getMe,
  updateAvatar
} = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddlewares') // Middleware para proteger rutas
const uploadAvatar = require('../middlewares/fileUpload') // Middleware para subir archivos (avatar)

const router = express.Router()

// Rutas públicas
router.post('/register', uploadAvatar.single('avatar'), register) // Registro con avatar
router.post('/login', login) // Iniciar sesión

// Rutas protegidas (requieren autenticación)
router.get('/me', protect, getMe) // Obtener datos del usuario autenticado
router.post('/avatar', protect, uploadAvatar.single('avatar'), updateAvatar) // Subir nuevo avatar

module.exports = router
