import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { useParams } from 'react-router-dom'
import jsPDF from 'jspdf'
import { companyService } from '../../services/company.service'
import { mtrService } from '../../services/mtr.service'
import type { Company, MTR as ApiMTR, WasteStatus } from '../../types'

type ClasseNBR = 'I' | 'II_A' | 'II_B'
type StatusMTR = 'DESTINADO' | 'TRANSPORTADO' | 'PENDENTE'

interface MTREntry {
  id: string
  numero: string
  residuo: string
  classificacao: ClasseNBR
  quantidade: string
  dataEntrada: string
  status: StatusMTR
}

function mapWasteStatus(status?: WasteStatus): StatusMTR {
  if (status === 'destinado') return 'DESTINADO'
  if (status === 'transportado' || status === 'coletado') return 'TRANSPORTADO'
  return 'PENDENTE'
}

function formatMTR(mtr: ApiMTR): MTREntry {
  return {
    id: String(mtr.id),
    numero: mtr.number,
    residuo: mtr.waste?.description ?? '—',
    classificacao: (mtr.waste?.class ?? 'II_A') as ClasseNBR,
    quantidade: mtr.waste ? `${mtr.waste.quantity.toLocaleString('pt-BR')} ${mtr.waste.unit}` : '—',
    dataEntrada: new Date(mtr.issueDate).toLocaleDateString('pt-BR'),
    status: mapWasteStatus(mtr.waste?.status),
  }
}

function getLicenseStatus(expiry?: string | null) {
  if (!expiry) {
    return {
      label: 'Não informada',
      detail: 'Sem vencimento cadastrado',
      tone: 'text-gray-700 bg-gray-50 border-gray-200',
      isExpired: false,
    }
  }

  const today = new Date()
  const expiryDate = new Date(expiry)
  const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      label: 'Vencida',
      detail: `Expirou há ${Math.abs(diffDays)} dias`,
      tone: 'text-red-700 bg-red-50 border-red-200',
      isExpired: true,
    }
  }

  if (diffDays <= 60) {
    return {
      label: 'Vencendo em breve',
      detail: `Expira em ${diffDays} dias`,
      tone: 'text-orange-700 bg-orange-50 border-orange-200',
      isExpired: false,
    }
  }

  return {
    label: 'Válida',
    detail: `Expira em ${diffDays} dias`,
    tone: 'text-green-700 bg-green-50 border-green-200',
    isExpired: false,
  }
}

