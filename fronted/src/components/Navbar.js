import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token') // Elimina el token del almacenamiento local
    navigate('/login') // Redirige al usuario a la página de inicio de sesión
    closeMenu()
  }

  const handleProfileClick = () => {
    const token = localStorage.getItem('token') // Verifica si hay un token en el almacenamiento local
    if (!token) {
      navigate('/login') // Si no hay token, redirige a la página de inicio de sesión
    } else {
      navigate('/profile') // Si hay token, redirige al perfil del usuario
    }
    closeMenu()
  }

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar-logo' onClick={closeMenu}>
        Eventastic
      </Link>
      <div className='navbar-toggle' onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <Link to='/events' className='navbar-tab' onClick={closeMenu}>
          Eventos
        </Link>
        <Link to='/create-event' className='navbar-tab' onClick={closeMenu}>
          Crear Evento
        </Link>
        <span className='navbar-tab' onClick={handleProfileClick}>
          Mi Perfil
        </span>
        {localStorage.getItem('token') ? (
          <button className='logout-btn' onClick={handleLogout}>
            Cerrar Sesión
          </button>
        ) : (
          <Link to='/login' className='navbar-tab' onClick={closeMenu}>
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
