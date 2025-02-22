import React from 'react'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-section about'>
          <h3>Eventastic</h3>
          <p>
            Eventastic es la plataforma perfecta para descubrir, crear y unirte
            a eventos únicos.
          </p>
        </div>
        <div className='footer-section contact'>
          <h3>Contacto</h3>
          <p>Email: contacto@eventastic.com</p>
          <p>Teléfono: +34 123 456 789</p>
        </div>
        <div className='footer-section social'>
          <h3>Síguenos</h3>
          <div className='social-links'>
            <a href='#' aria-label='Facebook'>
              <i className='fab fa-facebook-f'></i>
            </a>
            <a href='#' aria-label='Twitter'>
              <i className='fab fa-twitter'></i>
            </a>
            <a href='#' aria-label='Instagram'>
              <i className='fab fa-instagram'></i>
            </a>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        <p>© 2024 Eventastic | Todos los derechos reservados</p>
      </div>
    </footer>
  )
}

export default Footer
