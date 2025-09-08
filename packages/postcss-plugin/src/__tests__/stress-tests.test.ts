/**
 * Stress tests for PostCSS plugin
 * Tests behavior under extreme conditions and memory leak detection
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
  generateMalformedCSS,
  measureTime,
  measureTimeAsync,
  defaultTestOptions
} from './utils/test-helpers';
import {
  processCssWithMetrics,
  PerformanceBenchmark,
  MemoryLeakDetector,
  TestDataGenerator,
  EnterpriseAssertions,
  type TestMetrics
} from './utils/enterprise-test-helpers';

describe('PostCSS Plugin Stress Tests', () => {
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

  describe('High Volume Processing', () => {
    it('should handle 1000 simple transformations efficiently', async () => {
      const input = generateTestCSS(1000);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process 1000 rules in less than 5 seconds
      expect(time).toBeLessThan(5000);
    });

    it('should handle 500 complex transformations efficiently', async () => {
      let input = '';
      for (let i = 0; i < 500; i++) {
        input += generateComplexCSS();
      }
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process 500 complex CSS blocks in less than 10 seconds
      expect(time).toBeLessThan(10000);
    });

    it('should handle very large CSS files', async () => {
      const input = generateLargeCSS(5000);
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      // Should process 5000 rules in less than 15 seconds
      expect(time).toBeLessThan(15000);
    });

    it('should handle mixed content efficiently', async () => {
      const input = `
        ${generateTestCSS(500)}
        ${generateComplexCSS()}
        ${generateMalformedCSS()}
        .normal { color: red; background: blue; }
        .another-normal { border: 1px solid black; }
      `;
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(3000);
    });
  });

  describe('Memory Leak Detection', () => {
    it('should not leak memory with repeated processing', async () => {
      memoryDetector.takeSnapshot('initial');
      
      const input = generateTestCSS(100);
      
      // Process CSS multiple times
      for (let i = 0; i < 50; i++) {
        await processCss(input, defaultTestOptions);
        if (i % 10 === 0) {
          memoryDetector.takeSnapshot(`iteration-${i}`);
        }
      }
      
      const leaks = memoryDetector.detectLeaks();
      expect(leaks).toHaveLength(0);
    });

    it('should not leak memory with large CSS processing', async () => {
      memoryDetector.takeSnapshot('before-large');
      
      const input = generateLargeCSS(2000);
      await processCss(input, defaultTestOptions);
      
      memoryDetector.takeSnapshot('after-large');
      
      const growth = memoryDetector.getMemoryGrowth();
      // Should not use more than 100MB for processing large CSS files
      expect(growth).toBeLessThan(100 * 1024 * 1024);
    });

    it('should clean up memory after processing', async () => {
      memoryDetector.takeSnapshot('before-processing');
      
      const input = generateTestCSS(1000);
      await processCss(input, defaultTestOptions);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      memoryDetector.takeSnapshot('after-gc');
      
      const growth = memoryDetector.getMemoryGrowth();
      // Memory growth should be reasonable after GC
      expect(growth).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle memory pressure gracefully', async () => {
      memoryDetector.takeSnapshot('initial');
      
      // Process multiple large CSS files
      for (let i = 0; i < 10; i++) {
        const input = generateLargeCSS(1000);
        await processCss(input, defaultTestOptions);
        
        if (i % 2 === 0) {
          memoryDetector.takeSnapshot(`iteration-${i}`);
        }
      }
      
      const leaks = memoryDetector.detectLeaks();
      // Allow some memory growth under pressure, but not excessive leaks
      expect(leaks.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Concurrent Processing Stress', () => {
    it('should handle concurrent processing efficiently', async () => {
      const input = generateTestCSS(100);
      
      const startTime = performance.now();
      
      // Process multiple CSS files concurrently
      const promises = Array.from({ length: 20 }, () => 
        processCss(input, defaultTestOptions)
      );
      
      await Promise.all(promises);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Concurrent processing should be faster than sequential
      expect(totalTime).toBeLessThan(2000);
    });

    it('should handle mixed concurrent processing', async () => {
      const inputs = [
        generateTestCSS(50),
        generateComplexCSS(),
        generateLargeCSS(200),
        generateMalformedCSS()
      ];
      
      const startTime = performance.now();
      
      // Process different types of CSS concurrently
      const promises = Array.from({ length: 10 }, (_, i) => 
        processCss(inputs[i % inputs.length], defaultTestOptions)
      );
      
      await Promise.all(promises);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(3000);
    });

    it('should handle high concurrency without errors', async () => {
      const input = generateTestCSS(50);
      
      // Process 50 CSS files concurrently
      const promises = Array.from({ length: 50 }, () => 
        processCss(input, defaultTestOptions)
      );
      
      const results = await Promise.allSettled(promises);
      
      // All should succeed
      const failures = results.filter(result => result.status === 'rejected');
      expect(failures).toHaveLength(0);
    });
  });

  describe('Error Recovery Stress', () => {
    it('should handle many malformed CSS gracefully', async () => {
      const input = `
        .valid { font-size: rre(16); }
        .malformed1 { font-size: rre(); }
        .malformed2 { padding: rre(invalid); }
        .malformed3 { margin: rre(16, invalid-token); }
        .valid2 { padding: rre(12); }
        .malformed4 { width: rre(100, 'spacing', extra-param); }
        .valid3 { height: rre(20); }
      `;
      
      const { css, errors } = await processCssWithMetrics(input, defaultTestOptions);
      
      // Should not throw errors
      expect(errors).toHaveLength(0);
      
      // Should process valid parts
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-padding)');
      expect(css).toContain('var(--rre-height)');
      
      // Should preserve malformed parts
      expect(css).toContain('rre()');
      expect(css).toContain('rre(invalid)');
    });

    it('should handle CSS with many syntax errors', async () => {
      const input = `
        .test1 { font-size: rre(16); }
        .test2 { padding: rre(12); }
        .test3 { margin: rre(8); }
        .malformed1 { font-size: rre(); }
        .malformed2 { padding: rre(invalid); }
        .malformed3 { margin: rre(16, invalid-token); }
        .test4 { border-radius: rre(4); }
        .test5 { width: rre(100); }
      `;
      
      const { css, errors } = await processCssWithMetrics(input, defaultTestOptions);
      
      // Should not throw errors
      expect(errors).toHaveLength(0);
      
      // Should process valid parts
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-padding)');
      expect(css).toContain('var(--rre-margin)');
      expect(css).toContain('var(--rre-border-radius)');
      expect(css).toContain('var(--rre-width)');
    });

    it('should handle CSS with mixed valid and invalid content', async () => {
      const input = `
        .valid { font-size: rre(16); }
        .normal { color: red; }
        .malformed { font-size: rre(); }
        .another-valid { padding: rre(12); }
        .another-normal { background: blue; }
        .another-malformed { padding: rre(invalid); }
      `;
      
      const { css, errors } = await processCssWithMetrics(input, defaultTestOptions);
      
      // Should not throw errors
      expect(errors).toHaveLength(0);
      
      // Should process valid parts
      expect(css).toContain('var(--rre-font-size)');
      expect(css).toContain('var(--rre-padding)');
      
      // Should preserve normal CSS
      expect(css).toContain('color: red');
      expect(css).toContain('background: blue');
    });
  });

  describe('Performance Under Stress', () => {
    it('should maintain performance with repeated processing', async () => {
      const input = generateTestCSS(100);
      const times: number[] = [];
      
      // Process CSS multiple times
      for (let i = 0; i < 20; i++) {
        const { time } = await measureTimeAsync(async () => {
          await processCss(input, defaultTestOptions);
        });
        
        times.push(time);
      }
      
      // Performance should remain consistent
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      
      // Max time should not be more than 3x the min time
      expect(maxTime).toBeLessThan(minTime * 3);
      
      // Average time should be reasonable
      expect(avgTime).toBeLessThan(200);
    });

    it('should maintain performance with increasing CSS size', async () => {
      const sizes = [10, 50, 100, 200, 500, 1000];
      const times: number[] = [];
      
      for (const size of sizes) {
        const input = generateTestCSS(size);
        
        const { time } = await measureTimeAsync(async () => {
          await processCss(input, defaultTestOptions);
        });
        
        times.push(time);
      }
      
      // Check that performance scales reasonably
      for (let i = 1; i < times.length; i++) {
        const ratio = times[i] / times[i - 1];
        const sizeRatio = sizes[i] / sizes[i - 1];
        
        // Processing time should not grow faster than CSS size
        expect(ratio).toBeLessThanOrEqual(sizeRatio * 2);
      }
    });

    it('should handle performance under memory pressure', async () => {
      memoryDetector.takeSnapshot('initial');
      
      const input = generateTestCSS(200);
      const times: number[] = [];
      
      // Process CSS multiple times to create memory pressure
      for (let i = 0; i < 30; i++) {
        const { time } = await measureTimeAsync(async () => {
          await processCss(input, defaultTestOptions);
        });
        
        times.push(time);
        
        if (i % 10 === 0) {
          memoryDetector.takeSnapshot(`iteration-${i}`);
        }
      }
      
      // Performance should not degrade significantly
      const earlyTimes = times.slice(0, 10);
      const lateTimes = times.slice(-10);
      
      const earlyAvg = earlyTimes.reduce((sum, time) => sum + time, 0) / earlyTimes.length;
      const lateAvg = lateTimes.reduce((sum, time) => sum + time, 0) / lateTimes.length;
      
      // Late performance should not be more than 2x early performance
      expect(lateAvg).toBeLessThan(earlyAvg * 2);
    });
  });

  describe('Edge Case Stress Tests', () => {
    it('should handle CSS with many nested selectors', async () => {
      let input = '';
      for (let i = 0; i < 100; i++) {
        input += `
          .level-${i} {
            .nested-${i} {
              .deep-${i} {
                font-size: rre(${16 + i});
                padding: rre(${12 + i});
              }
            }
          }
        `;
      }
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(2000);
    });

    it('should handle CSS with many pseudo-selectors', async () => {
      let input = '';
      const pseudoSelectors = [':hover', ':focus', ':active', ':visited', ':before', ':after'];
      
      for (let i = 0; i < 50; i++) {
        for (const pseudo of pseudoSelectors) {
          input += `
            .test-${i}${pseudo} {
              font-size: rre(${16 + i});
              padding: rre(${12 + i});
            }
          `;
        }
      }
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(3000);
    });

    it('should handle CSS with many media queries', async () => {
      let input = '';
      const breakpoints = [320, 480, 768, 1024, 1200, 1440, 1920];
      
      for (let i = 0; i < 20; i++) {
        for (const breakpoint of breakpoints) {
          input += `
            @media (max-width: ${breakpoint}px) {
              .test-${i} {
                font-size: rre(${16 + i});
                padding: rre(${12 + i});
              }
            }
          `;
        }
      }
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(2000);
    });

    it('should handle CSS with many calc() expressions', async () => {
      let input = '';
      for (let i = 0; i < 100; i++) {
        input += `
          .calc-${i} {
            width: calc(100% - rre(${20 + i}));
            height: calc(100vh - rre(${40 + i}));
            padding: calc(rre(${10 + i}) + rre(${5 + i}));
            margin: calc(rre(${8 + i}) * 2);
          }
        `;
      }
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(2000);
    });
  });

  describe('Resource Exhaustion Tests', () => {
    it('should handle very deep nesting', async () => {
      let input = '.deep';
      for (let i = 0; i < 50; i++) {
        input += ' .level-' + i;
      }
      input += ' { font-size: rre(16); }';
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(1000);
    });

    it('should handle very long property names', async () => {
      const longProperty = 'a'.repeat(1000);
      const input = `
        .test {
          ${longProperty}: rre(16);
        }
      `;
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(1000);
    });

    it('should handle very long values', async () => {
      const longValue = 'a'.repeat(1000);
      const input = `
        .test {
          content: "${longValue}";
          font-size: rre(16);
        }
      `;
      
      const { time } = await measureTimeAsync(async () => {
        await processCss(input, defaultTestOptions);
      });
      
      expect(time).toBeLessThan(1000);
    });
  });

  describe('Stress Test Results', () => {
    it('should provide comprehensive stress test metrics', async () => {
      const input = generateTestCSS(500);
      
      const { metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Check all metrics are present
      expect(metrics.executionTime).toBeGreaterThan(0);
      // Memory usage can be negative if memory was freed during processing
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(-50 * 1024 * 1024); // Allow up to 50MB memory reduction
      expect(metrics.transformations).toBeGreaterThan(0);
      expect(metrics.cssSize).toBeGreaterThan(0);
      expect(metrics.customPropertiesGenerated).toBeGreaterThan(0);
      expect(metrics.mediaQueriesGenerated).toBeGreaterThan(0);
      expect(metrics.errors).toBe(0);
      
      // Check performance thresholds
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, 2000);
      EnterpriseAssertions.shouldMeetMemoryThreshold(metrics, 50 * 1024 * 1024);
    });

    it('should maintain quality under stress', async () => {
      const input = generateTestCSS(200);
      
      const { css, metrics } = processCssWithMetrics(input, defaultTestOptions);
      
      // Should generate valid CSS
      expect(css).toContain('var(--rre-');
      expect(css).toContain(':root');
      expect(css).toContain('@media');
      
      // Should have reasonable metrics
      expect(metrics.transformations).toBeGreaterThan(0);
      expect(metrics.customPropertiesGenerated).toBeGreaterThan(0);
      expect(metrics.mediaQueriesGenerated).toBeGreaterThan(0);
    });
  });
});
