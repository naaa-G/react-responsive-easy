import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'dashboard',
  build: {
    outDir: '../dashboard-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'dashboard/index.html'
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
