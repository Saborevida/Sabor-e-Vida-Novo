import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginForm from './components/auth/LoginForm';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

// Login Page Component
const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
      <LoginForm />
    </div>
  );
};

// Register Page Component
const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold text-dark-800 mb-4">
          Cadastro em Desenvolvimento
        </h1>
        <p className="text-neutral-600 mb-8">
          A página de cadastro está sendo desenvolvida. Por enquanto, use a demonstração.
        </p>
        <div className="text-left bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
          <h3 className="font-semibold mb-2">Dados para Demonstração:</h3>
          <p className="text-sm text-neutral-600 mb-1">Email: demo@saborevida.com</p>
          <p className="text-sm text-neutral-600">Senha: demo123</p>
        </div>
      </div>
    </div>
  );
};

// Recipes Page Component (placeholder)
const RecipesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-dark-800 mb-4">
            Biblioteca de Receitas
          </h1>
          <p className="text-neutral-600 mb-8">
            Esta seção está sendo desenvolvida. Em breve você terá acesso a centenas 
            de receitas especializadas para diabéticos.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h3 className="font-semibold mb-4">Funcionalidades Planejadas:</h3>
            <ul className="text-left space-y-2 text-neutral-600">
              <li>• Filtros por categoria, dificuldade e tempo de preparo</li>
              <li>• Informações nutricionais detalhadas</li>
              <li>• Cálculo automático do índice glicêmico</li>
              <li>• Sistema de favoritos</li>
              <li>• Avaliações e comentários</li>
              <li>• Listas de compras automáticas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recipes" 
                element={
                  <ProtectedRoute>
                    <RecipesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meal-plans" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-heading font-bold text-dark-800 mb-4">
                          Planos de Refeição
                        </h1>
                        <p className="text-neutral-600">Em desenvolvimento...</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/education" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-heading font-bold text-dark-800 mb-4">
                          Educação Nutricional
                        </h1>
                        <p className="text-neutral-600">Em desenvolvimento...</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-heading font-bold text-dark-800 mb-4">
                          Receitas Favoritas
                        </h1>
                        <p className="text-neutral-600">Em desenvolvimento...</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-heading font-bold text-dark-800 mb-4">
                          Perfil do Usuário
                        </h1>
                        <p className="text-neutral-600">Em desenvolvimento...</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;