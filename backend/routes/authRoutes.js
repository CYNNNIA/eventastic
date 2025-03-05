const express = require('express');
const { register, login, getMe, updateAvatar } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUpload'); 

const router = express.Router();

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;