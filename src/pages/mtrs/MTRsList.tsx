import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/Badge'
import jsPDF from 'jspdf'
import apiFetch from '../../services/api'
import type { MTR as ApiMTR, WasteStatus } from '../../types'

type ClasseNBR = 'I' | 'II_A' | 'II_B'
type StatusMTR = 'DESTINADO' | 'TRANSPORTADO' | 'PENDENTE' | 'CANCELADO'

interface MTR {
  id: string
  wasteId: number | null
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

function mapWasteStatus(status?: WasteStatus): StatusMTR {
  if (status === 'destinado') return 'DESTINADO'
  if (status === 'transportado' || status === 'coletado') return 'TRANSPORTADO'
  return 'PENDENTE'
}

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
  const [mtrs, setMtrs] = useState<MTR[]>([])
  const [error, setError] = useState('')
  const [menuAberto, setMenuAberto] = useState<string | null>(null)

  useEffect(() => {
    async function carregarMTRs() {
      try {
        setError('')
        const data = await apiFetch<ApiMTR[]>('/mtrs', 'GET')
        const formatados = data.map((m) => ({
          id: String(m.id),
          wasteId: m.waste?.id ?? m.wasteId ?? null,
          numero: m.number,
          geradora: m.waste?.companyId ? `Empresa #${m.waste.companyId}` : '—',
          destinadora: m.destination?.corporateName ?? '—',
          residuo: m.waste?.description ?? '—',
          classificacao: (m.waste?.class ?? 'II_A') as ClasseNBR,
          quantidade: m.waste ? `${m.waste.quantity.toLocaleString('pt-BR')} ${m.waste.unit}` : '—',
          dataEmissao: new Date(m.issueDate).toLocaleDateString('pt-BR'),
          dataMovimentacao: '—',
          status: mapWasteStatus(m.waste?.status),
        }))
        setMtrs(formatados)
      } catch (error) {
        console.error('Erro ao carregar MTRs:', error)
        setError('Não foi possível carregar os MTRs da API.')
        setMtrs([])
      }
    }
    carregarMTRs()
  }, [])

