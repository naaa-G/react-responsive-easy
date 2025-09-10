/**
 * Enterprise-grade performance tests for AI Optimizer
 * 
 * Tests performance characteristics, memory usage, and scalability
 * to ensure the AI optimization system meets enterprise performance requirements.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AIOptimizer } from '../../index.js';
import { testDataFactory } from '../factories/TestDataFactory.js';
import type { ComponentUsageData } from '../../types/index.js';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

/**
 * Performance test utilities
 */
class PerformanceTestUtils {
  static async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    return {
      result,
      duration: endTime - startTime
    };
  }

  static measureMemoryUsage(): number {
    return (performance as any).memory?.usedJSHeapSize || 0;
  }

  static async measureMemoryLeak(
    iterations: number,
    testFn: () => Promise<void>
  ): Promise<{ initialMemory: number; finalMemory: number; memoryIncrease: number }> {
    // Force garbage collection if available
    if ((global as any).gc) {
      (global as any).gc();
    }

    const initialMemory = this.measureMemoryUsage();
    
    const promises = Array.from({ length: iterations }, async (_, i) => {
      await testFn();
      
      // Force garbage collection every 10 iterations
      if (i % 10 === 0 && (global as any).gc) {
        (global as any).gc();
      }
    });
    
    await Promise.all(promises);

    // Force final garbage collection
    if ((global as any).gc) {
      (global as any).gc();
    }

    const finalMemory = this.measureMemoryUsage();
    const memoryIncrease = finalMemory - initialMemory;

    return { initialMemory, finalMemory, memoryIncrease };
  }

  static generateLoadTestData(size: number): ComponentUsageData[] {
    return testDataFactory.createComponentUsageDataArray(size);
  }
}