function StatusMTRBadge({ status }: { status: StatusMTR }) {
  const colorMap: Record<StatusMTR, string> = {
    DESTINADO: 'text-[#005F73] bg-[#e6f4f7] border border-[#b3dde6]',
    TRANSPORTADO: 'text-blue-700 bg-blue-50 border border-blue-200',
    PENDENTE: 'text-yellow-700 bg-yellow-50 border border-yellow-200',
  }

  const iconMap: Record<StatusMTR, ReactNode> = {
    DESTINADO: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    TRANSPORTADO: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    PENDENTE: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${colorMap[status]}`}>
      {iconMap[status]}
      {status}
    </span>
  )
}

export default function EmpresaDetail() {
  const navigate = useNavigate()
  const [filtraMTR, setFiltraMTR] = useState('')
  const { id } = useParams<{ id: string }>()
  const [company, setCompany] = useState<Company | null>(null)
  const [mtrs, setMtrs] = useState<MTREntry[]>([])
  const [error, setError] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadCompany() {
      if (!id) return

      try {
        setError('')
        const companyId = Number(id)
        const [companyData, mtrData] = await Promise.all([
          companyService.findById(companyId),
          mtrService.list(),
        ])

        if (!isMounted) return

        setCompany(companyData)
        setMtrs(mtrData.filter((mtr) => mtr.destinationId === companyId).map(formatMTR))
      } catch (err) {
        console.error('Erro ao carregar empresa:', err)
        if (!isMounted) return
        setError('Não foi possível carregar os dados da empresa.')
        setMtrs([])
      }
    }

    loadCompany()

    return () => {
      isMounted = false
    }
  }, [id])

  const mtrsFiltrados = mtrs.filter(
    (m) =>
      filtraMTR === '' ||
      m.numero.toLowerCase().includes(filtraMTR.toLowerCase()) ||
      m.residuo.toLowerCase().includes(filtraMTR.toLowerCase())
  )
  const licenseStatus = getLicenseStatus(company?.licenseExpiry)

  function baixarCertificadoDigital() {
    if (!company) return

    const doc = new jsPDF()
    const issuedAt = new Date().toLocaleDateString('pt-BR')

    doc.setFillColor(6, 38, 48)
    doc.rect(0, 0, 210, 26, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('CERTIFICADO DIGITAL AMAZOTRACK', 14, 17)

    doc.setTextColor(35, 35, 35)
    doc.setFontSize(11)
    doc.text('Dados da empresa', 14, 42)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Razão social: ${company.corporateName}`, 14, 54)
    doc.text(`CNPJ: ${company.cnpj}`, 14, 64)
    doc.text(`Tipo: ${company.type === 'destinadora' ? 'Destinadora' : 'Geradora'}`, 14, 74)
    doc.text(`E-mail: ${company.email ?? 'Não informado'}`, 14, 84)
    doc.text(`Telefone: ${company.phone ?? 'Não informado'}`, 14, 94)

    doc.setFont('helvetica', 'bold')
    doc.text('Licença ambiental', 14, 114)
    doc.setFont('helvetica', 'normal')
    doc.text(`Número da LO: ${company.licenseNumber ?? 'Não informado'}`, 14, 126)
    doc.text(`Órgão emissor: ${company.issuingAgency ?? 'Não informado'}`, 14, 136)
    doc.text(
      `Vencimento: ${company.licenseExpiry ? new Date(company.licenseExpiry).toLocaleDateString('pt-BR') : 'Não informado'}`,
      14,
      146,
    )
    doc.text(`Status: ${licenseStatus.label}`, 14, 156)

    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`Emitido em ${issuedAt} pelo AmazoTrack com dados atuais da API.`, 14, 282)

    doc.save(`certificado-digital-empresa-${company.id}.pdf`)
  }

  if (!company && error) return <div className="p-6 text-red-600">{error}</div>
  if (!company) return <div className="p-6 text-gray-500">Carregando...</div>

  return (
    <div className="flex flex-col h-full">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/empresas')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#005F73] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Detalhes da Empresa
        </button>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSettingsOpen((open) => !open)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Configurações"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            </button>
            {settingsOpen && (
              <div className="absolute right-0 top-9 z-50 w-56 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg">
                <p className="font-semibold text-gray-800">Configurações</p>
                <p className="mt-1">Detalhe conectado ao Railway.</p>
              </div>
            )}
          </div>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#005F73] text-white text-xs font-bold flex items-center justify-center ml-1">
            AA
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-5">
          {/* Left column */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Company Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-[#005F73] text-white text-[11px] font-bold uppercase tracking-wide rounded-md">
                      {company.type === 'destinadora' ? 'Destinadora Final' : 'Geradora'}
                    </span>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[11px] font-bold uppercase tracking-wide rounded-md">
                      Ativo
                    </span>
                  </div>
                  <h1
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "'Public Sans', sans-serif" }}
                  >
                    {company.corporateName}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">CNPJ: {company.cnpj}</p>
                  <div className="grid grid-cols-2 gap-6 mt-5">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                        Endereço Operacional
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Endereço não informado pela API.
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                        Contato Direto
                      </p>
                      <p className="text-sm text-gray-700">{company?.phone ?? 'Não informado'}</p>
                      <a
                        href={company.email ? `mailto:${company.email}` : undefined}
                        className="text-sm text-[#005F73] hover:underline mt-0.5 block"
                      >
                        {company.email ?? 'Não informado'}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 ml-4 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* MTR History */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2
                  className="font-semibold text-gray-900"
                  style={{ fontFamily: "'Public Sans', sans-serif" }}
                >
                  Histórico de Recebimento de Resíduos
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Filtrar MTR..."
                      value={filtraMTR}
                      onChange={(e) => setFiltraMTR(e.target.value)}
                      className="pl-7 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/20 focus:border-[#005F73] w-44 transition-all"
                    />
                  </div>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['MTR No.', 'Resíduo', 'Classificação', 'Quantidade', 'Data Entrada', 'Status', ''].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mtrsFiltrados.map((mtr) => (
                      <tr key={mtr.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-semibold text-[#005F73]">{mtr.numero}</span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-700 max-w-[160px]">{mtr.residuo}</td>
                        <td className="px-4 py-3.5">
                          <Badge classe={mtr.classificacao} />
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{mtr.quantidade}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{mtr.dataEntrada}</td>
                        <td className="px-4 py-3.5">
                          <StatusMTRBadge status={mtr.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {mtrsFiltrados.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                          Nenhum MTR encontrado para esta empresa.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                <span className="text-xs text-gray-500">
                  Exibindo {mtrsFiltrados.length} de {mtrs.length} registros
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Anterior
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#005F73] rounded-lg hover:bg-[#004558] transition-colors">
                    Próximo
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom action cards */}
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
                  title: 'Arquivos e Anexos',
                  sub: 'Documentos não cadastrados',
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
                  title: 'Localização GPS',
                  sub: 'Localização não cadastrada',
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
                  title: 'Métricas de Destinação',
                  sub: `${mtrs.length} MTRs recebidos`,
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></svg>,
                  title: 'Audit Log',
                  sub: `Cadastro criado em ${new Date(company.createdAt).toLocaleDateString('pt-BR')}`,
                },
              ].map((card) => (
                <button
                  key={card.title}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-[#005F73]/30 hover:shadow-md transition-all group"
                >
                  <div className="text-gray-400 group-hover:text-[#005F73] transition-colors mb-2">
                    {card.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{card.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right: License Panel */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-semibold text-gray-900"
                  style={{ fontFamily: "'Public Sans', sans-serif" }}
                >
                  Licença Ambiental
                </h3>
                <span className="text-[#005F73]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
              </div>

              <div className={`${licenseStatus.tone} border rounded-lg p-3 mb-4`}>
                <div className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Status da Validade
                    </p>
                    <p className="text-sm font-semibold mt-0.5">{licenseStatus.label}</p>
                    <p className="text-xs">{licenseStatus.detail}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Número da LO', value: company.licenseNumber ?? 'Não informado' },
                  { label: 'Órgão Emissor', value: company.issuingAgency ?? 'Não informado' },
                  { label: 'Cadastro', value: new Date(company.createdAt).toLocaleDateString('pt-BR') },
                  { label: 'Vencimento', value: company.licenseExpiry ? new Date(company.licenseExpiry).toLocaleDateString('pt-BR') : 'Não informado', red: licenseStatus.isExpired },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className={`text-xs font-semibold ${item.red ? 'text-red-600' : 'text-gray-800'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <Button variant="primary" className="w-full mt-5 justify-center text-xs" onClick={baixarCertificadoDigital}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Baixar Certificado Digital
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
