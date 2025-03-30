import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axiosInstance';
import '../styles/EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [isUserJoined, setIsUserJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await axiosInstance.get(`/events/${id}`);
        setEvent(data);

        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.user.id;
          setIsUserJoined(data.attendees.includes(userId));
        }
      } catch (err) {
        console.error('Error al cargar el evento:', err);
        setError('Error al cargar los detalles del evento.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleJoinEvent = async () => {
    try {
      const { data } = await axiosInstance.post(`/events/${id}/join`);
      setIsUserJoined(true);
      setEvent(data.event);
      alert(data.msg); 
    } catch (error) {
      console.error('Error al unirse al evento:', error);
      alert(error.response?.data?.msg || 'Error al unirse al evento');
    }
  };

  const handleLeaveEvent = async () => {
    try {
      const { data } = await axiosInstance.post(`/events/${id}/leave`);
      setIsUserJoined(false);
      setEvent(data.event);
      alert(data.msg); 
    } catch (error) {
      console.error('Error al salir del evento:', error);
      alert(error.response?.data?.msg || 'Error al salir del evento');
    }
  };

  if (loading) return <p>Cargando detalles del evento...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='event-details-page'>
      <div className='event-details-container-more'>
        <h1>{event.title}</h1>
        <img
          src={`http://localhost:5001${event.image}`}
          alt={event.title}
          className='event-details-image'
        />
        <p><strong>Descripción:</strong> {event.description}</p>
        <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Ubicación:</strong> {event.location}</p>

        <div className='event-details-buttons-more'>
          {isUserJoined ? (
            <button className='leave-event-button' onClick={handleLeaveEvent}>
              Salir del Evento
            </button>
          ) : (
            <button className='join-event-button' onClick={handleJoinEvent}>
              Unirse al Evento
            </button>
          )}
        </div>

        <button
          className='back-to-events-button'
          onClick={() => navigate('/events')}
        >
          Volver a Eventos
        </button>
      </div>
    </div>
  );
};

export default EventDetails;