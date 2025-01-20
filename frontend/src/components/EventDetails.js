import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance' 

const EventDetails = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await axiosInstance.get(`/events/${id}`)
        setEvent(data)
      } catch (err) {
        console.error('Error al cargar los detalles del evento:', err)
        setError('Error al cargar los detalles del evento.')
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [id])

  if (loading) return <p>Cargando detalles del evento...</p>
  if (error) return <p>{error}</p>

  return (
    <div className='events-container'>
      <h1 className='events-title'>{event.title}</h1>
      <div className='event-card'>
        {event.image && (
          <img
            src={`http://localhost:5001${event.image}`}
            alt={event.title}
            className='event-image'
          />
        )}
        <div className='event-content'>
          <p>
            <strong>Descripción:</strong> {event.description}
          </p>
          <p>
            <strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Ubicación:</strong> {event.location}
          </p>
        </div>
        <h3>Creado por: {event.createdBy.name}</h3>
        {event.createdBy.avatar && (
          <img
            src={`http://localhost:5001${event.createdBy.avatar}`}
            alt={event.createdBy.name}
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        )}
        <h3>Asistentes</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {event.attendees.map((attendee) => (
            <div key={attendee._id}>
              <p>{attendee.name}</p>
              {attendee.avatar && (
                <img
                  src={`http://localhost:5001${attendee.avatar}`}
                  alt={attendee.name}
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventDetails
