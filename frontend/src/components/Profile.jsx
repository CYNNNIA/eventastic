import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../utils/useFetch';
import axiosInstance from '../api/axiosInstance';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { data, loading, error, setData } = useFetch('/auth/me'); 

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error al cargar el perfil.</p>;
  if (!data) {
    console.warn('Usuario no encontrado, redirigiendo a login...');
    navigate('/login');
    return null;
  }

  const { user, createdEvents, joinedEvents } = data;


  const handleDeleteEvent = async (eventId) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);

      if (setData) {
        setData((prev) => ({
          ...prev,
          createdEvents: prev.createdEvents.filter((event) => event._id !== eventId),
        }));
      }

      alert('Evento eliminado correctamente.');
    } catch (error) {
      console.error('❌ Error al eliminar el evento:', error);
      alert('Error al eliminar el evento.');
    }
  };


  const handleLeaveEvent = async (eventId) => {
    try {
      await axiosInstance.post(`/events/${eventId}/leave`);

      if (setData) {
        setData((prev) => ({
          ...prev,
          joinedEvents: prev.joinedEvents.filter((event) => event._id !== eventId),
        }));
      }

      alert('Has salido del evento.');
    } catch (error) {
      console.error('❌ Error al salir del evento:', error);
      alert('Error al salir del evento.');
    }
  };

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
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2>Eventos Creados</h2>
      {createdEvents.length === 0 ? (
        <p>No has creado ningún evento.</p>
      ) : (
        <div className='event-list'>
          {createdEvents.map((event) => (
            <div key={event._id} className='event-card'>
              {event.image && (
                <img src={`http://localhost:5001${event.image}`} alt={event.title} />
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
                <img src={`http://localhost:5001${event.image}`} alt={event.title} />
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
  );
};

export default Profile;