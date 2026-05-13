import { gerarMTRMock } from '../../utils/gerarMTR'
import { useParams, useNavigate } from 'react-router-dom'
import Badge from '../../components/Badge'
import Card from '../../components/Card'
import Button from '../../components/Button'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ClasseNBR = 'I' | 'II_A' | 'II_B'
type StatusResiduo = 'GENERATED' | 'COLLECTED' | 'TRANSPORTED' | 'DISPOSED'

interface Waste {
  id: string
  name: string
  generatedAt: string
  status: StatusResiduo
  hazardClass: string
  nbrClasse: ClasseNBR
  estimatedWeight: number
  packaging: string
  physicalState: string
  nbrCode: string
  nbrDescription: string
  characteristics: string[]
  origin: {
    companyName: string
    sector: string
    city: string
    state: string
  }
  transporter: {
    companyName: string
    licensePlate: string
    vehicleId: string
    driverName: string
  }
  timeline: {
    generated?: { date: string; time: string }
    collected?: { date: string; time: string }
    transported?: { date: string; time: string }
    disposed?: { date: string; time: string }
  }
  route?: { description: string }
  updates: { title: string; time: string }[]
  compliance?: {
    message: string
    daysRemaining: number
    totalDays: number
  }
}

// ─── Mock ─────────────────────────────────────────────────────────────────────

