import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSqlitePlugin } from './server/apiMiddleware.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteSqlitePlugin(),
    react(),
    tailwindcss(),
  ],
})
