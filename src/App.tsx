import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import EmpresasList from './pages/empresas/EmpresasList'
import EmpresaDetail from './pages/empresas/EmpresaDetail'
import NovaEmpresa from './pages/empresas/NovaEmpresa'
import MTRsList from './pages/mtrs/MTRsList'
import Dashboard from './pages/dashboard/Dashboard'

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
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/empresas" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="residuos" element={<Placeholder title="Resíduos" />} />
        <Route path="empresas" element={<EmpresasList />} />
        <Route path="empresas/nova" element={<NovaEmpresa />} />
        <Route path="empresas/:id" element={<EmpresaDetail />} />
        <Route path="mtrs" element={<MTRsList />} />
      </Route>
    </Routes>
  )
}
