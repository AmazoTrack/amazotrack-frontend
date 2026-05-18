import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MTRsList from './MTRsList'

describe('MTRsList', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'jwt-demo')
    vi.stubGlobal('fetch', vi.fn())
  })

  it('renders MTRs from the real API response shape', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            id: 11,
            number: 'MTR-2024-8821',
            transporter: 'Elogística Transportes Especiais',
            issueDate: '2026-05-14T10:30:55.097Z',
            wasteId: 5,
            destinationId: 2,
            waste: {
              id: 5,
              code: 'D205',
              description: 'Papelão Prensado',
              quantity: 1200,
              unit: 'kg',
              sector: 'Logística',
              class: 'II_B',
              status: 'transportado',
              createdAt: '2026-05-14T10:25:52.807Z',
              deletedAt: null,
              userId: 4,
              companyId: 4,
            },
            destination: {
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
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    render(
      <MemoryRouter>
        <MTRsList />
      </MemoryRouter>,
    )

    expect(await screen.findByText('MTR-2024-8821')).toBeTruthy()
    expect(screen.getByText('Papelão Prensado')).toBeInTheDocument()
    expect(screen.getByText('EcoDestino Soluções Ambientais Ltda')).toBeInTheDocument()
    expect(screen.getByText('1.200 kg')).toBeInTheDocument()
    expect(screen.getByText('Transportado')).toBeInTheDocument()
  })
})
