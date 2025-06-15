import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // --- Adiciona a configuração para a pasta public e build ---
  publicDir: 'public', // Informa ao Vite que a pasta 'public' contém ativos estáticos
  build: {
    outDir: 'dist', // Garante que a saída do build é para a pasta 'dist'
    emptyOutDir: true, // Limpa a pasta 'dist' antes de cada build
  },
  // --- Fim da configuração ---
});