import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('📝 Tentativa de login:', email);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('❌ Erro no login:', error);
        setError('Email ou senha incorretos');
      } else {
        console.log('✅ Login realizado, redirecionando');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para login de demonstração - SEMPRE FUNCIONA
  const handleDemoLogin = async () => {
    console.log('🎭 Iniciando login de demonstração');
    setLoading(true);
    setError('');
    
    // Simular login bem-sucedido
    setTimeout(() => {
      console.log('✅ Login demo realizado com sucesso');
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark-800 mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-neutral-600">
          Faça login para acessar suas receitas e planos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          placeholder="seu@email.com"
          required
        />

        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-neutral-600">Lembrar de mim</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!email || !password}
        >
          Entrar
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">ou</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={handleDemoLogin}
          disabled={loading}
        >
          🎭 Entrar como Demonstração
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-neutral-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>

      {/* Informações de demonstração */}
      <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <h3 className="font-semibold text-sm text-primary-800 mb-2">
          🎯 Acesso Rápido:
        </h3>
        <div className="text-xs text-primary-700 space-y-1">
          <p>• Clique em "Entrar como Demonstração" para acesso imediato</p>
          <p>• Ou use: <strong>demo@saborevida.com</strong> / <strong>demo123</strong></p>
          <p>• Aplicação 100% funcional com dados de exemplo</p>
        </div>
      </div>
    </Card>
  );
};

export default LoginForm;