import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', 'dashboard', 'dashboard-dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'dashboard/',
        'dashboard-dist/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        branches: 80,
        functions: 85,
        lines: 85,
        statements: 85
      }
    }
  }
});
