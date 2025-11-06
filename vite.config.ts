import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Use repo path for GitHub Pages, but relative for flexibility
  // GitHub Pages URL: https://megan-situationbear.github.io/Mego-Proto-Experiments/
  base: process.env.NODE_ENV === 'production' ? '/Mego-Proto-Experiments/' : '/',
  // Use app.html as the entry point for both dev and build
  root: '.',
  publicDir: 'public',
  // For production build, explicitly set app.html as entry
  build: {
    rollupOptions: {
      input: './app.html',
    },
  },
  // For development, serve app.html when accessing root
  server: {
    open: '/app.html',
  },
})
