import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // necessário para o alias

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // habilita @ como atalho para src/
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
