/**
 * Advanced Batch Processing System for AI Optimizer
 * 
 * Features:
 * - Intelligent batching with dynamic batch sizing
 * - Priority-based queue management
 * - Parallel processing with worker pools
 * - Progress tracking and cancellation
 * - Memory-aware batch processing
 * - Retry mechanisms and error handling
 * - Performance monitoring and optimization
 */

import { EventEmitter } from 'events';

export interface BatchItem<T = any> {
  id: string;
  data: T;
  priority: number;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
}

export interface BatchConfig {
  maxBatchSize: number;
  minBatchSize: number;
  maxWaitTime: number;
  maxConcurrentBatches: number;
  retryDelay: number;
  enablePriority: boolean;
  enableProgressTracking: boolean;
  memoryThreshold: number;
}

export interface BatchResult<T = any> {
  id: string;
  success: boolean;
  data?: T;
  error?: Error;
  processingTime: number;
  retryCount: number;
}

export interface BatchProgress {
  total: number;
  processed: number;
  failed: number;
  pending: number;
  percentage: number;
  estimatedTimeRemaining: number;
  averageProcessingTime: number;
}

export interface ProcessingStats {
  totalBatches: number;
  totalItems: number;
  successfulItems: number;
  failedItems: number;
  averageBatchSize: number;
  averageProcessingTime: number;
  throughput: number; // items per second
  errorRate: number;
}

/**
 * Advanced Batch Processor with intelligent queuing and processing
 */
export class AdvancedBatchProcessor<T = any, R = any> extends EventEmitter {
  private queue: BatchItem<T>[] = [];
  private processingBatches: Map<string, BatchItem<T>[]> = new Map();
  private results: Map<string, BatchResult<R>> = new Map();
  private config: BatchConfig;
  private stats: ProcessingStats;
  private isProcessing = false;
  private processingStartTime = 0;
  private batchIdCounter = 0;
  private workerPool: Worker[] = [];
  private memoryMonitor: MemoryMonitor;
  private progressTracker: ProgressTracker;

  constructor(
    private processor: (batch: T[]) => Promise<R[]>,
    config: Partial<BatchConfig> = {}
  ) {
    super();
    
    this.config = {
      maxBatchSize: 100,
      minBatchSize: 10,
      maxWaitTime: 5000, // 5 seconds
      maxConcurrentBatches: 4,
      retryDelay: 1000,
      enablePriority: true,
      enableProgressTracking: true,
      memoryThreshold: 100 * 1024 * 1024, // 100MB
      ...config
    };

    this.stats = {
      totalBatches: 0,
      totalItems: 0,
      successfulItems: 0,
      failedItems: 0,
      averageBatchSize: 0,
      averageProcessingTime: 0,
      throughput: 0,
      errorRate: 0
    };

    this.memoryMonitor = new MemoryMonitor();
    this.progressTracker = new ProgressTracker();
    
    this.initializeWorkerPool();
    this.startProcessing();
  }

  /**
   * Add item to batch queue
   */
  addItem(
    data: T,
    options: {
      priority?: number;
      maxRetries?: number;
      metadata?: Record<string, any>;
    } = {}
  ): string {
    const item: BatchItem<T> = {
      id: this.generateId(),
      data,
      priority: options.priority || 0,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: options.maxRetries || 3,
      metadata: options.metadata
    };

    this.queue.push(item);
    this.stats.totalItems++;

    // Sort by priority if enabled
    if (this.config.enablePriority) {
      this.queue.sort((a, b) => b.priority - a.priority);
    }

    this.emit('itemAdded', item);
    this.checkForBatchProcessing();

    return item.id;
  }

  /**
   * Add multiple items to batch queue
   */
  addItems(
    items: Array<{
      data: T;
      priority?: number;
      maxRetries?: number;
      metadata?: Record<string, any>;
    }>
  ): string[] {
    const ids: string[] = [];
    
    for (const itemData of items) {
      const id = this.addItem(itemData.data, {
        priority: itemData.priority,
        maxRetries: itemData.maxRetries,
        metadata: itemData.metadata
      });
      ids.push(id);
    }

    return ids;
  }

