import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Backend API (guest session)
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Socket.IO (websocket + polling)
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true,
      },
    },
    // HTTPS disabled for local dev
    // https: {
    //   key: fs.readFileSync('./.dev/certs/key.pem'),
    //   cert: fs.readFileSync('./.dev/certs/cert.pem')
    // }
  }
})