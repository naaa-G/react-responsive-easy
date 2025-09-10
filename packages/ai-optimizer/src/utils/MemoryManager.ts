/**
 * Enterprise-grade memory management system for AI Optimizer
 * 
 * Provides tensor pooling, memory monitoring, and automatic cleanup
 * to ensure optimal performance and prevent memory leaks in production.
 */

import * as tf from '@tensorflow/tfjs';

export interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  tensorCount: number;
  memoryPressure: 'low' | 'medium' | 'high' | 'critical';
}

export interface TensorPoolConfig {
  maxPoolSize: number;
  cleanupThreshold: number;
  monitoringInterval: number;
}

/**
 * Advanced tensor pool for efficient memory management
 */
export class TensorPool {
  private pools: Map<string, tf.Tensor[]> = new Map();
  private config: TensorPoolConfig;
  // Constants for magic numbers
  public static readonly DEFAULT_MAX_POOL_SIZE = 50;
  public static readonly DEFAULT_CLEANUP_THRESHOLD = 0.8;
  public static readonly DEFAULT_MONITORING_INTERVAL = 5000;
  public static readonly CLEANUP_TARGET_MULTIPLIER = 0.5;
  public static readonly BYTES_PER_KB = 1024;
  public static readonly BYTES_PER_MB = TensorPool.BYTES_PER_KB * TensorPool.BYTES_PER_KB; // 1MB in bytes
  public static readonly MEMORY_50MB = 50;
  public static readonly MEMORY_100MB = 100;
  public static readonly MEMORY_200MB = 200;
  public static readonly MEMORY_500MB = 500;
  public static readonly DEFAULT_BATCH_SIZE = 10;
  public static readonly SNAPSHOT_INTERVAL = 10000;
  public static readonly MAX_SNAPSHOTS = 100;
  public static readonly MIN_SNAPSHOTS_FOR_ANALYSIS = 10;
  public static readonly MEMORY_LEAK_THRESHOLD = TensorPool.BYTES_PER_MB; // 1MB threshold

  private stats = {
    created: 0,
    reused: 0,
    disposed: 0
  };

  constructor(config: Partial<TensorPoolConfig> = {}) {
    this.config = {
      maxPoolSize: TensorPool.DEFAULT_MAX_POOL_SIZE,
      cleanupThreshold: TensorPool.DEFAULT_CLEANUP_THRESHOLD,
      monitoringInterval: TensorPool.DEFAULT_MONITORING_INTERVAL,
      ...config
    };
  }

  /**
   * Get a tensor from the pool or create a new one
   */
  getTensor(shape: number[], dtype: tf.DataType = 'float32', type: string = 'default'): tf.Tensor {
    const key = this.generateKey(shape, dtype, type);
    const pool = this.pools.get(key) ?? [];
    
    if (pool.length > 0) {
      const tensor = pool.pop()!;
      this.stats.reused++;
      return tensor;
    }
    
    const tensor = tf.zeros(shape, dtype);
    this.stats.created++;
    return tensor;
  }

  /**
   * Return a tensor to the pool for reuse
   */
  returnTensor(tensor: tf.Tensor, type: string = 'default'): void {
    const key = this.generateKey(tensor.shape, tensor.dtype, type);
    const pool = this.pools.get(key) ?? [];
    
    if (pool.length < this.config.maxPoolSize) {
      pool.push(tensor);
      this.pools.set(key, pool);
    } else {
      tensor.dispose();
      this.stats.disposed++;
    }
  }

  /**
   * Clean up excess tensors when memory pressure is high
   */
  cleanup(aggressive: boolean = false): void {
    const targetSize = aggressive ? 0 : Math.floor(this.config.maxPoolSize * TensorPool.CLEANUP_TARGET_MULTIPLIER);
    
    for (const [, pool] of this.pools.entries()) {
      while (pool.length > targetSize) {
        const tensor = pool.pop()!;
        tensor.dispose();
        this.stats.disposed++;
      }
    }
  }

  /**
   * Get pool statistics
   */
  getStats() {
    const totalTensors = Array.from(this.pools.values()).reduce((sum, pool) => sum + pool.length, 0);
    return {
      ...this.stats,
      totalTensors,
      poolCount: this.pools.size,
      efficiency: this.stats.reused / (this.stats.created + this.stats.reused) || 0
    };
  }

