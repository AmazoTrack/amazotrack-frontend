import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import EmpresasList from './pages/empresas/EmpresasList'
import EmpresaDetail from './pages/empresas/EmpresaDetail'
import NovaEmpresa from './pages/empresas/NovaEmpresa'
import MTRsList from './pages/mtrs/MTRsList'
import Dashboard from './pages/dashboard/Dashboard'
import ResiduosDetail from './pages/residuos/ResiduosDetail'
import CadastrarResiduo from './pages/residuos/CadastrarResiduo'
import ResiduosList from './pages/residuos/ResiduosList'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
        {title}
      </h1>
      <p className="text-sm text-gray-500 mt-1">Em desenvolvimento.</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Layout />}>
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