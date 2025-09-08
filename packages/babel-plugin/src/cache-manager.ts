/**
 * Cache manager for the Babel plugin
 */

import type { CacheEntry, BabelPluginOptions, PerformanceMetrics } from './types';

export class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private metrics: PerformanceMetrics;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
    this.metrics = {
      transformCount: 0,
      totalTransformTime: 0,
      averageTransformTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0
    };
  }

  /**
   * Generate cache key for input
   */
  private generateKey(input: string, options: BabelPluginOptions): string {
    const optionsKey = JSON.stringify({
      precompute: options.precompute,
      development: options.development,
      generateCSSProps: options.generateCSSProps,
      importSource: options.importSource,
      configPath: options.configPath
    });
    
    return `${input}:${optionsKey}`;
  }

  /**
   * Get cached result
   */
  get(input: string, options: BabelPluginOptions): string | null {
    const key = this.generateKey(input, options);
    const entry = this.cache.get(key);

    if (entry) {
      // Check if cache entry is still valid (1 hour TTL)
      const now = Date.now();
      const ttl = 60 * 60 * 1000; // 1 hour
      
      if (now - entry.timestamp < ttl) {
        this.metrics.cacheHits++;
        return entry.output;
      } else {
        // Remove expired entry
        this.cache.delete(key);
      }
    }

    this.metrics.cacheMisses++;
    return null;
  }

  /**
   * Set cached result
   */
  set(input: string, output: string, options: BabelPluginOptions): void {
    const key = this.generateKey(input, options);
    
    // Check cache size limit
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry = {
      input,
      output,
      timestamp: Date.now(),
      options
    };

    this.cache.set(key, entry);
  }

  /**
   * Evict oldest cache entry
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Set maximum cache size
   */
  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    
    // If current cache is larger than new max size, evict entries
    while (this.cache.size > this.maxSize) {
      this.evictOldest();
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hitRate: number; metrics: PerformanceMetrics } {
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    const hitRate = totalRequests > 0 ? this.metrics.cacheHits / totalRequests : 0;

    return {
      size: this.cache.size,
      hitRate,
      metrics: { ...this.metrics }
    };
  }

  /**
   * Update performance metrics
   */
  updateMetrics(transformTime: number, hasError: boolean = false): void {
    this.metrics.transformCount++;
    this.metrics.totalTransformTime += transformTime;
    this.metrics.averageTransformTime = this.metrics.totalTransformTime / this.metrics.transformCount;
    
    if (hasError) {
      this.metrics.errors++;
    }
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      transformCount: 0,
      totalTransformTime: 0,
      averageTransformTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0
    };
  }
}

// Singleton instance
export const cacheManager = new CacheManager();
