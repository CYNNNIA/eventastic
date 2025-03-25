import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axiosInstance from '../api/axiosInstance'
import '../styles/Events.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const userId = token ? jwtDecode(token).user?.id || jwtDecode(token).id : null

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data } = await axiosInstance.get('/api/events');
      setEvents(data);
    } catch (err) {
      console.error('❌ Error al cargar los eventos:', err);
    }
  };

  const handleJoinEvent = async (eventId) => {
    setLoadingAction(true)
    try {
      const { data } = await axiosInstance.post(`/events/${eventId}/join`)
      alert(data.msg || 'Te has unido al evento con éxito.')
      fetchEvents() // Refrescar los eventos tras unirse
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Error al unirse al evento.'
      alert(errorMsg)
    } finally {
      setLoadingAction(false)
    }
  }

  const handleLeaveEvent = async (eventId) => {
    setLoadingAction(true)
    try {
      const { data } = await axiosInstance.post(`/events/${eventId}/leave`)
      alert(data.msg || 'Has salido del evento con éxito.')
      fetchEvents() 
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Error al salir del evento.'
      alert(errorMsg)
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
          {events.map((event) => {
            const isUserJoined = event.attendees?.includes(userId)

            return (
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

                  {isUserJoined ? (
                    <button
                      onClick={() => handleLeaveEvent(event._id)}
                      disabled={loadingAction}
                      className='leave-button'
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
                      className='join-button'
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
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Events
