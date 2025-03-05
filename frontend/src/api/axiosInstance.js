import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://eventastic-production.up.railway.app/api' // URL del backend en producción
      : 'http://localhost:5001/api', // URL en local
  headers: {
    'Content-Type': 'application/json'
  }
})

// 🔹 Interceptor para adjuntar el token en cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        config.headers.Authorization = `Bearer ${token}`

        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp < currentTime) {
          localStorage.removeItem('token')
          alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
          window.location.href = '/login'
          return Promise.reject('Token expirado')
        }
      } catch (error) {
        console.error('❌ Error al decodificar el token:', error)
        localStorage.removeItem('token')
        alert('Token inválido. Por favor, inicia sesión nuevamente.')
        window.location.href = '/login'
        return Promise.reject('Token inválido')
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// 🔹 Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('⚠️ No autorizado. Cerrando sesión...')
        localStorage.removeItem('token')
        alert('No autorizado. Por favor, inicia sesión nuevamente.')
        window.location.href = '/login'
      } else if (error.response.status === 403) {
        alert('No tienes permisos para acceder a esta función.')
      } else if (error.response.status === 500) {
        console.error('❌ Error en el servidor:', error.response.data)
        alert('Error interno del servidor. Inténtalo más tarde.')
      }
    } else {
      console.error('❌ Error de red o servidor no disponible:', error)
      alert('No se pudo conectar con el servidor.')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
