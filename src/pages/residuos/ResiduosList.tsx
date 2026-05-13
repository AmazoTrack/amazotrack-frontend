import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import Loading from '../../components/Loading'

type ClasseNBR = 'I' | 'II_A' | 'II_B'
type EstadoAtual = 'Gerado' | 'Transportado' | 'Coletado' | 'Destinado'

interface Residuo {
  id: string
  descricao: string
  classeNbr: ClasseNBR
  setorGerador: string
  estadoAtual: EstadoAtual
  dataCadastro: string
}

const mockResiduos: Residuo[] = [
  { id: 'RES-001', descricao: 'Lodo Galvânico', classeNbr: 'I', setorGerador: 'Eletroeletrônico', estadoAtual: 'Gerado', dataCadastro: '10/05/2026' },
  { id: 'RES-002', descricao: 'Papelão Prensado', classeNbr: 'II_B', setorGerador: 'Logística', estadoAtual: 'Transportado', dataCadastro: '09/05/2026' },
  { id: 'RES-003', descricao: 'Óleo Lubrificante Usado', classeNbr: 'I', setorGerador: 'Manutenção', estadoAtual: 'Destinado', dataCadastro: '08/05/2026' },
  { id: 'RES-004', descricao: 'Sucata Metálica', classeNbr: 'II_A', setorGerador: 'Metalúrgico', estadoAtual: 'Coletado', dataCadastro: '07/05/2026' },
  { id: 'RES-005', descricao: 'Filtros de Ar Óleo', classeNbr: 'I', setorGerador: 'Manutenção', estadoAtual: 'Destinado', dataCadastro: '05/05/2026' },
  { id: 'RES-006', descricao: 'Resíduos de Varrição', classeNbr: 'II_B', setorGerador: 'Limpeza', estadoAtual: 'Gerado', dataCadastro: '04/05/2026' },
  { id: 'RES-007', descricao: 'Baterias Chumbo-Ácido', classeNbr: 'I', setorGerador: 'Eletroeletrônico', estadoAtual: 'Transportado', dataCadastro: '02/05/2026' },
  { id: 'RES-008', descricao: 'EPIs Contaminados', classeNbr: 'I', setorGerador: 'Produção', estadoAtual: 'Coletado', dataCadastro: '01/05/2026' },
]

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EstadoBadge({ estado }: { estado: EstadoAtual }) {
  const map: Record<EstadoAtual, { bg: string; text: string; dot: string }> = {
    Gerado: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
    Coletado: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    Transportado: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    Destinado: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  }
  const { bg, text, dot } = map[estado]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {estado}
    </span>
  )
}

type TabStatus = 'Todos' | 'Gerado' | 'Transportado'

export default function ResiduosList() {
  const navigate = useNavigate()
  const [loading] = useState(false)
  const [residuos] = useState<Residuo[]>(mockResiduos)
  const [statusFilter, setStatusFilter] = useState<TabStatus>('Todos')
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')

  const residuosFiltrados = residuos.filter((r) =>
    statusFilter === 'Todos' ? true : r.estadoAtual === statusFilter
  )

  if (loading) return <Loading />

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Lista de Resíduos
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Gerenciamento e rastreabilidade de resíduos cadastrados no sistema.
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard/residuos/cadastrar')}>
            + Cadastrar Resíduo
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2">
              {(['Todos', 'Gerado', 'Transportado'] as TabStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    statusFilter === status
                      ? 'bg-[#005F73] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">De:</span>
                <Input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} className="text-xs py-1" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Até:</span>
                <Input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} className="text-xs py-1" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['ID', 'Descrição', 'Classe NBR', 'Setor Gerador', 'Estado Atual', 'Data Cadastro', 'Ações'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {residuosFiltrados.map((residuo) => (
                  <tr key={residuo.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-[#005F73]">{residuo.id}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{residuo.descricao}</td>
                    <td className="px-4 py-3"><Badge classe={residuo.classeNbr} /></td>
                    <td className="px-4 py-3 text-gray-600">{residuo.setorGerador}</td>
                    <td className="px-4 py-3"><EstadoBadge estado={residuo.estadoAtual} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{residuo.dataCadastro}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/dashboard/residuos/editar/${residuo.id}`)} className="p-1.5 text-gray-400 hover:text-[#005F73] bg-gray-50 hover:bg-[#e6f4f7] rounded transition-colors">
                          <IconEdit />
                        </button>
                        <button onClick={() => navigate(`/dashboard/residuos/${residuo.id}`)} className="p-1.5 text-gray-400 hover:text-[#005F73] bg-gray-50 hover:bg-[#e6f4f7] rounded transition-colors">
                          <IconEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Exibindo {residuosFiltrados.length} de {residuos.length} resíduos
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-red-100 shadow-sm p-4 border-l-4 border-l-red-500">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Riscos Elevados</p>
            <p className="text-2xl font-bold text-red-600 mt-1">24 <span className="text-sm font-normal text-red-400">registros</span></p>
            <p className="text-xs text-gray-400 mt-1">Requerem atenção imediata</p>
          </div>
          <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-4 border-l-4 border-l-orange-500">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Em Trânsito</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">3.5 <span className="text-sm font-normal text-orange-300">ton</span></p>
            <p className="text-xs text-gray-400 mt-1">A caminho da destinadora</p>
          </div>
          <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4 border-l-4 border-l-green-500">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Meta Reciclagem</p>
            <p className="text-2xl font-bold text-green-600 mt-1">78% <span className="text-sm font-normal text-green-400">atingida</span></p>
            <p className="text-xs text-gray-400 mt-1">Objetivo mensal: 85%</p>
          </div>
        </div>
      </div>
    </div>
  )
}