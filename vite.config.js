import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Check if the module comes from node_modules
          if (id.includes('node_modules')) {
            // Extract the package name from the file path
            return id.toString().split('node_modules/')[1].split('/')[0];
          }
        }
      }
    }
  },
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
