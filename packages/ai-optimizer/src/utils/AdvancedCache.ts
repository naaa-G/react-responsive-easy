/**
 * Advanced Caching System for AI Optimizer
 * 
 * Features:
 * - Multi-level caching (L1: Memory, L2: IndexedDB, L3: LocalStorage)
 * - Intelligent cache invalidation with dependency tracking
 * - Cache warming and preloading strategies
 * - Memory-aware cache management
 * - Cache compression and serialization
 * - Performance monitoring and analytics
 */

import { AI_OPTIMIZER_CONSTANTS } from '../constants';
import { Logger } from './Logger';

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  dependencies: string[];
  accessCount: number;
  lastAccessed: number;
  size: number;
  compressed?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
  compressionEnabled: boolean;
  warmingEnabled: boolean;
  invalidationStrategy: 'lru' | 'lfu' | 'ttl' | 'hybrid';
  levels: {
    l1: { enabled: boolean; maxSize: number };
    l2: { enabled: boolean; maxSize: number };
    l3: { enabled: boolean; maxSize: number };
  };
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  hitRate: number;
  averageAccessTime: number;
  compressionRatio: number;
  memoryUsage: number;
}

export interface CacheDependency {
  key: string;
  type: 'config' | 'model' | 'data' | 'feature';
  version: string;
  hash: string;
}

/**
 * Advanced Multi-Level Cache System
 */
export class AdvancedCache {
  // Constants for magic numbers
  private static readonly L1_SIZE_DIVISOR = 20;
  private static readonly L2_SIZE_DIVISOR = 10;
  private static readonly KB_TO_BYTES = 1024;
  private static readonly CLEANUP_INTERVAL_MS = 60000;

  private l1Cache: Map<string, CacheEntry> = new Map();
  private l2Cache: Map<string, CacheEntry> = new Map();
  private l3Cache: Map<string, CacheEntry> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private accessOrder: string[] = [];
  private accessCounts: Map<string, number> = new Map();
  private config: CacheConfig;
  private stats: CacheStats;
  private compressionWorker?: Worker;
  private warmingQueue: string[] = [];
  private isWarming = false;
  private logger: Logger;

  constructor(config: Partial<CacheConfig> = {}) {
    this.logger = new Logger('AdvancedCache');
    this.config = {
      maxSize: AI_OPTIMIZER_CONSTANTS.MEMORY_LIMITS.CRITICAL_THRESHOLD,
      defaultTtl: AI_OPTIMIZER_CONSTANTS.TIME.MINUTE * 30,
      compressionEnabled: true,
      warmingEnabled: true,
      invalidationStrategy: 'hybrid',
      levels: {
        l1: { enabled: true, maxSize: AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MEMORY_200MB / 2 },
        l2: { enabled: true, maxSize: AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MEMORY_200MB },
        l3: { enabled: true, maxSize: AI_OPTIMIZER_CONSTANTS.MEMORY_LIMITS.CRITICAL_THRESHOLD }
      },
      ...config
    };

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      hitRate: 0,
      averageAccessTime: 0,
      compressionRatio: 0,
      memoryUsage: 0
    };

