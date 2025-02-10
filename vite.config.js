import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All requests starting with /api are proxied to the public URL.
      '/api': {
        target: 'https://stations.airbkk.com',
        changeOrigin: true,
        // Remove the "/api" prefix when forwarding the request
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
