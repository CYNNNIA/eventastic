import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode' // Importación nombrada correcta // Cambiado para importación directa
import axiosInstance from '../api/axiosInstance' // Asegúrate de que la ruta sea correcta
import '../styles/Events.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const userId = token ? jwtDecode(token).id : null

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axiosInstance.get('/events')
        setEvents(data)
        setLoading(false)
      } catch (err) {
        console.error('Error al cargar los eventos:', err)
        setError('Error al cargar los eventos.')
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleJoinEvent = async (eventId) => {
    setLoadingAction(true)
    try {
      await axiosInstance.post(`/events/${eventId}/join`)
      alert('Te has unido al evento con éxito.')
      navigate('/profile')
    } catch {
      alert('Error al unirse al evento.')
    } finally {
      setLoadingAction(false)
    }
  }

  const handleLeaveEvent = async (eventId) => {
    setLoadingAction(true)
    try {
      await axiosInstance.post(`/events/${eventId}/leave`)
      alert('Has salido del evento con éxito.')
      navigate('/profile')
    } catch {
      alert('Error al salir del evento.')
    } finally {
      setLoadingAction(false)
    }
  }

  if (loading) return <p>Cargando eventos...</p>
  if (error) return <p>{error}</p>

  return (
    <div className='events-container'>
      <h1 className='events-title'>Lista de Eventos</h1>
      {events.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        <div className='events-grid'>
          {events.map((event) => (
            <div key={event._id} className='event-card'>
              {event.image && (
                <img
                  src={`http://localhost:5001${event.image}`}
                  alt={event.title}
                  className='event-image'
                />
              )}
              <div className='event-content'>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Fecha: {new Date(event.date).toLocaleDateString()}</p>
                <p>Ubicación: {event.location}</p>
              </div>
              <div className='event-buttons'>
                <button onClick={() => navigate(`/events/${event._id}`)}>
                  <i className='fas fa-info-circle'></i> Más detalles
                </button>
                {event.attendees.includes(userId) ? (
                  <button
                    onClick={() => handleLeaveEvent(event._id)}
                    disabled={loadingAction}
                  >
                    {loadingAction ? (
                      'Cargando...'
                    ) : (
                      <>
                        <i className='fas fa-sign-out-alt'></i> Salir
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinEvent(event._id)}
                    disabled={loadingAction}
                  >
                    {loadingAction ? (
                      'Cargando...'
                    ) : (
                      <>
                        <i className='fas fa-sign-in-alt'></i> Unirse
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events
