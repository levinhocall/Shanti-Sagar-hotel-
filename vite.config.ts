import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three')) {
            return 'three-vendor';
          }
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
