/**
 * Enterprise-grade performance optimization system
 * 
 * Provides intelligent caching, memoization, and batch processing
 * for optimal AI optimization performance in production environments.
 */

import { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';
import { ComponentUsageData, OptimizationSuggestions } from '../types/index.js';
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
  // Constants for magic numbers
  public static readonly DEFAULT_MAX_SIZE = 1000;
  public static readonly DEFAULT_TTL_MINUTES = 5;
  public static readonly DEFAULT_CLEANUP_INTERVAL_MINUTES = 1;
  public static readonly MS_PER_MINUTE = 60 * 1000;
  // Performance thresholds for optimization decisions
  public static readonly PERFORMANCE_THRESHOLD_IMPROVING = 0.9; // 90% of baseline performance
  public static readonly PERFORMANCE_THRESHOLD_DEGRADING = 1.1; // 110% of baseline performance
  
  // Negative performance thresholds for error detection
  public static readonly NEGATIVE_PERFORMANCE_THRESHOLD = -100; // -100% performance (complete failure)
  public static readonly NEGATIVE_MEMORY_THRESHOLD = -50; // -50% memory efficiency (severe degradation)
  
  // Metrics collection and analysis constants
  public static readonly RECENT_METRICS_COUNT = 100; // Number of recent operations to analyze
  public static readonly TREND_ANALYSIS_COUNT = 50; // Number of operations for trend analysis
  public static readonly MIN_TREND_SAMPLES = 10; // Minimum samples required for trend analysis

  private cache = new Map<string, { value: unknown; timestamp: number; accessCount: number }>();
  private config: CacheConfig;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: IntelligentCache.DEFAULT_MAX_SIZE,
      ttl: IntelligentCache.DEFAULT_TTL_MINUTES * IntelligentCache.MS_PER_MINUTE, // 5 minutes
      cleanupInterval: IntelligentCache.DEFAULT_CLEANUP_INTERVAL_MINUTES * IntelligentCache.MS_PER_MINUTE, // 1 minute
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
    return entry.value as T;
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

  private hashObject(obj: unknown): string {
    return JSON.stringify(obj, Object.keys(obj as Record<string, unknown>).sort());
  }
}

/**
 * Batch processing system for optimization requests
 */
export class BatchProcessor {
  private batches = new Map<string, Array<{
    request: { config: ResponsiveConfig; usageData: ComponentUsageData[] };
    resolve: (_value: OptimizationSuggestions) => void;
    reject: (_error: Error) => void;
    timestamp: number;
  }>>();
  
  private config: BatchConfig;
  private processing = false;

  // Constants for magic numbers
  private static readonly DEFAULT_MAX_BATCH_SIZE = 10;
  private static readonly DEFAULT_TIMEOUT_MS = 100;
  private static readonly DEFAULT_CONCURRENCY = 3;

  constructor(config: Partial<BatchConfig> = {}) {
    this.config = {
      maxBatchSize: BatchProcessor.DEFAULT_MAX_BATCH_SIZE,
      timeout: BatchProcessor.DEFAULT_TIMEOUT_MS,
      concurrency: BatchProcessor.DEFAULT_CONCURRENCY,
      ...config
    };
  }

  /**
   * Add request to batch
   */
  async addToBatch(
    config: ResponsiveConfig,
    usageData: ComponentUsageData[],
    processor: (_requests: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>) => Promise<OptimizationSuggestions[]>
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

  private scheduleBatchProcessing(
    batchKey: string,
    processor: (_requests: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>) => Promise<OptimizationSuggestions[]>
  ): void {
    if (this.processing) return;
    
    this.processing = true;
    
    // Wait for timeout or batch to fill
    setTimeout(() => {
      (async () => {
        try {
          const batch = this.batches.get(batchKey);
          if (!batch || batch.length === 0) {
            this.processing = false;
            return;
          }

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
          const batch = this.batches.get(batchKey);
          if (batch) {
            batch.forEach(item => {
              item.reject(error as Error);
            });
          }
        } finally {
          this.batches.delete(batchKey);
          this.processing = false;
        }
      })().catch(() => {
        // Handle any unhandled promise rejections
        this.processing = false;
      });
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
    const recent = this.metrics.slice(-IntelligentCache.RECENT_METRICS_COUNT); // Last 100 operations
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
    const recent = this.metrics.slice(-IntelligentCache.TREND_ANALYSIS_COUNT);
    if (recent.length < IntelligentCache.MIN_TREND_SAMPLES) {
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
      optimizationTime: secondAvgTime < firstAvgTime * IntelligentCache.PERFORMANCE_THRESHOLD_IMPROVING ? 'improving' : 
                       secondAvgTime > firstAvgTime * IntelligentCache.PERFORMANCE_THRESHOLD_DEGRADING ? 'degrading' : 'stable',
      memoryUsage: secondAvgMemory > firstAvgMemory * IntelligentCache.PERFORMANCE_THRESHOLD_DEGRADING ? 'increasing' :
                   secondAvgMemory < firstAvgMemory * IntelligentCache.PERFORMANCE_THRESHOLD_IMPROVING ? 'decreasing' : 'stable',
      errorRate: secondErrorRate > firstErrorRate * IntelligentCache.PERFORMANCE_THRESHOLD_DEGRADING ? 'increasing' :
                 secondErrorRate < firstErrorRate * IntelligentCache.PERFORMANCE_THRESHOLD_IMPROVING ? 'decreasing' : 'stable'
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
    optimizer: (_config: ResponsiveConfig, _usageData: ComponentUsageData[]) => Promise<OptimizationSuggestions>
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
    optimizer: (_requests: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>) => Promise<OptimizationSuggestions[]>
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
    cacheStats: unknown;
    memoryStats: unknown;
    trends: unknown;
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
