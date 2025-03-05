const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ msg: 'No autorizado, token no encontrado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 🔹 Usar `decoded.id` en lugar de `decoded.user.id`
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res
        .status(401)
        .json({ msg: 'No autorizado, usuario no encontrado' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('❌ Error en autenticación:', error)
    res.status(500).json({ msg: 'Error en la autenticación' })
  }
}

module.exports = { protect }
