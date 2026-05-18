type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export class ApiError extends Error {
  status: number
  details: Array<{ field: string; message: string }>

  constructor(
    status: number,
    message: string,
    details: Array<{ field: string; message: string }> = []
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

// Evento customizado para sessão expirada — AuthContext vai escutar isso
export const SESSION_EXPIRED_EVENT = 'amazotrack:session-expired'

interface ApiFetchOptions {
  emitSessionExpired?: boolean
}

export function getApiUrl(endpoint: string) {
  const baseUrl = import.meta.env.VITE_API_URL

  if (!baseUrl) {
    throw new ApiError(0, 'VITE_API_URL não configurada')
  }

  const normalizedBase = baseUrl.replace(/\/$/, '')
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `${normalizedBase}${normalizedEndpoint}`
}

async function apiFetch<T = unknown>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: object,
  options: ApiFetchOptions = {}
): Promise<T> {
  const token = localStorage.getItem('token')

  const response = await fetch(getApiUrl(endpoint), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  // Token expirado — emite evento, AuthContext cuida do redirect
  if (response.status === 401 && options.emitSessionExpired !== false) {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
    throw new ApiError(401, 'Sessão expirada. Faça login novamente.')
  }

  const data = response.status === 204 ? null : await response.json()

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? 'Erro na requisição',
      data?.details ?? []
    )
  }

  return data as T
}

export default apiFetch
