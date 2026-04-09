import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: true, // This enables the HTTPS server
  },
  plugins: [
    react(),
    mkcert(),
    tailwindcss()
  ],
})
