import Login from '../src/pages/Login'
import Register from '../src/pages/Register'
import './App.css'
import Home from './pages/Home'
import 'react-notifications/lib/notifications.css'
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/home' element={<Home />}></Route>
        <Route path='/' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
