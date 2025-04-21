const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  register,
  login,
  getMe,
  updateAvatar,
  verifyToken
} = require('../controllers/authController');

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/avatar', verifyToken, updateAvatar);

module.exports = router;