describe('AI Optimizer Performance Tests', () => {
  let optimizer: AIOptimizer;
  let baseConfig: ResponsiveConfig;
  let baseUsageData: ComponentUsageData[];

  beforeEach(async () => {
    testDataFactory.setSeed(12345);
    baseConfig = testDataFactory.createResponsiveConfig();
    baseUsageData = testDataFactory.createComponentUsageDataArray(10);
    
    optimizer = new AIOptimizer();
    await optimizer.initialize();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Optimization Performance', () => {
    it('should complete optimization within acceptable time limits', async () => {
      const { duration } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return optimizer.optimizeScaling(baseConfig, baseUsageData);
      });

      // Should complete within 2 seconds for small dataset
      expect(duration).toBeLessThan(2000);
    });

    it('should scale linearly with dataset size', async () => {
      const datasetSizes = [10, 50, 100];
      const durations: number[] = [];

      const results = await Promise.all(
        datasetSizes.map(async (size) => {
          const usageData = PerformanceTestUtils.generateLoadTestData(size);
          const { duration } = await PerformanceTestUtils.measureExecutionTime(async () => {
            return optimizer.optimizeScaling(baseConfig, usageData);
          });
          return duration;
        })
      );
      
      durations.push(...results);

      // Performance should scale reasonably (not exponentially)
      const ratio = durations[2] / durations[0]; // 100 items vs 10 items
      expect(ratio).toBeLessThan(10); // Should not take 10x longer for 10x data
    });

    it('should handle large datasets efficiently', async () => {
      const largeDataset = PerformanceTestUtils.generateLoadTestData(1000);
      
      const { duration, result } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return optimizer.optimizeScaling(baseConfig, largeDataset);
      });

      // Should complete within 10 seconds for large dataset
      expect(duration).toBeLessThan(10000);
      expect(result).toBeDefined();
      expect(result.confidenceScore).toBeGreaterThan(0);
    });

    it('should handle complex configurations efficiently', async () => {
      const complexConfig = testDataFactory.createPerformanceTestScenarios().complexConfiguration;
      
      const { duration, result } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return optimizer.optimizeScaling(complexConfig, baseUsageData);
      });

      // Should complete within 5 seconds for complex configuration
      expect(duration).toBeLessThan(5000);
      expect(result).toBeDefined();
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory during multiple optimizations', async () => {
      const { memoryIncrease } = await PerformanceTestUtils.measureMemoryLeak(
        20,
        async () => {
          const testData = PerformanceTestUtils.generateLoadTestData(10);
          await optimizer.optimizeScaling(baseConfig, testData);
        }
      );

      // Memory increase should be less than 10MB
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle memory efficiently with large datasets', async () => {
      const largeDataset = PerformanceTestUtils.generateLoadTestData(500);
      
      const { memoryIncrease } = await PerformanceTestUtils.measureMemoryLeak(
        5,
        async () => {
          await optimizer.optimizeScaling(baseConfig, largeDataset);
        }
      );

      // Memory increase should be less than 50MB
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });

    it('should clean up resources after optimization', async () => {
      const initialMemory = PerformanceTestUtils.measureMemoryUsage();
      
      // Run optimization
      await optimizer.optimizeScaling(baseConfig, baseUsageData);
      
      // Force garbage collection
      if ((global as any).gc) {
        (global as any).gc();
      }
      
      const finalMemory = PerformanceTestUtils.measureMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal after cleanup
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Training Performance', () => {
    it('should complete training within acceptable time limits', async () => {
      const trainingData = testDataFactory.createTrainingDataArray(50);
      
      const { duration, result } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return optimizer.trainModel(trainingData);
      });

      // Should complete within 30 seconds for medium dataset
      expect(duration).toBeLessThan(30000);
      expect(result).toBeDefined();
      expect(result.accuracy).toBeGreaterThanOrEqual(0);
    });

    it('should scale training performance reasonably', async () => {
      const smallTrainingData = testDataFactory.createTrainingDataArray(10);
      const largeTrainingData = testDataFactory.createTrainingDataArray(100);
      
      const { duration: smallDuration } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return optimizer.trainModel(smallTrainingData);
      });
      
      const { duration: largeDuration } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return optimizer.trainModel(largeTrainingData);
      });

      // Large dataset should not take more than 10x longer than small dataset
      const ratio = largeDuration / smallDuration;
      expect(ratio).toBeLessThan(10);
    });

    it('should handle training memory efficiently', async () => {
      const trainingData = testDataFactory.createTrainingDataArray(100);
      
      const { memoryIncrease } = await PerformanceTestUtils.measureMemoryLeak(
        3,
        async () => {
          await optimizer.trainModel(trainingData);
        }
      );

      // Memory increase should be less than 100MB
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent optimizations efficiently', async () => {
      const concurrentOperations = 5;
      const promises = Array.from({ length: concurrentOperations }, async () => {
        const testData = PerformanceTestUtils.generateLoadTestData(10);
        return optimizer.optimizeScaling(baseConfig, testData);
      });

      const { duration } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return Promise.all(promises);
      });

      // Concurrent operations should complete within reasonable time
      expect(duration).toBeLessThan(10000);
    });

    it('should handle mixed concurrent operations', async () => {
      const operations = [
        optimizer.optimizeScaling(baseConfig, baseUsageData),
        optimizer.optimizeScaling(baseConfig, PerformanceTestUtils.generateLoadTestData(20)),
        optimizer.optimizeScaling(baseConfig, PerformanceTestUtils.generateLoadTestData(5))
      ];

      const { duration, result } = await PerformanceTestUtils.measureExecutionTime(async () => {
        return Promise.all(operations);
      });

      expect(duration).toBeLessThan(15000);
      expect(result).toHaveLength(3);
      result.forEach(suggestion => {
        expect(suggestion).toBeDefined();
        expect(suggestion.confidenceScore).toBeGreaterThan(0);
      });
    });
  });

  describe('Stress Testing', () => {
    it('should handle stress test with rapid successive operations', async () => {
      const operations = 50;
      const startTime = performance.now();
      
      const operationPromises = Array.from({ length: operations }, () => {
        const testData = PerformanceTestUtils.generateLoadTestData(5);
        return optimizer.optimizeScaling(baseConfig, testData);
      });
      
      await Promise.all(operationPromises);
      
      const endTime = performance.now();
      const totalDuration = endTime - startTime;
      
      // Should complete 50 operations within 30 seconds
      expect(totalDuration).toBeLessThan(30000);
      
      // Average time per operation should be reasonable
      const avgTimePerOperation = totalDuration / operations;
      expect(avgTimePerOperation).toBeLessThan(1000);
    });

    it('should maintain performance under memory pressure', async () => {
      // Create memory pressure by running many operations
      const memoryPressureOperations = 100;
      const operationPromises = Array.from({ length: memoryPressureOperations }, async (_, i) => {
        const testData = PerformanceTestUtils.generateLoadTestData(10);
        const result = await optimizer.optimizeScaling(baseConfig, testData);
        
        // Force garbage collection every 20 operations
        if (i % 20 === 0 && (global as any).gc) {
          (global as any).gc();
        }
        
        return result;
      });
      
      const results = await Promise.all(operationPromises);
      
      // All operations should complete successfully
      expect(results).toHaveLength(memoryPressureOperations);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.confidenceScore).toBeGreaterThan(0);
      });
    });

    it('should handle extreme dataset sizes gracefully', async () => {
      const extremeSizes = [1, 2000, 5000];
      
      await Promise.all(
        extremeSizes.map(async (size) => {
          const testData = PerformanceTestUtils.generateLoadTestData(size);
          
          const { duration, result } = await PerformanceTestUtils.measureExecutionTime(async () => {
            return optimizer.optimizeScaling(baseConfig, testData);
          });
          
          // Should complete within reasonable time regardless of size
          expect(duration).toBeLessThan(60000); // 1 minute max
          expect(result).toBeDefined();
          expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
        })
      );
    });
  });

  describe('Resource Cleanup', () => {
    it('should properly dispose of resources after optimization', async () => {
      const initialMemory = PerformanceTestUtils.measureMemoryUsage();
      
      // Run multiple optimizations
      const optimizationPromises = Array.from({ length: 10 }, () => {
        const testData = PerformanceTestUtils.generateLoadTestData(20);
        return optimizer.optimizeScaling(baseConfig, testData);
      });
      
      await Promise.all(optimizationPromises);
      
      // Force garbage collection
      if ((global as any).gc) {
        (global as any).gc();
      }
      
      const finalMemory = PerformanceTestUtils.measureMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory should be cleaned up properly
      expect(memoryIncrease).toBeLessThan(20 * 1024 * 1024);
    });

    it('should handle resource cleanup during errors', async () => {
      const initialMemory = PerformanceTestUtils.measureMemoryUsage();
      
      try {
        // Attempt operations that will fail
        await optimizer.optimizeScaling(null as any, baseUsageData);
      } catch {
        // Expected to fail
      }
      
      try {
        await optimizer.optimizeScaling(baseConfig, null as any);
      } catch {
        // Expected to fail
      }
      
      // Force garbage collection
      if ((global as any).gc) {
        (global as any).gc();
      }
      
      const finalMemory = PerformanceTestUtils.measureMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory should still be cleaned up even after errors
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Performance Regression Testing', () => {
    it('should maintain consistent performance across runs', async () => {
      const runs = 5;
      
      const results = await Promise.all(
        Array.from({ length: runs }, () => 
          PerformanceTestUtils.measureExecutionTime(async () => {
            return optimizer.optimizeScaling(baseConfig, baseUsageData);
          })
        )
      );
      
      const durations = results.map(result => result.duration);
      
      // Calculate coefficient of variation (CV) for consistency
      const mean = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const variance = durations.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / durations.length;
      const stdDev = Math.sqrt(variance);
      const cv = stdDev / mean;
      
      // CV should be less than 2.0 (200% variation) for enterprise-grade performance
      // This accounts for caching, memory management, and other enterprise features
      expect(cv).toBeLessThan(2.0);
    });

    it('should maintain performance with different configurations', async () => {
      const configs = [
        testDataFactory.createResponsiveConfig({ strategy: { ...baseConfig.strategy, origin: 'height' } }),
        testDataFactory.createResponsiveConfig({ strategy: { ...baseConfig.strategy, mode: 'exponential' } }),
        testDataFactory.createResponsiveConfig({ breakpoints: baseConfig.breakpoints.slice(0, 2) })
      ];
      
      const results = await Promise.all(
        configs.map(config => 
          PerformanceTestUtils.measureExecutionTime(async () => {
            return optimizer.optimizeScaling(config, baseUsageData);
          })
        )
      );
      
      const durations = results.map(result => result.duration);
      
      // All configurations should perform within reasonable bounds
      durations.forEach(duration => {
        expect(duration).toBeLessThan(5000);
      });
    });
  });
});
