// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const generateToken = (user) => {
  return jwt.sign({ user: { id: user._id } }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'El email ya está registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el registro', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Credenciales inválidas' });

    res.status(200).json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error al iniciar sesión', error: err.message });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded.user.id }; // ✅ Aquí el fix
    next();
  } catch (err) {
    res.status(403).json({ msg: 'Token inválido' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('createdEvents')
      .populate('joinedEvents');

    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      createdEvents: user.createdEvents,
      joinedEvents: user.joinedEvents
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener el perfil', error: err.message });
  }
};

// Verificar si el token ha caducado
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar si el token es válido y no ha caducado
    req.user = decoded.user; // Decodificamos el usuario del token y lo adjuntamos a la solicitud
    next(); // Continuamos con la solicitud
  } catch (error) {
    console.error('❌ Token inválido o caducado:', error);
    return res.status(401).json({ msg: 'Token inválido o caducado' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateAvatar,
  verifyToken, // Añadimos la nueva función de verificación
};