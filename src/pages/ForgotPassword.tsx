import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage('Instruções de redefinição enviadas para seu email.');
    } catch {
      setError('Erro ao enviar email de redefinição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Redefinir Senha</h1>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Enviar Instruções
        </Button>
      </form>
    </Card>
  );
};

export default ForgotPassword;
