import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // Ajusta si es necesario
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar el token y errores globales
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Si el token está expirado
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          return Promise.reject('Token expirado');
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // Si el token es inválido o corrupto
        localStorage.removeItem('token');
        window.location.href = '/login';
        alert('Token inválido. Por favor, inicia sesión nuevamente.');
        return Promise.reject('Token inválido');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejo de errores globales (opcional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      alert('No autorizado. Por favor, inicia sesión nuevamente.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;