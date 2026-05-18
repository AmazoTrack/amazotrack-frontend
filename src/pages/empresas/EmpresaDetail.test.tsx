import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import EmpresaDetail from './EmpresaDetail'

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

describe('EmpresaDetail actions', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'jwt-demo')
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 8,
        corporateName: 'EcoDestino Manaus',
        cnpj: '12.345.678/0001-90',
        type: 'destinadora',
        licenseNumber: 'LO-2026/001',
        issuingAgency: 'IPAAM',
        licenseExpiry: '2026-12-31T00:00:00.000Z',
        createdAt: '2026-05-14T10:30:55.097Z',
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }))
  })

  it('downloads a digital certificate PDF from API company data', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/empresas/8']}>
        <Routes>
          <Route path="/dashboard/empresas/:id" element={<EmpresaDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('EcoDestino Manaus')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /baixar certificado digital/i }))

    expect(saveMock).toHaveBeenCalledWith('certificado-digital-empresa-8.pdf')
  })
})
