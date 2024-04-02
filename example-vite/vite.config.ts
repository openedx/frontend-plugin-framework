import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {find: 'env.config', replacement: path.resolve(__dirname, 'env.config.tsx')},
      {find: '~bootstrap', replacement: path.resolve(__dirname, 'node_modules/@openedx/frontend-plugin-framework/node_modules/bootstrap/')},
    ],
    dedupe: [
      'react',
      'react-dom',
      '@types/react',
      '@types/react-dom',
    ],
  },
  define: {
    'process.env': {},
    'global': 'globalThis',
  },
  server: {
    port: 8080,
  }
});
