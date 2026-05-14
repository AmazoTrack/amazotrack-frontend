const BASE_URL = import.meta.env.VITE_API_URL

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

async function apiFetch<T = unknown>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: object
): Promise<T> {
  const token = localStorage.getItem('token')

  if (token === 'token-fake-de-teste-12345') {
    console.log('[apiFetch] Mock detectado — abortando chamada real')
    throw new ApiError(0, 'Usando dados de demonstração')
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  // Token expirado — emite evento, AuthContext cuida do redirect
  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
    throw new ApiError(401, 'Sessão expirada. Faça login novamente.')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message ?? 'Erro na requisição',
      data.details ?? []
    )
  }

  return data as T
}

export default apiFetch