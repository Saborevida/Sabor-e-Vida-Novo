import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
