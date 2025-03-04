# Eventastic

Eventastic es una plataforma de gestión de eventos donde los usuarios pueden crear, explorar y unirse a eventos de forma sencilla. También permite la importación de eventos desde un archivo Excel, incluyendo la generación automática de imágenes para los eventos.

## 🚀 Características

- Autenticación de usuarios (registro, inicio de sesión, perfil con avatar).
- Creación de eventos con título, descripción, fecha, ubicación e imagen.
- Unirse y salir de eventos.
- Eliminación de eventos por parte del creador.
- Visualización de detalles de los eventos.
- Importación masiva de eventos desde un archivo Excel.
- Almacenamiento de imágenes en la carpeta `uploads/`.
- API protegida con autenticación mediante JWT.


## 📂 Estructura del Proyecto

```
## 📂 Estructura del proyecto

```
Eventastic/
│── backend/
│   ├── config/
│   │   ├── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── fileUpload.js
│   ├── models/
│   │   ├── Event.js
│   │   ├── Reservation.js
│   │   ├── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   ├── uploads/ (directorio para imágenes subidas)
│   ├── index.js
│   ├── .env
│── frontend/
│   ├── public/
│   │   ├── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js
│   │   ├── components/
│   │   │   ├── EventDetails.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── Profile.jsx
│   │   ├── pages/
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│── eventastic_data.xlsx (archivo de importación de eventos)
│── importExcel.js (script para importar eventos desde Excel)
│── .gitignore
│── package.json
│── README.md
│── vercel.json
```
---

## ⚙️ Configuración del entorno

Para ejecutar el proyecto localmente, sigue estos pasos:

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/cynnnia/eventastic.git
cd eventastic
```

### 2️⃣ Configurar el backend
#### Instalar dependencias
```bash
cd backend
npm install
```
#### Configurar variables de entorno
Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/eventastic
JWT_SECRET=tu_clave_secreta
```
#### Iniciar el backend
```bash
npm run dev
```

### 3️⃣ Configurar el frontend
#### Instalar dependencias
```bash
cd frontend
npm install
```
#### Iniciar el frontend
```bash
npm start
```

El frontend estará disponible en `http://localhost:3000` y el backend en `http://localhost:5001`.

---

## 📤 Importación de eventos desde Excel

Para importar eventos desde un archivo Excel, sigue estos pasos:

1. Coloca el archivo `eventastic_data.xlsx` en la raíz del proyecto.
2. Asegúrate de que el archivo tiene una hoja llamada `Events` con las siguientes columnas:
   - `title`: Título del evento.
   - `description`: Descripción del evento.
   - `date`: Fecha en formato `YYYY-MM-DD`.
   - `location`: Ubicación del evento.
3. Ejecuta el siguiente comando:
   ```bash
   node importExcel.js
   ```
4. Los eventos se guardarán en la base de datos y las imágenes se generarán automáticamente en la carpeta `uploads/`.

---

## 🛠️ Tecnologías utilizadas

### 🔹 Backend
- Node.js
- Express.js
- MongoDB con Mongoose
- Multer (para la subida de imágenes)
- JWT (para autenticación)
- bcrypt.js (para el cifrado de contraseñas)

### 🔹 Frontend
- React.js
- React Router
- Axios (para consumir la API)
- Tailwind CSS (para el diseño)

---

## 🚀 Despliegue en Producción

Si deseas desplegar este proyecto en **Vercel**, sigue estos pasos:

1. Asegúrate de que el backend esté desplegado en **Render**, **Railway** o **Atlas**.
2. En `frontend/package.json`, cambia el proxy del backend a la URL del backend en producción.
3. Ejecuta el siguiente comando desde el frontend:
   ```bash
   vercel
   ```
4. Sigue las instrucciones en la terminal para completar el despliegue.

---

## 📝 Requisitos del Proyecto

✅ Full responsive.
✅ Buen uso de CSS con una estructura clara de estilos.
✅ Uso correcto de `react-router-dom`.
✅ Creación y uso de al menos un **custom hook**.
✅ Implementación de `useReducer` en algún punto clave.
✅ Optimización de re-renderizaciones.
✅ Código modular y bien estructurado.
✅ Proyecto público en GitHub.

---

## ✨ Autor

👤 **Cynn**  
📧 Contacto: [cynthialorenzolopez@gmail.com]

¡Gracias por visitar Eventastic! 🎉

