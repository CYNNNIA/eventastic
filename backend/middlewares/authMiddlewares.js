const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token

  // Verificar si el token está en los encabezados de la solicitud
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1] // Extraer el token

      // Decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Asignar el usuario decodificado a la solicitud
      req.user = await User.findById(decoded.user.id).select('-password')

      // Continuar con la siguiente función en el middleware
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'El token ha expirado, por favor inicia sesión de nuevo.'
        })
      }

      console.error('Error al verificar el token:', error.message)
      return res.status(401).json({ message: 'No autorizado, token inválido.' })
    }
  }

  // Si no hay token en los encabezados
  if (!token) {
    return res
      .status(401)
      .json({ message: 'No autorizado, no se proporcionó un token.' })
  }
}

module.exports = { protect }
