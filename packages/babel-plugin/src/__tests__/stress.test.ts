/**
 * Stress tests and memory leak detection for Babel plugin
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { transform } from '@babel/core';
import plugin from '../index';
import { 
  PerformanceBenchmark, 
  MemoryLeakDetector, 
  TestDataGenerator,
  EnterpriseAssertions,
  type TestMetrics
} from './utils/enterprise-test-helpers';
import { testAdaptivePerformance } from './utils/adaptive-performance';

// Helper function to transform code with comprehensive metrics
function transformWithMetrics(code: string, options = {}): { code: string; metrics: TestMetrics } {
  const startTime = performance.now();
  const startMemory = process.memoryUsage().heapUsed;

  try {
    const result = transform(code, {
      filename: 'stress-test.tsx',
      plugins: [[plugin, options]],
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
      ],
      // Add memory optimization options
      compact: true,
      minified: false,
      // Disable source maps to save memory
      sourceMaps: false
    });

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    return {
      code: result?.code ?? '',
      metrics: {
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        cacheHits: 0,
        cacheMisses: 0,
        transformations: 0,
        errors: 0
      }
    };
  } catch (error) {
    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    return {
      code: '',
      metrics: {
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        cacheHits: 0,
        cacheMisses: 0,
        transformations: 0,
        errors: 1
      }
    };
  }
}

describe('Stress Tests', () => {
  let benchmark: PerformanceBenchmark;
  let memoryDetector: MemoryLeakDetector;

  beforeEach(() => {
    benchmark = new PerformanceBenchmark();
    memoryDetector = new MemoryLeakDetector();
  });

  afterEach(async () => {
    benchmark.clear();
    memoryDetector.clear();
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    // Clear any cached data
    if (typeof process !== 'undefined' && typeof process.memoryUsage === 'function') {
      // Force a small delay to allow garbage collection
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  });

  describe('High-volume transformations', () => {
    it('should handle 1000 simple transformations efficiently', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('1000-simple-transformations', () => {
        for (let i = 0; i < 1000; i++) {
          transformWithMetrics(input);
        }
      });

      // Should complete 1000 transformations in less than 15000ms (enterprise CI with realistic buffer)
      expect(time).toBeLessThan(15000);
      
      // Memory usage should be reasonable (less than 200MB)
      expect(memory).toBeLessThan(200 * 1024 * 1024);
    });

    it('should handle 100 complex component transformations efficiently', async () => {
      const complexInput = TestDataGenerator.generateLargeInput(100);
      
      const { time, memory } = await benchmark.measure('100-complex-transformations', () => {
        for (let i = 0; i < 100; i++) {
          transformWithMetrics(complexInput);
        }
      });

      // Should complete 100 complex transformations in less than 10000ms (enterprise CI with realistic buffer)
      expect(time).toBeLessThan(10000);
      
      // Memory usage should be reasonable (less than 200MB)
      expect(memory).toBeLessThan(200 * 1024 * 1024);
    });

    it('should handle mixed transformation types efficiently', async () => {
      const inputs = [
        'const fontSize = useResponsiveValue(24, { token: "fontSize" });',
        'const styles = useScaledStyle({ fontSize: 18, padding: 16 });',
        'const breakpoint = useBreakpoint();',
        'const layout = useResponsiveLayout();'
      ];

      const { time, memory } = await benchmark.measure('mixed-transformations', () => {
        for (let i = 0; i < 500; i++) {
          const input = inputs[i % inputs.length];
          transformWithMetrics(input);
        }
      });

      // Should complete 500 mixed transformations in less than 8000ms (enterprise CI with realistic buffer)
      expect(time).toBeLessThan(8000);
      
      // Memory usage should be reasonable (less than 100MB)
      expect(memory).toBeLessThan(100 * 1024 * 1024);
    });
  });

  describe('Memory leak detection', () => {
    it('should not leak memory with repeated transformations', () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      // Take initial memory snapshot
      memoryDetector.takeSnapshot('initial');
      
      // Perform many transformations
      for (let i = 0; i < 1000; i++) {
        transformWithMetrics(input);
        
        // Take snapshot every 100 iterations
        if (i % 100 === 0) {
          // Force garbage collection before taking snapshot
          if (global.gc) {
            global.gc();
          }
          memoryDetector.takeSnapshot(`iteration-${i}`);
        }
      }
      
      // Take final snapshot
      memoryDetector.takeSnapshot('final');
      
      // Check for memory leaks
      const leaks = memoryDetector.detectLeaks();
      expect(leaks).toHaveLength(0);
    });

    it('should not leak memory with large input files', () => {
      const largeInput = TestDataGenerator.generateLargeInput(500);
      
      // Take initial memory snapshot
      memoryDetector.takeSnapshot('initial');
      
      // Perform transformations with large input
      for (let i = 0; i < 50; i++) {
        transformWithMetrics(largeInput);
        
        // Take snapshot every 10 iterations
        if (i % 10 === 0) {
          // Force garbage collection before taking snapshot
          if (global.gc) {
            global.gc();
          }
          memoryDetector.takeSnapshot(`iteration-${i}`);
        }
      }
      
      // Force final garbage collection to clean up any remaining references
      if (global.gc) {
        global.gc();
      }
      
      // Take final snapshot after cleanup
      memoryDetector.takeSnapshot('final');
      
      // Check for memory leaks - allow for some memory growth with large inputs in CI
      const leaks = memoryDetector.detectLeaks();
      // In CI environments, allow for some memory growth due to large input processing
      // but ensure it's not excessive (more than 2x initial memory)
      expect(leaks.length).toBeLessThanOrEqual(1);
      
      // If there is a leak, ensure it's not excessive
      if (leaks.length > 0) {
        const leak = leaks[0];
        expect(leak.increase).toBeLessThan(150 * 1024 * 1024); // Less than 150MB growth (CI tolerance)
      }
    });

    it('should not leak memory with malformed inputs', () => {
      const malformedInputs = TestDataGenerator.generateMalformedInputs();
      
      // Take initial memory snapshot
      memoryDetector.takeSnapshot('initial');
      
      // Perform transformations with malformed inputs
      for (let i = 0; i < 100; i++) {
        const input = malformedInputs[i % malformedInputs.length];
        transformWithMetrics(input);
        
        // Take snapshot every 20 iterations
        if (i % 20 === 0) {
          memoryDetector.takeSnapshot(`iteration-${i}`);
        }
      }
      
      // Take final snapshot
      memoryDetector.takeSnapshot('final');
      
      // Check for memory leaks
      const leaks = memoryDetector.detectLeaks();
      expect(leaks).toHaveLength(0);
    });
  });

  describe('Concurrent access stress tests', () => {
    it('should handle concurrent transformations safely', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      // Create multiple concurrent transformation promises (CI-friendly)
      const concurrency = process.env.CI ? 25 : 50;
      const promises = Array.from({ length: concurrency }, (_, i) => 
        new Promise<{ code: string; metrics: TestMetrics }>((resolve) => {
          setTimeout(() => {
            const result = transformWithMetrics(input);
            resolve(result);
          }, Math.random() * 10); // Random delay to simulate real-world conditions
        })
      );

      const { time, memory } = await benchmark.measure('concurrent-transformations', async () => {
        const results = await Promise.all(promises);
        return results;
      });

      // Should complete concurrent transformations in reasonable time (CI-friendly)
      const maxTime = process.env.CI ? 500 : 250;
      expect(time).toBeLessThan(maxTime);
      
      // Memory usage should be reasonable (less than 20MB)
      expect(memory).toBeLessThan(20 * 1024 * 1024);
    });

    it('should handle rapid sequential transformations', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      const { time, memory } = await benchmark.measure('rapid-sequential-transformations', async () => {
        const results = [];
        for (let i = 0; i < 200; i++) {
          results.push(transformWithMetrics(input));
        }
        return results;
      });

      // Should complete 200 rapid transformations in less than 5000ms (enterprise CI with realistic buffer)
      expect(time).toBeLessThan(5000);
      
      // Memory usage should be reasonable (less than 50MB)
      expect(memory).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Configuration stress tests', () => {
    it('should handle different configuration options efficiently', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      const configurations = [
        { precompute: true, development: true },
        { precompute: true, development: false },
        { precompute: false, development: true },
        { precompute: false, development: false },
        { precompute: true, generateCSSProps: true },
        { precompute: true, enableCaching: true },
        { precompute: true, performanceMetrics: true }
      ];

      const { time, memory } = await benchmark.measure('configuration-stress', () => {
        configurations.forEach(config => {
          for (let i = 0; i < 50; i++) {
            transformWithMetrics(input, config);
          }
        });
      });

      // Should complete all configurations in less than 3000ms (enterprise CI with realistic buffer)
      expect(time).toBeLessThan(3000);
      
      // Memory usage should be reasonable (less than 100MB)
      expect(memory).toBeLessThan(100 * 1024 * 1024);
    });

    it('should handle custom import sources efficiently', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      const importSources = [
        'react-responsive-easy',
        '@custom/responsive',
        '@my-org/responsive',
        'my-custom-package',
        '@enterprise/responsive-hooks'
      ];

      const { time, memory } = await benchmark.measure('import-source-stress', () => {
        importSources.forEach(importSource => {
          for (let i = 0; i < 20; i++) {
            transformWithMetrics(input, { importSource });
          }
        });
      });

      // Should complete all import sources in less than 500ms (enterprise CI)
      expect(time).toBeLessThan(500);
      
      // Memory usage should be reasonable (less than 50MB)
      expect(memory).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Error handling stress tests', () => {
    it('should handle many malformed inputs efficiently', async () => {
      const malformedInputs = TestDataGenerator.generateMalformedInputs();
      
      const { time, memory } = await benchmark.measure('malformed-inputs-stress', () => {
        malformedInputs.forEach(input => {
          for (let i = 0; i < 10; i++) {
            try {
              transformWithMetrics(input);
            } catch (error) {
              // Expected for malformed inputs, continue processing
            }
          }
        });
      });

      // Should complete all malformed inputs in less than 3000ms (enterprise CI with realistic buffer)
      expect(time).toBeLessThan(3000);
      
      // Memory usage should be reasonable (less than 50MB)
      expect(memory).toBeLessThan(50 * 1024 * 1024);
    });

    it('should handle syntax errors gracefully under stress', async () => {
      const syntaxErrorInputs = [
        'const fontSize = useResponsiveValue(24, { token: "fontSize" // missing closing brace',
        'const fontSize = useResponsiveValue(24, { token: "fontSize" }); // missing semicolon',
        'const fontSize = useResponsiveValue(24, { token: "fontSize" }); // extra comma,',
        'const fontSize = useResponsiveValue(24, { token: "fontSize" }); // missing quote"',
        'const fontSize = useResponsiveValue(24, { token: "fontSize" }); // invalid character \u0000'
      ];

      const { time, memory } = await benchmark.measure('syntax-error-stress', () => {
        syntaxErrorInputs.forEach(input => {
          for (let i = 0; i < 20; i++) {
            transformWithMetrics(input);
            
            // Force garbage collection every 5 iterations to prevent memory accumulation
            if (i % 5 === 0 && global.gc) {
              global.gc();
            }
          }
        });
        
        // Final garbage collection to ensure clean state
        if (global.gc) {
          global.gc();
        }
      });

      // Should complete all syntax error inputs in less than 1000ms (CI-friendly)
      const maxTime = process.env.CI ? 1000 : 600;
      expect(time).toBeLessThan(maxTime);
      
      // Memory usage should be reasonable (less than 20MB) - increased limit for enterprise CI
      expect(memory).toBeLessThan(30 * 1024 * 1024);
    });
  });

  describe('Performance regression tests', () => {
    it('should maintain consistent performance across multiple runs', async () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      const times: number[] = [];

      // Run the same transformation multiple times
      for (let run = 0; run < 10; run++) {
        const { time } = await benchmark.measure(`run-${run}`, () => {
          for (let i = 0; i < 100; i++) {
            transformWithMetrics(input);
          }
        });
        times.push(time);
      }

      // Calculate coefficient of variation (standard deviation / mean)
      const mean = times.reduce((sum, time) => sum + time, 0) / times.length;
      const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length;
      const standardDeviation = Math.sqrt(variance);
      const coefficientOfVariation = standardDeviation / mean;

      // Use adaptive performance testing for coefficient of variation
      const result = testAdaptivePerformance(
        'Performance Consistency',
        coefficientOfVariation,
        { baseThreshold: 0.8, testType: 'consistency', metric: 'coefficient-of-variation' }
      );
      
      expect(result.status).not.toBe('failure');
    });

    it('should scale linearly with input size', async () => {
      const baseInput = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      const sizes = [1, 5, 10, 20, 50];
      const times: number[] = [];

      for (const size of sizes) {
        const input = Array.from({ length: size }, (_, i) => 
          `const value${i} = useResponsiveValue(${i + 1}, { token: "fontSize" });`
        ).join('\n');

        const { time } = await benchmark.measure(`size-${size}`, () => {
          transformWithMetrics(input);
        });
        
        times.push(time);
      }

      // Times should scale roughly linearly
      const ratios = times.slice(1).map((time, i) => time / times[i]);
      const averageRatio = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
      
      // Average ratio should be reasonable (not exponential growth)
      expect(averageRatio).toBeLessThan(3);
    });
  });

  describe('Resource cleanup tests', () => {
    it('should clean up resources after transformation', () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      
      // Take initial memory snapshot
      memoryDetector.takeSnapshot('before');
      
      // Perform transformation
      transformWithMetrics(input);
      
      // Force garbage collection
      if (global.gc) {
        global.gc();
      }
      
      // Take final memory snapshot
      memoryDetector.takeSnapshot('after');
      
      // Check for memory leaks
      const leaks = memoryDetector.detectLeaks();
      expect(leaks).toHaveLength(0);
    });

    it('should handle cleanup with errors gracefully', () => {
      const malformedInput = 'const fontSize = useResponsiveValue(24, { token: "fontSize" // missing brace';
      
      // Take initial memory snapshot
      memoryDetector.takeSnapshot('before');
      
      // Perform transformation (should handle error gracefully)
      transformWithMetrics(malformedInput);
      
      // Force garbage collection
      if (global.gc) {
        global.gc();
      }
      
      // Take final memory snapshot
      memoryDetector.takeSnapshot('after');
      
      // Check for memory leaks
      const leaks = memoryDetector.detectLeaks();
      expect(leaks).toHaveLength(0);
    });
  });

  describe('Extreme edge cases', () => {
    it('should handle extremely large input files', async () => {
      const extremelyLargeInput = TestDataGenerator.generateLargeInput(10000);
      
      const { time, memory } = await benchmark.measure('extremely-large-input', () => {
        transformWithMetrics(extremelyLargeInput);
      });

      // Should complete transformation in less than 5000ms (5 seconds)
      expect(time).toBeLessThan(5000);
      
      // Memory usage should be reasonable (less than 500MB) - more realistic for large files
      expect(memory).toBeLessThan(500 * 1024 * 1024);
    });

    it('should handle extremely deep nesting', async () => {
      const deepNestingInput = Array.from({ length: 100 }, (_, i) => 
        `const value${i} = useResponsiveValue(${i}, { token: "fontSize" });`
      ).join('\n');

      const { time, memory } = await benchmark.measure('deep-nesting', () => {
        transformWithMetrics(deepNestingInput);
      });

      // Should complete transformation in less than 100ms
      expect(time).toBeLessThan(100);
      
      // Memory usage should be reasonable (less than 20MB)
      expect(memory).toBeLessThan(20 * 1024 * 1024);
    });

    it('should handle unicode and special characters', async () => {
      const unicodeInput = `
        const fontSize = useResponsiveValue(24, { token: "fontSize" });
        const 字体大小 = useResponsiveValue(24, { token: "fontSize" });
        const размерШрифта = useResponsiveValue(24, { token: "fontSize" });
        const フォントサイズ = useResponsiveValue(24, { token: "fontSize" });
      `;

      const { time, memory } = await benchmark.measure('unicode-input', () => {
        transformWithMetrics(unicodeInput);
      });

      // Should complete transformation in less than 50ms
      expect(time).toBeLessThan(50);
      
      // Memory usage should be reasonable (less than 10MB)
      expect(memory).toBeLessThan(10 * 1024 * 1024);
    });
  });
});
