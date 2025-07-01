import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const backendBaseUrl = process.env.REACT_APP_BACKEND_URL || "";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${backendBaseUrl}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
