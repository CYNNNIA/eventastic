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

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    if (avatar) {
      formData.append('avatar', avatar)
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5001/api/auth/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      localStorage.setItem('token', data.token)
      alert('Registro exitoso')
      navigate('/events')
    } catch (err) {
      console.error(err.response?.data || err.message)
      setError(
        err.response?.data?.message ||
          'Error al registrarse. Inténtalo de nuevo.'
      )
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
