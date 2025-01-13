const multer = require('multer')
const path = require('path')

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Especificar la carpeta donde se almacenarán los archivos subidos
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    // Crear un nombre único para cada archivo subido
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

// Configurar multer con el almacenamiento definido
const upload = multer({ storage })

module.exports = upload
