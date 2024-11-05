import { useSelector } from 'react-redux'
import Login from '../src/pages/Login'
import Register from '../src/pages/Register'
import './App.css'
import Home from './pages/Home'
import 'react-notifications/lib/notifications.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const currentUser = useSelector((state) => state.users.currentUser)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={currentUser === null ? <Navigate to='/' /> : <Home />} />
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
