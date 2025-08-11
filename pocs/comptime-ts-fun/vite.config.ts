import { defineConfig } from 'vite';
import { comptime } from 'comptime.ts/vite';

export default defineConfig({
  plugins: [comptime()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        entryFileNames: 'index.js',
      }
    }
  }
});