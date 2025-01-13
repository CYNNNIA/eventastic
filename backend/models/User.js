const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '/uploads/default-avatar.png' },
  createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  joinedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
})

const User = mongoose.model('User', userSchema)
module.exports = User
