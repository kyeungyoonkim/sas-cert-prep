import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: set VITE_BASE_PATH=/your-repo-name/ when building
// Local dev: leave unset (defaults to /)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
