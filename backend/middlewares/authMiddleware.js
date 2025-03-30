const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Obtener el token del header Authorization
  if (!token) {
    return res.status(401).json({ msg: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;  // Almacenar el usuario decodificado en el objeto req
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token no válido' });
  }
};

module.exports = authMiddleware;