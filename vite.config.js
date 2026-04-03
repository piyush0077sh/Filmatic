import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tmdb-proxy': {
        target: 'https://api.themoviedb.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/tmdb-proxy/, '/3'),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase';
            }

            if (id.includes('react-dom') || id.includes('scheduler') || id.includes('react')) {
              return 'react-vendor';
            }

            return 'vendor';
          }
        },
      },
    },
  },
});