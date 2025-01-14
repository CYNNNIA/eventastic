import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/Register.css'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Manejar el cambio del avatar
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0])
  }

  // Manejar la sumisión del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    // Validación de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!email.match(emailRegex)) {
      setError('Por favor, ingresa un correo electrónico válido.')
      return
    }

    // Validación de la contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    // Validación de campos vacíos
    if (!name || !email || !password) {
      setError('Por favor, completa todos los campos.')
      return
    }

    // Crear el FormData para enviar los datos al backend
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    if (avatar) {
      formData.append('avatar', avatar)
    }

    try {
      // Realizar la solicitud POST al backend para registrar el usuario
      const { data } = await axios.post(
        'http://localhost:5001/api/auth/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      // Guardar el token en el almacenamiento local y redirigir al usuario
      localStorage.setItem('token', data.token)
      alert('Registro exitoso')
      navigate('/events') // Redirige al usuario a la página de eventos
    } catch (err) {
      // Manejo de errores de registro (por ejemplo, si el correo ya está registrado)
      if (err.response?.data?.msg === 'El usuario ya existe') {
        setError('Este correo electrónico ya está registrado.')
      } else {
        setError('Error al registrarse. Inténtalo de nuevo.')
      }
    }
  }

  return (
    <div className='register-container'>
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Nombre'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Correo electrónico'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='avatar'>Subir avatar</label>
          <input
            type='file'
            id='avatar'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
        <button type='submit'>Registrarse</button>
        {error && <p className='error-message'>{error}</p>}
      </form>
    </div>
  )
}

export default Register