import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginForm from './components/auth/LoginForm';
import RecipesPage from './pages/Recipes';
import MealPlansPage from './pages/MealPlans';
import EducationPage from './pages/Education';
import FavoritesPage from './pages/Favorites';
import ProfilePage from './pages/Profile';

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

// Register Page Component - FULLY FUNCTIONAL
const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const diabetesType = formData.get('diabetesType') as string;

    console.log('📝 Registration attempt:', email);

    try {
      const { error } = await signUp(email, password, {
        name,
        diabetesType
      });

      if (error) {
        console.error('❌ Registration error:', error);
        setError('Erro ao criar conta. Tente novamente.');
      } else {
        console.log('✅ Registration successful');
        setSuccess(true);
      }
    } catch (err) {
      console.error('❌ Unexpected registration error:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-heading font-bold text-dark-800 mb-2">
            Conta Criada!
          </h1>
          <p className="text-neutral-600 mb-6">
            Verifique seu email para confirmar sua conta e fazer login.
          </p>
          <a
            href="/login"
            className="w-full bg-primary-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 inline-block text-center"
          >
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-dark-800 mb-2">
            Criar Conta
          </h1>
          <p className="text-neutral-600">
            Cadastre-se para acessar todas as funcionalidades
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              name="password"
              className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">
              Tipo de Diabetes
            </label>
            <select 
              name="diabetesType"
              className="block w-full px-3 py-2.5 text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="type2">Tipo 2</option>
              <option value="type1">Tipo 1</option>
              <option value="gestational">Gestacional</option>
              <option value="prediabetes">Pré-diabetes</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Já tem uma conta?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  console.log('🎯 Rendering App component - COMPLETE PRODUCTION VERSION');
  console.log('🌍 Current URL:', window.location.href);
  console.log('🔧 Mode:', import.meta.env.MODE);
  
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
                    <MealPlansPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/education" 
                element={
                  <ProtectedRoute>
                    <EducationPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
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