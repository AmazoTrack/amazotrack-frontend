import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../contexts/AuthContext'
import Login from './Login'

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('logs in through the API and stores the returned token', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ token: 'jwt-demo' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    renderLogin()

    await userEvent.type(screen.getByLabelText(/e-mail corporativo/i), 'arthur@amazotrack.com')
    await userEvent.type(screen.getByLabelText(/senha de acesso/i), 'amazo2026')
    await userEvent.click(screen.getByRole('button', { name: /entrar no sistema/i }))

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('jwt-demo')
    })

    expect(fetch).toHaveBeenCalledWith('https://api.test/auth/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'arthur@amazotrack.com', password: 'amazo2026' }),
    }))
  })

  it('shows backend login errors without storing a token', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: true, message: 'E-mail ou senha inválidos' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    renderLogin()

    await userEvent.type(screen.getByLabelText(/e-mail corporativo/i), 'arthur@amazotrack.com')
    await userEvent.type(screen.getByLabelText(/senha de acesso/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /entrar no sistema/i }))

    expect(await screen.findByText('E-mail ou senha inválidos')).toBeInTheDocument()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
