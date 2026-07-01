import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: set VITE_BASE_PATH=/your-repo-name/ when building
// Local dev: leave unset (defaults to /)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('/src/data/extra/')) return 'question-bank-extra'
          if (id.includes('/src/data/upgrade/')) return 'question-bank-upgrade'
          if (id.includes('/src/data/')) return 'question-bank-core'
          return undefined
        },
      },
    },
  },
})
