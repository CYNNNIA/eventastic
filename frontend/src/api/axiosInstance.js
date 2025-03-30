import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://eventastic-1.onrender.com/api' // URL en producción
      : 'http://localhost:5001/api', // URL en local
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para añadir el token a las cabeceras de cada solicitud
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