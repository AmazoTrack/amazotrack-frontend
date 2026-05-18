import { beforeEach, describe, expect, it, vi } from 'vitest'
import apiFetch, { ApiError, SESSION_EXPIRED_EVENT, getApiUrl } from './api'

describe('apiFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('builds requests from VITE_API_URL and attaches bearer tokens', async () => {
    localStorage.setItem('token', 'demo-token')
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(apiFetch('/companies')).resolves.toEqual({ ok: true })

    expect(fetch).toHaveBeenCalledWith('https://api.test/companies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo-token',
      },
    })
  })

  it('throws API errors with backend validation details', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: true,
          message: 'Dados inválidos',
          details: [{ field: 'email', message: 'E-mail inválido' }],
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    await expect(apiFetch('/auth/register', 'POST', { email: 'bad' })).rejects.toMatchObject({
      status: 400,
      message: 'Dados inválidos',
      details: [{ field: 'email', message: 'E-mail inválido' }],
    } satisfies Partial<ApiError>)
  })

  it('emits the session-expired event on protected 401 responses', async () => {
    const listener = vi.fn()
    window.addEventListener(SESSION_EXPIRED_EVENT, listener)
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: true, message: 'Token inválido' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(apiFetch('/companies')).rejects.toMatchObject({
      status: 401,
      message: 'Sessão expirada. Faça login novamente.',
    })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('allows login failures without emitting session expiration', async () => {
    const listener = vi.fn()
    window.addEventListener(SESSION_EXPIRED_EVENT, listener)
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: true, message: 'E-mail ou senha inválidos' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(
      apiFetch('/auth/login', 'POST', { email: 'x', password: 'y' }, { emitSessionExpired: false }),
    ).rejects.toMatchObject({
      status: 401,
      message: 'E-mail ou senha inválidos',
    })
    expect(listener).not.toHaveBeenCalled()
  })

  it('normalizes endpoint slashes', () => {
    expect(getApiUrl('wastes')).toBe('https://api.test/wastes')
  })
})
