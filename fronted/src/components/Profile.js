import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import '../styles/Profile.css'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [createdEvents, setCreatedEvents] = useState([])
  const [joinedEvents, setJoinedEvents] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/auth/me')
        setUser(data.user)
        setCreatedEvents(data.createdEvents)
        setJoinedEvents(data.joinedEvents)
      } catch (err) {
        setError('Error al cargar el perfil.')
        navigate('/login')
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLeaveEvent = async (eventId) => {
    try {
      await axiosInstance.post(`/events/${eventId}/leave`)
      setJoinedEvents((prev) => prev.filter((event) => event._id !== eventId))
    } catch {
      alert('Error al salir del evento.')
    }
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`)
      setCreatedEvents((prev) => prev.filter((event) => event._id !== eventId))
    } catch {
      alert('Error al eliminar el evento.')
    }
  }

  if (error) return <p>{error}</p>
  if (!user) return <p>Cargando perfil...</p>

  return (
    <div className='profile-container'>
      <h1>Perfil de Usuario</h1>
      {user.avatar && (
        <img
          src={`http://localhost:5001${user.avatar}`}
          alt='Avatar del usuario'
          className='profile-avatar'
        />
      )}
      <p>
        <strong>Nombre:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <h2>Eventos Creados</h2>
      {createdEvents.length === 0 ? (
        <p>No has creado ningún evento.</p>
      ) : (
        <div className='event-list'>
          {createdEvents.map((event) => (
            <div key={event._id} className='event-card'>
              {event.image && (
                <img
                  src={`http://localhost:5001${event.image}`}
                  alt={event.title}
                />
              )}
              <div className='event-card-content'>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <button onClick={() => handleDeleteEvent(event._id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Eventos Unidos</h2>
      {joinedEvents.length === 0 ? (
        <p>No te has unido a ningún evento.</p>
      ) : (
        <div className='event-list'>
          {joinedEvents.map((event) => (
            <div key={event._id} className='event-card'>
              {event.image && (
                <img
                  src={`http://localhost:5001${event.image}`}
                  alt={event.title}
                />
              )}
              <div className='event-card-content'>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <button onClick={() => handleLeaveEvent(event._id)}>
                  Salir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
