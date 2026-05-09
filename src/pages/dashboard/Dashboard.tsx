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

// ── Dados mockados ──────────────────────────────────────────────────────────

const evolucaoMensal = [
  { mes: 'Jan', total: 820 },
  { mes: 'Fev', total: 932 },
  { mes: 'Mar', total: 901 },
  { mes: 'Abr', total: 1049 },
  { mes: 'Mai', total: 1100 },
  { mes: 'Jun', total: 1240 },
]

const volumePorClasse = [
  { name: 'Classe I (Perigosos)', value: 15, color: '#E85D24' },
  { name: 'Classe II-A (Não Inertes)', value: 35, color: '#F2A623' },
  { name: 'Classe II-B (Inertes)', value: 50, color: '#1D9E75' },
]

const volumePorSetor = [
  { setor: 'Eletroeletrônico', volume: 580 },
  { setor: 'Metalúrgico', volume: 420 },
  { setor: 'Químico', volume: 240 },
]

const ultimosMTRs = [
  {
    numero: '#MTR-2026-9904',
    residuo: 'Lodo Galvânico',
    classe: 'CLASSE I',
    classeColor: 'bg-red-100 text-red-700',
    destinadora: 'EcoBest Reciclagem S.A.',
    data: '12/06/2026',
  },
  {
    numero: '#MTR-2026-9902',
    residuo: 'Papelão Prensado',
    classe: 'CLASSE II-B',
    classeColor: 'bg-green-100 text-green-700',
    destinadora: 'Amazon Paper LTDA',
    data: '11/06/2026',
  },
  {
    numero: '#MTR-2026-9888',
    residuo: 'Sucata Metálica Mix',
    classe: 'CLASSE II-A',
    classeColor: 'bg-yellow-100 text-yellow-700',
    destinadora: 'Siderúrgica do Norte',
    data: '11/06/2026',
  },
]

// ── Ícones ──────────────────────────────────────────────────────────────────

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

function IconArrowUp() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="text-[#005F73] font-semibold text-sm">Dashboard</span>
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <IconBell />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <IconSettings />
          </button>
          <div className="flex items-center gap-2 ml-1">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-800">Arthur Mendes</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Gestor Ambiental</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#005F73] text-white text-xs font-bold flex items-center justify-center">
              AM
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto p-6">
        {/* Título */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Painel de Operações
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Visão geral do ciclo de vida dos resíduos · Junho 2026
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#005F73] text-white text-sm font-medium rounded-lg hover:bg-[#004d5e] transition-colors">
            <IconDownload />
            Exportar Relatório
          </button>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Resíduos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                1.240 <span className="text-base font-normal text-gray-400">ton</span>
              </p>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                <IconArrowUp />
                +9% em relação ao mês anterior
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#e6f4f7] flex items-center justify-center text-[#005F73]">
              <IconPackage />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Empresas Destinadoras</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                12 <span className="text-base font-normal text-gray-400">unidades</span>
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">0% — estável</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <IconBuilding />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">MTRs Gerados</p>
              <p className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                450 <span className="text-base font-normal text-gray-400">documentos</span>
              </p>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                <IconArrowUp />
                +6,4% — acima da meta
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <IconDoc />
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Gráfico 1 — Evolução Mensal (Area) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Evolução Mensal de Cadastros</h2>
                <p className="text-xs text-gray-400 mt-0.5">Volume acumulado de resíduos processados (ton)</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005F73] inline-block" />
                resíduos totais
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={evolucaoMensal} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005F73" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#005F73" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  formatter={(v: unknown) => [`${Number(v)} ton`, 'Total']}
                />
                <Area type="monotone" dataKey="total" stroke="#005F73" strokeWidth={2} fill="url(#colorTotal)" dot={{ r: 3, fill: '#005F73' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 2 — Volume por Classe (Pie) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Volume por Classe</h2>
              <p className="text-xs text-gray-400 mt-0.5">Distribuição por classificação NBR 10004</p>
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie
                    data={volumePorClasse}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
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

        {/* Gráfico 3 — Volume por Setor (Bar horizontal) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Volume por Setor Gerador</h2>
            <p className="text-xs text-gray-400 mt-0.5">Toneladas processadas por segmento industrial</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={volumePorSetor} layout="vertical" margin={{ top: 0, right: 16, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit=" ton" />
              <YAxis type="category" dataKey="setor" tick={{ fontSize: 12, fill: '#4b5563' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v: unknown) => [`${Number(v)} ton`, 'Volume']}
              />
              <Bar dataKey="volume" fill="#005F73" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Últimos MTRs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Últimos MTRs Emitidos</h2>
            <button className="text-xs text-[#005F73] font-medium hover:underline">Ver todos</button>
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
                {ultimosMTRs.map((mtr) => (
                  <tr key={mtr.numero} className="hover:bg-gray-50/70 transition-colors cursor-pointer">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-[#005F73]">{mtr.numero}</td>
                    <td className="px-4 py-3 text-gray-700">{mtr.residuo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${mtr.classeColor}`}>
                        {mtr.classe}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{mtr.destinadora}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{mtr.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
