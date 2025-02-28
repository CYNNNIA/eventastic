const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventastic', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ MongoDB conectado correctamente...')
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error)
    process.exit(1)
  }
}

module.exports = connectDB
