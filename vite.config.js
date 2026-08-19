import { defineConfig } from 'vite'

export default defineConfig({
  base: '/web-011/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    },
    hmr: {
      clientPort: 443
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true
  }
})