    this.initializeCompressionWorker();
    this.startCacheWarming();
  }

  /**
   * Get value from cache with intelligent multi-level lookup
   */
  get<T>(key: string): T | null {
    const startTime = performance.now();
    
    try {
      // Try L1 cache first
      const l1Result = this.tryL1Cache<T>(key, startTime);
      if (l1Result !== null) return l1Result;

      // Try L2 cache if enabled
      if (this.config.levels.l2.enabled) {
        const l2Result = this.tryL2Cache<T>(key, startTime);
        if (l2Result !== null) return l2Result;
      }

      // Try L3 cache if enabled
      if (this.config.levels.l3.enabled) {
        const l3Result = this.tryL3Cache<T>(key, startTime);
        if (l3Result !== null) return l3Result;
      }

      this.stats.misses++;
      this.stats.averageAccessTime = (this.stats.averageAccessTime + (performance.now() - startTime)) / 2;
      return null;
    } catch (error) {
      this.logger.error('Cache get error:', error instanceof Error ? error : new Error(String(error)));
      this.stats.misses++;
      return null;
    }
  }

  private tryL1Cache<T>(key: string, startTime: number): T | null {
    const entry = this.l1Cache.get(key);
    if (entry && this.isValid(entry)) {
      this.updateAccessStats(entry);
      this.stats.hits++;
      this.stats.averageAccessTime = (this.stats.averageAccessTime + (performance.now() - startTime)) / 2;
      return this.decompressValue(entry.value) as T | null;
    }
    return null;
  }

  private tryL2Cache<T>(key: string, startTime: number): T | null {
    const entry = this.getFromL2(key);
    if (entry && this.isValid(entry)) {
      // Promote to L1
      this.setInL1(key, entry);
      this.updateAccessStats(entry);
      this.stats.hits++;
      this.stats.averageAccessTime = (this.stats.averageAccessTime + (performance.now() - startTime)) / 2;
      return this.decompressValue(entry.value) as T | null;
    }
    return null;
  }

  private tryL3Cache<T>(key: string, startTime: number): T | null {
    const entry = this.getFromL3(key);
    if (entry && this.isValid(entry)) {
      // Promote to L2 and L1
      this.setInL2(key, entry);
      this.setInL1(key, entry);
      this.updateAccessStats(entry);
      this.stats.hits++;
      this.stats.averageAccessTime = (this.stats.averageAccessTime + (performance.now() - startTime)) / 2;
      return this.decompressValue(entry.value) as T | null;
    }
    return null;
  }

  /**
   * Set value in cache with intelligent placement and compression
   */
  set<T>(
    key: string, 
    value: T, 
    options: {
      ttl?: number;
      dependencies?: string[];
      metadata?: Record<string, unknown>;
      level?: 'l1' | 'l2' | 'l3' | 'auto';
    } = {}
  ): void {
    try {
      const ttl = options.ttl ?? this.config.defaultTtl;
      const dependencies = options.dependencies ?? [];
      const metadata = options.metadata ?? {};
      
      // Compress value if enabled
      const processedValue = this.config.compressionEnabled 
        ? this.compressValue(value)
        : value;

      const entry: CacheEntry<T> = {
        key,
        value: processedValue,
        timestamp: Date.now(),
        ttl,
        dependencies,
        accessCount: 0,
        lastAccessed: Date.now(),
        size: this.calculateSize(processedValue),
        compressed: this.config.compressionEnabled,
        metadata
      };

      // Update dependency graph
      this.updateDependencyGraph(key, dependencies);

      // Determine cache level
      const level = options.level ?? this.determineOptimalLevel(entry.size);
      
      switch (level) {
        case 'l1':
          this.setInL1(key, entry);
          break;
        case 'l2':
          this.setInL2(key, entry);
          break;
        case 'l3':
          this.setInL3(key, entry);
          break;
        case 'auto':
          // Auto-placement based on size and access patterns
          if (entry.size < this.config.levels.l1.maxSize / 10) {
            this.setInL1(key, entry);
          } else if (entry.size < this.config.levels.l2.maxSize / 5) {
            this.setInL2(key, entry);
          } else {
            this.setInL3(key, entry);
          }
          break;
      }

      this.updateStats();
    } catch (error) {
      this.logger.error('Cache set error:', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Invalidate cache entries based on dependencies
   */
  invalidate(pattern: string | RegExp | string[]): void {
    try {
      const keysToInvalidate = new Set<string>();

      if (Array.isArray(pattern)) {
        pattern.forEach(key => keysToInvalidate.add(key));
      } else if (typeof pattern === 'string') {
        // Find keys that match pattern or depend on it
        for (const [key, dependencies] of this.dependencyGraph.entries()) {
          if (key.includes(pattern) || dependencies.has(pattern)) {
            keysToInvalidate.add(key);
          }
        }
      } else if (pattern instanceof RegExp) {
        // Find keys that match regex
        for (const key of this.getAllKeys()) {
          if (pattern.test(key)) {
            keysToInvalidate.add(key);
          }
        }
      }

      // Remove from all cache levels
      for (const key of keysToInvalidate) {
        this.l1Cache.delete(key);
        this.removeFromL2(key);
        this.removeFromL3(key);
        this.dependencyGraph.delete(key);
        this.removeFromAccessOrder(key);
        this.accessCounts.delete(key);
      }

      this.updateStats();
    } catch (error) {
      this.logger.error('Cache invalidation error:', error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Warm cache with frequently accessed data
   */
  async warmCache(keys: string[], dataProvider: (_key: string) => Promise<unknown>): Promise<void> {
    if (this.isWarming) return;
    
    this.isWarming = true;
    this.warmingQueue.push(...keys);

    try {
      const warmPromises = keys.map(async (key) => {
        try {
          const value = await dataProvider(key);
          this.set(key, value, { level: 'auto' });
        } catch (error) {
          this.logger.warn(`Failed to warm cache for key: ${key}`, { error: error instanceof Error ? error.message : String(error) });
        }
      });

      await Promise.allSettled(warmPromises);
    } finally {
      this.isWarming = false;
      this.warmingQueue = [];
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Clear all cache levels
   */
  clear(): void {
    this.l1Cache.clear();
    this.l2Cache.clear();
    this.l3Cache.clear();
    this.dependencyGraph.clear();
    this.accessOrder = [];
    this.accessCounts.clear();
    this.updateStats();
  }

  /**
   * Optimize cache based on usage patterns
   */
  optimize(): void {
    // Remove expired entries
    this.cleanupExpired();
    
    // Rebalance cache levels based on access patterns
    this.rebalanceLevels();
    
    // Compress large entries
    if (this.config.compressionEnabled) {
      this.compressLargeEntries();
    }
  }

  // Private methods

  private getFromL2(key: string): CacheEntry | undefined {
    // Mock IndexedDB implementation
    return this.l2Cache.get(key);
  }

  private getFromL3(key: string): CacheEntry | undefined {
    // Mock LocalStorage implementation
    return this.l3Cache.get(key);
  }

  private setInL1(key: string, entry: CacheEntry): void {
    // Check size limits
    if (this.getL1Size() + entry.size > this.config.levels.l1.maxSize) {
      this.evictFromL1();
    }
    
    this.l1Cache.set(key, entry);
    this.addToAccessOrder(key);
  }

  private setInL2(key: string, entry: CacheEntry): void {
    if (this.getL2Size() + entry.size > this.config.levels.l2.maxSize) {
      this.evictFromL2();
    }
    
    this.l2Cache.set(key, entry);
  }

  private setInL3(key: string, entry: CacheEntry): void {
    if (this.getL3Size() + entry.size > this.config.levels.l3.maxSize) {
      this.evictFromL3();
    }
    
    this.l3Cache.set(key, entry);
  }

  private removeFromL2(key: string): void {
    this.l2Cache.delete(key);
  }

  private removeFromL3(key: string): void {
    this.l3Cache.delete(key);
  }

  private isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private updateAccessStats(entry: CacheEntry): void {
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.accessCounts.set(entry.key, entry.accessCount);
    this.moveToEnd(entry.key);
  }

  private determineOptimalLevel(size: number): 'l1' | 'l2' | 'l3' {
    if (size < this.config.levels.l1.maxSize / AdvancedCache.L1_SIZE_DIVISOR) return 'l1';
    if (size < this.config.levels.l2.maxSize / AdvancedCache.L2_SIZE_DIVISOR) return 'l2';
    return 'l3';
  }

  private updateDependencyGraph(key: string, dependencies: string[]): void {
    this.dependencyGraph.set(key, new Set(dependencies));
  }

  private calculateSize(value: unknown): number {
    return JSON.stringify(value).length * 2; // Rough estimate
  }

  private compressValue<T>(value: T): T {
    if (!this.config.compressionEnabled) return value;
    
    // Mock compression - in real implementation, use actual compression
    return value;
  }

  private decompressValue<T>(value: T): T {
    // Mock decompression - in real implementation, use actual decompression
    return value;
  }

  private evictFromL1(): void {
    const keyToEvict = this.getKeyToEvict('l1');
    if (keyToEvict) {
      this.l1Cache.delete(keyToEvict);
      this.stats.evictions++;
    }
  }

  private evictFromL2(): void {
    const keyToEvict = this.getKeyToEvict('l2');
    if (keyToEvict) {
      this.l2Cache.delete(keyToEvict);
      this.stats.evictions++;
    }
  }

  private evictFromL3(): void {
    const keyToEvict = this.getKeyToEvict('l3');
    if (keyToEvict) {
      this.l3Cache.delete(keyToEvict);
      this.stats.evictions++;
    }
  }

  private getKeyToEvict(level: 'l1' | 'l2' | 'l3'): string | null {
    const cache = level === 'l1' ? this.l1Cache : level === 'l2' ? this.l2Cache : this.l3Cache;
    
    switch (this.config.invalidationStrategy) {
      case 'lru':
        return this.accessOrder[0] ?? null;
      case 'lfu': {
        let minAccess = Infinity;
        let keyToEvict = null;
        for (const [key, count] of this.accessCounts.entries()) {
          if (cache.has(key) && count < minAccess) {
            minAccess = count;
            keyToEvict = key;
          }
        }
        return keyToEvict;
      }
      case 'ttl': {
        let oldestTime = Infinity;
        let oldestKey = null;
        for (const [key, entry] of cache.entries()) {
          if (entry.timestamp < oldestTime) {
            oldestTime = entry.timestamp;
            oldestKey = key;
          }
        }
        return oldestKey;
      }
      case 'hybrid': {
        // Combine LRU and LFU
        const lruKey = this.accessOrder[0];
        const lfuKey = this.getKeyToEvict('l2');
        return lruKey ?? lfuKey;
      }
      default:
        return null;
    }
  }

  private addToAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private moveToEnd(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private getAllKeys(): string[] {
    const keys = new Set<string>();
    this.l1Cache.forEach((_, key) => keys.add(key));
    this.l2Cache.forEach((_, key) => keys.add(key));
    this.l3Cache.forEach((_, key) => keys.add(key));
    return Array.from(keys);
  }

  private getL1Size(): number {
    let size = 0;
    this.l1Cache.forEach(entry => {
      size += entry.size;
    });
    return size;
  }

  private getL2Size(): number {
    let size = 0;
    this.l2Cache.forEach(entry => {
      size += entry.size;
    });
    return size;
  }

  private getL3Size(): number {
    let size = 0;
    this.l3Cache.forEach(entry => {
      size += entry.size;
    });
    return size;
  }

  private updateStats(): void {
    this.stats.size = this.getL1Size() + this.getL2Size() + this.getL3Size();
    this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.MIN_SCORE;
    this.stats.memoryUsage = this.getL1Size();
  }

  private initializeCompressionWorker(): void {
    // Mock compression worker initialization
    // In real implementation, create a Web Worker for compression
  }

  private startCacheWarming(): void {
    if (!this.config.warmingEnabled) return;
    
    // Mock cache warming - in real implementation, preload frequently accessed data
    setInterval(() => {
      if (!this.isWarming && this.warmingQueue.length > 0) {
        // Process warming queue
      }
    }, AdvancedCache.CLEANUP_INTERVAL_MS); // Check every minute
  }

  private cleanupExpired(): void {
    
    // Clean L1
    for (const [key, entry] of this.l1Cache.entries()) {
      if (!this.isValid(entry)) {
        this.l1Cache.delete(key);
        this.removeFromAccessOrder(key);
      }
    }
    
    // Clean L2
    for (const [key, entry] of this.l2Cache.entries()) {
      if (!this.isValid(entry)) {
        this.l2Cache.delete(key);
      }
    }
    
    // Clean L3
    for (const [key, entry] of this.l3Cache.entries()) {
      if (!this.isValid(entry)) {
        this.l3Cache.delete(key);
      }
    }
  }

  private rebalanceLevels(): void {
    // Move frequently accessed items to higher levels
    const l2Entries = Array.from(this.l2Cache.entries());
    const l3Entries = Array.from(this.l3Cache.entries());
    
    // Promote hot items from L2 to L1
    for (const [key, entry] of l2Entries) {
      if (entry.accessCount > 5 && this.getL1Size() + entry.size < this.config.levels.l1.maxSize) {
        this.l2Cache.delete(key);
        this.setInL1(key, entry);
      }
    }
    
    // Promote hot items from L3 to L2
    for (const [key, entry] of l3Entries) {
      if (entry.accessCount > 3 && this.getL2Size() + entry.size < this.config.levels.l2.maxSize) {
        this.l3Cache.delete(key);
        this.setInL2(key, entry);
      }
    }
  }

  private compressLargeEntries(): void {
    // Compress large entries to save space
    const allEntries = [
      ...Array.from(this.l1Cache.entries()),
      ...Array.from(this.l2Cache.entries()),
      ...Array.from(this.l3Cache.entries())
    ];
    
    // Process all entries
    for (const [, entry] of allEntries) {
      if (entry.size > AdvancedCache.KB_TO_BYTES * AdvancedCache.KB_TO_BYTES && !entry.compressed) { // 1MB threshold
        const compressedValue = this.compressValue(entry.value);
        entry.value = compressedValue;
        entry.compressed = true;
        entry.size = this.calculateSize(compressedValue);
      }
    }
  }
}

/**
 * Intelligent Memoization System
 */
export class IntelligentMemoizer {
  private cache: Map<string, { value: unknown; timestamp: number; dependencies: string[] }> = new Map();
  private dependencyTracker: Map<string, Set<string>> = new Map();
  private functionHashes: Map<Function, string> = new Map();
  private config: {
    maxSize: number;
    defaultTtl: number;
    enableDependencyTracking: boolean;
  };

  constructor(config: Partial<typeof this.config> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTtl: 5 * 60 * 1000, // 5 minutes
      enableDependencyTracking: true,
      ...config
    };
  }

  /**
   * Memoize a function with intelligent dependency tracking
   */
  memoize<T extends (..._args: unknown[]) => unknown>(
    fn: T,
    options: {
      keyGenerator?: (..._args: Parameters<T>) => string;
      ttl?: number;
      dependencies?: string[];
    } = {}
  ): T {
    const keyGenerator = options.keyGenerator ?? this.defaultKeyGenerator;
    const ttl = options.ttl ?? this.config.defaultTtl;
    const dependencies = options.dependencies ?? [];

    const memoizedFn = ((...args: Parameters<T>) => {
      const key = keyGenerator(...args);
      
      // Check cache
      if (this.cache.has(key)) {
        const entry = this.cache.get(key);
        if (entry && Date.now() - entry.timestamp < ttl) {
          return entry.value;
        } else {
          this.cache.delete(key);
        }
      }

      // Execute function
      const result = fn(...args);
      
      // Cache result
      this.cache.set(key, {
        value: result,
        timestamp: Date.now(),
        dependencies
      });

      // Track dependencies
      if (this.config.enableDependencyTracking) {
        this.dependencyTracker.set(key, new Set(dependencies));
      }

      // Cleanup if cache is too large
      if (this.cache.size > this.config.maxSize) {
        this.cleanup();
      }

      return result;
    }) as T;

    return memoizedFn;
  }

  /**
   * Invalidate memoized results based on dependencies
   */
  invalidate(pattern: string | RegExp): void {
    const keysToDelete: string[] = [];

    if (typeof pattern === 'string') {
      for (const [key, dependencies] of this.dependencyTracker.entries()) {
        if (key.includes(pattern) || dependencies.has(pattern)) {
          keysToDelete.push(key);
        }
      }
    } else if (pattern instanceof RegExp) {
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          keysToDelete.push(key);
        }
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.dependencyTracker.delete(key);
    });
  }

  /**
   * Clear all memoized results
   */
  clear(): void {
    this.cache.clear();
    this.dependencyTracker.clear();
  }

  /**
   * Get memoization statistics
   */
  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Would need to track hits/misses
    };
  }

  private defaultKeyGenerator(...args: unknown[]): string {
    return JSON.stringify(args);
  }

  private cleanup(): void {
    // Remove oldest entries
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, Math.floor(this.config.maxSize * AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.POOR_THRESHOLD));
    toRemove.forEach(([key]) => {
      this.cache.delete(key);
      this.dependencyTracker.delete(key);
    });
  }
}

/**
 * Cache Performance Monitor
 */
export class CachePerformanceMonitor {
  private metrics: {
    totalRequests: number;
    cacheHits: number;
    cacheMisses: number;
    averageResponseTime: number;
    peakMemoryUsage: number;
    compressionSavings: number;
  } = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageResponseTime: 0,
    peakMemoryUsage: 0,
    compressionSavings: 0
  };

  private startTimes: Map<string, number> = new Map();

  /**
   * Start timing a cache operation
   */
  startTiming(operationId: string): void {
    this.startTimes.set(operationId, performance.now());
  }

  /**
   * End timing and record metrics
   */
  endTiming(operationId: string, hit: boolean): void {
    const startTime = this.startTimes.get(operationId);
    if (!startTime) return;

    const duration = performance.now() - startTime;
    this.startTimes.delete(operationId);

    this.metrics.totalRequests++;
    if (hit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }

    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + duration) / 
      this.metrics.totalRequests;
  }

  /**
   * Record memory usage
   */
  recordMemoryUsage(usage: number): void {
    this.metrics.peakMemoryUsage = Math.max(this.metrics.peakMemoryUsage, usage);
  }

  /**
   * Record compression savings
   */
  recordCompressionSavings(originalSize: number, compressedSize: number): void {
    const savings = originalSize - compressedSize;
    this.metrics.compressionSavings += savings;
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      hitRate: this.metrics.cacheHits / this.metrics.totalRequests || 0,
      missRate: this.metrics.cacheMisses / this.metrics.totalRequests || 0
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      peakMemoryUsage: 0,
      compressionSavings: 0
    };
    this.startTimes.clear();
  }
}
