import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      manifest: {
        name: 'React Responsive Easy - Vite Example',
        short_name: 'RRE Vite',
        description: 'Advanced responsive React application with Vite',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  
  // Build optimizations
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          responsive: ['@react-responsive-easy/core'],
          charts: ['chart.js', 'react-chartjs-2'],
          animations: ['framer-motion'],
          gestures: ['react-use-gesture']
        }
      }
    }
  },
  
  // Development server
  server: {
    port: 3001,
    open: true,
    host: true,
    headers: {
      'Link': '</src/main.tsx>; rel=preload; as=script'
    }
  },
  
  // Preview server
  preview: {
    port: 3002,
    open: true
  }
})
