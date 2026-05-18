import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ResiduosDetail from './ResiduosDetail'

describe('ResiduosDetail loading', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'jwt-demo')
    vi.stubGlobal('fetch', vi.fn())
  })

  it('renders residue details from the MTR payload when the waste endpoint cannot return it', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({
        error: true,
        message: 'Resíduo não encontrado',
        details: [],
      }), { status: 404, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([
        {
          id: 3,
          number: 'MTR-2026-0003',
          transporter: 'Transportadora Norte',
          issueDate: '2026-05-14T10:30:55.097Z',
          wasteId: 1,
          destinationId: 8,
          waste: {
            id: 1,
            description: 'Lodo industrial',
            quantity: 12,
            unit: 'kg',
            sector: 'ETE',
            class: 'I',
            status: 'gerado',
            createdAt: '2026-05-14T10:30:55.097Z',
            userId: 4,
            companyId: 2,
          },
          destination: {
            id: 8,
            corporateName: 'EcoDestino Manaus',
            cnpj: '12.345.678/0001-90',
            type: 'destinadora',
            createdAt: '2026-05-14T10:30:55.097Z',
          },
        },
      ]), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 2,
        corporateName: 'Geradora AM',
        cnpj: '98.765.432/0001-10',
        type: 'geradora',
        createdAt: '2026-05-14T10:30:55.097Z',
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        data: [],
        total: 0,
        page: 1,
        limit: 100,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))

    render(
      <MemoryRouter initialEntries={['/dashboard/residuos/1']}>
        <Routes>
          <Route path="/dashboard/residuos/:id" element={<ResiduosDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Lodo industrial')).toBeInTheDocument()
    expect(screen.getByText('Geradora AM')).toBeInTheDocument()
    expect(screen.queryByText('Não foi possível carregar o resíduo da API.')).not.toBeInTheDocument()
  })
})
