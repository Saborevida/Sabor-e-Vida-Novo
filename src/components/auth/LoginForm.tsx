import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/button';
import Input from '../ui/input';
import { Card } from '../ui/card'; // CORREÇÃO: Importa Card como uma exportação nomeada

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

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Email ou senha incorretos');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
      </form>

      <div className="mt-6 text-center">
        <p className="text-neutral-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default LoginForm;