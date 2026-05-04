import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<div className="text-gray-500">Selecione uma opção no menu</div>} />
      </Route>
    </Routes>
  );
}

export default App;