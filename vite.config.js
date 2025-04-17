import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import browserslist from 'browserslist';
import react from '@vitejs/plugin-react-swc';
import {browserslistToTargets} from 'lightningcss';

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
    },
    cssMinify: 'lightningcss',
  },
  plugins: [
    ViteImageOptimizer({
      png: { quality: 90 },
      jpeg: { quality: 85 },
      webp: { quality: 90 },
      avif: { quality: 80 },
      svg: {
        plugins: [
          { name: 'sortAttrs' },
          { name: 'removeViewBox', active: false }
        ],
      },
    }),
    react()
  ],
  optimizeDeps: {
    include: ['framer-motion', 'lodash', '@supabase/supabase-js', 'recharts'], // Pre-bundle specific heavy dependencies
    exclude: ['tsparticles']
  },
  server: {
    port: 5176,
    proxy: {
      '/api': {
        target: 'http://localhost:5180',
        changeOrigin: true,
      }
    },
    hmr: {
      overlay: false
    }
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%'))
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  }
});