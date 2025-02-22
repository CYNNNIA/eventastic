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
    return res.status(401).json({ msg: 'No autorizado, token faltante' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.user.id).select('-password')
    next()
  } catch (error) {
    console.error('Error de autenticación:', error)
    res.status(401).json({ msg: 'Token no válido' })
  }
}

module.exports = { protect }
