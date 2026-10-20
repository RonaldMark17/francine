import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  // SQLite remains available for local development, but is never loaded by a
  // production build. Vercel serves the API from the root api/ Functions.
  const localApi = command === 'serve'
    ? [(await import('./server/apiMiddleware.js')).viteSqlitePlugin()]
    : []
  return { plugins: [...localApi, react(), tailwindcss()] }
})
