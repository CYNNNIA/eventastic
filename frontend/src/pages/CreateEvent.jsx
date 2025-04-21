import React, { useReducer, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateEvent.css';

const initialState = {
  title: '',
  description: '',
  date: '',
  location: '',
  image: null,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_IMAGE':
      return { ...state, image: action.value };
    case 'SET_LOADING':
      return { ...state, loading: action.value };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

const CreateEvent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para crear un evento.');
      return;
    }

    const formData = new FormData();
    formData.append('title', state.title);
    formData.append('description', state.description);
    formData.append('date', state.date);
    formData.append('location', state.location);
    if (state.image) formData.append('image', state.image);

    dispatch({ type: 'SET_LOADING', value: true });

    try {
      await axiosInstance.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Evento creado con éxito.');
      dispatch({ type: 'RESET_FORM' });
      navigate('/events');
    } catch (error) {
      alert(error.response?.data?.msg || 'Error al crear el evento.');
    } finally {
      dispatch({ type: 'SET_LOADING', value: false });
    }
  }, [state, navigate]);

  return (
    <div className='create-event-page'>
      <div className='create-event-container'>
        <h1 className='create-event-title'>Crear Evento</h1>
        <form className='create-event-form' onSubmit={handleSubmit}>
          <input type='text' placeholder='Título' value={state.title} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })} required />
          <textarea placeholder='Descripción' rows='4' value={state.description} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })} required />
          <input type='date' value={state.date} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'date', value: e.target.value })} required />
          <input type='text' placeholder='Ubicación' value={state.location} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'location', value: e.target.value })} required />
          <input type='file' accept='image/*' onChange={(e) => dispatch({ type: 'SET_IMAGE', value: e.target.files[0] })} />
          <button type='submit' className='create-event-button' disabled={state.loading}>
            {state.loading ? 'Creando...' : 'Crear Evento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;