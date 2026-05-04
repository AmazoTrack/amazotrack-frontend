import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://amazotrack-backend-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar login');
      }

      // Salva o token
      localStorage.setItem('token', data.token);
      
      // Se tiver implementado a lógica de lembrar, pode salvar no localStorage também
      if (rememberMe) {
        localStorage.setItem('rememberMe', email);
      }

      // Redireciona para o dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Painel Esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-900 flex-col justify-center items-center p-12 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">AmazoTrack</h1>
        <p className="text-green-100 text-lg max-w-md">
          Sistema de gestão e monitoramento otimizado. Acesse sua conta para continuar.
        </p>
      </div>

      {/* Painel Direito - Formulário */}
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
                className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Mantenha-me conectado</span>
              </label>
              
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <Button disabled={isLoading} variant="primary">
              {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Ainda não tem conta?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Criar conta
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}