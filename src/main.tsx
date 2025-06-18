import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';

import Register from './pages/Register'; // <-- nova importação

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} /> {/* <-- nova rota */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
