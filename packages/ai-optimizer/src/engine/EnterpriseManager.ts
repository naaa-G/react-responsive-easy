import { ResponsiveConfig, ComponentUsageData, OptimizationSuggestions } from '../types/index.js';
import { MemoryMonitor, MemoryAwareTensorOps } from '../utils/MemoryManager.js';
import { PerformanceOptimizer } from '../utils/PerformanceOptimizer.js';
import { AnalyticsEngine } from '../utils/AnalyticsEngine.js';
import { AdvancedCache, IntelligentMemoizer, CachePerformanceMonitor } from '../utils/AdvancedCache.js';
import { AdvancedBatchProcessor, BatchProcessingOptimizer } from '../utils/BatchProcessor.js';
import { DynamicConfigManager } from '../utils/DynamicConfig.js';
import { AI_OPTIMIZER_CONSTANTS, ADDITIONAL_CONSTANTS } from '../constants.js';

/**
 * Manages enterprise features for AI Optimizer
 */
export class EnterpriseManager {
  private memoryMonitor!: MemoryMonitor;
  private memoryAwareOps!: MemoryAwareTensorOps;
  private performanceOptimizer!: PerformanceOptimizer;
  private analyticsEngine!: AnalyticsEngine;
  private advancedCache!: AdvancedCache;
  private memoizer!: IntelligentMemoizer;
  private cacheMonitor!: CachePerformanceMonitor;
  private batchProcessor!: AdvancedBatchProcessor<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }, OptimizationSuggestions>;
  private batchOptimizer!: BatchProcessingOptimizer;
  private dynamicConfig!: DynamicConfigManager;

  constructor() {
    this.initializeEnterpriseFeatures();
  }

  /**
   * Initialize enterprise features
   */
  private initializeEnterpriseFeatures(): void {
    this.memoryMonitor = MemoryMonitor.getInstance();
    this.memoryAwareOps = new MemoryAwareTensorOps();
    this.performanceOptimizer = new PerformanceOptimizer();
    this.analyticsEngine = new AnalyticsEngine();

    this.advancedCache = new AdvancedCache({
      maxSize: ADDITIONAL_CONSTANTS.MEMORY_200MB,
      defaultTtl: AI_OPTIMIZER_CONSTANTS.TIME.HOUR,
      compressionEnabled: true,
      warmingEnabled: true,
      invalidationStrategy: 'hybrid'
    });
    
    this.memoizer = new IntelligentMemoizer({
      maxSize: 2000,
      defaultTtl: 30 * 60 * 1000, // 30 minutes
      enableDependencyTracking: true
    });
    
    this.cacheMonitor = new CachePerformanceMonitor();
    
    this.batchProcessor = new AdvancedBatchProcessor(
      this.processBatchOptimization.bind(this),
      {
        maxBatchSize: 50,
        minBatchSize: 5,
        maxWaitTime: 3000,
        maxConcurrentBatches: 3,
        enablePriority: true,
        enableProgressTracking: true
      }
    );
    
    this.batchOptimizer = new BatchProcessingOptimizer();
    
    this.dynamicConfig = new DynamicConfigManager({
      schema: this.getConfigSchema(),
      sources: [
        { type: 'environment', priority: 1, enabled: true },
        { type: 'memory', priority: 2, enabled: true }
      ],
      enableVersioning: true
    });
  }

  /**
   * Start monitoring
   */
  startMonitoring(): void {
    this.memoryMonitor.startMonitoring();
  }

  /**
   * Get comprehensive performance metrics
   */
  getPerformanceMetrics() {
    return this.performanceOptimizer.getPerformanceMetrics();
  }

  /**
   * Get system health status
   */
  getSystemHealth() {
    const memoryStats = this.memoryMonitor.getMemoryStats();
    const performanceMetrics = this.performanceOptimizer.getPerformanceMetrics();
    const analytics = this.analyticsEngine.generateReport();
    
    return {
      memory: memoryStats,
      performance: performanceMetrics,
      analytics: analytics.summary,
      status: memoryStats.memoryPressure === 'critical' ? 'critical' : 
              memoryStats.memoryPressure === 'high' ? 'warning' : 'healthy'
    };
  }

  /**
   * Get analytics report
   */
  getAnalyticsReport() {
    return this.analyticsEngine.generateReport();
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): string {
    return this.analyticsEngine.exportData();
  }

  /**
   * Get memory statistics
   */
  getMemoryStats() {
    return this.memoryMonitor.getMemoryStats();
  }

  /**
   * Force memory cleanup
   */
  forceMemoryCleanup(): void {
    this.memoryMonitor.checkMemoryUsage();
  }

  /**
   * Get advanced cache statistics
   */
  getCacheStats() {
    return {
      advanced: this.advancedCache.getStats(),
      memoization: this.memoizer.getStats(),
      performance: this.cacheMonitor.getMetrics()
    };
  }

  /**
   * Warm cache with frequently accessed data
   */
  async warmCache(dataProvider: (_key: string) => Promise<unknown>): Promise<void> {
    const commonKeys = [
      'optimization:default',
      'features:common',
      'model:predictions',
      'performance:metrics'
    ];
    
    await this.advancedCache.warmCache(commonKeys, dataProvider);
  }

  /**
   * Invalidate cache entries
   */
  invalidateCache(pattern: string | RegExp | string[]): void {
    this.advancedCache.invalidate(pattern);
    if (typeof pattern === 'string' || pattern instanceof RegExp) {
      this.memoizer.invalidate(pattern);
    } else {
      pattern.forEach(p => this.memoizer.invalidate(p));
    }
  }

  /**
   * Get batch processing statistics
   */
  getBatchStats() {
    return {
      processor: this.batchProcessor.getStats(),
      optimizer: this.batchOptimizer.getRecommendations(),
      progress: this.batchProcessor.getProgress()
    };
  }

  /**
   * Get dynamic configuration value
   */
  getConfigValue<T = unknown>(path: string, defaultValue?: T): T {
    return this.dynamicConfig.get(path, defaultValue);
  }

  /**
   * Update dynamic configuration
   */
  updateConfig(path: string, value: unknown, source = 'api'): void {
    this.dynamicConfig.set(path, value, source);
    
    // Invalidate related caches
    this.invalidateCache(`config:${path}`);
  }

  /**
   * Bulk update configuration
   */
  bulkUpdateConfig(
    updates: Record<string, unknown>, 
    source = 'bulk'
  ): void {
    this.dynamicConfig.update(updates, source);
    
    // Invalidate all config-related caches
    this.invalidateCache(/^config:/);
  }

  /**
   * Get configuration schema
   */
  getConfigSchema() {
    return {
      'model.architecture': {
        type: 'string' as const,
        enum: ['neural-network', 'linear-regression', 'decision-tree'],
        default: 'neural-network',
        description: 'AI model architecture type'
      },
      'model.training.epochs': {
        type: 'number' as const,
        min: 1,
        max: 1000,
        default: 100,
        description: 'Number of training epochs'
      },
      'model.training.batchSize': {
        type: 'number' as const,
        min: 1,
        max: 128,
        default: 32,
        description: 'Training batch size'
      },
      'cache.maxSize': {
        type: 'number' as const,
        min: ADDITIONAL_CONSTANTS.MEMORY_THRESHOLD * ADDITIONAL_CONSTANTS.KB_TO_BYTES, // 1MB
        max: ADDITIONAL_CONSTANTS.MEMORY_THRESHOLD * ADDITIONAL_CONSTANTS.MB_TO_BYTES, // 1GB
        default: ADDITIONAL_CONSTANTS.MEMORY_200MB, // 200MB
        description: 'Maximum cache size in bytes'
      },
      'cache.defaultTtl': {
        type: 'number' as const,
        min: 1000, // 1 second
        max: 24 * 60 * 60 * 1000, // 24 hours
        default: 60 * 60 * 1000, // 1 hour
        description: 'Default cache TTL in milliseconds'
      },
      'batch.maxSize': {
        type: 'number' as const,
        min: 1,
        max: 1000,
        default: 50,
        description: 'Maximum batch size for processing'
      },
      'performance.enableOptimization': {
        type: 'boolean' as const,
        default: true,
        description: 'Enable performance optimizations'
      }
    };
  }

  /**
   * Export configuration
   */
  exportConfig(format: 'json' | 'yaml' | 'env' = 'json'): string {
    return this.dynamicConfig.export(format);
  }

  /**
   * Import configuration
   */
  importConfig(
    configData: string, 
    format: 'json' | 'yaml' | 'env' = 'json'
  ): void {
    this.dynamicConfig.import(configData, format);
    
    // Apply configuration changes
    this.applyConfigurationChanges();
  }

  /**
   * Rollback configuration to previous version
   */
  rollbackConfig(version?: string): void {
    this.dynamicConfig.rollback(version);
    this.applyConfigurationChanges();
  }

  /**
   * Get configuration versions
   */
  getConfigVersions() {
    return this.dynamicConfig.getVersions();
  }

  /**
   * Get comprehensive enterprise metrics
   */
  getEnterpriseMetrics() {
    return {
      systemHealth: this.getSystemHealth(),
      performance: this.getPerformanceMetrics(),
      cache: this.getCacheStats(),
      batch: this.getBatchStats(),
      analytics: this.getAnalyticsReport(),
      config: this.dynamicConfig.getPerformanceMetrics(),
      memory: this.getMemoryStats()
    };
  }

  /**
   * Optimize system performance
   */
  optimizeSystem(): void {
    // Optimize cache
    this.advancedCache.optimize();
    
    // Optimize batch processing
    const recommendations = this.batchOptimizer.getRecommendations();
    if (recommendations.optimalBatchSize) {
      // Update batch processor configuration
      // This would require extending the batch processor to support dynamic config
    }
    
    // Clear expired cache entries
    this.advancedCache.invalidate(/^expired:/);
    
    // Force memory cleanup
    this.forceMemoryCleanup();
  }

  /**
   * Clear all caches and reset metrics
   */
  clearCache(): void {
    this.performanceOptimizer.clear();
    this.analyticsEngine.clear();
  }

  /**
   * Process batch optimization
   */
  private processBatchOptimization(
    _batch: Array<{ config: ResponsiveConfig; usageData: ComponentUsageData[] }>
  ): Promise<OptimizationSuggestions[]> {
    // This will be implemented by the main AIOptimizer class
    // This is just a placeholder for the batch processor
    return Promise.resolve([]);
  }

  /**
   * Apply configuration changes
   */
  private applyConfigurationChanges(): void {
    // Apply configuration changes to the system
    this.getConfigValue('cache.maxSize', ADDITIONAL_CONSTANTS.CACHE_MAX_SIZE * ADDITIONAL_CONSTANTS.MB_TO_BYTES);
    this.getConfigValue('cache.defaultTtl', AI_OPTIMIZER_CONSTANTS.TIME.HOUR);
    
    // Update cache configuration
    // Note: This would require extending the cache to support dynamic reconfiguration
    
    // Update batch configuration
    this.getConfigValue('batch.maxSize', AI_OPTIMIZER_CONSTANTS.CACHE_SIZES.MAX_ITEMS);
    // Note: This would require extending the batch processor to support dynamic reconfiguration
    
    // Invalidate relevant caches
    this.invalidateCache(/^config:/);
  }

  /**
   * Get performance optimizer
   */
  getPerformanceOptimizer() {
    return this.performanceOptimizer;
  }

  /**
   * Get memory aware operations
   */
  getMemoryAwareOps() {
    return this.memoryAwareOps;
  }

  /**
   * Get analytics engine
   */
  getAnalyticsEngine() {
    return this.analyticsEngine;
  }

  /**
   * Batch optimize multiple configurations with priority
   */
  async batchOptimizeWithPriority(
    requests: Array<{
      config: ResponsiveConfig;
      usageData: ComponentUsageData[];
      priority?: number;
      metadata?: Record<string, unknown>;
    }>
  ): Promise<Map<string, OptimizationSuggestions>> {
    // Add items to batch processor with priority
    requests.map(request => 
      this.batchProcessor.addItem(
        { config: request.config, usageData: request.usageData },
        {
          priority: request.priority ?? 0,
          metadata: request.metadata
        }
      )
    );

    // Process all batches
    const results = await this.batchProcessor.processAll();

    // Convert BatchResult to OptimizationSuggestions
    const convertedResults = new Map<string, OptimizationSuggestions>();
    for (const [id, result] of results.entries()) {
      if (result.success && result.data) {
        convertedResults.set(id, result.data);
      }
    }
    return convertedResults;
  }

  /**
   * Dispose enterprise resources
   */
  dispose(): void {
    this.memoryMonitor.dispose();
    this.clearCache();
    this.advancedCache.clear();
    this.memoizer.clear();
    this.batchProcessor.cancel();
    this.dynamicConfig.removeAllListeners();
  }
}
