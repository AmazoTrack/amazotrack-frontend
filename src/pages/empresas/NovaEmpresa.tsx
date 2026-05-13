import { companyService } from '../../services/company.service'
import { ApiError } from '../../services/api'
import type { CompanyType } from '../../types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'

type TipoEmpresa = 'GERADORA' | 'DESTINADORA'

interface FormState {
  tipo: TipoEmpresa
  razaoSocial: string
  cnpj: string
  endereco: string
  numeroLicenca: string
  orgaoEmissor: string
  dataValidade: string
  classeI: boolean
  classeIIA: boolean
  classeIIB: boolean
}

const orgaosEmissores = ['IPAAM', 'IBAMA', 'SEMA', 'SEMMAS', 'CETESB', 'FEPAM', 'FEAM']

export default function NovaEmpresa() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    tipo: 'GERADORA',
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    numeroLicenca: '',
    orgaoEmissor: '',
    dataValidade: '',
    classeI: false,
    classeIIA: false,
    classeIIB: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function formatCNPJ(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 14)
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

function validate() {
  const newErrors: Partial<Record<keyof FormState, string>> = {}
  if (!form.razaoSocial.trim()) newErrors.razaoSocial = 'Razão social é obrigatória'
  if (!form.cnpj || form.cnpj.replace(/\D/g, '').length < 14) newErrors.cnpj = 'CNPJ inválido'
  if (!form.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório'
  if (!form.numeroLicenca.trim()) newErrors.numeroLicenca = 'Número da licença é obrigatório'
  if (!form.orgaoEmissor) newErrors.orgaoEmissor = 'Selecione o órgão emissor'
  if (!form.dataValidade) newErrors.dataValidade = 'Data de validade é obrigatória'
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  setLoading(true)

  try {
    await companyService.create({
      corporateName: form.razaoSocial,
      cnpj: form.cnpj.replace(/\D/g, ''),
      type: form.tipo.toLowerCase() as CompanyType,
      licenseNumber: form.numeroLicenca || undefined,
      issuingAgency: form.orgaoEmissor || undefined,
      licenseExpiry: form.dataValidade
        ? new Date(form.dataValidade).toISOString()
        : undefined,
    })
    navigate('/dashboard/empresas')
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 0) {
        navigate('/dashboard/empresas')
        return
      }
    } else {
      setErrors({ razaoSocial: 'Erro ao cadastrar empresa. Tente novamente.' })
    }
  } finally {
    setLoading(false)
  }
}

  const isDestinadora = form.tipo === 'DESTINADORA'

  const classeItems = [
    { key: 'classeI' as const, label: 'Classe I (Perigosos)', color: '#ef4444' },
    { key: 'classeIIA' as const, label: 'Classe II-A (Não Inertes)', color: '#f59e0b' },
    { key: 'classeIIB' as const, label: 'Classe II-B (Inertes)', color: '#22c55e' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Nova Empresa</span>
        <div className="flex items-center gap-2">
          {[
            <svg key="bell" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
            <svg key="settings" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
            <svg key="help" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
          ].map((icon, i) => (
            <button key={i} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              {icon}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-1">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-800">Admin Amazo</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Gestor de Resíduos</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#005F73] text-white text-xs font-bold flex items-center justify-center">
              AA
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'Public Sans', sans-serif" }}
          >
            Cadastro Industrial
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Defina a natureza jurídica e os dados operacionais da nova unidade.
          </p>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {(
            [
              {
                tipo: 'GERADORA' as TipoEmpresa,
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 20h20M4 20V10l8-6 8 6v10"/>
                    <path d="M10 20v-5h4v5"/>
                    <circle cx="12" cy="10" r="2"/>
                  </svg>
                ),
                label: 'Geradora',
                desc: 'Unidades industriais que produzem resíduos em seus processos.',
              },
              {
                tipo: 'DESTINADORA' as TipoEmpresa,
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="1 4 1 10 7 10"/>
                    <polyline points="23 20 23 14 17 14"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                  </svg>
                ),
                label: 'Destinadora',
                desc: 'Empresas licenciadas para recepção, tratamento ou disposição final.',
              },
            ] as const
          ).map(({ tipo, icon, label, desc }) => {
            const isSelected = form.tipo === tipo
            return (
              <button
                key={tipo}
                type="button"
                onClick={() => set('tipo', tipo)}
                className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#005F73] border-[#005F73] text-white shadow-lg'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#005F73]/40 hover:bg-gray-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
                <div className={`mb-3 ${isSelected ? 'text-white' : 'text-[#005F73]'}`}>{icon}</div>
                <p className={`font-bold text-base ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {label}
                </p>
                <p className={`text-sm mt-1 leading-relaxed ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {desc}
                </p>
              </button>
            )
          })}
        </div>

        {/* Form + Right Panel */}
        <div className="flex gap-5">
          {/* Form */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Dados Cadastrais */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005F73" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <h3 className="font-semibold text-gray-800 text-sm">Dados Cadastrais</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  label="RAZÃO SOCIAL"
                  placeholder="Ex: Amazônia Metais S.A."
                  value={form.razaoSocial}
                  onChange={(e) => set('razaoSocial', e.target.value)}
                  error={errors.razaoSocial}
                />
                <Input
                  label="CNPJ"
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj}
                  onChange={(e) => set('cnpj', formatCNPJ(e.target.value))}
                  error={errors.cnpj}
                />
              </div>

              <Input
                label="ENDEREÇO OPERACIONAL"
                placeholder="Rua Industrial, Distrito, Manaus - AM"
                value={form.endereco}
                onChange={(e) => set('endereco', e.target.value)}
                error={errors.endereco}
              />
            </div>

            {/* Licenciamento Ambiental */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005F73" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <h3 className="font-semibold text-gray-800 text-sm">Licenciamento Ambiental</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#005F73]/10 text-[#005F73] text-[10px] font-bold uppercase tracking-wide rounded">
                  Obrigatório
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="NÚMERO DA LICENÇA"
                  placeholder="LO nº 123/2024"
                  value={form.numeroLicenca}
                  onChange={(e) => set('numeroLicenca', e.target.value)}
                  error={errors.numeroLicenca}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Órgão Emissor
                  </label>
                  <div className="relative">
                    <select
                      value={form.orgaoEmissor}
                      onChange={(e) => set('orgaoEmissor', e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 appearance-none bg-white cursor-pointer transition-all ${
                        errors.orgaoEmissor
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-[#005F73]/20 focus:border-[#005F73]'
                      }`}
                    >
                      <option value="">IPAAM</option>
                      {orgaosEmissores.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  {errors.orgaoEmissor && (
                    <span className="text-xs text-red-500">{errors.orgaoEmissor}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Data de Validade
                  </label>
                  <input
                    type="date"
                    value={form.dataValidade}
                    onChange={(e) => set('dataValidade', e.target.value)}
                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.dataValidade
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-[#005F73]/20 focus:border-[#005F73]'
                    }`}
                  />
                  {errors.dataValidade && (
                    <span className="text-xs text-red-500">{errors.dataValidade}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel (Destinadora only) */}
          {isDestinadora && (
            <div className="w-64 flex-shrink-0 flex flex-col gap-4">
              {/* Classes Aceitas */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3
                  className="font-semibold text-gray-800 mb-1"
                  style={{ fontFamily: "'Public Sans', sans-serif" }}
                >
                  Classes Aceitas
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Selecione as classificações NBR 10004 que esta unidade está habilitada a processar.
                </p>
                <div className="space-y-3">
                  {classeItems.map(({ key, label, color }) => (
                    <label
                      key={key}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color, opacity: 0.6 }}
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) => set(key, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-[#005F73] cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Documentação Necessária */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#005F73" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-[10px] font-bold text-[#005F73] uppercase tracking-wider">
                    Documentação Necessária
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'PDF da Licença de Operação (LO)',
                    'Comprovante de Inscrição no CTF',
                    'Alvará de Funcionamento Vigente',
                  ].map((doc) => (
                    <li key={doc} className="flex items-start gap-1.5">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                      <span className="text-xs text-gray-600">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
        <Button variant="secondary" onClick={() => navigate('/dashboard/empresas')}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Salvando...
            </>
          ) : (
            'Finalizar Cadastro'
          )}
        </Button>
      </footer>
    </div>
  )
}
