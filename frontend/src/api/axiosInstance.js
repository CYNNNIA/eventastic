import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://eventastic-api.onrender.com/api', // 🔥 FORZAMOS el backend en producción
  headers: { 'Content-Type': 'application/json' },
});

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