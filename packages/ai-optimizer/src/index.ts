// Main exports for the AI Optimizer package
export { AIOptimizer } from './engine/AIOptimizer.js';
export { FeatureExtractor } from './engine/FeatureExtractor.js';
export { ModelTrainer } from './engine/ModelTrainer.js';
export { PredictionEngine } from './engine/PredictionEngine.js';

// Type exports (compile-time only)
export type {
  ComponentUsageData,
  ResponsiveValueUsage,
  PerformanceMetrics,
  InteractionData,
  ComponentContext,
  OptimizationSuggestions,
  ScalingCurveRecommendation,
  PerformanceImpact,
  AccessibilityWarning,
  EstimatedImprovements,
  TrainingData,
  ModelFeatures,
  ModelLabels,
  AIModelConfig,
  ModelEvaluationMetrics,
  ConfigurationFeatures,
  UsageFeatures,
  PerformanceFeatures,
  ContextFeatures,
  TrainingMetadata
} from './types/index.js';



// Utility functions and helpers
export { createDefaultAIConfig } from './utils/defaults.js';
export { DataCollector } from './utils/DataCollector.js';
export { OptimizationReporter } from './utils/OptimizationReporter.js';

// Enterprise utilities
export { MemoryMonitor, MemoryAwareTensorOps, TensorPool } from './utils/MemoryManager.js';
export { PerformanceOptimizer, IntelligentCache, BatchProcessor } from './utils/PerformanceOptimizer.js';
export { AnalyticsEngine, AnalyticsTracker, SystemHealthMonitor } from './utils/AnalyticsEngine.js';

// Advanced enterprise utilities
export { AdvancedCache, IntelligentMemoizer, CachePerformanceMonitor } from './utils/AdvancedCache.js';
export { AdvancedBatchProcessor, BatchProcessingOptimizer } from './utils/BatchProcessor.js';
export { DynamicConfigManager } from './utils/DynamicConfig.js';

// Low priority enterprise utilities
export { AdvancedAIManager } from './utils/AdvancedAI.js';
export { HyperparameterTuner } from './utils/HyperparameterTuner.js';
export { FeatureEngineer } from './utils/FeatureEngineer.js';
export { ABTestingFramework } from './utils/ABTestingFramework.js';
export { StreamingAPIManager, OptimizationStream } from './utils/StreamingAPI.js';

// Version information
export const VERSION = '1.0.1';

/**
 * Create and initialize an AI optimizer instance
 */
export async function createAIOptimizer(config?: Partial<import('./types/index.js').AIModelConfig>): Promise<import('./engine/AIOptimizer.js').AIOptimizer> {
  const { AIOptimizer } = await import('./engine/AIOptimizer.js');
  const optimizer = new AIOptimizer(config);
  await optimizer.initialize();
  return optimizer;
}

/**
 * Quick optimization function for simple use cases
 */
export async function optimizeConfiguration(
  config: import('@yaseratiar/react-responsive-easy-core').ResponsiveConfig,
  usageData: import('./types/index.js').ComponentUsageData[]
): Promise<import('./types/index.js').OptimizationSuggestions> {
  const optimizer = await createAIOptimizer();
  return optimizer.optimizeScaling(config, usageData);
}
