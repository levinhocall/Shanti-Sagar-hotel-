import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'three-renderer', test: /node_modules[\\/]three[\\/]/, maxSize: 300_000, priority: 30, includeDependenciesRecursively: false },
            { name: 'three-controls', test: /node_modules[\\/](?:@react-three|three-stdlib)[\\/]/, maxSize: 250_000, priority: 20, includeDependenciesRecursively: false },
          ],
        },
      },
    },
  },
})
