import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import apiFetch, { ApiError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { AuthResponse } from '../types';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await apiFetch<AuthResponse>(
        '/auth/login',
        'POST',
        { email, password },
        { emitSessionExpired: false },
      )

      signIn(data.token, {
        id: 0,
        name: email.split('@')[0] || 'Usuário',
        email,
      })
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', email);
      }

      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : 'Erro ao realizar login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B2A2D] flex-col justify-center items-center p-12 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">AmazoTrack</h1>
        <p className="text-green-100 text-lg max-w-md">
          Sistema de gestão e monitoramento otimizado. Acesse sua conta para continuar.
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="text-gray-500 mt-2">Insira suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

            <Input 
              label="E-mail Corporativo"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input 
                label="Senha de Acesso"
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-[#005F73] transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#005F73] focus:ring-[#005F73]"
                />
                <span className="text-sm text-gray-600">Mantenha-me conectado</span>
              </label>
              
              <a href="#" className="text-sm text-[#005F73] hover:text-[#004558] hover:underline font-medium">
                Esqueceu a senha?
              </a>
            </div>

           <Button type="submit" disabled={isLoading} variant="primary">
            {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
           </Button>

            <p className="text-center text-sm text-gray-600">
              Ainda não tem conta?{' '}
              <Link to="/register" className="text-[#005F73] hover:text-[#004558] hover:underline font-medium">
                Criar conta
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
