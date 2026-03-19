import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'gembaos-app-icon.png'],
      manifest: {
        name: 'GembaOS',
        short_name: 'GembaOS',
        description: 'Kaizen Copilot: Ultimate Lean Management System',
        theme_color: '#F15A29',
        background_color: '#1A1A1A',
        display: 'standalone',
        icons: [
          {
            src: 'gembaos-app-icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'gembaos-app-icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'gembaos-app-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'konva-vendor': ['konva', 'react-konva'],
          'supabase-vendor': ['@supabase/supabase-js']
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
  }
})
