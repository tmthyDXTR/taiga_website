import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint()
  ],
  // Local PHP server (npm run dev:api) backs the blog API and uploads.
  // changeOrigin stays false so PHP sees the browser's Host and the Origin check passes.
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: false },
      '/uploads': { target: 'http://localhost:8000', changeOrigin: false },
    },
  },
})