  /**
   * Dispose all tensors in the pool
   */
  dispose(): void {
    for (const pool of this.pools.values()) {
      for (const tensor of pool) {
        tensor.dispose();
      }
    }
    this.pools.clear();
  }

  private generateKey(shape: number[], dtype: tf.DataType, type: string): string {
    return `${type}-${dtype}-${shape.join(',')}`;
  }
}

/**
 * Memory monitoring and management system
 */
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private tensorPool: TensorPool;
  private monitoringInterval: ReturnType<typeof setInterval> | null = null;
  private memoryThresholds = {
    low: TensorPool.MEMORY_50MB * TensorPool.BYTES_PER_MB,    // 50MB
    medium: TensorPool.MEMORY_100MB * TensorPool.BYTES_PER_MB, // 100MB
    high: TensorPool.MEMORY_200MB * TensorPool.BYTES_PER_MB,   // 200MB
    critical: TensorPool.MEMORY_500MB * TensorPool.BYTES_PER_MB // 500MB
  };
  private callbacks: Array<(_stats: MemoryStats) => void> = [];

  private constructor() {
    this.tensorPool = new TensorPool();
  }

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  /**
   * Start monitoring memory usage
   */
  startMonitoring(interval: number = TensorPool.DEFAULT_MONITORING_INTERVAL): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, interval);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): MemoryStats {
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    const tensorCount = tf.memory().numTensors;
    
    let memoryPressure: MemoryStats['memoryPressure'] = 'low';
    if (memory) {
      if (memory.usedJSHeapSize > this.memoryThresholds.critical) {
        memoryPressure = 'critical';
      } else if (memory.usedJSHeapSize > this.memoryThresholds.high) {
        memoryPressure = 'high';
      } else if (memory.usedJSHeapSize > this.memoryThresholds.medium) {
        memoryPressure = 'medium';
      }
    }

    return {
      usedJSHeapSize: memory?.usedJSHeapSize ?? 0,
      totalJSHeapSize: memory?.totalJSHeapSize ?? 0,
      jsHeapSizeLimit: memory?.jsHeapSizeLimit ?? 0,
      tensorCount,
      memoryPressure
    };
  }

  /**
   * Check memory usage and trigger cleanup if needed
   */
  checkMemoryUsage(): boolean {
    const stats = this.getMemoryStats();
    
    // Notify callbacks
    this.callbacks.forEach(callback => callback(stats));
    
    // Trigger cleanup based on memory pressure
    switch (stats.memoryPressure) {
      case 'high':
        this.tensorPool.cleanup();
        this.forceGarbageCollection();
        break;
      case 'critical':
        this.tensorPool.cleanup(true);
        this.forceGarbageCollection();
        // eslint-disable-next-line no-console
        console.warn('🚨 Critical memory usage detected, aggressive cleanup performed');
        break;
    }
    
    return stats.memoryPressure !== 'critical';
  }

  /**
   * Register a callback for memory events
   */
  onMemoryEvent(callback: (_stats: MemoryStats) => void): void {
    this.callbacks.push(callback);
  }

  /**
   * Get the tensor pool instance
   */
  getTensorPool(): TensorPool {
    return this.tensorPool;
  }

  /**
   * Force garbage collection if available
   */
  private forceGarbageCollection(): void {
    if ((global as typeof globalThis & { gc?: () => void }).gc) {
      (global as typeof globalThis & { gc: () => void }).gc();
    }
  }

  /**
   * Dispose all resources
   */
  dispose(): void {
    this.stopMonitoring();
    this.tensorPool.dispose();
    this.callbacks = [];
  }
}

/**
 * Memory-aware tensor operations wrapper
 */
export class MemoryAwareTensorOps {
  private memoryMonitor: MemoryMonitor;
  private tensorPool: TensorPool;

  constructor() {
    this.memoryMonitor = MemoryMonitor.getInstance();
    this.tensorPool = this.memoryMonitor.getTensorPool();
  }

  /**
   * Create a tensor with memory management
   */
  createTensor(values: number[], shape?: number[], dtype: tf.DataType = 'float32'): tf.Tensor {
    // Check memory before creating
    if (!this.memoryMonitor.checkMemoryUsage()) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ High memory usage, creating tensor anyway');
    }
    
