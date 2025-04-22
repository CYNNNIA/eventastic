import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://eventastic-api.onrender.com/api' // ✅ tu backend en producción (Render)
      : 'http://localhost:5001/api', // solo se usa en desarrollo local
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para añadir el token si existe
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;