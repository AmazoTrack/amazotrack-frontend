import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CadastrarResiduo from './CadastrarResiduo'

describe('CadastrarResiduo actions', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'jwt-demo')
    vi.stubGlobal('fetch', vi.fn())
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({
        data: [{ id: 1, corporateName: 'Metalúrgica Amazon Tech', cnpj: '123', type: 'geradora', createdAt: '2026-05-14T10:30:55.097Z' }],
        total: 1,
        page: 1,
        limit: 50,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        data: [{ id: 1, description: 'Papelão Prensado', quantity: 1200, unit: 'kg', sector: 'Logística', class: 'II_B', status: 'gerado', createdAt: '2026-05-14T10:30:55.097Z', userId: 4, companyId: 1 }],
        total: 1,
        page: 1,
        limit: 5,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
  })

  it('loads API data and opens the full waste history', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/residuos/cadastrar']}>
        <Routes>
          <Route path="/dashboard/residuos/cadastrar" element={<CadastrarResiduo />} />
          <Route path="/dashboard/residuos" element={<div>Histórico de resíduos</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Metalúrgica Amazon Tech')).toBeInTheDocument()
    expect(screen.getByText('Papelão Prensado')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /ver histórico completo/i }))
    expect(screen.getByText('Histórico de resíduos')).toBeInTheDocument()
  })
})
