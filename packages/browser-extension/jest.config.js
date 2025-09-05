module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx'
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@background/(.*)$': '<rootDir>/src/background/$1',
    '^@content/(.*)$': '<rootDir>/src/content/$1',
    '^@devtools/(.*)$': '<rootDir>/src/devtools/$1',
    '^@popup/(.*)$': '<rootDir>/src/popup/$1'
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}'
  ],
  
  // Coverage thresholds (enterprise-grade)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Specific thresholds for critical components
    './src/core/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/background/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Verbose output
  verbose: false,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: false,
  
  // Reset modules between tests
  resetModules: false,
  
  // Max workers to prevent memory issues
  maxWorkers: '50%',
  
  // Worker idle memory limit
  workerIdleMemoryLimit: '512MB',
  
  // Global setup and teardown
  globalSetup: '<rootDir>/src/__tests__/global-setup.ts',
  globalTeardown: '<rootDir>/src/__tests__/global-teardown.ts',
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'https://example.com'
  },
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(chrome-types|webextension-polyfill)/)'
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Force exit after tests complete
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: false
};
