import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Aseguramos que la URL termina sin '/' para evitar errores en rutas
const API_URL = 'https://eventastic-production.up.railway.app'

// Crear la instancia de Axios con la configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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
          alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
          window.location.replace('/login')
          return Promise.reject(new Error('Token expirado'))
        }

        config.headers.Authorization = `Bearer ${token}`
      } catch (error) {
        localStorage.removeItem('token')
        alert('Token inválido. Por favor, inicia sesión nuevamente.')
        window.location.replace('/login')
        return Promise.reject(new Error('Token inválido'))
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Manejo global de respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error en la respuesta:', error.response)

      if (error.response.status === 401) {
        localStorage.removeItem('token')
        alert('No autorizado. Por favor, inicia sesión nuevamente.')
        window.location.replace('/login')
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request)
    } else {
      console.error('Error en la configuración de la solicitud:', error.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