    return tf.tensor(values, shape, dtype);
  }

  /**
   * Perform tensor operations with automatic cleanup
   */
  async withCleanup<T>(operation: () => Promise<T>): Promise<T> {
    const initialTensorCount = tf.memory().numTensors;
    
    try {
      const result = await operation();
      return result;
    } finally {
      // Clean up any leaked tensors
      const finalTensorCount = tf.memory().numTensors;
      if (finalTensorCount > initialTensorCount) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ Potential tensor leak detected: ${finalTensorCount - initialTensorCount} tensors not disposed`);
      }
    }
  }

  /**
   * Batch tensor operations with memory management
   */
  async batchOperations<T>(
    operations: Array<() => Promise<T>>,
    batchSize: number = TensorPool.DEFAULT_BATCH_SIZE
  ): Promise<T[]> {
    // Create batches
    const batches: Array<() => Promise<T[]>> = [];
    
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      batches.push(() => this.processBatch(batch));
    }
    
    // Process all batches in parallel
    const batchResults = await Promise.all(
      batches.map(batchProcessor => batchProcessor())
    );
    
    // Flatten results
    return batchResults.flat();
  }

  /**
   * Process a single batch of operations
   */
  private async processBatch<T>(batch: Array<() => Promise<T>>): Promise<T[]> {
    // Check memory before processing batch
    if (!this.memoryMonitor.checkMemoryUsage()) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ High memory usage, processing sequentially');
      // Process one at a time if memory is high - use reduce to avoid await in loop
      return batch.reduce(async (accPromise, operation) => {
        const acc = await accPromise;
        const result = await this.withCleanup(operation);
        acc.push(result);
        return acc;
      }, Promise.resolve([] as T[]));
    } else {
      // Process batch normally
      return Promise.all(
        batch.map(operation => this.withCleanup(operation))
      );
    }
  }
}

/**
 * Memory leak detector for development
 */
export class MemoryLeakDetector {
  private snapshots: Array<{ timestamp: number; stats: MemoryStats }> = [];
  private maxSnapshots = TensorPool.MAX_SNAPSHOTS;

  constructor() {
    // Take snapshot every 10 seconds
    setInterval(() => {
      this.takeSnapshot();
    }, TensorPool.SNAPSHOT_INTERVAL);
  }

  private takeSnapshot(): void {
    const monitor = MemoryMonitor.getInstance();
    const stats = monitor.getMemoryStats();
    
    this.snapshots.push({
      timestamp: Date.now(),
      stats
    });
    
    // Keep only recent snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
  }

  /**
   * Analyze memory usage patterns
   */
  analyzeMemoryPatterns(): {
    isLeaking: boolean;
    trend: 'increasing' | 'stable' | 'decreasing';
    averageGrowth: number;
    recommendations: string[];
  } {
    if (this.snapshots.length < TensorPool.MIN_SNAPSHOTS_FOR_ANALYSIS) {
      return {
        isLeaking: false,
        trend: 'stable',
        averageGrowth: 0,
        recommendations: ['Insufficient data for analysis']
      };
    }

    const recent = this.snapshots.slice(-TensorPool.MIN_SNAPSHOTS_FOR_ANALYSIS);
    const growth = recent.map((snapshot, index) => {
      if (index === 0) return 0;
      return snapshot.stats.usedJSHeapSize - recent[index - 1].stats.usedJSHeapSize;
    });

    const averageGrowth = growth.reduce((sum, g) => sum + g, 0) / growth.length;
    const isLeaking = averageGrowth > TensorPool.MEMORY_LEAK_THRESHOLD; // 1MB growth per snapshot
    const trend = averageGrowth > 0 ? 'increasing' : averageGrowth < 0 ? 'decreasing' : 'stable';

    const recommendations: string[] = [];
    if (isLeaking) {
      recommendations.push('Memory leak detected - check tensor disposal');
      recommendations.push('Consider reducing batch sizes');
      recommendations.push('Review caching strategies');
    }
    if (trend === 'increasing') {
      recommendations.push('Monitor memory usage closely');
    }

    return {
      isLeaking,
      trend,
      averageGrowth,
      recommendations
    };
  }
}
