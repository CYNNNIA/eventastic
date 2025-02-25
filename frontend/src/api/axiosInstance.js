import axios from 'axios';

// Configura la base URL de tu API
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // Ajusta si es necesario
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor para añadir el token JWT en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Recupera el token almacenado
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Añade el token al header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ❌ Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expira o es inválido
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ Sesión expirada. Redirigiendo al login...');
      localStorage.removeItem('token'); // Elimina el token
      window.location.href = '/login';  // Redirige al login
    }

    // Manejo genérico de errores
    if (error.response) {
      console.error(`🚨 Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('🚨 No se recibió respuesta del servidor.');
    } else {
      console.error('🚨 Error al configurar la solicitud:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;