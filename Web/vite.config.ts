import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
    // Garante uma única instância destas libs (evita "useContext of null"
    // quando @react-three/postprocessing pega outra cópia do React/fiber).
    dedupe: ['react', 'react-dom', '@react-three/fiber', 'three'],
  },
})
