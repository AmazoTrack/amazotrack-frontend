import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'

type TipoEmpresa = 'GERADORA' | 'DESTINADORA' | 'TRANSPORTADORA'
type StatusLicenca = 'Regular' | 'Vencido' | 'Alerta'

interface Empresa {
  id: number
  razaoSocial: string
  cnpj: string
  tipo: TipoEmpresa
  licenca: string
  validade: string
  validadeDate: Date
  status: StatusLicenca
}

const mockEmpresas: Empresa[] = [
  {
    id: 1,
    razaoSocial: 'Indústria de Polímeros Delta S.A.',
    cnpj: '12.345.678/0001-90',
    tipo: 'GERADORA',
    licenca: 'LO-2023/882-A',
    validade: '15 Jan 2026',
    validadeDate: new Date('2026-01-15'),
    status: 'Regular',
  },
  {
    id: 2,
    razaoSocial: 'Reciclagem Norte Verde Ltda',
    cnpj: '98.765.432/0001-21',
    tipo: 'DESTINADORA',
    licenca: 'LP-2021/441-B',
    validade: '22 Out 2023',
    validadeDate: new Date('2023-10-22'),
    status: 'Vencido',
  },
  {
    id: 3,
    razaoSocial: 'Elogística Transportes Especiais',
    cnpj: '45.567.890/0002-33',
    tipo: 'TRANSPORTADORA',
    licenca: 'AUT-2023/110',
    validade: '08 Ago 2025',
    validadeDate: new Date('2025-08-08'),
    status: 'Alerta',
  },
  {
    id: 4,
    razaoSocial: 'Metalúrgica Amazon Tech',
    cnpj: '23.111.444/0001-00',
    tipo: 'GERADORA',
    licenca: 'LO-2024/003-B',
    validade: '30 Dez 2027',
    validadeDate: new Date('2027-12-30'),
    status: 'Regular',
  },
]

function TipoBadge({ tipo }: { tipo: TipoEmpresa }) {
  const map: Record<TipoEmpresa, string> = {
    GERADORA: 'bg-red-50 text-red-700 border border-red-200',
    DESTINADORA: 'bg-blue-50 text-blue-700 border border-blue-200',
    TRANSPORTADORA: 'bg-orange-50 text-orange-700 border border-orange-200',
  }
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${map[tipo]}`}>
      {tipo}
    </span>
  )
}

function StatusBadge({ status }: { status: StatusLicenca }) {
  const map: Record<StatusLicenca, { dot: string; text: string }> = {
    Regular: { dot: 'bg-green-500', text: 'text-green-700' },
    Vencido: { dot: 'bg-red-500', text: 'text-red-600' },
    Alerta: { dot: 'bg-yellow-500', text: 'text-yellow-700' },
  }
  const { dot, text } = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {status}
    </span>
  )
}

function IconShield() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function IconFilter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function IconDots() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  )
}

type TabFiltro = 'todas' | 'geradoras' | 'destinadoras' | 'transportadoras'

export default function EmpresasList() {
  const navigate = useNavigate()
  const [tabAtiva, setTabAtiva] = useState<TabFiltro>('todas')
  const [busca, setBusca] = useState('')

  const empresasFiltradas = mockEmpresas.filter((e) => {
    const matchTab =
      tabAtiva === 'todas' ||
      (tabAtiva === 'geradoras' && e.tipo === 'GERADORA') ||
      (tabAtiva === 'destinadoras' && e.tipo === 'DESTINADORA') ||
      (tabAtiva === 'transportadoras' && e.tipo === 'TRANSPORTADORA')
    const matchBusca =
      busca === '' ||
      e.razaoSocial.toLowerCase().includes(busca.toLowerCase()) ||
      e.cnpj.includes(busca)
    return matchTab && matchBusca
  })

  const tabs: { id: TabFiltro; label: string }[] = [
    { id: 'todas', label: 'Todas as Empresas' },
    { id: 'geradoras', label: 'Geradoras' },
    { id: 'destinadoras', label: 'Destinadoras' },
    { id: 'transportadoras', label: 'Transportadoras' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[#005F73] font-semibold text-sm">Empresas</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar por CNPJ ou Razão..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] w-64 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <IconBell />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <IconSettings />
          </button>
          <div className="flex items-center gap-2 ml-1">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-800">Eng. Roberto Silva</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Gestor Ambiental</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#005F73] text-white text-xs font-bold flex items-center justify-center">
              RS
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Page title row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Gerenciamento de Parceiros
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Controle de conformidade e licenças das empresas cadastradas.
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard/empresas/nova')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Cadastrar Empresa
          </Button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Tabs + Filtros */}
          <div className="flex items-center justify-between px-4 pt-4 pb-0 border-b border-gray-100">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTabAtiva(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-px ${
                    tabAtiva === tab.id
                      ? 'text-[#005F73] border-[#005F73] bg-[#f0f9fb]'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors mb-1">
              <IconFilter />
              Filtros Avançados
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Razão Social / CNPJ
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Licença Ambiental
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Validade
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {empresasFiltradas.map((empresa) => {
                  const isVencido = empresa.status === 'Vencido'
                  return (
                    <tr
                      key={empresa.id}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/empresas/${empresa.id}`)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 group-hover:text-[#005F73] transition-colors">
                          {empresa.razaoSocial}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{empresa.cnpj}</p>
                      </td>
                      <td className="px-4 py-4">
                        <TipoBadge tipo={empresa.tipo} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <span className="text-[#005F73]"><IconShield /></span>
                          <span className="text-sm">{empresa.licenca}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${isVencido ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                          {empresa.validade}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={empresa.status} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <IconDots />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Exibindo {empresasFiltradas.length} de 128 empresas
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-7 h-7 text-xs rounded-md font-medium transition-colors ${
                    page === 1
                      ? 'bg-[#005F73] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-1 text-gray-400 text-xs">...</span>
              <button className="w-7 h-7 text-xs rounded-md font-medium text-gray-600 hover:bg-gray-100">
                32
              </button>
              <button className="w-7 h-7 text-xs rounded-md text-gray-500 hover:bg-gray-100 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Geradoras</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                84
              </p>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                +12% este mês
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#e6f4f7] flex items-center justify-center text-[#005F73]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="9" width="18" height="13" rx="2"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Licenças a Vencer</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                07
              </p>
              <p className="text-xs text-orange-500 font-medium mt-1">Ação necessária</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Abrangência Regional</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                12
              </p>
              <p className="text-xs text-gray-500 mt-1">Estados Brasileiros atendidos</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
