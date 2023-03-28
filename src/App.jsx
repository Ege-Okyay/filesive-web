import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SharedFile from './pages/SharedFile'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth/register' element={<Register />} />
      <Route path='/auth/login' element={<Login />} />
      <Route path='/shared-file/:id' element={<SharedFile />} />
    </Routes>
  )
}

export default App
