/**
 * Performance tests for PostCSS plugin
 * Tests performance characteristics, optimization, and benchmarks
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import postcss from 'postcss';
import plugin from '../index';
import type { PostCSSPluginOptions } from '../index';
import {
  processCss,
  generateTestCSS,
  generateComplexCSS,
  generateLargeCSS,
  measureTime,
  measureTimeAsync,
  defaultTestOptions,
  developmentTestOptions,
  productionTestOptions
} from './utils/test-helpers';
import {
  processCssWithMetrics,
  PerformanceBenchmark,
  MemoryLeakDetector,
  TestDataGenerator,
  EnterpriseAssertions,
  type TestMetrics
} from './utils/enterprise-test-helpers';

describe('PostCSS Plugin Performance Tests', () => {
  let benchmark: PerformanceBenchmark;
  let memoryDetector: MemoryLeakDetector;

  beforeEach(() => {
    benchmark = new PerformanceBenchmark();
    memoryDetector = new MemoryLeakDetector();
  });

  afterEach(() => {
    // Clean up any resources
    benchmark = new PerformanceBenchmark();
    memoryDetector = new MemoryLeakDetector();
  });

  describe('Basic Performance Benchmarks', () => {
    it('should process small CSS quickly', async () => {
      const input = generateTestCSS(5);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process 5 rules in less than 50ms
      expect(time).toBeLessThan(50);
    });

    it('should process medium CSS efficiently', async () => {
      const input = generateTestCSS(50);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process 50 rules in less than 200ms
      expect(time).toBeLessThan(200);
    });

    it('should process large CSS within acceptable time', async () => {
      const input = generateTestCSS(200);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process 200 rules in less than 1 second
      expect(time).toBeLessThan(1000);
    });

    it('should handle complex CSS efficiently', async () => {
      const input = generateComplexCSS();
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process complex CSS in less than 300ms
      expect(time).toBeLessThan(300);
    });
  });

  describe('Performance Benchmarking', () => {
    it('should benchmark simple transformations', async () => {
      const input = '.test { font-size: rre(16); }';
      
      const { metrics } = await benchmark.measure('simple-transformation', async () => {
        await processCss(input, defaultTestOptions);
      }, 10);
      
      expect(metrics.executionTime).toBeLessThan(100);
    });

    it('should benchmark multiple transformations', async () => {
      const input = generateTestCSS(20);
      
      const { metrics } = await benchmark.measure('multiple-transformations', async () => {
        await processCss(input, defaultTestOptions);
      }, 5);
      
      expect(metrics.executionTime).toBeLessThan(200);
    });

    it('should benchmark complex CSS processing', async () => {
      const input = generateComplexCSS();
      
      const { metrics } = await benchmark.measure('complex-css', async () => {
        await processCss(input, defaultTestOptions);
      }, 3);
      
      expect(metrics.executionTime).toBeLessThan(500);
    });

    it('should benchmark large CSS processing', async () => {
      const input = generateLargeCSS(500);
      
      const { metrics } = await benchmark.measure('large-css', async () => {
        await processCss(input, defaultTestOptions);
      }, 2);
      
      expect(metrics.executionTime).toBeLessThan(2000);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not leak memory with repeated processing', async () => {
      memoryDetector.takeSnapshot('initial');
      
      const input = generateTestCSS(100);
      
      // Process CSS multiple times
      for (let i = 0; i < 10; i++) {
        await processCss(input, defaultTestOptions);
        memoryDetector.takeSnapshot(`iteration-${i}`);
      }
      
      const leaks = memoryDetector.detectLeaks();
      expect(leaks).toHaveLength(0);
    });

    it('should handle memory efficiently with large CSS', async () => {
      memoryDetector.takeSnapshot('before-large');
      
      const input = generateLargeCSS(1000);
      await processCss(input, defaultTestOptions);
      
      memoryDetector.takeSnapshot('after-large');
      
      const growth = memoryDetector.getMemoryGrowth();
      // Should not use more than 50MB for processing large CSS files
      expect(growth).toBeLessThan(50 * 1024 * 1024);
    });

    it('should clean up memory after processing', async () => {
      memoryDetector.takeSnapshot('before-processing');
      
      const input = generateTestCSS(200);
      await processCss(input, defaultTestOptions);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      memoryDetector.takeSnapshot('after-gc');
      
      const growth = memoryDetector.getMemoryGrowth();
      // Memory growth should be reasonable (allow up to 10MB for processing)
      expect(growth).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Configuration Performance Impact', () => {
    it('should perform well with custom properties enabled', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, {
          ...defaultTestOptions,
          generateCustomProperties: true
        });
      });
      
      expect(time).toBeLessThan(300);
    });

    it('should perform well with custom properties disabled', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, {
          ...defaultTestOptions,
          generateCustomProperties: false
        });
      });
      
      expect(time).toBeLessThan(200);
    });

    it('should perform well with custom media enabled', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, {
          ...defaultTestOptions,
          generateCustomMedia: true
        });
      });
      
      expect(time).toBeLessThan(300);
    });

    it('should perform well with custom media disabled', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, {
          ...defaultTestOptions,
          generateCustomMedia: false
        });
      });
      
      expect(time).toBeLessThan(200);
    });

    it('should perform well in development mode', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, developmentTestOptions);
      });
      
      expect(time).toBeLessThan(400);
    });

    it('should perform well in production mode', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, productionTestOptions);
      });
      
      expect(time).toBeLessThan(300);
    });
  });

  describe('Scalability Tests', () => {
    it('should scale linearly with CSS size', async () => {
      const sizes = [10, 50, 100, 200];
      const times: number[] = [];
      
      for (const size of sizes) {
        const input = generateTestCSS(size);
        
        const { time } = await measureTimeAsync(async () => {
          await processCss(input, defaultTestOptions);
        });
        
        times.push(time);
      }
      
      // Check that processing time scales reasonably
      for (let i = 1; i < times.length; i++) {
        const ratio = times[i] / times[i - 1];
        const sizeRatio = sizes[i] / sizes[i - 1];
        
        // Processing time should not grow faster than CSS size
        expect(ratio).toBeLessThanOrEqual(sizeRatio * 2);
      }
    });

    it('should handle concurrent processing efficiently', async () => {
      const input = generateTestCSS(50);
      
      const startTime = performance.now();
      
      // Process multiple CSS files concurrently
      const promises = Array.from({ length: 10 }, () => 
        processCss(input, defaultTestOptions)
      );
      
      await Promise.all(promises);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Concurrent processing should be faster than sequential
      expect(totalTime).toBeLessThan(1000);
    });

    it('should handle very large CSS files', async () => {
      const input = generateLargeCSS(2000);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should handle 2000 rules in less than 5 seconds
      expect(time).toBeLessThan(5000);
    });
  });

  describe('Performance Metrics', () => {
    it('should provide accurate performance metrics', async () => {
      const input = generateTestCSS(100);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      expect(metrics.executionTime).toBeGreaterThan(0);
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(metrics.transformations).toBeGreaterThan(0);
      expect(metrics.cssSize).toBeGreaterThan(0);
      expect(metrics.customPropertiesGenerated).toBeGreaterThan(0);
      expect(metrics.mediaQueriesGenerated).toBeGreaterThan(0);
      expect(metrics.errors).toBe(0);
    });

    it('should meet performance thresholds', async () => {
      const input = generateTestCSS(100);
      
      const { metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 500);
      EnterpriseAssertions.shouldMeetMemoryThreshold(metrics, 10 * 1024 * 1024);
    });

    it('should provide consistent performance metrics', async () => {
      const input = generateTestCSS(50);
      const metrics: TestMetrics[] = [];
      
      // Run multiple times to check consistency
      for (let i = 0; i < 5; i++) {
        const { metrics: result } = processCssWithMetrics(input, defaultTestOptions);
        metrics.push(result);
      }
      
      // Check that metrics are reasonably consistent
      const avgTime = metrics.reduce((sum, m) => sum + m.executionTime, 0) / metrics.length;
      const maxTime = Math.max(...metrics.map(m => m.executionTime));
      const minTime = Math.min(...metrics.map(m => m.executionTime));
      
      // Max time should not be more than 3x the min time
      expect(maxTime).toBeLessThan(minTime * 3);
    });
  });

  describe('Optimization Tests', () => {
    it('should optimize CSS output size', async () => {
      const input = generateTestCSS(100);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // CSS should be reasonably sized
      expect(metrics.cssSize).toBeGreaterThan(0);
      expect(metrics.cssSize).toBeLessThan(100 * 1024); // Less than 100KB
    });

    it('should minimize custom property generation', async () => {
      const input = `
        .test1 { font-size: rre(16); }
        .test2 { font-size: rre(16); }
        .test3 { font-size: rre(16); }
      `;
      
      const { metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should generate custom properties for each rre() call plus responsive variants
      // 3 base properties (one per class) + 9 responsive variants (3 classes × 3 breakpoints) = 12 total
      expect(metrics.customPropertiesGenerated).toBe(12);
    });

    it('should optimize media query generation', async () => {
      const input = `
        .test1 { font-size: rre(16); }
        .test2 { padding: rre(12); }
        .test3 { margin: rre(8); }
      `;
      
      const { metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should generate media queries for each breakpoint
      expect(metrics.mediaQueriesGenerated).toBeGreaterThan(0);
    });
  });

  describe('Stress Tests', () => {
    it('should handle rapid successive processing', async () => {
      const input = generateTestCSS(50);
      
      const startTime = performance.now();
      
      // Process CSS rapidly
      for (let i = 0; i < 20; i++) {
        await processCss(input, defaultTestOptions);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle rapid processing efficiently
      expect(totalTime).toBeLessThan(2000);
    });

    it('should handle mixed CSS content efficiently', async () => {
      const input = `
        ${generateTestCSS(50)}
        ${generateComplexCSS()}
        .normal { color: red; background: blue; }
        .another-normal { border: 1px solid black; }
      `;
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(500);
    });

    it('should handle edge case CSS efficiently', async () => {
      const input = `
        .test { font-size: rre(16); }
        .malformed { font-size: rre(); }
        .normal { color: red; }
        .another-test { padding: rre(12); }
      `;
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(100);
    });
  });

  describe('Performance Regression Tests', () => {
    it('should maintain performance with simple CSS', async () => {
      const input = '.test { font-size: rre(16); }';
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process simple CSS in less than 10ms
      expect(time).toBeLessThan(10);
    });

    it('should maintain performance with medium CSS', async () => {
      const input = generateTestCSS(25);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process medium CSS in less than 100ms
      expect(time).toBeLessThan(100);
    });

    it('should maintain performance with large CSS', async () => {
      const input = generateTestCSS(100);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process large CSS in less than 300ms
      expect(time).toBeLessThan(300);
    });
  });

  describe('Performance Comparison Tests', () => {
    it('should compare performance between configurations', async () => {
      const input = generateTestCSS(100);
      
      const configs = [
        { name: 'default', options: defaultTestOptions },
        { name: 'development', options: developmentTestOptions },
        { name: 'production', options: productionTestOptions },
        { name: 'no-custom-props', options: { ...defaultTestOptions, generateCustomProperties: false } },
        { name: 'no-custom-media', options: { ...defaultTestOptions, generateCustomMedia: false } }
      ];
      
      const results: { name: string; time: number }[] = [];
      
      for (const config of configs) {
        const { time } = await measureTimeAsync(async () => {
          await processCss(input, config.options);
        });
        
        results.push({ name: config.name, time });
      }
      
      // All configurations should perform reasonably
      for (const result of results) {
        expect(result.time).toBeLessThan(500);
      }
      
      // Production should be faster than development
      const productionResult = results.find(r => r.name === 'production');
      const developmentResult = results.find(r => r.name === 'development');
      
      if (productionResult && developmentResult) {
        expect(productionResult.time).toBeLessThanOrEqual(developmentResult.time * 1.5);
      }
    });
  });
});
