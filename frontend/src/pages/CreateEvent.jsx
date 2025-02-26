import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateEvent.css';
import '../styles/spinner.css'; // Para el spinner de carga

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(''); // Estado para errores
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!title || !description || !date || !location) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    if (image) formData.append('image', image);

    setLoading(true); // Mostrar spinner al enviar
    setError(''); // Limpiar errores anteriores

    try {
      await axiosInstance.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('🎉 Evento creado con éxito.');
      navigate('/events'); // Redirige a la lista de eventos
    } catch (error) {
      console.error('❌ Error al crear el evento:', error);
      const errorMsg = error.response?.data?.msg || 'Error al crear el evento. Inténtalo de nuevo.';
      setError(errorMsg);
    } finally {
      setLoading(false); // Ocultar spinner al finalizar
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        <h1 className="create-event-title">Crear Evento</h1>

        {error && <p className="error-message">{error}</p>} {/* Mostrar errores */}

        <form className="create-event-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Descripción"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            className="create-event-button"
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : 'Crear Evento'}
          </button>
        </form>

        <div className="event-info">
          <h3>Condiciones para Crear un Evento</h3>
          <ul>
            <li>El título debe ser claro y representativo.</li>
            <li>La fecha debe ser futura.</li>
            <li>La descripción debe incluir todos los detalles.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
