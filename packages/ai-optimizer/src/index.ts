// Main exports for the AI Optimizer package
export { AIOptimizer } from './engine/AIOptimizer.js';
export { FeatureExtractor } from './engine/FeatureExtractor.js';
export { ModelTrainer } from './engine/ModelTrainer.js';
export { PredictionEngine } from './engine/PredictionEngine.js';

// Type exports
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

// Version information
export const VERSION = '0.0.1';

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
  config: import('@react-responsive-easy/core').ResponsiveConfig,
  usageData: import('./types/index.js').ComponentUsageData[]
): Promise<import('./types/index.js').OptimizationSuggestions> {
  const optimizer = await createAIOptimizer();
  return optimizer.optimizeScaling(config, usageData);
}
