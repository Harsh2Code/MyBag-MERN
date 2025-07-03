import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'https://mybag-server-mern.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
