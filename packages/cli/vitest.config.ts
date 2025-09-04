import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Enterprise-grade test configuration
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'coverage/**',
        'dist/**',
        'node_modules/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/__tests__/**',
        '**/test/**',
        '**/tests/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // Test patterns
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: [
      'node_modules',
      'dist',
      'coverage',
      '**/*.d.ts',
    ],
    
    // Timeout configuration
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter configuration
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './test-results.json',
    },
    
    // Mock configuration
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
