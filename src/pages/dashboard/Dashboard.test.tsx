import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'

const saveMock = vi.hoisted(() => vi.fn())

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(function MockJsPDF() {
    return {
      setFillColor: vi.fn(),
      rect: vi.fn(),
      setTextColor: vi.fn(),
      setFont: vi.fn(),
      setFontSize: vi.fn(),
      text: vi.fn(),
      save: saveMock,
    }
  }),
}))

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/home']}>
      <Routes>
        <Route path="/dashboard/home" element={<Dashboard />} />
        <Route path="/dashboard/mtrs" element={<div>MTR route</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Dashboard actions', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({
        totals: { wastes: 11, companies: 8, movements: 3 },
        wastesByStatus: [{ status: 'gerado', _count: 5 }],
        wastesByClass: [{ class: 'I', _count: 5 }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([
        {
          id: 1,
          number: 'MTR-2026-0001',
          transporter: 'Transportadora',
          issueDate: '2026-05-14T10:30:55.097Z',
          wasteId: 1,
          destinationId: 2,
          waste: {
            id: 1,
            description: 'Lodo de Tratamento',
            quantity: 10,
            unit: 'kg',
            sector: 'Tratamento',
            class: 'I',
            status: 'gerado',
            createdAt: '2026-05-14T10:30:55.097Z',
            userId: 4,
            companyId: 1,
          },
          destination: {
            id: 2,
            corporateName: 'EcoDestino',
            cnpj: '123',
            type: 'destinadora',
            createdAt: '2026-05-14T10:30:55.097Z',
          },
        },
      ]), { status: 200, headers: { 'Content-Type': 'application/json' } }))
  })

  it('exports a PDF report and navigates to all MTRs', async () => {
    renderDashboard()

    expect(await screen.findByText('MTR-2026-0001')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /exportar relatório/i }))
    expect(saveMock).toHaveBeenCalledWith('relatorio-operacional-amazotrack.pdf')

    await userEvent.click(screen.getByRole('button', { name: /ver todos/i }))
    expect(screen.getByText('MTR route')).toBeInTheDocument()
  })
})
