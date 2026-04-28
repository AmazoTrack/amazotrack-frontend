import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div className="text-gray-500">Selecione uma opção no menu</div>} />
      </Route>
    </Routes>
  )
}

export default App