import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'http://eventastic-cynns-projects.vercel.app/api' 
      : 'http://localhost:5001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adjuntar el token en cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp < currentTime) {
          localStorage.removeItem('token')
          window.location.href = '/login'
          alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
          return Promise.reject('Token expirado')
        }

        config.headers.Authorization = `Bearer ${token}`
      } catch (error) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        alert('Token inválido. Por favor, inicia sesión nuevamente.')
        return Promise.reject('Token inválido')
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Manejo global de errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      alert('No autorizado. Por favor, inicia sesión nuevamente.')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
