import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/Badge'

type ClasseNBR = 'I' | 'II_A' | 'II_B'
type StatusMTR = 'DESTINADO' | 'TRANSPORTADO' | 'PENDENTE' | 'CANCELADO'

interface MTR {
  id: string
  numero: string
  geradora: string
  destinadora: string
  residuo: string
  classificacao: ClasseNBR
  quantidade: string
  dataEmissao: string
  dataMovimentacao: string
  status: StatusMTR
}

const mockMTRs: MTR[] = [
  {
    id: '1',
    numero: 'MTR-2024-8821',
    geradora: 'Metalúrgica Amazon Tech',
    destinadora: 'EcoDestino Soluções Ambientais',
    residuo: 'Lodo de Tratamento de Efluentes',
    classificacao: 'I',
    quantidade: '4.500 kg',
    dataEmissao: '10/10/2024',
    dataMovimentacao: '12/10/2024',
    status: 'DESTINADO',
  },
  {
    id: '2',
    numero: 'MTR-2024-8790',
    geradora: 'Indústria de Polímeros Delta S.A.',
    destinadora: 'Elogística Transportes Especiais',
    residuo: 'Resíduos de Manutenção Civil',
    classificacao: 'II_B',
    quantidade: '12.800 kg',
    dataEmissao: '06/10/2024',
    dataMovimentacao: '08/10/2024',
    status: 'TRANSPORTADO',
  },
  {
    id: '3',
    numero: 'MTR-2024-8755',
    geradora: 'Metalúrgica Amazon Tech',
    destinadora: 'Reciclagem Norte Verde Ltda',
    residuo: 'Embalagens Plásticas Contaminadas',
    classificacao: 'I',
    quantidade: '820 kg',
    dataEmissao: '03/10/2024',
    dataMovimentacao: '05/10/2024',
    status: 'DESTINADO',
  },
  {
    id: '4',
    numero: 'MTR-2024-8722',
    geradora: 'Indústria de Polímeros Delta S.A.',
    destinadora: 'EcoDestino Soluções Ambientais',
    residuo: 'Escórias de Fundição',
    classificacao: 'II_A',
    quantidade: '25.000 kg',
    dataEmissao: '01/10/2024',
    dataMovimentacao: '02/10/2024',
    status: 'DESTINADO',
  },
  {
    id: '5',
    numero: 'MTR-2024-8698',
    geradora: 'Metalúrgica Amazon Tech',
    destinadora: 'EcoDestino Soluções Ambientais',
    residuo: 'Resíduos de Solda e Corte',
    classificacao: 'I',
    quantidade: '340 kg',
    dataEmissao: '28/09/2024',
    dataMovimentacao: '-',
    status: 'PENDENTE',
  },
  {
    id: '6',
    numero: 'MTR-2024-8650',
    geradora: 'Indústria de Polímeros Delta S.A.',
    destinadora: 'Reciclagem Norte Verde Ltda',
    residuo: 'Aparas Plásticas',
    classificacao: 'II_B',
    quantidade: '5.200 kg',
    dataEmissao: '22/09/2024',
    dataMovimentacao: '-',
    status: 'CANCELADO',
  },
]

function StatusBadge({ status }: { status: StatusMTR }) {
  const map: Record<StatusMTR, { color: string; dot: string }> = {
    DESTINADO: { color: 'text-[#005F73]', dot: 'bg-[#005F73]' },
    TRANSPORTADO: { color: 'text-blue-700', dot: 'bg-blue-500' },
    PENDENTE: { color: 'text-yellow-700', dot: 'bg-yellow-500' },
    CANCELADO: { color: 'text-gray-500', dot: 'bg-gray-400' },
  }
  const { color, dot } = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${color}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

type TabFiltro = 'todos' | 'pendentes' | 'em_transito' | 'concluidos'

export default function MTRsList() {
  const navigate = useNavigate()
  const [tabAtiva, setTabAtiva] = useState<TabFiltro>('todos')
  const [busca, setBusca] = useState('')

  const mtrsFiltrados = mockMTRs.filter((m) => {
    const matchTab =
      tabAtiva === 'todos' ||
      (tabAtiva === 'pendentes' && m.status === 'PENDENTE') ||
      (tabAtiva === 'em_transito' && m.status === 'TRANSPORTADO') ||
      (tabAtiva === 'concluidos' && m.status === 'DESTINADO')
    const matchBusca =
      busca === '' ||
      m.numero.toLowerCase().includes(busca.toLowerCase()) ||
      m.geradora.toLowerCase().includes(busca.toLowerCase()) ||
      m.destinadora.toLowerCase().includes(busca.toLowerCase()) ||
      m.residuo.toLowerCase().includes(busca.toLowerCase())
    return matchTab && matchBusca
  })

  const tabs: { id: TabFiltro; label: string; count?: number }[] = [
    { id: 'todos', label: 'Todos os MTRs' },
    { id: 'pendentes', label: 'Pendentes', count: mockMTRs.filter((m) => m.status === 'PENDENTE').length },
    { id: 'em_transito', label: 'Em Trânsito', count: mockMTRs.filter((m) => m.status === 'TRANSPORTADO').length },
    { id: 'concluidos', label: 'Concluídos', count: mockMTRs.filter((m) => m.status === 'DESTINADO').length },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[#005F73] font-semibold text-sm">MTRs</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar por número, empresa ou resíduo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] w-80 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
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
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Histórico e Rastreabilidade
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manifesto de Transporte de Resíduos — rastreamento completo de movimentações.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exportar
            </button>
            <button
              onClick={() => navigate('/empresas')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#005F73] rounded-lg hover:bg-[#004558] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo MTR
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total de MTRs', value: '128', sub: 'este mês', color: 'text-gray-900' },
            { label: 'Pendentes', value: '03', sub: 'aguardando coleta', color: 'text-yellow-700' },
            { label: 'Em Trânsito', value: '07', sub: 'em movimentação', color: 'text-blue-700' },
            { label: 'Concluídos', value: '118', sub: 'destinação confirmada', color: 'text-[#005F73]' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`} style={{ fontFamily: "'Public Sans', sans-serif" }}>
                {s.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 pt-4 pb-0 border-b border-gray-100">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTabAtiva(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-px ${
                    tabAtiva === tab.id
                      ? 'text-[#005F73] border-[#005F73] bg-[#f0f9fb]'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      tabAtiva === tab.id ? 'bg-[#005F73] text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors mb-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filtros
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Nº MTR', 'Geradora', 'Destinadora', 'Resíduo', 'Classe', 'Quantidade', 'Emissão', 'Movimentação', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mtrsFiltrados.map((mtr) => (
                  <tr
                    key={mtr.id}
                    onClick={() => navigate(`/residuos/${mtr.id}`)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold text-[#005F73]">{mtr.numero}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 max-w-[130px] truncate">{mtr.geradora}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 max-w-[130px] truncate">{mtr.destinadora}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 max-w-[140px] truncate">{mtr.residuo}</td>
                    <td className="px-4 py-3.5">
                      <Badge classe={mtr.classificacao} />
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{mtr.quantidade}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{mtr.dataEmissao}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{mtr.dataMovimentacao}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={mtr.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Exibindo {mtrsFiltrados.length} de 128 registros
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-7 h-7 text-xs rounded-md font-medium transition-colors ${
                    page === 1 ? 'bg-[#005F73] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-1 text-gray-400 text-xs">...</span>
              <button className="w-7 h-7 text-xs rounded-md font-medium text-gray-600 hover:bg-gray-100">32</button>
              <button className="w-7 h-7 text-xs rounded-md text-gray-500 hover:bg-gray-100 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}