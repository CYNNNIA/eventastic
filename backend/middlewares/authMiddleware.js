// backend/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Obtener el token de los encabezados

  if (!token) {
    return res.status(401).json({ msg: 'No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifica que el token es válido y no ha caducado
    req.user = decoded.user;  // Decodifica la información del usuario y la adjunta a la solicitud
    next();  // Continua con la solicitud
  } catch (error) {
    console.error('❌ Token inválido o caducado:', error);
    return res.status(401).json({ msg: 'Token inválido o caducado' });
  }
};

module.exports = authMiddleware;