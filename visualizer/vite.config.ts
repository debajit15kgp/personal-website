import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build as a static sub-app that can be deployed under /visualizer/ on the parent site.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
