import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3002,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'anchor': path.resolve(__dirname, '../anchor'),
      },
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        external: ['anchor'], // Externalize the onchain package
      }
    },
    optimizeDeps: {
      include: ['@trezor/env-utils']
    }
  };
});