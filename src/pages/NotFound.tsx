import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-dark-800 mb-4">404</h1>
        <p className="text-neutral-600">Página não encontrada</p>
      </div>
    </div>
  );
};

export default NotFound;
