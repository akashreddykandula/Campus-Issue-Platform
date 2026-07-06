import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig ({
  plugins: [react ()],

  // Dev server proxies /api calls to the local Flask backend so that
  // the browser never hits CORS restrictions during development.
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Make src/ the implicit root for absolute imports (e.g. '@/components/…').
  resolve: {
    alias: {
      '@': '/src',
    },
  },

  build: {
    outDir: 'dist',
    // Chunk splitting for better cache behaviour on Vercel
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
