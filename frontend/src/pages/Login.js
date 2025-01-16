import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import '../styles/spinner.css';  // Asegúrate de importar el archivo spinner.css

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Estado para el spinner
  const navigate = useNavigate();

  // Verifica si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/events');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);  // Mostrar el spinner cuando se envía el formulario

    try {
      const { data } = await axios.post(
        'http://localhost:5001/api/auth/login',
        { email, password }
      );

      localStorage.setItem('token', data.token);
      navigate('/events'); // Redirige al usuario a la página de eventos
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);  // Ocultar el spinner después de la respuesta
    }
  };

  return (
    <div className='login-container'>
      <h1>Iniciar sesión</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Correo electrónico'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='login-input'
          required
        />
        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='login-input'
          required
        />
        {error && <p className='login-error'>{error}</p>}
        <button type='submit' className='login-button'>
          {loading ? (
            <div className="spinner"></div>  // Mostrar el spinner si está cargando
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </form>
      <p className='login-footer'>
        ¿No tienes cuenta? <a href='/register'>Regístrate</a>
      </p>
    </div>
  );
};

export default Login;