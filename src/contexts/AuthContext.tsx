import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'

// ─── Tipos do contexto ────────────────────────────────────────────────────────

interface AuthContextData {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (token: string, user: User) => void
  signOut: () => void
}

// ─── Criação do contexto ──────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Rehydrata sessão ao recarregar a página
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        // dados corrompidos — limpa tudo
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])
  
// Escuta evento de sessão expirada emitido pelo apiFetch
useEffect(() => {
  function handleSessionExpired() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  window.addEventListener('amazotrack:session-expired', handleSessionExpired)
  return () => {
    window.removeEventListener('amazotrack:session-expired', handleSessionExpired)
  }
}, [])

  function signIn(newToken: string, newUser: User) {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function signOut() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook de consumo ──────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}