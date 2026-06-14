import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 1e8,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
      },
      manifest: {
        name: 'S3 Gallery',
        short_name: 'S3 Gallery',
        description: 'Browse and preview images in an S3 gallery.',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
      },
      pwaAssets: {
        image: "public/favicon.png",
      }
    })
  ],
  base: process.env.BASE_URL || '/',
})
