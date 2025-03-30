const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Verificar si la solicitud tiene un token en los encabezados
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];  // Obtener el token de los encabezados
  }

  if (!token) {
    return res.status(401).json({ msg: 'No autorizado, token no encontrado' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Usar JWT_SECRET del .env
    const user = await User.findById(decoded.user.id).select('-password');  // Buscar al usuario por su id
    if (!user) {
      return res.status(401).json({ msg: 'No autorizado, usuario no encontrado' });
    }

    req.user = user;  // Añadir el usuario a la solicitud
    next();  // Continuar con la solicitud
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ msg: 'Error en la autenticación' });
  }
};

module.exports = { protect };