import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Enables Tailwind CSS in the project
  ],
  server: {
    port: 5173,        // Always use 5173
    strictPort: true,  // Fail instead of picking a random port — keeps CORS predictable
  },
})
