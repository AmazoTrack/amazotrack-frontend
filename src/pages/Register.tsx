import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem.');
    }

    if (!termsAccepted) {
      return setError('Você precisa aceitar os termos de serviço.');
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://amazotrack-backend-production.up.railway.app/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }

      // Redireciona para o login após sucesso
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Painel Esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-900 flex-col justify-center p-16 text-white">
        <h1 className="text-4xl font-bold mb-8">AmazoTrack</h1>
        <div className="space-y-4 text-green-100">
          <p className="flex items-center gap-3">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Gestão completa e integrada
          </p>
          <p className="flex items-center gap-3">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Monitoramento em tempo real
          </p>
          <p className="flex items-center gap-3">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Segurança e confiabilidade
          </p>
        </div>
      </div>

      {/* Painel Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Crie sua conta</h2>
            <p className="text-gray-500 mt-2">Preencha os dados para se cadastrar</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

            <Input 
              label="Nome Completo ou Razão Social"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input 
              label="E-mail Corporativo"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input 
              label="Senha"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input 
              label="Confirmar Senha"
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <label className="flex items-start gap-2 cursor-pointer mt-2">
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600 leading-tight">
                Concordo com os Termos de Serviço e Políticas de Segurança NBR
              </span>
            </label>

            <div className="pt-2">
              <Button disabled={isLoading} variant="primary">
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Já possui uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Acessar portal
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}