import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const backendBaseUrl = "https://mybag-mern-1.onrender.com";

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
