import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    // CI-friendly configuration
    testTimeout: process.env.CI ? 60000 : 30000, // 60s in CI, 30s locally
    hookTimeout: process.env.CI ? 60000 : 30000,
    teardownTimeout: process.env.CI ? 60000 : 30000,
    // Reduce concurrency in CI to prevent resource conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: process.env.CI ? true : false
      }
    },
    // Increase retry attempts in CI
    retry: process.env.CI ? 2 : 0
  }
});
