import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyService } from '../../services/company.service'
import { wasteService } from '../../services/waste.service'
import type { Company, Waste } from '../../types'

type ClasseNBR = 'I' | 'II_A' | 'II_B' | null

interface FormData {
  code: string
  description: string
  sector: string
  quantity: string
  unit: string
  companyId: string
  observations: string
}

interface FormErrors {
  description?: string
  sector?: string
  quantity?: string
  unit?: string
  companyId?: string
}

const setores = [
  'Produção',
  'Manutenção Industrial',
  'Manutenção Civil',
  'Tratamento de Efluentes',
  'Almoxarifado',
  'Fundição',
  'Eletroeletrônico',
  'Químico',
  'Metalúrgico',
]

function classifyWaste(description: string): ClasseNBR {
  if (!description || description.length < 3) return null
  const desc = description.toLowerCase()
  const classI = ['lodo', 'galvânico', 'galvanico', 'óleo', 'oleo', 'solvente', 'tinta', 'contaminad', 'perigoso', 'tóxico', 'toxico', 'corrosiv']
  const classIIA = ['escória', 'escoria', 'cinza', 'lama', 'resíduo orgânico', 'residuo organico', 'não inerte', 'nao inerte']
  if (classI.some(k => desc.includes(k))) return 'I'
  if (classIIA.some(k => desc.includes(k))) return 'II_A'
  return 'II_B'
}

