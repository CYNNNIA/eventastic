import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://eventastic-1.onrender.com/api' // Backend en Render en producción
      : 'http://localhost:5001/api', // URL local para desarrollo
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para adjuntar el token en cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Recuperar el token desde el localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adjuntar el token a la cabecera
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;