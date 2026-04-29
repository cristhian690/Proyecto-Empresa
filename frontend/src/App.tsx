import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Kardex from './pages/Kardex'
import Historial from './pages/Historial'
import SaldosIniciales from './pages/SaldosIniciales'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kardex/:procesamiento_id" element={<Kardex />} />
      <Route path="/historial" element={<Historial />} />
      <Route path="/saldos" element={<SaldosIniciales />} />
    </Routes>
  )
}

export default App