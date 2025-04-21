const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

// ✅ Generar token JWT
const generateToken = (user) => {
  return jwt.sign({ user: { id: user._id } }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ✅ REGISTRO con subida de avatar
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file?.path; // Ruta del archivo subido (si se subió avatar)

    // Validación
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    // Devolver token y datos del usuario
    return res.status(201).json({
      token: generateToken(newUser),
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (err) {
    console.error('❌ Error en el registro:', err);
    res.status(500).json({ msg: 'Error en el registro', error: err.message });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    res.status(200).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('❌ Error al iniciar sesión:', err);
    res.status(500).json({ msg: 'Error al iniciar sesión', error: err.message });
  }
};

// ✅ PERFIL (requiere autenticación)
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
        avatar: user.avatar,
      },
      createdEvents: user.createdEvents,
      joinedEvents: user.joinedEvents,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener perfil', error: err.message });
  }
};

// ✅ Verificar token JWT como middleware
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded.user.id };
    next();
  } catch (err) {
    console.error('❌ Token inválido:', err);
    res.status(403).json({ msg: 'Token inválido o caducado' });
  }
};

// (Opcional) actualizar avatar si lo usas
exports.updateAvatar = async (req, res) => {
  try {
    const avatar = req.file?.path;
    if (!avatar) return res.status(400).json({ msg: 'No se proporcionó imagen' });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );

    res.status(200).json({
      msg: 'Avatar actualizado',
      avatar: updatedUser.avatar,
    });
  } catch (err) {
    console.error('❌ Error al actualizar avatar:', err);
    res.status(500).json({ msg: 'Error al actualizar avatar', error: err.message });
  }
};