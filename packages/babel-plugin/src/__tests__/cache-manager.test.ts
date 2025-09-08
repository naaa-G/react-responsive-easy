/**
 * Tests for cache manager functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CacheManager, cacheManager } from '../cache-manager';
import type { BabelPluginOptions, PerformanceMetrics } from '../types';

describe('CacheManager', () => {
  let cache: CacheManager;
  const mockOptions: BabelPluginOptions = {
    precompute: true,
    development: false,
    generateCSSProps: false,
    importSource: 'react-responsive-easy'
  };

  beforeEach(() => {
    cache = new CacheManager(5); // Small cache for testing
  });

  afterEach(() => {
    cache.clear();
  });

  describe('Basic cache operations', () => {
    it('should store and retrieve cached values', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'const fontSize = useMemo(() => { /* transformed */ }, []);';

      cache.set(input, output, mockOptions);
      const result = cache.get(input, mockOptions);

      expect(result).toBe(output);
    });

    it('should return null for non-existent keys', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const result = cache.get(input, mockOptions);

      expect(result).toBeNull();
    });

    it('should handle different options as separate cache entries', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output1 = 'transformed output 1';
      const output2 = 'transformed output 2';

      const options1: BabelPluginOptions = { ...mockOptions, development: true };
      const options2: BabelPluginOptions = { ...mockOptions, development: false };

      cache.set(input, output1, options1);
      cache.set(input, output2, options2);

      expect(cache.get(input, options1)).toBe(output1);
      expect(cache.get(input, options2)).toBe(output2);
    });

    it('should clear cache', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';

      cache.set(input, output, mockOptions);
      expect(cache.size()).toBe(1);

      cache.clear();
      expect(cache.size()).toBe(0);
    });
  });

  describe('Cache eviction', () => {
    it('should evict oldest entries when cache is full', () => {
      // Fill cache to capacity
      for (let i = 0; i < 5; i++) {
        cache.set(`input${i}`, `output${i}`, mockOptions);
      }

      expect(cache.size()).toBe(5);

      // Add one more entry to trigger eviction
      cache.set('input5', 'output5', mockOptions);

      expect(cache.size()).toBe(5);
      expect(cache.get('input0', mockOptions)).toBeNull(); // Oldest should be evicted
      expect(cache.get('input5', mockOptions)).toBe('output5'); // Newest should be present
    });

    it('should evict expired entries', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';

      // Mock Date.now to control time
      const originalNow = Date.now;
      const mockTime = 1000000;
      vi.spyOn(Date, 'now').mockReturnValue(mockTime);

      cache.set(input, output, mockOptions);
      expect(cache.get(input, mockOptions)).toBe(output);

      // Advance time beyond TTL (1 hour)
      vi.spyOn(Date, 'now').mockReturnValue(mockTime + 60 * 60 * 1000 + 1);

      expect(cache.get(input, mockOptions)).toBeNull();

      // Restore original Date.now
      vi.spyOn(Date, 'now').mockImplementation(originalNow);
    });
  });

  describe('Cache statistics', () => {
    it('should track cache hits and misses', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';

      // Miss
      cache.get(input, mockOptions);
      let stats = cache.getStats();
      expect(stats.metrics.cacheMisses).toBe(1);
      expect(stats.metrics.cacheHits).toBe(0);

      // Store and hit
      cache.set(input, output, mockOptions);
      cache.get(input, mockOptions);
      stats = cache.getStats();
      expect(stats.metrics.cacheHits).toBe(1);
      expect(stats.metrics.cacheMisses).toBe(1);
    });

    it('should calculate hit rate correctly', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';

      // 2 misses, 1 hit
      cache.get(input, mockOptions);
      cache.get(input, mockOptions);
      cache.set(input, output, mockOptions);
      cache.get(input, mockOptions);

      const stats = cache.getStats();
      expect(stats.hitRate).toBe(1 / 3); // 1 hit out of 3 total requests
    });

    it('should track performance metrics', () => {
      const transformTime = 15.5;
      const hasError = false;

      cache.updateMetrics(transformTime, hasError);
      cache.updateMetrics(10.2, false);
      cache.updateMetrics(5.1, true);

      const stats = cache.getStats();
      expect(stats.metrics.transformCount).toBe(3);
      expect(stats.metrics.totalTransformTime).toBeCloseTo(30.8, 1);
      expect(stats.metrics.averageTransformTime).toBeCloseTo(10.27, 2);
      expect(stats.metrics.errors).toBe(1);
    });

    it('should reset metrics', () => {
      cache.updateMetrics(10, false);
      cache.updateMetrics(20, true);

      let stats = cache.getStats();
      expect(stats.metrics.transformCount).toBe(2);

      cache.resetMetrics();
      stats = cache.getStats();
      expect(stats.metrics.transformCount).toBe(0);
      expect(stats.metrics.totalTransformTime).toBe(0);
      expect(stats.metrics.errors).toBe(0);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle empty input strings', () => {
      const input = '';
      const output = 'transformed output';

      cache.set(input, output, mockOptions);
      expect(cache.get(input, mockOptions)).toBe(output);
    });

    it('should handle very large input strings', () => {
      const input = 'a'.repeat(10000);
      const output = 'transformed output';

      cache.set(input, output, mockOptions);
      expect(cache.get(input, mockOptions)).toBe(output);
    });

    it('should handle special characters in input', () => {
      const input = 'const fontSize = useResponsiveValue(24, { token: "fontSize" });';
      const output = 'transformed output';

      cache.set(input, output, mockOptions);
      expect(cache.get(input, mockOptions)).toBe(output);
    });

    it('should handle complex options objects', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';
      const complexOptions: BabelPluginOptions = {
        precompute: true,
        development: true,
        generateCSSProps: true,
        importSource: '@custom/responsive',
        configPath: './custom-config.ts',
        enableCaching: true,
        cacheSize: 1000,
        enableMemoization: true,
        addComments: true,
        validateConfig: true,
        performanceMetrics: true,
        generateSourceMaps: true,
        preserveTypeInfo: true,
        minifyOutput: false,
        onTransform: vi.fn(),
        onError: vi.fn()
      };

      cache.set(input, output, complexOptions);
      expect(cache.get(input, complexOptions)).toBe(output);
    });

    it('should handle concurrent access safely', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';

      // Simulate concurrent access
      const promises = Array.from({ length: 10 }, (_, i) => 
        new Promise<void>((resolve) => {
          setTimeout(() => {
            cache.set(`${input}${i}`, `${output}${i}`, mockOptions);
            resolve();
          }, Math.random() * 10);
        })
      );

      return Promise.all(promises).then(() => {
        // Cache has maxSize of 5, so it should only keep the 5 most recent entries
        expect(cache.size()).toBe(5);
      });
    });
  });

  describe('Memory management', () => {
    it('should not leak memory with repeated operations', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform many cache operations
      for (let i = 0; i < 1000; i++) {
        const input = `const fontSize = useResponsiveValue(${i});`;
        const output = `transformed output ${i}`;
        
        cache.set(input, output, mockOptions);
        cache.get(input, mockOptions);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle cache size limits gracefully', () => {
      const largeCache = new CacheManager(2);
      
      // Fill cache beyond limit
      for (let i = 0; i < 5; i++) {
        largeCache.set(`input${i}`, `output${i}`, mockOptions);
      }

      expect(largeCache.size()).toBe(2);
    });
  });

  describe('Singleton instance', () => {
    it('should provide singleton instance', () => {
      expect(cacheManager).toBeInstanceOf(CacheManager);
    });

    it('should maintain state across different imports', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';

      cacheManager.set(input, output, mockOptions);
      expect(cacheManager.get(input, mockOptions)).toBe(output);
    });
  });

  describe('Performance benchmarks', () => {
    it('should perform cache operations within acceptable time limits', () => {
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';

      const startTime = performance.now();
      
      // Perform 1000 cache operations
      for (let i = 0; i < 1000; i++) {
        cache.set(`${input}${i}`, `${output}${i}`, mockOptions);
        cache.get(`${input}${i}`, mockOptions);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete 1000 operations in less than 100ms
      expect(totalTime).toBeLessThan(100);
    });

    it('should maintain consistent performance with cache eviction', () => {
      const smallCache = new CacheManager(10);
      const input = 'const fontSize = useResponsiveValue(24);';
      const output = 'transformed output';

      const startTime = performance.now();
      
      // Perform operations that will trigger eviction
      for (let i = 0; i < 100; i++) {
        smallCache.set(`${input}${i}`, `${output}${i}`, mockOptions);
        smallCache.get(`${input}${i}`, mockOptions);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete 100 operations in less than 50ms
      expect(totalTime).toBeLessThan(50);
    });
  });
});
