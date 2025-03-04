const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1] // Extraer el token
  }

  if (!token) {
    return res.status(401).json({ msg: 'No autorizado, token no encontrado' })
  }

  try {
    // Decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar usuario en la base de datos
    const user = await User.findById(decoded.user.id).select('-password')
    if (!user) {
      return res
        .status(401)
        .json({ msg: 'No autorizado, usuario no encontrado' })
    }

    req.user = user // Pasar usuario a la petición
    next()
  } catch (error) {
    console.error('❌ Error en autenticación:', error)
    res.status(500).json({ msg: 'Error en la autenticación' })
  }
}

module.exports = { protect }
