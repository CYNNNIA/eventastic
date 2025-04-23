import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        'fs',
        'path',
        'url',
        'crypto',
        'stream',
        'events',
        'util',
        'module',
        'tty',
        'perf_hooks',
        'fsevents' // AÑADE ESTE AQUÍ
      ]
    }
  }
})