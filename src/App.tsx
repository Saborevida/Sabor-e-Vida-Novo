import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Manter relativa ou mudar para '@/contexts/AuthContext'
import Header from './components/layout/header'; // Manter relativa ou mudar para '@/components/layout/header'
import Footer from './components/layout/footer'; // Manter relativa ou mudar para '@/components/layout/footer'

// Importações das Páginas (Usando Alias @/ e nome em minúsculas)
import Home from '@/pages/home'; // CORREÇÃO
import Dashboard from '@/pages/dashboard'; // CORREÇÃO
import LoginForm from '@/components/auth/loginForm'; // CORREÇÃO
import RegisterForm from '@/components/auth/registerForm'; // CORREÇÃO
import RecipesPage from '@/pages/recipes'; // CORREÇÃO
import EducationPage from '@/pages/education'; // CORREÇÃO
import MealPlansPage from '@/pages/mealplans'; // CORREÇÃO
import FavoritesPage from '@/pages/favorites'; // CORREÇÃO
import ProfilePage from '@/pages/profile'; // CORREÇÃO
import ForgotPasswordForm from '@/components/auth/forgotPasswordForm'; // CORREÇÃO

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

// ... Resto do código do App (LoginPage, RegisterPage, RecipesPage, etc.)
// As definições de LoginPage, RegisterPage, RecipesPage, etc. serão as importações acima.

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
                    <LoginForm /> {/* Usa o componente importado */}
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterForm /> {/* Usa o componente importado */}
                  </PublicRoute>
                } 
              />
              <Route 
                path="/forgot-password" 
                element={
                  <PublicRoute>
                    <ForgotPasswordForm /> {/* Usa o componente importado */}
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard /> {/* Usa o componente importado */}
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recipes" 
                element={
                  <ProtectedRoute>
                    <RecipesPage /> {/* Usa o componente importado */}
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meal-plans" 
                element={
                  <ProtectedRoute>
                    <MealPlansPage /> {/* Usa o componente importado */}
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/education" 
                element={
                  <ProtectedRoute>
                    <EducationPage /> {/* Usa o componente importado */}
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <FavoritesPage /> {/* Usa o componente importado */}
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage /> {/* Usa o componente importado */}
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
