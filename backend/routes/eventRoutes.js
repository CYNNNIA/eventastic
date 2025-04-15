// backend/routes/eventRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} = require('../controllers/eventController'); // ✅ importante

const router = express.Router();

// CRUD
router.post('/create', authMiddleware, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

// Participación
router.post('/:id/join', authMiddleware, joinEvent);
router.post('/:id/leave', authMiddleware, leaveEvent);

module.exports = router;