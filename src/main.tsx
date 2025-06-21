import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// PRODUCTION INITIALIZATION LOGS
console.log('🚀 STARTING SABOR & VIDA APPLICATION - PRODUCTION VERSION');
console.log('🌍 Environment:', import.meta.env.MODE);
console.log('🌐 Current URL:', window.location.href);
console.log('🔧 Environment variables:');

// Detailed environment verification
const envVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  VITE_APP_URL: import.meta.env.VITE_APP_URL
};

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`- ${key}:`, value ? '✅ Configured' : '❌ Not found');
  if (value) {
    console.log(`  Value: ${key.includes('KEY') ? value.substring(0, 20) + '...' : value}`);
  }
});

// Check if we're in production
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
console.log('🏭 Production environment:', isProduction ? '✅ Yes' : '❌ No');

if (isProduction) {
  console.log('🌐 Running in production:', window.location.hostname);
  
  // Force production configurations
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('⚠️ VITE_SUPABASE_URL not found, using fallback');
  }
  
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY not found, using fallback');
  }
}

// Ensure DOM is ready
const initApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('❌ Root element not found');
    return;
  }
  
  console.log('✅ Root element found, starting React');
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('✅ React application started');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Additional logging for production debugging
window.addEventListener('load', () => {
  console.log('🎯 Page fully loaded');
  console.log('📊 Performance:', {
    loadTime: performance.now(),
    navigation: performance.getEntriesByType('navigation')[0]
  });
});

// Capture unhandled errors
window.addEventListener('error', (event) => {
  console.error('❌ Unhandled error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});
