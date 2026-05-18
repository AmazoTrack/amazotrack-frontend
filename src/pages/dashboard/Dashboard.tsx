import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import apiFetch from '../../services/api'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import type { DashboardSummary, MTR } from '../../types'

function IconPackage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function IconDoc() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  )
}

function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
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

export default function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [mtrsRecentes, setMtrsRecentes] = useState<MTR[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    async function carregarSummary() {
      try {
        const data = await apiFetch<DashboardSummary>('/dashboard/summary', 'GET')
        setSummary(data)
      } catch (error) {
        console.error('Erro ao carregar summary:', error)
      }
    }
    carregarSummary()
  }, [])

  useEffect(() => {
    async function carregarMTRs() {
      try {
        const data = await apiFetch<MTR[]>('/mtrs', 'GET')
        setMtrsRecentes(data.slice(0, 5))
      } catch (error) {
        console.error('Erro ao carregar MTRs:', error)
      }
    }
    carregarMTRs()
  }, [])

  const volumePorClasse = (summary?.wastesByClass ?? []).map((item) => ({
    name: item.class === 'I' ? 'Classe I (Perigosos)' : item.class === 'II_A' ? 'Classe II-A (Não Inertes)' : 'Classe II-B (Inertes)',
    value: item._count,
    color: item.class === 'I' ? '#E85D24' : item.class === 'II_A' ? '#F2A623' : '#1D9E75',
  }))

  const volumePorStatus = (summary?.wastesByStatus ?? []).map((item) => ({
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    volume: item._count,
  }))

  function exportarRelatorio() {
    const doc = new jsPDF()
    doc.setFillColor(6, 38, 48)
    doc.rect(0, 0, 210, 24, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('RELATÓRIO OPERACIONAL — AMAZOTRACK', 14, 15)

    doc.setTextColor(40, 40, 40)
    doc.setFontSize(11)
    doc.text(`Resíduos: ${summary?.totals.wastes ?? 0}`, 14, 40)
    doc.text(`Empresas: ${summary?.totals.companies ?? 0}`, 14, 50)
    doc.text(`Movimentações: ${summary?.totals.movements ?? 0}`, 14, 60)

    doc.setFont('helvetica', 'bold')
    doc.text('Últimos MTRs', 14, 80)
    doc.setFont('helvetica', 'normal')
    let y = 92
    mtrsRecentes.forEach((mtr) => {
      doc.text(`${mtr.number} — ${mtr.waste?.description ?? 'Sem resíduo'} — ${mtr.destination?.corporateName ?? 'Sem destinadora'}`, 14, y)
      y += 8
    })

    doc.save('relatorio-operacional-amazotrack.pdf')
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="text-[#005F73] font-semibold text-sm">Dashboard</span>
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><IconBell /></button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSettingsOpen((open) => !open)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Configurações"
            >
              <IconSettings />
            </button>
            {settingsOpen && (
              <div className="absolute right-0 top-9 z-50 w-56 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg">
                <p className="font-semibold text-gray-800">Configurações</p>
                <p className="mt-1">API Railway conectada via VITE_API_URL.</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-1">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-800">Arthur Mendes</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Gestor Ambiental</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#005F73] text-white text-xs font-bold flex items-center justify-center">AM</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Painel de Operações
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Visão geral do ciclo de vida dos resíduos · Junho 2026</p>
          </div>
          <button
            type="button"
            onClick={exportarRelatorio}
            className="flex items-center gap-2 px-4 py-2 bg-[#005F73] text-white text-sm font-medium rounded-lg hover:bg-[#004d5e] transition-colors"
          >
            <IconDownload />
            Exportar Relatório
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Resíduos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                {summary?.totals?.wastes ?? '—'} <span className="text-base font-normal text-gray-400">registros</span>
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Dados atuais da API</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#e6f4f7] flex items-center justify-center text-[#005F73]"><IconPackage /></div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Empresas Cadastradas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                {summary?.totals?.companies ?? '—'} <span className="text-base font-normal text-gray-400">unidades</span>
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">0% — estável</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><IconBuilding /></div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">MTRs Gerados</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                {summary?.totals?.movements ?? '—'} <span className="text-base font-normal text-gray-400">documentos</span>
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Movimentações registradas</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><IconDoc /></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Resíduos por Status</h2>
                <p className="text-xs text-gray-400 mt-0.5">Distribuição atual no ciclo de vida</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005F73] inline-block" />
                resíduos
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={volumePorStatus} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005F73" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#005F73" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v: unknown) => [`${Number(v)} registros`, 'Total']} />
                <Area type="monotone" dataKey="volume" stroke="#005F73" strokeWidth={2} fill="url(#colorTotal)" dot={{ r: 3, fill: '#005F73' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Volume por Classe</h2>
              <p className="text-xs text-gray-400 mt-0.5">Distribuição por classificação NBR 10004</p>
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie data={volumePorClasse} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                    {volumePorClasse.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => [`${Number(v)}%`, 'Participação']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5 flex-1">
                {volumePorClasse.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-600 leading-tight">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800 ml-2">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Volume por Status</h2>
            <p className="text-xs text-gray-400 mt-0.5">Quantidade de registros em cada etapa</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={volumePorStatus} layout="vertical" margin={{ top: 0, right: 16, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="status" tick={{ fontSize: 12, fill: '#4b5563' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v: unknown) => [`${Number(v)} registros`, 'Volume']} />
              <Bar dataKey="volume" fill="#005F73" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Últimos MTRs Emitidos</h2>
            <button
              type="button"
              onClick={() => navigate('/dashboard/mtrs')}
              className="text-xs text-[#005F73] font-medium hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Código MTR</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resíduo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Classe</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Destinadora</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mtrsRecentes.map((mtr) => {
                  const classeColor = mtr.waste?.class === 'I'
                    ? 'bg-red-100 text-red-700'
                    : mtr.waste?.class === 'II_A'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                  return (
                    <tr key={mtr.id} className="hover:bg-gray-50/70 transition-colors cursor-pointer">
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-[#005F73]">{mtr.number}</td>
                      <td className="px-4 py-3 text-gray-700">{mtr.waste?.description ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${classeColor}`}>
                          {mtr.waste?.class === 'I' ? 'CLASSE I' : mtr.waste?.class === 'II_A' ? 'CLASSE II-A' : 'CLASSE II-B'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{mtr.destination?.corporateName ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(mtr.issueDate).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  )
                })}
                {mtrsRecentes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-sm text-gray-500">
                      Nenhum MTR retornado pela API.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
