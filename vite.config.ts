import { execFileSync } from 'node:child_process';
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
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'release-revision',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'release.json', source: JSON.stringify({ commit: buildCommit(), design: 'cinematic-v3' }) });
      },
    },
  ],
  build: {
    target: ['es2020', 'safari15.4'],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three-renderer';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
