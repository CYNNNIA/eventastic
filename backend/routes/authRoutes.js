const express = require('express');
const { register, login, getMe, updateAvatar, verifyToken } = require('../controllers/authController');
const router = express.Router();

// Ruta para obtener el perfil del usuario (requiere token)
router.get('/me', verifyToken, getMe);  // Aquí usamos verifyToken para proteger la ruta

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para login de usuario
router.post('/login', login);

// Ruta para actualizar el avatar del usuario (requiere token)
router.post('/avatar', verifyToken, updateAvatar);

module.exports = router;