  /**
   * Process all queued items
   */
  async processAll(): Promise<Map<string, BatchResult<R>>> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Batch processing timeout'));
      }, 300000); // 5 minutes timeout

      this.once('processingComplete', () => {
        clearTimeout(timeout);
        resolve(new Map(this.results));
      });

      this.once('processingError', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      this.startProcessing();
    });
  }

  /**
   * Get processing progress
   */
  getProgress(): BatchProgress {
    return this.progressTracker.getProgress();
  }

  /**
   * Get processing statistics
   */
  getStats(): ProcessingStats {
    return { ...this.stats };
  }

  /**
   * Cancel processing
   */
  cancel(): void {
    this.isProcessing = false;
    this.queue = [];
    this.processingBatches.clear();
    this.emit('processingCancelled');
  }

  /**
   * Clear all results
   */
  clear(): void {
    this.results.clear();
    this.stats = {
      totalBatches: 0,
      totalItems: 0,
      successfulItems: 0,
      failedItems: 0,
      averageBatchSize: 0,
      averageProcessingTime: 0,
      throughput: 0,
      errorRate: 0
    };
    this.progressTracker.reset();
  }

  /**
   * Get result for specific item
   */
  getResult(itemId: string): BatchResult<R> | undefined {
    return this.results.get(itemId);
  }

  /**
   * Get all results
   */
  getAllResults(): Map<string, BatchResult<R>> {
    return new Map(this.results);
  }

  // Private methods

  private async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.processingStartTime = Date.now();
    this.emit('processingStarted');

    try {
      while (this.isProcessing && (this.queue.length > 0 || this.processingBatches.size > 0)) {
        await this.processNextBatch();
        await this.waitForBatchCompletion();
      }

      if (this.isProcessing) {
        this.emit('processingComplete');
      }
    } catch (error) {
      this.emit('processingError', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processNextBatch(): Promise<void> {
    if (this.processingBatches.size >= this.config.maxConcurrentBatches) {
      return;
    }

    const batch = this.createBatch();
    if (batch.length === 0) return;

    const batchId = this.generateBatchId();
    this.processingBatches.set(batchId, batch);
    this.stats.totalBatches++;

    // Remove items from queue
    batch.forEach(item => {
      const index = this.queue.findIndex(q => q.id === item.id);
      if (index > -1) {
        this.queue.splice(index, 1);
      }
    });

    this.emit('batchStarted', { batchId, items: batch });

    // Process batch
    this.processBatch(batchId, batch).catch(error => {
      console.error(`Batch ${batchId} processing error:`, error);
      this.handleBatchError(batchId, batch, error);
    });
  }

  private createBatch(): BatchItem<T>[] {
    const batch: BatchItem<T>[] = [];
    const now = Date.now();

    // Check if we should create a batch based on size or time
    const shouldCreateBatch = 
      this.queue.length >= this.config.minBatchSize ||
      (this.queue.length > 0 && this.getOldestItemAge() >= this.config.maxWaitTime);

    if (!shouldCreateBatch) return batch;

    // Check memory constraints
    if (this.memoryMonitor.getCurrentUsage() > this.config.memoryThreshold) {
      // Reduce batch size under memory pressure
      const reducedMaxSize = Math.max(
        this.config.minBatchSize,
        Math.floor(this.config.maxBatchSize * 0.5)
      );
      
      for (let i = 0; i < Math.min(reducedMaxSize, this.queue.length); i++) {
        batch.push(this.queue[i]);
      }
    } else {
      // Normal batch creation
      for (let i = 0; i < Math.min(this.config.maxBatchSize, this.queue.length); i++) {
        batch.push(this.queue[i]);
      }
    }

    return batch;
  }

  private async processBatch(batchId: string, batch: BatchItem<T>[]): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Extract data from batch items
      const data = batch.map(item => item.data);
      
      // Process batch
      const results = await this.processor(data);
      
      // Handle results
      batch.forEach((item, index) => {
        const result: BatchResult<R> = {
          id: item.id,
          success: true,
          data: results[index],
          processingTime: performance.now() - startTime,
          retryCount: item.retryCount
        };
        
        this.results.set(item.id, result);
        this.stats.successfulItems++;
        this.progressTracker.recordSuccess();
      });

      this.emit('batchCompleted', { batchId, results: batch.map(item => this.results.get(item.id)) });
      
    } catch (error) {
      this.handleBatchError(batchId, batch, error as Error);
    } finally {
      this.processingBatches.delete(batchId);
      this.updateStats(performance.now() - startTime, batch.length);
    }
  }

  private handleBatchError(batchId: string, batch: BatchItem<T>[], error: Error): void {
    batch.forEach(item => {
      if (item.retryCount < item.maxRetries) {
        // Retry item
        item.retryCount++;
        setTimeout(() => {
          this.queue.push(item);
          this.checkForBatchProcessing();
        }, this.config.retryDelay * item.retryCount);
      } else {
        // Mark as failed
        const result: BatchResult<R> = {
          id: item.id,
          success: false,
          error,
          processingTime: 0,
          retryCount: item.retryCount
        };
        
        this.results.set(item.id, result);
        this.stats.failedItems++;
        this.progressTracker.recordFailure();
      }
    });

    this.emit('batchFailed', { batchId, error, items: batch });
  }

  private async waitForBatchCompletion(): Promise<void> {
    // Wait for at least one batch to complete or timeout
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (this.processingBatches.size < this.config.maxConcurrentBatches) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  private checkForBatchProcessing(): void {
    if (this.isProcessing && this.queue.length > 0) {
      this.processNextBatch();
    }
  }

  private getOldestItemAge(): number {
    if (this.queue.length === 0) return 0;
    return Date.now() - Math.min(...this.queue.map(item => item.timestamp));
  }

  private updateStats(processingTime: number, batchSize: number): void {
    this.stats.averageProcessingTime = 
      (this.stats.averageProcessingTime * (this.stats.totalBatches - 1) + processingTime) / 
      this.stats.totalBatches;
    
    this.stats.averageBatchSize = 
      (this.stats.averageBatchSize * (this.stats.totalBatches - 1) + batchSize) / 
      this.stats.totalBatches;

    const totalTime = (Date.now() - this.processingStartTime) / 1000;
    this.stats.throughput = this.stats.successfulItems / totalTime;
    this.stats.errorRate = this.stats.failedItems / this.stats.totalItems;
  }

  private generateId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBatchId(): string {
    return `batch_${++this.batchIdCounter}_${Date.now()}`;
  }

  private initializeWorkerPool(): void {
    // Mock worker pool initialization
    // In real implementation, create Web Workers for parallel processing
  }
}

