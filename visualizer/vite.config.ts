import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Built and served under /visualizer/ on debajitchakraborty.com.
// If you want to host it elsewhere, change `base` to './' for relative URLs.
export default defineConfig({
  plugins: [react()],
  base: '/visualizer/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
