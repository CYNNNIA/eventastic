import axios from 'axios';

// Crear una instancia de Axios con la configuración adecuada
const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://eventastic-1.onrender.com/api'  // URL de producción (Render)
      : 'http://localhost:5001/api',  // URL en local
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para agregar el token de autorización en las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Agregar el token en las cabeceras
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;