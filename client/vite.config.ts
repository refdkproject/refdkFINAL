import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config'; // Import from vitest/config

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  test: {
    environment: 'jsdom', // Use jsdom for testing
    globals: true, // Enable global test functions like expect, describe, etc.
    setupFiles: './setupTests.ts', // Optional: global setup file
  },
});
