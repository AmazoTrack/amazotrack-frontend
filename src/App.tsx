import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import EmpresasList from './pages/empresas/EmpresasList'
import EmpresaDetail from './pages/empresas/EmpresaDetail'
import NovaEmpresa from './pages/empresas/NovaEmpresa'
import MTRsList from './pages/mtrs/MTRsList'
import Dashboard from './pages/dashboard/Dashboard'
import ResiduosList from './pages/residuos/ResiduosList'
import ResiduosDetail from './pages/residuos/ResiduosDetail'
import CadastrarResiduo from './pages/residuos/CadastrarResiduo'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/home" replace />} />
        <Route path="home" element={<Dashboard />} />
        <Route path="residuos" element={<ResiduosList />} />
        <Route path="residuos/cadastrar" element={<CadastrarResiduo />} />
        <Route path="residuos/editar/:id" element={<CadastrarResiduo />} />
        <Route path="residuos/:id" element={<ResiduosDetail />} />
        <Route path="empresas" element={<EmpresasList />} />
        <Route path="empresas/nova" element={<NovaEmpresa />} />
        <Route path="empresas/:id" element={<EmpresaDetail />} />
        <Route path="mtrs" element={<MTRsList />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}