import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // 👈 adicione essa linha
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AuthProvider> {/* 👈 envolva o App */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