const mockWastes: Waste[] = [
  {
    id: '1',
    name: 'Lodo de Tratamento de Efluentes',
    generatedAt: '2025-04-10T09:15:00',
    status: 'DISPOSED',
    hazardClass: 'Classe I (Perigoso)',
    nbrClasse: 'I',
    estimatedWeight: 4500,
    packaging: 'Big Bag',
    physicalState: 'Sólido',
    nbrCode: 'F006',
    nbrDescription: 'Lodos de tratamento de efluentes de operações de eletrodeposição.',
    characteristics: ['Corrosividade', 'Toxicidade'],
    origin: { companyName: 'Metalúrgica Amazon Tech', sector: 'Setor de Tratamento', city: 'Manaus', state: 'AM' },
    transporter: { companyName: 'EcoLog Transp. Especializados', licensePlate: 'ABC-1234', vehicleId: '04', driverName: 'J. Silva' },
    timeline: {
      generated: { date: '10/04/2025', time: '09:15' },
      collected: { date: '11/04/2025', time: '14:30' },
      transported: { date: '12/04/2025', time: '08:00' },
      disposed: { date: '12/04/2025', time: '16:00' },
    },
    route: { description: 'BR-174 • KM 42' },
    updates: [
      { title: 'Destinação Confirmada', time: 'Há 2 dias por Sistema Automático' },
      { title: 'Manifesto de Saída Confirmado', time: 'Há 3 dias por Sistema Automático' },
    ],
    compliance: { message: 'Certificado de destinação final (CDF) emitido com sucesso.', daysRemaining: 30, totalDays: 30 },
  },
  {
    id: '2',
    name: 'Resíduos de Manutenção Civil',
    generatedAt: '2025-04-06T08:00:00',
    status: 'TRANSPORTED',
    hazardClass: 'Classe II-B (Inerte)',
    nbrClasse: 'II_B',
    estimatedWeight: 12800,
    packaging: 'Caçamba',
    physicalState: 'Sólido',
    nbrCode: 'A001',
    nbrDescription: 'Resíduos de construção civil e demolição.',
    characteristics: ['Inerte'],
    origin: { companyName: 'Indústria de Polímeros Delta S.A.', sector: 'Manutenção Civil', city: 'Manaus', state: 'AM' },
    transporter: { companyName: 'Elogística Transportes Especiais', licensePlate: 'DEF-5678', vehicleId: '02', driverName: 'M. Costa' },
    timeline: {
      generated: { date: '06/04/2025', time: '08:00' },
      collected: { date: '07/04/2025', time: '10:00' },
      transported: { date: '08/04/2025', time: '09:00' },
    },
    route: { description: 'AM-010 • KM 15' },
    updates: [
      { title: 'Manifesto de Saída Confirmado', time: 'Há 14 horas por Sistema Automático' },
      { title: 'Pesagem Balança #02', time: 'Há 16 horas • 12.800kg registrados' },
    ],
    compliance: { message: 'Este resíduo requer certificado de destinação final (CDF) em até 30 dias após o transporte.', daysRemaining: 28, totalDays: 30 },
  },
  {
    id: '3',
    name: 'Embalagens Plásticas Contaminadas',
    generatedAt: '2025-04-03T07:30:00',
    status: 'DISPOSED',
    hazardClass: 'Classe I (Perigoso)',
    nbrClasse: 'I',
    estimatedWeight: 820,
    packaging: 'Tambor',
    physicalState: 'Sólido',
    nbrCode: 'F019',
    nbrDescription: 'Embalagens contaminadas com substâncias perigosas.',
    characteristics: ['Toxicidade'],
    origin: { companyName: 'Metalúrgica Amazon Tech', sector: 'Almoxarifado', city: 'Manaus', state: 'AM' },
    transporter: { companyName: 'EcoLog Transp. Especializados', licensePlate: 'GHI-9012', vehicleId: '01', driverName: 'R. Souza' },
    timeline: {
      generated: { date: '03/04/2025', time: '07:30' },
      collected: { date: '04/04/2025', time: '09:00' },
      transported: { date: '05/04/2025', time: '08:00' },
      disposed: { date: '05/04/2025', time: '14:00' },
    },
    route: { description: 'BR-319 • KM 8' },
    updates: [
      { title: 'Destinação Confirmada', time: 'Há 5 dias' },
      { title: 'Coleta Realizada', time: 'Há 6 dias' },
    ],
    compliance: { message: 'CDF emitido com sucesso dentro do prazo.', daysRemaining: 30, totalDays: 30 },
  },
  {
    id: '4',
    name: 'Escórias de Fundição',
    generatedAt: '2025-04-01T06:00:00',
    status: 'DISPOSED',
    hazardClass: 'Classe II-A (Não Inerte)',
    nbrClasse: 'II_A',
    estimatedWeight: 25000,
    packaging: 'Granel',
    physicalState: 'Sólido',
    nbrCode: 'K061',
    nbrDescription: 'Escórias de processos de fundição de metais ferrosos.',
    characteristics: ['Reatividade'],
    origin: { companyName: 'Indústria de Polímeros Delta S.A.', sector: 'Fundição', city: 'Manaus', state: 'AM' },
    transporter: { companyName: 'EcoDestino Soluções Ambientais', licensePlate: 'JKL-3456', vehicleId: '06', driverName: 'A. Lima' },
    timeline: {
      generated: { date: '01/04/2025', time: '06:00' },
      collected: { date: '01/04/2025', time: '14:00' },
      transported: { date: '02/04/2025', time: '07:00' },
      disposed: { date: '02/04/2025', time: '15:00' },
    },
    route: { description: 'BR-174 • KM 20' },
    updates: [
      { title: 'Destinação Confirmada', time: 'Há 7 dias' },
      { title: 'Pesagem Balança #01', time: 'Há 8 dias • 25.000kg registrados' },
    ],
    compliance: { message: 'CDF emitido com sucesso.', daysRemaining: 30, totalDays: 30 },
  },
  {
    id: '5',
    name: 'Resíduos de Solda e Corte',
    generatedAt: '2025-03-28T10:00:00',
    status: 'GENERATED',
    hazardClass: 'Classe I (Perigoso)',
    nbrClasse: 'I',
    estimatedWeight: 340,
    packaging: 'Tambor',
    physicalState: 'Sólido',
    nbrCode: 'F039',
    nbrDescription: 'Resíduos de processos de solda e corte metálico.',
    characteristics: ['Toxicidade', 'Corrosividade'],
    origin: { companyName: 'Metalúrgica Amazon Tech', sector: 'Manutenção Industrial', city: 'Manaus', state: 'AM' },
    transporter: { companyName: 'EcoDestino Soluções Ambientais', licensePlate: '-', vehicleId: '-', driverName: '-' },
    timeline: {
      generated: { date: '28/03/2025', time: '10:00' },
    },
    route: { description: 'Aguardando coleta' },
    updates: [
      { title: 'MTR Gerado', time: 'Há 3 dias por Sistema Automático' },
    ],
    compliance: { message: 'Aguardando coleta para início do prazo de destinação.', daysRemaining: 30, totalDays: 30 },
  },
  {
    id: '6',
    name: 'Aparas Plásticas',
    generatedAt: '2025-03-22T08:00:00',
    status: 'COLLECTED',
    hazardClass: 'Classe II-B (Inerte)',
    nbrClasse: 'II_B',
    estimatedWeight: 5200,
    packaging: 'Bag',
    physicalState: 'Sólido',
    nbrCode: 'D205',
    nbrDescription: 'Resíduos de plásticos não contaminados.',
    characteristics: ['Inerte'],
    origin: { companyName: 'Indústria de Polímeros Delta S.A.', sector: 'Produção', city: 'Manaus', state: 'AM' },
    transporter: { companyName: 'Reciclagem Norte Verde Ltda', licensePlate: 'MNO-7890', vehicleId: '03', driverName: 'P. Ferreira' },
    timeline: {
      generated: { date: '22/03/2025', time: '08:00' },
      collected: { date: '23/03/2025', time: '11:00' },
    },
    route: { description: 'AM-070 • KM 5' },
    updates: [
      { title: 'Coleta Realizada', time: 'Há 12 dias' },
      { title: 'MTR Gerado', time: 'Há 13 dias' },
    ],
    compliance: { message: 'Aguardando transporte para destinação final.', daysRemaining: 25, totalDays: 30 },
  },
]

