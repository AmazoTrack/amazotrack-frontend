import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import EmpresasList from './EmpresasList'

describe('EmpresasList', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'jwt-demo')
    vi.stubGlobal('fetch', vi.fn())
  })

  it('renders companies returned by the backend contract', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 2,
              corporateName: 'EcoDestino Soluções Ambientais Ltda',
              cnpj: '12.345.678/0001-90',
              type: 'destinadora',
              licenseNumber: 'LO-2023/882-A',
              issuingAgency: 'IPAAM',
              licenseExpiry: '2027-01-15T00:00:00.000Z',
              acceptedWasteTypes: null,
              phone: null,
              email: null,
              createdAt: '2026-05-13T16:04:07.903Z',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    render(
      <MemoryRouter>
        <EmpresasList />
      </MemoryRouter>,
    )

    expect(await screen.findByText('EcoDestino Soluções Ambientais Ltda')).toBeInTheDocument()
    expect(screen.getByText('DESTINADORA')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('https://api.test/companies', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer jwt-demo' }),
    }))
  })
})
