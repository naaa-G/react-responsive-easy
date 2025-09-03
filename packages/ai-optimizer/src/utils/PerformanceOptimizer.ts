/**
 * Enterprise-grade performance optimization system
 * 
 * Provides intelligent caching, memoization, and batch processing
 * for optimal AI optimization performance in production environments.
 */

import { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';
import { ComponentUsageData, ModelFeatures, OptimizationSuggestions } from '../types/index.js';
import { MemoryMonitor } from './MemoryManager.js';

export interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  cleanupInterval: number;
}

export interface BatchConfig {
  maxBatchSize: number;
  timeout: number; // Maximum wait time for batching
  concurrency: number;
}

export interface PerformanceMetrics {
  cacheHitRate: number;
  averageOptimizationTime: number;
  memoryEfficiency: number;
  throughput: number; // optimizations per second
  errorRate: number;
}

/**
 * Intelligent caching system with LRU eviction and TTL
 */
export class IntelligentCache {
  private cache = new Map<string, { value: any; timestamp: number; accessCount: number }>();
  private config: CacheConfig;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      ttl: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      ...config
    };

    // Start cleanup interval
    setInterval(() => this.cleanup(), this.config.cleanupInterval);
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access count for LRU
    entry.accessCount++;
    this.stats.hits++;
    return entry.value;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T): void {
    // Evict if at capacity
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 1
    });
  }

  /**
   * Generate cache key for optimization request
   */
  generateOptimizationKey(config: ResponsiveConfig, usageData: ComponentUsageData[]): string {
    const configHash = this.hashObject(config);
    const usageHash = this.hashObject(usageData.map(d => ({
      componentId: d.componentId,
      componentType: d.componentType,
      responsiveValues: d.responsiveValues
    })));
    
    return `opt:${configHash}:${usageHash}`;
  }

  /**
   * Generate cache key for feature extraction
   */
  generateFeatureKey(config: ResponsiveConfig, usageData: ComponentUsageData[]): string {
    const configHash = this.hashObject(config);
    const usageHash = this.hashObject(usageData);
    return `features:${configHash}:${usageHash}`;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      size: this.cache.size,
      maxSize: this.config.maxSize
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestAccess = Infinity;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Prioritize by access count, then by timestamp
      if (entry.accessCount < oldestAccess || 
          (entry.accessCount === oldestAccess && entry.timestamp < oldestTime)) {
        oldestKey = key;
        oldestAccess = entry.accessCount;
        oldestTime = entry.timestamp;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private hashObject(obj: any): string {
    return JSON.stringify(obj, Object.keys(obj).sort());
  }
}

/**
 * Batch processing system for optimization requests
 */
export class BatchProcessor {
  private batches = new Map<string, Array<{
    request: { config: ResponsiveConfig; usageData: ComponentUsageData[] };
    resolve: (value: OptimizationSuggestions) => void;
    reject: (error: Error) => void;
    timestamp: number;
  }>>();
  
  private config: BatchConfig;
  private processing = false;

  constructor(config: Partial<BatchConfig> = {}) {
    this.config = {
      maxBatchSize: 10,
      timeout: 100, // 100ms
      concurrency: 3,
      ...config
    };
  }

  /**
   * Add request to batch
   */
  async addToBatch(
    config: ResponsiveConfig,
    usageData: ComponentUsageData[],
    processor: (requests: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>) => Promise<OptimizationSuggestions[]>
  ): Promise<OptimizationSuggestions> {
    const batchKey = this.generateBatchKey(config);
    
    return new Promise((resolve, reject) => {
      if (!this.batches.has(batchKey)) {
        this.batches.set(batchKey, []);
      }
      
      const batch = this.batches.get(batchKey)!;
      batch.push({
        request: { config, usageData },
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Process batch if it's full or if this is the first request
      if (batch.length >= this.config.maxBatchSize || batch.length === 1) {
        this.scheduleBatchProcessing(batchKey, processor);
      }
    });
  }

  private async scheduleBatchProcessing(
    batchKey: string,
    processor: (requests: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>) => Promise<OptimizationSuggestions[]>
  ): Promise<void> {
    if (this.processing) return;
    
    this.processing = true;
    
    // Wait for timeout or batch to fill
    setTimeout(async () => {
      const batch = this.batches.get(batchKey);
      if (!batch || batch.length === 0) {
        this.processing = false;
        return;
      }

      try {
        const requests = batch.map(item => item.request);
        const results = await processor(requests);
        
        // Resolve all promises
        batch.forEach((item, index) => {
          if (results[index]) {
            item.resolve(results[index]);
          } else {
            item.reject(new Error('Batch processing failed'));
          }
        });
      } catch (error) {
        // Reject all promises
        batch.forEach(item => {
          item.reject(error as Error);
        });
      } finally {
        this.batches.delete(batchKey);
        this.processing = false;
      }
    }, this.config.timeout);
  }

  private generateBatchKey(config: ResponsiveConfig): string {
    // Group similar configurations together
    return `${config.strategy.origin}-${config.strategy.mode}`;
  }
}

/**
 * Performance monitoring and analytics
 */
export class PerformanceMonitor {
  private metrics: Array<{
    timestamp: number;
    operation: string;
    duration: number;
    memoryUsage: number;
    success: boolean;
  }> = [];
  
  private maxMetrics = 1000;
  private memoryMonitor: MemoryMonitor;

  constructor() {
    this.memoryMonitor = MemoryMonitor.getInstance();
  }

  /**
   * Record performance metric
   */
  recordMetric(operation: string, duration: number, success: boolean = true): void {
    const memoryStats = this.memoryMonitor.getMemoryStats();
    
    this.metrics.push({
      timestamp: Date.now(),
      operation,
      duration,
      memoryUsage: memoryStats.usedJSHeapSize,
      success
    });

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): PerformanceMetrics {
    const recent = this.metrics.slice(-100); // Last 100 operations
    if (recent.length === 0) {
      return {
        cacheHitRate: 0,
        averageOptimizationTime: 0,
        memoryEfficiency: 0,
        throughput: 0,
        errorRate: 0
      };
    }

    const successful = recent.filter(m => m.success);
    const failed = recent.filter(m => !m.success);
    
    const averageTime = successful.reduce((sum, m) => sum + m.duration, 0) / successful.length;
    const errorRate = failed.length / recent.length;
    
    // Calculate throughput (operations per second)
    const timeSpan = recent[recent.length - 1].timestamp - recent[0].timestamp;
    const throughput = timeSpan > 0 ? (recent.length / timeSpan) * 1000 : 0;
    
    // Calculate memory efficiency (lower is better)
    const memoryEfficiency = recent.reduce((sum, m) => sum + m.memoryUsage, 0) / recent.length;

    return {
      cacheHitRate: 0, // Will be set by cache
      averageOptimizationTime: averageTime,
      memoryEfficiency,
      throughput,
      errorRate
    };
  }

  /**
   * Get performance trends
   */
  getPerformanceTrends(): {
    optimizationTime: 'improving' | 'stable' | 'degrading';
    memoryUsage: 'stable' | 'increasing' | 'decreasing';
    errorRate: 'stable' | 'increasing' | 'decreasing';
  } {
    const recent = this.metrics.slice(-50);
    if (recent.length < 10) {
      return {
        optimizationTime: 'stable',
        memoryUsage: 'stable',
        errorRate: 'stable'
      };
    }

    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const firstAvgTime = firstHalf.reduce((sum, m) => sum + m.duration, 0) / firstHalf.length;
    const secondAvgTime = secondHalf.reduce((sum, m) => sum + m.duration, 0) / secondHalf.length;
    
    const firstAvgMemory = firstHalf.reduce((sum, m) => sum + m.memoryUsage, 0) / firstHalf.length;
    const secondAvgMemory = secondHalf.reduce((sum, m) => sum + m.memoryUsage, 0) / secondHalf.length;
    
    const firstErrorRate = firstHalf.filter(m => !m.success).length / firstHalf.length;
    const secondErrorRate = secondHalf.filter(m => !m.success).length / secondHalf.length;

    return {
      optimizationTime: secondAvgTime < firstAvgTime * 0.9 ? 'improving' : 
                       secondAvgTime > firstAvgTime * 1.1 ? 'degrading' : 'stable',
      memoryUsage: secondAvgMemory > firstAvgMemory * 1.1 ? 'increasing' :
                   secondAvgMemory < firstAvgMemory * 0.9 ? 'decreasing' : 'stable',
      errorRate: secondErrorRate > firstErrorRate * 1.1 ? 'increasing' :
                 secondErrorRate < firstErrorRate * 0.9 ? 'decreasing' : 'stable'
    };
  }
}

/**
 * Main performance optimization coordinator
 */
export class PerformanceOptimizer {
  private cache: IntelligentCache;
  private batchProcessor: BatchProcessor;
  private performanceMonitor: PerformanceMonitor;
  private memoryMonitor: MemoryMonitor;

  constructor() {
    this.cache = new IntelligentCache();
    this.batchProcessor = new BatchProcessor();
    this.performanceMonitor = new PerformanceMonitor();
    this.memoryMonitor = MemoryMonitor.getInstance();
  }

  /**
   * Optimize with caching and performance monitoring
   */
  async optimizeWithCaching(
    config: ResponsiveConfig,
    usageData: ComponentUsageData[],
    optimizer: (config: ResponsiveConfig, usageData: ComponentUsageData[]) => Promise<OptimizationSuggestions>
  ): Promise<OptimizationSuggestions> {
    const startTime = performance.now();
    const cacheKey = this.cache.generateOptimizationKey(config, usageData);
    
    try {
      // Check cache first
      const cached = this.cache.get<OptimizationSuggestions>(cacheKey);
      if (cached) {
        this.performanceMonitor.recordMetric('optimization_cached', performance.now() - startTime, true);
        return cached;
      }

      // Perform optimization
      const result = await optimizer(config, usageData);
      
      // Cache result
      this.cache.set(cacheKey, result);
      
      const duration = performance.now() - startTime;
      this.performanceMonitor.recordMetric('optimization', duration, true);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.performanceMonitor.recordMetric('optimization', duration, false);
      throw error;
    }
  }

  /**
   * Batch optimize multiple requests
   */
  async batchOptimize(
    requests: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>,
    optimizer: (requests: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>) => Promise<OptimizationSuggestions[]>
  ): Promise<OptimizationSuggestions[]> {
    const startTime = performance.now();
    
    try {
      const results = await optimizer(requests);
      const duration = performance.now() - startTime;
      this.performanceMonitor.recordMetric('batch_optimization', duration, true);
      return results;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.performanceMonitor.recordMetric('batch_optimization', duration, false);
      throw error;
    }
  }

  /**
   * Get comprehensive performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics & {
    cacheStats: any;
    memoryStats: any;
    trends: any;
  } {
    const performanceStats = this.performanceMonitor.getPerformanceStats();
    const cacheStats = this.cache.getStats();
    const memoryStats = this.memoryMonitor.getMemoryStats();
    const trends = this.performanceMonitor.getPerformanceTrends();

    return {
      ...performanceStats,
      cacheHitRate: cacheStats.hitRate,
      cacheStats,
      memoryStats,
      trends
    };
  }

  /**
   * Clear all caches and reset metrics
   */
  clear(): void {
    this.cache.clear();
    this.performanceMonitor = new PerformanceMonitor();
  }
}
