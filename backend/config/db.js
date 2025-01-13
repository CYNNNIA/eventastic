const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado correctamente...');
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;