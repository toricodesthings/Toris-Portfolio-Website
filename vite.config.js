import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    proxy: {
      '/api': {
        target: 'http://localhost:5180',
        changeOrigin: true,
        // If your Express routes don't include the /api prefix,
        // you can uncomment the following line to remove it:
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
