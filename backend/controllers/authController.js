const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Event = require('../models/Event')

// Controlador para el registro de usuarios
const register = async (req, res) => {
  const { name, email, password } = req.body

  // Verificar que todos los campos estén presentes
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: 'Por favor, proporciona todos los campos' })
  }

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' })
    }

    // Crear un nuevo usuario
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Asignar avatar predeterminado si no se subió uno
    const avatarPath = req.file
      ? `/uploads/${req.file.filename}`
      : '/uploads/default-avatar.png'

    user = new User({
      name,
      email,
      password: hashedPassword,
      avatar: avatarPath
    })

    await user.save()

    // Generar y devolver un token JWT
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Tiempo de expiración del token
      (err, token) => {
        if (err) throw err
        res.status(201).json({ token }) // Devolver el token en la respuesta
      }
    )
  } catch (err) {
    console.error('Error en el registro:', err.message)
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

// Controlador para el inicio de sesión
const login = async (req, res) => {
  const { email, password } = req.body

  // Verificar que todos los campos estén presentes
  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: 'Por favor, proporciona todos los campos' })
  }

  try {
    // Verificar si el usuario existe
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' })
    }

    // Comparar las contraseñas
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' })
    }

    // Crear y devolver el token JWT
    const payload = {
      user: { id: user.id }
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Tiempo de expiración del token
      (err, token) => {
        if (err) throw err
        res.status(200).json({ token }) // Devolver el token en la respuesta
      }
    )
  } catch (err) {
    console.error('Error en el inicio de sesión:', err.message)
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

// Controlador para obtener el usuario autenticado
const getMe = async (req, res) => {
  try {
    // Obtener los datos del usuario sin la contraseña
    const user = await User.findById(req.user.id).select('-password')
    const createdEvents = await Event.find({ createdBy: req.user.id })
    const joinedEvents = await Event.find({ attendees: req.user.id })

    res.status(200).json({
      user,
      createdEvents,
      joinedEvents
    })
  } catch (err) {
    console.error('Error al obtener usuario:', err.message)
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

// Controlador para actualizar el avatar del usuario
const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' })
    }

    // Verificar que se haya subido un archivo
    if (!req.file) {
      return res.status(400).json({ msg: 'No se subió ningún archivo' })
    }

    // Actualizar el avatar del usuario
    user.avatar = `/uploads/${req.file.filename}`
    await user.save()

    res.status(200).json({ msg: 'Avatar actualizado con éxito', user })
  } catch (err) {
    console.error('Error al actualizar avatar:', err.message)
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateAvatar
}
