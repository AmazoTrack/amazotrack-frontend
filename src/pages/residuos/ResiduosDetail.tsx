import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { companyService } from '../../services/company.service'
import { movementService } from '../../services/movement.service'
import { mtrService } from '../../services/mtr.service'
import { wasteService } from '../../services/waste.service'
import type { Company, Movement, Waste, WasteStatus } from '../../types'

const STATUS_LABEL: Record<WasteStatus, string> = {
  gerado: 'Gerado',
  coletado: 'Coletado',
  transportado: 'Em transporte',
  destinado: 'Destinado',
}

const STATUS_STEPS: WasteStatus[] = ['gerado', 'coletado', 'transportado', 'destinado']

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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

export default function ResiduosDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [waste, setWaste] = useState<Waste | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    async function loadWaste() {
      if (!id) return

      try {
        setLoading(true)
        setError('')
        const wasteId = Number(id)
        if (Number.isNaN(wasteId)) {
          setError('ID de resíduo inválido.')
          return
        }

        let wasteData: Waste

        try {
          wasteData = await wasteService.findById(wasteId)
        } catch (primaryError) {
          const mtrs = await mtrService.list()
          const relatedMtr = mtrs.find((mtr) => mtr.wasteId === wasteId || mtr.waste?.id === wasteId)

          if (!relatedMtr?.waste) {
            throw primaryError
          }

          wasteData = relatedMtr.waste
        }

        setWaste(wasteData)

        const [companyResult, movementResult] = await Promise.allSettled([
          companyService.findById(wasteData.companyId),
          movementService.list(1, 100),
        ])

        if (companyResult.status === 'fulfilled') {
          setCompany(companyResult.value)
        } else {
          setCompany(null)
        }

        if (movementResult.status === 'fulfilled') {
          setMovements(movementResult.value.data.filter((movement) => movement.wasteId === wasteData.id))
        } else {
          setMovements([])
        }
      } catch (err) {
        console.error('Erro ao carregar resíduo:', err)
        setError('Não foi possível carregar o resíduo da API.')
      } finally {
        setLoading(false)
      }
    }

    loadWaste()
  }, [id])

  const currentStep = useMemo(() => waste ? STATUS_STEPS.indexOf(waste.status) : 0, [waste])

  if (loading) return <div className="p-6 text-gray-500">Carregando resíduo...</div>
  if (error || !waste) return <div className="p-6 text-red-600">{error || 'Resíduo não encontrado.'}</div>

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard/residuos')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#005F73] transition-colors"
        >
          <IconArrowLeft />
          Detalhe do Resíduo
        </button>
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
              <p className="mt-1">Detalhe carregado diretamente da API.</p>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-[#f0f5f8] space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge classe={waste.class} />
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-md bg-[#e6f4f7] text-[#005F73] border border-[#b3dde6]">
                {STATUS_LABEL[waste.status]}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              {waste.description}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID: {waste.id} • Gerado em {new Date(waste.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outlined" onClick={() => navigate(`/dashboard/residuos/editar/${waste.id}`)}>
              Editar
            </Button>
            <Button variant="primary" onClick={() => navigate('/dashboard/mtrs')}>
              Ver MTRs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Quantidade</p>
            <p className="text-2xl font-bold text-[#005F73]">{waste.quantity.toLocaleString('pt-BR')} {waste.unit}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Setor Gerador</p>
            <p className="text-lg font-semibold text-gray-800">{waste.sector}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Empresa</p>
            <p className="text-lg font-semibold text-gray-800">{company?.corporateName ?? `Empresa #${waste.companyId}`}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Ciclo de vida</h2>
          <div className="grid grid-cols-4 gap-3">
            {STATUS_STEPS.map((status, index) => (
              <div
                key={status}
                className={`rounded-lg border p-4 ${index <= currentStep ? 'border-[#005F73] bg-[#e6f4f7] text-[#005F73]' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
              >
                <p className="text-xs font-bold uppercase tracking-wide">{STATUS_LABEL[status]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Movimentações</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-5 py-3 text-gray-500">{new Date(movement.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-gray-700">{STATUS_LABEL[movement.type]}</td>
                    <td className="px-4 py-3 text-gray-700">{movement.company?.corporateName ?? `Empresa #${movement.companyId}`}</td>
                    <td className="px-4 py-3 text-gray-500">{movement.notes ?? '—'}</td>
                  </tr>
                ))}
                {movements.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-sm text-gray-500">
                      Nenhuma movimentação registrada para este resíduo.
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
