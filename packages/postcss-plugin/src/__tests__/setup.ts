/**
 * Test setup and configuration for PostCSS plugin tests
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global test setup
beforeAll(() => {
  // Set up global test environment
  process.env.NODE_ENV = 'test';
  
  // Set up performance monitoring
  if (typeof performance === 'undefined') {
    global.performance = {
      now: () => Date.now()
    } as any;
  }
});

afterAll(() => {
  // Clean up global test environment
  delete process.env.NODE_ENV;
});

beforeEach(() => {
  // Set up before each test
});

afterEach(() => {
  // Clean up after each test
});

// Mock console methods for cleaner test output
const originalConsole = { ...console };

beforeAll(() => {
  // Suppress console output during tests unless explicitly enabled
  if (!process.env.DEBUG_TESTS) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
});

afterAll(() => {
  // Restore console methods
  Object.assign(console, originalConsole);
});

// Global test utilities
declare global {
  var testUtils: {
    performance: typeof performance;
    memoryUsage: () => NodeJS.MemoryUsage;
  };
}

global.testUtils = {
  performance: global.performance,
  memoryUsage: () => process.memoryUsage()
};
