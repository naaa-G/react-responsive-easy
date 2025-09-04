/**
 * Test setup for Performance Dashboard
 * 
 * This file provides global test configuration, mocks, and utilities
 * for enterprise-grade testing of the Performance Dashboard package.
 */

import { vi } from 'vitest';
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Mock Performance API
const mockPerformanceObserver = vi.fn();
const mockPerformanceObserverInstance = {
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => [])
};

mockPerformanceObserver.mockImplementation(() => mockPerformanceObserverInstance);

// Mock performance.memory
const mockMemory = {
  usedJSHeapSize: 50 * 1024 * 1024, // 50MB
  totalJSHeapSize: 100 * 1024 * 1024, // 100MB
  jsHeapSizeLimit: 2 * 1024 * 1024 * 1024 // 2GB
};

// Mock performance.getEntriesByType
const mockResourceEntries = [
  {
    name: 'https://example.com/style.css',
    startTime: 100,
    requestStart: 100,
    responseStart: 150,
    responseEnd: 200,
    transferSize: 1024
  },
  {
    name: 'https://example.com/script.js',
    startTime: 200,
    requestStart: 200,
    responseStart: 250,
    responseEnd: 300,
    transferSize: 2048
  }
];

// Mock performance.now
let mockNowValue = 1000;
const mockPerformanceNow = vi.fn(() => mockNowValue);

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: {
    memory: mockMemory,
    now: mockPerformanceNow,
    getEntriesByType: vi.fn((type: string) => {
      if (type === 'resource') return mockResourceEntries;
      if (type === 'paint') return [
        { name: 'first-contentful-paint', startTime: 500 },
        { name: 'largest-contentful-paint', startTime: 800 }
      ];
      if (type === 'navigation') return [{
        entryType: 'navigation',
        domContentLoadedEventStart: 100,
        domContentLoadedEventEnd: 150,
        loadEventStart: 200,
        loadEventEnd: 250,
        responseStart: 50,
        requestStart: 0,
        domInteractive: 120,
        fetchStart: 0,
        redirectStart: 0,
        redirectEnd: 0,
        domainLookupStart: 0,
        domainLookupEnd: 0,
        connectStart: 0,
        connectEnd: 0,
        domComplete: 300,
        responseEnd: 100
      }];
      return [];
    }),
    mark: vi.fn(),
    measure: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn()
  },
  writable: true
});

// Mock PerformanceObserver
Object.defineProperty(window, 'PerformanceObserver', {
  value: mockPerformanceObserver,
  writable: true
});

// Mock LayoutShift API
Object.defineProperty(window, 'LayoutShift', {
  value: class MockLayoutShift {
    constructor(public value: number, public hadRecentInput: boolean, public sources: any[]) {}
  },
  writable: true
});

// Mock document methods
Object.defineProperty(document, 'querySelectorAll', {
  value: vi.fn((selector: string) => {
    if (selector === '[data-responsive]') {
      return Array.from({ length: 5 }, (_, i) => ({
        tagName: 'DIV',
        className: `responsive-element-${i}`,
        offsetHeight: 100 + i * 10,
        getAttribute: vi.fn((attr: string) => attr === 'style' ? 'width: 100px;' : null),
        getElementsByTagName: vi.fn(() => Array.from({ length: i + 1 }))
      }));
    }
    return [];
  }),
  writable: true
});

// Mock console methods to avoid noise in tests
const originalConsole = { ...console };
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn()
};

// Test utilities
export const testUtils = {
  // Advance time for testing
  advanceTime: (ms: number) => {
    mockNowValue += ms;
  },
  
  // Reset time
  resetTime: () => {
    mockNowValue = 1000;
  },
  
  // Create mock metrics
  createMockMetrics: () => ({
    layoutShift: {
      current: 0.05,
      entries: [{
        value: 0.05,
        timestamp: 1000,
        sources: [{ element: 'DIV', selector: '.test-element' }]
      }]
    },
    paintTiming: {
      fcp: 500,
      lcp: 800
    },
    memory: {
      used: 50 * 1024 * 1024,
      total: 100 * 1024 * 1024,
      limit: 2 * 1024 * 1024 * 1024,
      usage: 0.025
    },
    navigation: {
      domContentLoaded: 50,
      loadComplete: 50,
      firstByte: 50,
      domInteractive: 120,
      redirect: 0,
      dns: 0,
      tcp: 0,
      request: 50,
      response: 50,
      processing: 100
    },
    responsiveElements: {
      count: 5,
      renderTimes: [1, 2, 3, 4, 5],
      averageRenderTime: 3,
      memoryUsage: 1000,
      layoutShiftContributions: 0
    },
    resources: {
      totalRequests: 2,
      recentRequests: 2,
      totalSize: 3072,
      averageLoadTime: 100,
      slowRequests: []
    },
    custom: {
      scalingOperations: 15,
      scalingTime: 2.5,
      cacheHitRate: 0.85,
      configComplexity: 2.0,
      breakpointTransitions: 0
    }
  }),
  
  // Create mock alert
  createMockAlert: (type: string = 'layout-shift', severity: 'info' | 'warning' | 'critical' = 'warning') => ({
    type,
    severity,
    message: `Test ${type} alert`,
    value: 0.1,
    threshold: 0.05,
    timestamp: Date.now()
  }),
  
  // Create mock snapshot
  createMockSnapshot: (timestamp: number = Date.now()) => ({
    timestamp,
    metrics: testUtils.createMockMetrics()
  }),
  
  // Wait for async operations
  waitFor: (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock AI Optimizer integration
  createMockAIOptimizer: () => ({
    optimizeScaling: vi.fn().mockResolvedValue({
      suggestedTokens: { width: 100, height: 200 },
      scalingCurveRecommendations: [{ breakpoint: 'md', recommendation: 'optimize' }],
      performanceImpacts: { renderTime: 0.1, memoryUsage: 0.05 },
      accessibilityWarnings: [],
      confidenceScore: 0.9,
      estimatedImprovements: {
        userExperience: { interactionRate: 0.1, accessibilityScore: 0.05, visualHierarchy: 0.1 },
        performance: { renderTime: 0.1, bundleSize: 0.05, memoryUsage: 0.05 },
        layout: { layoutShift: 0.1, codeReduction: 0.1, maintenanceEffort: 0.05 },
        developerExperience: { debuggingTime: 0.1 }
      }
    }),
    getCacheStats: vi.fn().mockReturnValue({
      hitRate: 0.85,
      size: 1024 * 50,
      evictions: 10
    }),
    getEnterpriseMetrics: vi.fn().mockReturnValue({
      optimizationCount: 100,
      averageImprovement: 0.15,
      systemHealth: 0.95
    })
  })
};

// Global test setup
beforeAll(() => {
  // Setup global test environment
  vi.clearAllMocks();
});

beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks();
  testUtils.resetTime();
  
  // Reset PerformanceObserver mock
  mockPerformanceObserverInstance.observe.mockClear();
  mockPerformanceObserverInstance.disconnect.mockClear();
  mockPerformanceObserverInstance.takeRecords.mockClear();
});

afterEach(() => {
  // Cleanup after each test
  vi.clearAllTimers();
});

afterAll(() => {
  // Restore original console
  global.console = originalConsole;
});

// Export mocks for use in tests
export {
  mockPerformanceObserver,
  mockPerformanceObserverInstance,
  mockMemory,
  mockResourceEntries,
  mockPerformanceNow
};
