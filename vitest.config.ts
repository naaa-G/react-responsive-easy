import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@react-responsive-easy/core': './packages/core/src',
      '@react-responsive-easy/cli': './packages/cli/src',
    },
  },
});
