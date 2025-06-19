import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  publicDir: 'public', // Mantém a pasta public para ativos estáticos como _redirects
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // --- NOVO: Configuração explícita de entrada para o Rollup (Vite usa Rollup internamente) ---
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Garante que index.html é o ponto de entrada principal
      },
    },
    // --- Fim da nova configuração ---
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias para @/src
    },
  },
});