import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'dashboard',
  define: {
    // Define Node.js globals for browser compatibility
    global: 'globalThis',
    process: 'process',
  },
  build: {
    outDir: '../dashboard-dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Increase warning threshold to 1MB
    rollupOptions: {
      input: 'dashboard/index.html',
      external: [
        // Node.js modules that should be externalized
        'events',
        'fs/promises',
        'fs',
        'path',
        'os',
        'crypto',
        'util',
        'stream',
        'buffer',
        'url',
        'querystring'
      ],
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/recharts') || id.includes('chartjs-adapter')) {
            return 'chart-vendor';
          }
          if (id.includes('node_modules/date-fns')) {
            return 'date-vendor';
          }
          if (id.includes('node_modules/socket.io-client')) {
            return 'socket-vendor';
          }
          if (id.includes('@yaseratiar/react-responsive-easy-ai-optimizer')) {
            return 'ai-optimizer';
          }
          if (id.includes('@yaseratiar/react-responsive-easy-core')) {
            return 'core';
          }
          // Don't create chunks for unused dependencies
          return null;
        }
      }
    }
  },
  server: {
    port: 3001,
    host: true
  },
  preview: {
    port: 3001,
    host: true
  }
});