// ─── Constantes ───────────────────────────────────────────────────────────────

const STATUS_STEPS = [
  { key: 'generated',   label: 'Gerado',       timelineKey: 'generated'   },
  { key: 'collected',   label: 'Coletado',     timelineKey: 'collected'   },
  { key: 'transported', label: 'Transportado', timelineKey: 'transported' },
  { key: 'disposed',    label: 'Destinado',    timelineKey: 'disposed'    },
] as const

const STATUS_ORDER: Record<StatusResiduo, number> = {
  GENERATED:   0,
  COLLECTED:   1,
  TRANSPORTED: 2,
  DISPOSED:    3,
}

const STATUS_LABEL: Record<StatusResiduo, string> = {
  GENERATED:   'Gerado',
  COLLECTED:   'Coletado',
  TRANSPORTED: 'Em Transporte',
  DISPOSED:    'Destinado',
}

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconTruck({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconArchive() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

function IconMap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconAlert() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconHelp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ResiduosDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const waste = mockWastes.find(w => w.id === id) ?? mockWastes[0]
  const currentStep = STATUS_ORDER[waste.status]

  const compliancePercent = waste.compliance
    ? Math.min(100, Math.round((waste.compliance.daysRemaining / waste.compliance.totalDays) * 100))
    : 0

  return (
    <div className="flex flex-col h-full">

      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard/residuos')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#005F73] transition-colors"
        >
          <IconArrowLeft />
          Detalhe do Resíduo
        </button>
        <div className="flex items-center gap-2">
          {[<IconBell key="bell" />, <IconSettings key="s" />, <IconHelp key="h" />].map((icon, i) => (
            <button key={i} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              {icon}
            </button>
          ))}
          <div className="w-8 h-8 rounded-full bg-[#005F73] text-white text-xs font-bold flex items-center justify-center ml-1">
            AA
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto p-6 bg-[#f0f5f8] space-y-4">

        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge classe={waste.nbrClasse} />
              <span
                className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-md"
                style={{ backgroundColor: '#e6f4f7', color: '#005F73', border: '1px solid #b3dde6' }}
              >
                {STATUS_LABEL[waste.status]}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              {waste.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID: {waste.id} • Gerado em{' '}
              {new Date(waste.generatedAt).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outlined" onClick={() => navigate(`/dashboard/residuos/editar/${waste.id}`)}>
              Editar
            </Button>
            <Button variant="primary" onClick={gerarMTRMock}>
              Gerar MTR
            </Button>
            <Button variant="outlined" disabled className="flex items-center gap-2">
              Avançar Estado <IconLock />
            </Button>
          </div>
        </div>

        {/* Info + NBR */}
        <div className="flex gap-4">
          <Card className="flex-1">
            <div className="grid grid-cols-3 gap-6 pb-5 mb-5 border-b border-gray-100">
              {[
                { label: 'Peso Estimado',    value: `${waste.estimatedWeight.toLocaleString('pt-BR')} kg` },
                { label: 'Acondicionamento', value: waste.packaging },
                { label: 'Estado Físico',    value: waste.physicalState },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{m.label}</p>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Public Sans', sans-serif", color: '#005F73' }}>
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Origem</p>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5" style={{ color: '#005F73' }}>
                    <IconBuilding />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800">{waste.origin.companyName}</p>
                    <p className="text-sm text-gray-500">{waste.origin.sector}</p>
                    <p className="text-sm text-gray-400">{waste.origin.city}, {waste.origin.state}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Transportador</p>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5" style={{ color: '#005F73' }}>
                    <IconTruck size={18} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800">{waste.transporter.companyName}</p>
                    <p className="text-sm text-gray-500">
                      Placa: {waste.transporter.licensePlate} (Veículo {waste.transporter.vehicleId})
                    </p>
                    <p className="text-sm text-gray-400">Motorista: {waste.transporter.driverName}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* NBR */}
          <div className="w-90 flex-shrink-0 rounded-2xl p-6 flex flex-col gap-4" style={{ backgroundColor: '#d6e4ee' }}>
            <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '15px' }}>
              Classificação NBR 10004
            </h3>

            {/* Card código */}
            <div className="bg-white rounded-xl p-5 flex-1 border-l-4 border-red-400">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#374151' }}>Código do Resíduo</p>
              <p className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                {waste.nbrCode}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">{waste.nbrDescription}</p>
            </div>

            {/* Card característica */}
            <div className="bg-white rounded-xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#374151' }}>Característica</p>
              <div className="flex gap-2 flex-wrap">
                {waste.characteristics.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-red-100 text-red-700 border border-red-400"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => {
              const isDone   = i < currentStep
              const isActive = i === currentStep
              const entry    = waste.timeline[step.timelineKey as keyof Waste['timeline']]

              return (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    {/* Ícone com efeito relevo no ativo */}
                    <div
                      className="mb-3 flex items-center justify-center"
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: isActive ? '#e8eef8' : 'transparent',
                        padding: isActive ? 5 : 0,
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 12,
                          backgroundColor: isActive ? '#2563eb' : isDone ? '#005F73' : '#e5e7eb',
                          color: isActive || isDone ? '#fff' : '#9ca3af',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isDone ? <IconCheck /> : isActive ? <IconTruck size={22} /> : <IconArchive />}
                      </div>
                    </div>

                    {/* Label */}
                    <p
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: isActive ? '#2563eb' : isDone ? '#374151' : '#9ca3af' }}
                    >
                      {step.label}
                    </p>

                    {/* Data */}
                    <p
                      className="text-xs mt-0.5 text-center"
                      style={{ color: isActive ? '#3b82f6' : '#9ca3af', fontWeight: isActive ? 600 : 400 }}
                    >
                      {entry
                        ? `${entry.date} - ${entry.time}`
                        : isActive ? 'Em Trânsito' : 'Aguardando MTR'}
                    </p>
                  </div>

                  {/* Linha */}
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className="h-px flex-1 mx-2 mb-8"
                      style={{ backgroundColor: isDone ? '#005F73' : '#e5e7eb' }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Cards inferiores */}
        <div className="grid grid-cols-3 gap-4">

          {/* Rota */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#005F73' }}><IconMap /></span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                Logística
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Rota de Transporte
            </h3>
            <div className="rounded-lg overflow-hidden h-36 relative flex items-end justify-center" style={{ backgroundColor: '#4a7c59' }}>
              <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" viewBox="0 0 300 145">
                {/* Fundo */}
                <rect width="300" height="145" fill="#4a7c59"/>

                {/* Grade densa de ruas */}
                {Array.from({ length: 20 }, (_, i) => i * 8).map((y) => (
                  <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke="#3a6b49" strokeWidth="0.4"/>
                ))}
                {Array.from({ length: 40 }, (_, i) => i * 8).map((x) => (
                  <line key={`v${x}`} x1={x} y1="0" x2={x} y2="145" stroke="#3a6b49" strokeWidth="0.4"/>
                ))}

                {/* Quarteirões — blocos preenchidos */}
                {[
                  [2,2,30,14],[34,2,30,14],[66,2,30,14],[98,2,30,14],[130,2,30,14],[162,2,30,14],[194,2,30,14],[226,2,30,14],[258,2,40,14],
                  [2,18,30,14],[34,18,30,14],[66,18,30,14],[98,18,30,14],[130,18,30,14],[162,18,30,14],[194,18,30,14],[226,18,30,14],[258,18,40,14],
                  [2,34,30,14],[34,34,30,14],[66,34,30,14],[98,34,30,14],[130,34,30,14],[162,34,30,14],[194,34,30,14],
                  [2,50,30,14],[34,50,30,14],[66,50,30,14],[98,50,30,14],[130,50,30,14],[162,50,30,14],[194,50,30,14],[226,50,30,14],[258,50,40,14],
                  [2,66,30,14],[34,66,30,14],[66,66,30,14],[98,66,30,14],[130,66,30,14],[162,66,30,14],[194,66,30,14],[226,66,30,14],[258,66,40,14],
                  [2,82,30,14],[34,82,30,14],[66,82,30,14],[98,82,30,14],[130,82,30,14],[162,82,30,14],[194,82,30,14],[226,82,30,14],[258,82,40,14],
                  [2,98,30,14],[34,98,30,14],[66,98,30,14],[98,98,30,14],[130,98,30,14],[162,98,30,14],[194,98,30,14],[226,98,30,14],[258,98,40,14],
                  [2,114,30,14],[34,114,30,14],[66,114,30,14],[98,114,30,14],[130,114,30,14],[162,114,30,14],[194,114,30,14],[226,114,30,14],[258,114,40,14],
                  [2,130,30,13],[34,130,30,13],[66,130,30,13],[98,130,30,13],[130,130,30,13],[162,130,30,13],[194,130,30,13],[226,130,30,13],[258,130,40,13],
                ].map(([x, y, w, h], i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="#417056" opacity="0.85"/>
                ))}

                {/* Lago azul canto superior direito */}
                <ellipse cx="268" cy="32" rx="22" ry="14" fill="#5a8fa0" opacity="0.75"/>
                <ellipse cx="272" cy="36" rx="14" ry="9" fill="#6aa0b5" opacity="0.5"/>

                {/* Ruas principais mais largas */}
                <line x1="0" y1="72" x2="300" y2="72" stroke="#5a9468" strokeWidth="3.5"/>
                <line x1="150" y1="0" x2="150" y2="145" stroke="#5a9468" strokeWidth="3.5"/>
                <line x1="0" y1="24" x2="300" y2="24" stroke="#5a9468" strokeWidth="2"/>
                <line x1="0" y1="120" x2="300" y2="120" stroke="#5a9468" strokeWidth="2"/>
                <line x1="75" y1="0" x2="75" y2="145" stroke="#5a9468" strokeWidth="2"/>
                <line x1="225" y1="0" x2="225" y2="145" stroke="#5a9468" strokeWidth="2"/>

                {/* Rua diagonal — BR-174 */}
                <path d="M0 145 Q75 100 150 72 Q225 44 300 0" stroke="#5a9468" strokeWidth="3" fill="none" opacity="0.8"/>

                {/* Pin */}
                <circle cx="150" cy="72" r="6" fill="white" opacity="0.95"/>
                <circle cx="150" cy="72" r="3.5" fill="#005F73"/>
              </svg>
              <div className="mb-3 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10" style={{ backgroundColor: '#005F73' }}>
                {waste.route?.description ?? 'Rota não informada'}
              </div>
            </div>
          </Card>

          {/* Atualizações */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#005F73' }}><IconClock /></span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                Auditoria
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-4" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Últimas Atualizações
            </h3>
            <div className="space-y-4">
              {waste.updates.map((u, i) => (
                <div key={i} className="flex gap-3">
                  {/* Primeira barra teal, segunda cinza */}
                  <div
                    className="w-0.5 rounded-full flex-shrink-0 mt-1"
                    style={{ minHeight: 36, backgroundColor: i === 0 ? '#005F73' : '#d1d5db' }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{u.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{u.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Conformidade */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="text-red-500"><IconAlert /></span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                Alerta
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Conformidade Legal
            </h3>
            {waste.compliance && (
              <>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{waste.compliance.message}</p>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Prazo Restante</p>
                    <span className="text-xs font-bold text-gray-800">{waste.compliance.daysRemaining} DIAS</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${compliancePercent}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}