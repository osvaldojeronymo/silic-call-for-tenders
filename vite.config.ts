import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use base "/" during dev for clean local URLs; GH Pages base on build
export default defineConfig(({ command }) => ({
  plugins: [react()],
  root: '.',
  base: command === 'serve' ? '/' : '/silic-call-for-tenders/',
  server: {
    port: 3000,
    open: '/form-renderer.html'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        'form-renderer': 'form-renderer.html'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}))