/**
 * Memory Monitor for batch processing
 */
class MemoryMonitor {
  private currentUsage = 0;
  private peakUsage = 0;

  getCurrentUsage(): number {
    // Mock memory usage - in real implementation, use performance.memory
    return this.currentUsage;
  }

  getPeakUsage(): number {
    return this.peakUsage;
  }

  recordUsage(usage: number): void {
    this.currentUsage = usage;
    this.peakUsage = Math.max(this.peakUsage, usage);
  }

  reset(): void {
    this.currentUsage = 0;
    this.peakUsage = 0;
  }
}

/**
 * Progress Tracker for batch processing
 */
class ProgressTracker {
  private total = 0;
  private processed = 0;
  private failed = 0;
  private startTime = 0;
  private processingTimes: number[] = [];

  start(total: number): void {
    this.total = total;
    this.processed = 0;
    this.failed = 0;
    this.startTime = Date.now();
    this.processingTimes = [];
  }

  recordSuccess(): void {
    this.processed++;
  }

  recordFailure(): void {
    this.failed++;
  }

  recordProcessingTime(time: number): void {
    this.processingTimes.push(time);
  }

  getProgress(): BatchProgress {
    const totalProcessed = this.processed + this.failed;
    const percentage = this.total > 0 ? (totalProcessed / this.total) * 100 : 0;
    
    const averageProcessingTime = this.processingTimes.length > 0
      ? this.processingTimes.reduce((sum, time) => sum + time, 0) / this.processingTimes.length
      : 0;

    const estimatedTimeRemaining = averageProcessingTime > 0 && this.processed > 0
      ? (this.total - totalProcessed) * averageProcessingTime
      : 0;

    return {
      total: this.total,
      processed: this.processed,
      failed: this.failed,
      pending: this.total - totalProcessed,
      percentage,
      estimatedTimeRemaining,
      averageProcessingTime
    };
  }

  reset(): void {
    this.total = 0;
    this.processed = 0;
    this.failed = 0;
    this.startTime = 0;
    this.processingTimes = [];
  }
}

/**
 * Batch Processing Optimizer
 */
export class BatchProcessingOptimizer {
  private historicalData: Array<{
    batchSize: number;
    processingTime: number;
    successRate: number;
    memoryUsage: number;
  }> = [];

  /**
   * Optimize batch size based on historical performance
   */
  optimizeBatchSize(currentBatchSize: number): number {
    if (this.historicalData.length < 10) {
      return currentBatchSize;
    }

    // Find optimal batch size based on throughput
    const throughputBySize = new Map<number, number>();
    
    this.historicalData.forEach(data => {
      const throughput = data.batchSize / data.processingTime;
      const existing = throughputBySize.get(data.batchSize) || 0;
      throughputBySize.set(data.batchSize, (existing + throughput) / 2);
    });

    let optimalSize = currentBatchSize;
    let maxThroughput = 0;

    throughputBySize.forEach((throughput, size) => {
      if (throughput > maxThroughput) {
        maxThroughput = throughput;
        optimalSize = size;
      }
    });

    return optimalSize;
  }

  /**
   * Record batch processing data for optimization
   */
  recordBatchData(data: {
    batchSize: number;
    processingTime: number;
    successRate: number;
    memoryUsage: number;
  }): void {
    this.historicalData.push(data);
    
    // Keep only recent data
    if (this.historicalData.length > 100) {
      this.historicalData = this.historicalData.slice(-50);
    }
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): {
    optimalBatchSize: number;
    recommendedConcurrency: number;
    memoryOptimization: string[];
  } {
    const avgBatchSize = this.historicalData.reduce((sum, d) => sum + d.batchSize, 0) / this.historicalData.length;
    const avgSuccessRate = this.historicalData.reduce((sum, d) => sum + d.successRate, 0) / this.historicalData.length;
    const avgMemoryUsage = this.historicalData.reduce((sum, d) => sum + d.memoryUsage, 0) / this.historicalData.length;

    const recommendations = {
      optimalBatchSize: Math.round(avgBatchSize),
      recommendedConcurrency: avgSuccessRate > 0.95 ? 4 : 2,
      memoryOptimization: [] as string[]
    };

    if (avgMemoryUsage > 100 * 1024 * 1024) { // 100MB
      recommendations.memoryOptimization.push('Consider reducing batch size');
      recommendations.memoryOptimization.push('Enable memory-aware processing');
    }

    if (avgSuccessRate < 0.9) {
      recommendations.memoryOptimization.push('Increase retry attempts');
      recommendations.memoryOptimization.push('Implement circuit breaker pattern');
    }

    return recommendations;
  }
}
