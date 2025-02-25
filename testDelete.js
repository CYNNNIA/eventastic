const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/eventastic', {
  serverSelectionTimeoutMS: 20000,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

(async () => {
  try {
    // Insertar un documento de prueba
    const newUser = new User({ name: 'Test User', email: 'test@example.com', password: '1234' });
    await newUser.save();
    console.log('📥 Documento de prueba añadido');

    // Eliminar el documento
    await User.deleteMany({});
    console.log('✅ Documentos eliminados correctamente');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error durante la eliminación:', err);
    mongoose.connection.close();
  }
})();