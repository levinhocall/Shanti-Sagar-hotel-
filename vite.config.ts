import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function buildCommit() {
  const fromEnvironment = process.env.WORKERS_CI_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromEnvironment && /^[0-9a-f]{40}$/i.test(fromEnvironment)) return fromEnvironment;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'release-revision',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'release.json', source: JSON.stringify({ commit: buildCommit(), design: 'cinematic-v4' }) });
      },
    },
  ],
  build: {
    target: ['es2020', 'safari15.4'],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.endsWith('/three/build/three.core.js')) return 'three-core';
          if (id.endsWith('/three/build/three.module.js')) return 'three-renderer';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
