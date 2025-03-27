const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'No autorizado, token no encontrado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Aquí se verifica el token
    const user = await User.findById(decoded.user.id).select('-password'); // Obtiene el usuario del token
    if (!user) {
      return res.status(401).json({ msg: 'No autorizado, usuario no encontrado' });
    }

    req.user = user; // Asigna el usuario decodificado al request
    next(); // Pasa al siguiente middleware o función
  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    res.status(500).json({ msg: 'Error en la autenticación' });
  }
};

module.exports = { protect };