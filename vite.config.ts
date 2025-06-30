import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importa o módulo 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    publicDir: 'public', // Mantém a pasta public para ativos estáticos como _redirects
    build: {
      outDir: 'dist', // Garante que a saída é para a pasta 'dist'
      emptyOutDir: true, // Limpa a pasta 'dist' antes de cada build
      sourcemap: isDevelopment, // Gera sourcemaps em dev para debug
      // --- NOVO: Configuração explícita de entrada para o Rollup (Vite usa Rollup internamente) ---
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'), // Garante que index.html é o ponto de entrada principal
        },
        output: {
          // Garante que os chunks (código dividido) e assets (CSS, imagens) sejam gerados corretamente
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
      // --- Fim da nova configuração ---
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Alias para @/src
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
    },
  };
});