  const mtrsFiltrados = mtrs.filter((m) => {
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

  function exportarMTRsPDF() {
    const doc = new jsPDF()
    let y = 20

    doc.setFillColor(6, 38, 48)
    doc.rect(0, 0, 210, 22, 'F')
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('RELATÓRIO DE MTRs — AMAZOTRACK', 14, 14)

    y = 32
    doc.setTextColor(50, 50, 50)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(240, 245, 248)
    doc.rect(14, y - 5, 182, 8, 'F')
    doc.text('Nº MTR', 16, y)
    doc.text('Geradora', 50, y)
    doc.text('Resíduo', 100, y)
    doc.text('Qtd', 155, y)
    doc.text('Status', 175, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    mtrsFiltrados.forEach((mtr) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(mtr.numero, 16, y)
      doc.text(doc.splitTextToSize(mtr.geradora, 45)[0], 50, y)
      doc.text(doc.splitTextToSize(mtr.residuo, 50)[0], 100, y)
      doc.text(mtr.quantidade, 155, y)
      doc.text(mtr.status, 175, y)
      doc.setDrawColor(220, 220, 220)
      doc.line(14, y + 2, 196, y + 2)
      y += 8
    })

    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.text('Documento gerado pelo sistema AmazoTrack', 105, 287, { align: 'center' })
    doc.save('relatorio-mtrs.pdf')
  }

  function exportarMTRPDF(mtr: MTR) {
    const doc = new jsPDF()
    doc.setFillColor(6, 38, 48)
    doc.rect(0, 0, 210, 22, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(`MTR ${mtr.numero}`, 14, 14)

    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Resíduo: ${mtr.residuo}`, 14, 38)
    doc.text(`Classe: ${mtr.classificacao}`, 14, 48)
    doc.text(`Quantidade: ${mtr.quantidade}`, 14, 58)
    doc.text(`Destinadora: ${mtr.destinadora}`, 14, 68)
    doc.text(`Status: ${mtr.status}`, 14, 78)
    doc.save(`${mtr.numero}.pdf`)
  }

  function abrirDetalhesMTR(mtr: MTR) {
    if (!mtr.wasteId) {
      setError('Este MTR não possui resíduo vinculado para abrir detalhes.')
      return
    }

    navigate(`/dashboard/residuos/${mtr.wasteId}`)
  }

  // Stats calculados a partir dos dados reais
  const totalMTRs = mtrs.length
  const totalPendentes = mtrs.filter(m => m.status === 'PENDENTE').length
  const totalTransito = mtrs.filter(m => m.status === 'TRANSPORTADO').length
  const totalConcluidos = mtrs.filter(m => m.status === 'DESTINADO').length

  const tabs: { id: TabFiltro; label: string; count?: number }[] = [
    { id: 'todos', label: 'Todos os MTRs' },
    { id: 'pendentes', label: 'Pendentes', count: totalPendentes },
    { id: 'em_transito', label: 'Em Trânsito', count: totalTransito },
    { id: 'concluidos', label: 'Concluídos', count: totalConcluidos },
  ]

  return (
    <div className="flex flex-col h-full">
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
          <div className="w-8 h-8 rounded-full bg-[#005F73] text-white text-xs font-bold flex items-center justify-center">AM</div>
        </div>
      </header>

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
            <button
              onClick={() => exportarMTRsPDF()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exportar
            </button>
            <button
              onClick={() => navigate('/dashboard/residuos/cadastrar')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#005F73] rounded-lg hover:bg-[#004558] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo MTR
            </button>
          </div>
        </div>

        {/* Stats calculados a partir dos dados reais */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total de MTRs</p>
            <p className="text-2xl font-bold mt-1 text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>{totalMTRs}</p>
            <p className="text-xs text-gray-400 mt-0.5">registros no sistema</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pendentes</p>
            <p className="text-2xl font-bold mt-1 text-yellow-700" style={{ fontFamily: "'Public Sans', sans-serif" }}>{totalPendentes}</p>
            <p className="text-xs text-gray-400 mt-0.5">aguardando coleta</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Em Trânsito</p>
            <p className="text-2xl font-bold mt-1 text-blue-700" style={{ fontFamily: "'Public Sans', sans-serif" }}>{totalTransito}</p>
            <p className="text-xs text-gray-400 mt-0.5">em movimentação</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Concluídos</p>
            <p className="text-2xl font-bold mt-1 text-[#005F73]" style={{ fontFamily: "'Public Sans', sans-serif" }}>{totalConcluidos}</p>
            <p className="text-xs text-gray-400 mt-0.5">destinação confirmada</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {error && (
            <div className="px-4 py-3 text-sm text-red-600 bg-red-50 border-b border-red-100">
              {error}
            </div>
          )}
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
                    onClick={() => abrirDetalhesMTR(mtr)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold text-[#005F73]">{mtr.numero}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 max-w-[130px] truncate">{mtr.geradora}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 max-w-[130px] truncate">{mtr.destinadora}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 max-w-[140px] truncate">{mtr.residuo}</td>
                    <td className="px-4 py-3.5"><Badge classe={mtr.classificacao} /></td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{mtr.quantidade}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{mtr.dataEmissao}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{mtr.dataMovimentacao}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={mtr.status} /></td>
                    <td className="px-4 py-3.5 relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuAberto(menuAberto === mtr.id ? null : mtr.id) }}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                        </svg>
                      </button>
                      {menuAberto === mtr.id && (
                        <div className="absolute right-4 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44">
                          <button onClick={(e) => { e.stopPropagation(); abrirDetalhesMTR(mtr); setMenuAberto(null) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ver detalhes</button>
                          <button onClick={(e) => { e.stopPropagation(); exportarMTRPDF(mtr); setMenuAberto(null) }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Gerar MTR (PDF)</button>
                          <button disabled className="w-full cursor-not-allowed text-left px-4 py-2 text-sm text-gray-400">Cancelar indisponível</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {mtrsFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-6 text-center text-sm text-gray-500">
                      Nenhum MTR encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Exibindo {mtrsFiltrados.length} de {mtrs.length} registros
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
