import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import CreateEvent from './pages/CreateEvent'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

const App = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const decoded = jwtDecode(token)
          if (decoded.exp * 1000 < Date.now()) {
            // Token expirado
            localStorage.removeItem('token')
            navigate('/login')
          }
        } catch (error) {
          // Token inválido
          localStorage.removeItem('token')
          navigate('/login')
        }
      }
    }

    checkTokenValidity()
  }, [navigate])

  return (
    <div className='page-wrapper'>
      <Navbar />
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/events' element={<Events />} />
          <Route path='/events/:id' element={<EventDetails />} />
          <Route
            path='/profile'
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path='/create-event'
            element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppWrapper