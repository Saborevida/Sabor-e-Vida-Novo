import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <RegisterForm />
    </div>
  );
};

export default Register;
