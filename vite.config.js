import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0];
          }
        }
      }
    }
  },
  plugins: [react(),
  ViteImageOptimizer({
    png: { quality: 92 },
    jpeg: { quality: 88 },
    webp: { quality: 92 },
    avif: { quality: 80 },
    svg: {
      plugins: [
        { name: 'sortAttrs' }
      ],
    },
  }),
  ],
  server: {
    port: 5176,
    proxy: {
      '/api': {
        target: 'http://localhost:5180',
        changeOrigin: true,
      }
    }
  }
});