function ClasseBadge({ classe }: { classe: ClasseNBR }) {
  if (!classe) return null
  const map: Record<string, { label: string; color: string }> = {
    I:    { label: 'CLASSE I',    color: 'bg-red-100 text-red-700 border border-red-300' },
    II_A: { label: 'CLASSE II-A', color: 'bg-yellow-100 text-yellow-700 border border-yellow-300' },
    II_B: { label: 'CLASSE II-B', color: 'bg-green-100 text-green-700 border border-green-300' },
  }
  const { label, color } = map[classe]
  return (
    <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide ${color}`}>
      {label}
    </span>
  )
}

function IconSave() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function IconHelp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

function IconPackage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

export default function NovoResiduo() {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormData>({
    code: '',
    description: '',
    sector: '',
    quantity: '',
    unit: 'kg',
    companyId: '',
    observations: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [recentWastes, setRecentWastes] = useState<Waste[]>([])
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const classeDetectada: ClasseNBR = classifyWaste(form.description)

  useEffect(() => {
    async function loadData() {
      try {
        setLoadError('')
        const [companiesResponse, wastesResponse] = await Promise.all([
          companyService.list(1, 50),
          wasteService.list(1, 5),
        ])
        setCompanies(companiesResponse.data)
        setRecentWastes(wastesResponse.data)
      } catch (error) {
        console.error('Erro ao carregar dados de cadastro:', error)
        setLoadError('Não foi possível carregar empresas ou últimos lançamentos da API.')
      }
    }

    loadData()
  }, [])

  function handleChange(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.description || form.description.length < 3) newErrors.description = 'Descrição obrigatória (mín. 3 caracteres)'
    if (!form.sector || form.sector.length < 2) newErrors.sector = 'Setor obrigatório'
    if (!form.quantity || Number(form.quantity) <= 0) newErrors.quantity = 'Quantidade deve ser maior que zero'
    if (!form.unit) newErrors.unit = 'Unidade obrigatória'
    if (!form.companyId) newErrors.companyId = 'Empresa obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    setSubmitError('')

    try {
      await wasteService.create({
        code: form.code || undefined,
        description: form.description,
        sector: form.sector,
        quantity: Number(form.quantity),
        unit: form.unit,
        companyId: Number(form.companyId),
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard/residuos'), 900)
    } catch (error) {
      console.error('Erro ao salvar resíduo:', error)
      setSubmitError('Não foi possível salvar o resíduo na API.')
    } finally {
      setLoading(false)
    }
  }

  const totalMesKg = recentWastes
    .filter((waste) => waste.unit === 'kg')
    .reduce((total, waste) => total + waste.quantity, 0)

  return (
    <div className="flex flex-col h-full">

      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Resíduos</span>
          <span className="text-gray-300">/</span>
          <span className="text-[#005F73] font-semibold text-sm">Cadastrar Resíduo</span>
        </div>
        <div className="flex items-center gap-2">
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
                <p className="mt-1">Cadastro conectado a empresas e resíduos reais.</p>
              </div>
            )}
          </div>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><IconHelp /></button>
          <div className="w-8 h-8 rounded-full bg-[#005F73] text-white text-xs font-bold flex items-center justify-center ml-1">
            RS
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-[#f0f5f8]">

        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[17px] text-[#334155] hover:text-[#005F73] transition-colors mb-4 font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar
          </button>

          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
            Cadastrar Resíduo
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Insira as informações técnicas para a rastreabilidade e conformidade ambiental.
          </p>
        </div>

        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Resíduo cadastrado com sucesso! Redirecionando...
          </div>
        )}
        {loadError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            {loadError}
          </div>
        )}
        {submitError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            {submitError}
          </div>
        )}

        <div className="flex gap-5">

          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Descrição do Resíduo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Lodo de Processo Galvânico"
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] transition-all ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Empresa Geradora <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.companyId}
                  onChange={e => handleChange('companyId', e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] transition-all bg-gray-50 ${
                    errors.companyId ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Selecione a empresa...</option>
                  {companies.map(e => (
                    <option key={e.id} value={e.id}>{e.corporateName}</option>
                  ))}
                </select>
                {errors.companyId && <p className="text-xs text-red-500 mt-1">{errors.companyId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Setor Gerador <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.sector}
                  onChange={e => handleChange('sector', e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] transition-all bg-gray-50 ${
                    errors.sector ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Selecione o setor...</option>
                  {setores.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.sector && <p className="text-xs text-red-500 mt-1">{errors.sector}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Classificação NBR 10004
              </label>
              <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg min-h-[40px]">
                {classeDetectada ? (
                  <>
                    <ClasseBadge classe={classeDetectada} />
                    <span className="text-xs text-gray-400">Detectada automaticamente pela descrição</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">Preencha a descrição para classificação automática</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={form.quantity}
                  onChange={e => handleChange('quantity', e.target.value)}
                  className={`flex-1 px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] transition-all ${
                    errors.quantity ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                />
                <select
                  value={form.unit}
                  onChange={e => handleChange('unit', e.target.value)}
                  className="px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] transition-all"
                >
                  <option value="kg">kg</option>
                  <option value="ton">ton</option>
                  <option value="L">L</option>
                  <option value="m³">m³</option>
                </select>
              </div>
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Código do Resíduo <span className="text-gray-400 font-normal normal-case">(opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: F006"
                value={form.code}
                onChange={e => handleChange('code', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Observações Técnicas
              </label>
              <textarea
                placeholder="Detalhes sobre acondicionamento, riscos ou instruções especiais..."
                value={form.observations}
                onChange={e => handleChange('observations', e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F73]/30 focus:border-[#005F73] transition-all resize-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#005F73] text-white text-sm font-semibold rounded-lg hover:bg-[#004d5e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <IconSave />
                  Salvar Resíduo
                </>
              )}
            </button>
          </div>

          <div className="w-72 flex-shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#005F73]"><IconInfo /></span>
                <h3 className="text-sm font-semibold text-gray-800">Guia de Preenchimento</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Certifique-se de que a <strong>Descrição</strong> identifique o resíduo com clareza. Para resíduos <strong>Classe I</strong>, o acondicionamento em bombonas devidamente rotuladas é obrigatório antes da coleta.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                <span>Última atualização</span>
                <span className="font-medium text-gray-600">12/10/2023</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                <span>Norma Aplicada</span>
                <span className="font-medium text-gray-600">NBR 10004:2004</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-[#062630] to-[#005F73] flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="absolute border border-white/20 rounded" style={{
                      width: 40 + i * 15,
                      height: 40 + i * 15,
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 15}deg)`
                    }} />
                  ))}
                </div>
                <div className="text-white/80 z-10">
                  <IconPackage />
                </div>
                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white/60 uppercase tracking-wider">SAFE WORK</span>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dica de Armazenamento</p>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "Mantenha a segregação na fonte para evitar contaminação cruzada e reduzir custos de destinação final."
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Gerado (MÊS)</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                  {(totalMesKg / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} <span className="text-base font-normal text-gray-400">t</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#e6f4f7] flex items-center justify-center text-[#005F73]">
                <IconPackage />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Últimos Lançamentos</h2>
            <button
              type="button"
              onClick={() => navigate('/dashboard/residuos')}
              className="flex items-center gap-1 text-xs text-[#005F73] font-medium hover:underline"
            >
              Ver Histórico Completo <IconArrowRight />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resíduo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Classificação</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qtd.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentWastes.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.description}</td>
                    <td className="px-4 py-3">
                      <ClasseBadge classe={item.class} />
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{item.quantity.toLocaleString('pt-BR')} {item.unit}</td>
                  </tr>
                ))}
                {recentWastes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-sm text-gray-500">
                      Nenhum lançamento retornado pela API.
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
