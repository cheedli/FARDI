import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
      '/start-game': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:5010',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
  },
  base: '/'
})
