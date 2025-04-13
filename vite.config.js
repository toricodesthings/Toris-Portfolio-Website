import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import browserslist from 'browserslist';
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
    minify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500
  },
  plugins: [
    react({
      fastRefresh: true,
    }),
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
  ],
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
    target: 'es2020'
  }
});