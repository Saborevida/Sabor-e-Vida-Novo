import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importa o módulo 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => { // Recebe 'mode' para diferenciar ambientes
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    publicDir: 'public',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Alias que aponta para a pasta 'src/'
      },
    },
    // --- NOVO: Configuração de variáveis de ambiente para desenvolvimento local ---
    define: {
      'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
      // As variáveis VITE_... já são lidas do .env por padrão, não precisam de 'define' aqui
    },
    // --- Fim da nova configuração ---
  };
});