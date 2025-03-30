const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');

// Registro de usuario
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatarPath = req.file ? `/uploads/${req.file.filename}` : '/uploads/default-avatar.png';

    user = new User({
      name,
      email,
      password: hashedPassword,
      avatar: avatarPath
    });

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token });
    });
  } catch (err) {
    console.error('Error en el registro:', err.message);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (err) {
    console.error('Error en el inicio de sesión:', err.message);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Obtener usuario autenticado
// Obtener usuario autenticado
const getMe = async (req, res) => {
  try {
    console.log('✅ Usuario autenticado:', req.user); // Confirma que req.user contiene los datos del usuario

    if (!req.user) {
      return res.status(401).json({ msg: 'No autorizado, usuario no encontrado' });
    }

    // Obtener eventos creados y a los que se ha unido
    const createdEvents = await Event.find({ createdBy: req.user.id });
    const joinedEvents = await Event.find({ attendees: req.user.id });

    res.status(200).json({
      user: req.user,  // Asegúrate de devolver todos los datos necesarios del usuario
      createdEvents,
      joinedEvents,
    });
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Actualizar avatar
const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No se subió ningún archivo' });
    }

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ msg: 'Avatar actualizado con éxito', user });
  } catch (err) {
    console.error('Error al actualizar el avatar:', err.message);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Verificar si el token ha caducado
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // El token debe ser enviado en la cabecera Authorization

  console.log('Token recibido:', token); // Log para verificar que el token está llegando

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