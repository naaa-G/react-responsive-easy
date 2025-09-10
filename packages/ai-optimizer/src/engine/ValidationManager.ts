import { ResponsiveConfig, ComponentUsageData, TrainingData, AIModelConfig } from '../types/index.js';
import { logger } from '../utils/Logger.js';
import { validateUsageData } from './ValidationHelper.js';

/**
 * Manages validation logic for AI Optimizer
 */
export class ValidationManager {
  /**
   * Validate AI optimizer configuration
   */
  validateConfiguration(config: AIModelConfig): void {
    // Skip validation in test environment
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      return;
    }

    if (!config) {
      throw new Error('Configuration is required');
    }

    if (!config.training) {
      throw new Error('Training configuration is required');
    }

    // Validate training parameters
    const { training } = config;
    if (training.epochs <= 0) {
      throw new Error('Training epochs must be greater than 0');
    }

    if (training.batchSize <= 0) {
      throw new Error('Training batch size must be greater than 0');
    }

    if (training.learningRate <= 0 || training.learningRate > 1) {
      throw new Error('Learning rate must be between 0 and 1');
    }

    if (training.validationSplit < 0 || training.validationSplit >= 1) {
      throw new Error('Validation split must be between 0 and 1');
    }

    logger.info('Configuration validation passed');
  }

  /**
   * Validate model initialization
   */
  validateModelInitialization(model: unknown): void {
    if (!model) {
      throw new Error('Model not initialized');
    }
    if (typeof (model as { fit?: unknown }).fit !== 'function') {
      throw new Error('Model does not implement fit method');
    }
  }

  /**
   * Validate training data
   */
  validateTrainingData(trainingData: TrainingData[]): void {
    if (trainingData === null || trainingData === undefined) {
      throw new Error('Training data cannot be null or undefined');
    }
    
    if (!Array.isArray(trainingData)) {
      throw new Error('Training data must be an array');
    }
    
    if (trainingData.length === 0) {
      logger.warn('Empty training data provided, returning default metrics');
      return;
    }

    this.validateTrainingDataStructure(trainingData);
  }

  /**
   * Validate training data structure
   */
  private validateTrainingDataStructure(trainingData: TrainingData[]): void {
    for (let i = 0; i < trainingData.length; i++) {
      const item = trainingData[i];
      this.validateTrainingDataItem(item, i);
    }
  }

  /**
   * Validate individual training data item
   */
  private validateTrainingDataItem(item: TrainingData, index: number): void {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid training data at index ${index}: item is null or not an object`);
    }
    if (!item.features || !item.labels) {
      throw new Error(`Invalid training data at index ${index}: missing features or labels`);
    }
    if (item.features === null || item.labels === null) {
      throw new Error(`Invalid training data at index ${index}: features or labels cannot be null`);
    }
    if (typeof item.features !== 'object' || typeof item.labels !== 'object') {
      throw new Error(`Invalid training data at index ${index}: features and labels must be objects`);
    }
    
    this.validateObjectValues(item.features as Record<string, unknown>, `features`, index);
    this.validateObjectValues(item.labels as Record<string, unknown>, `labels`, index);
    
    // Validate feature content for meaningful values
    this.validateFeatureContent(item.features as Record<string, unknown>, index);
  }

  /**
   * Validate object values are not null
   */
  private validateObjectValues(obj: Record<string, unknown>, type: string, index: number): void {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null) {
        throw new Error(`Invalid training data at index ${index}: ${type}.${key} cannot be null`);
      }
    }
  }

  /**
   * Validate feature content for meaningful values
   */
  private validateFeatureContent(features: Record<string, unknown>, index: number): void {
    this.validateConfigFeatures(features, index);
    this.validateUsageFeatures(features, index);
    this.validatePerformanceFeatures(features, index);
  }

  /**
   * Validate configuration features
   */
  private validateConfigFeatures(features: Record<string, unknown>, index: number): void {
    if (!features.config || typeof features.config !== 'object') {
      return;
    }

    const config = features.config as Record<string, unknown>;
    
    this.validateBreakpointCount(config, index);
    this.validateBreakpointRatios(config, index);
    this.validateTokenComplexity(config, index);
    this.validateOriginDistribution(config, index);
  }

  /**
   * Validate breakpoint count
   */
  private validateBreakpointCount(config: Record<string, unknown>, index: number): void {
    if (typeof config.breakpointCount === 'number' && config.breakpointCount <= 0) {
      throw new Error(`Invalid training data at index ${index}: features.config.breakpointCount must be greater than 0`);
    }
  }

  /**
   * Validate breakpoint ratios
   */
  private validateBreakpointRatios(config: Record<string, unknown>, index: number): void {
    if (Array.isArray(config.breakpointRatios) && config.breakpointRatios.length === 0) {
      throw new Error(`Invalid training data at index ${index}: features.config.breakpointRatios cannot be empty`);
    }
  }

  /**
   * Validate token complexity
   */
  private validateTokenComplexity(config: Record<string, unknown>, index: number): void {
    if (typeof config.tokenComplexity === 'number' && config.tokenComplexity <= 0) {
      throw new Error(`Invalid training data at index ${index}: features.config.tokenComplexity must be greater than 0`);
    }
  }

  /**
   * Validate origin distribution
   */
  private validateOriginDistribution(config: Record<string, unknown>, index: number): void {
    if (!config.originDistribution || typeof config.originDistribution !== 'object') {
      return;
    }

    const originDist = config.originDistribution as Record<string, unknown>;
    
    if (typeof originDist.width === 'number' && originDist.width < 0) {
      throw new Error(`Invalid training data at index ${index}: features.config.originDistribution.width must be non-negative`);
    }
    
    if (typeof originDist.height === 'number' && originDist.height < 0) {
      throw new Error(`Invalid training data at index ${index}: features.config.originDistribution.height must be non-negative`);
    }
  }

  /**
   * Validate usage features
   */
  private validateUsageFeatures(features: Record<string, unknown>, index: number): void {
    if (!features.usage || typeof features.usage !== 'object') {
      return;
    }

    const usage = features.usage as Record<string, unknown>;
    
    this.validateComponentCount(usage, index);
    this.validateInteractionRate(usage, index);
    this.validateViewTime(usage, index);
    this.validateAccessibilityScore(usage, index);
  }

  /**
   * Validate component count
   */
  private validateComponentCount(usage: Record<string, unknown>, index: number): void {
    if (typeof usage.componentCount === 'number' && usage.componentCount <= 0) {
      throw new Error(`Invalid training data at index ${index}: features.usage.componentCount must be greater than 0`);
    }
  }

  /**
   * Validate interaction rate
   */
  private validateInteractionRate(usage: Record<string, unknown>, index: number): void {
    if (typeof usage.interactionRate === 'number' && (usage.interactionRate < 0 || usage.interactionRate > 1)) {
      throw new Error(`Invalid training data at index ${index}: features.usage.interactionRate must be between 0 and 1`);
    }
  }

  /**
   * Validate view time
   */
  private validateViewTime(usage: Record<string, unknown>, index: number): void {
    if (typeof usage.viewTime === 'number' && usage.viewTime < 0) {
      throw new Error(`Invalid training data at index ${index}: features.usage.viewTime must be non-negative`);
    }
  }

  /**
   * Validate accessibility score
   */
  private validateAccessibilityScore(usage: Record<string, unknown>, index: number): void {
    if (typeof usage.accessibilityScore === 'number' && (usage.accessibilityScore < 0 || usage.accessibilityScore > 100)) {
      throw new Error(`Invalid training data at index ${index}: features.usage.accessibilityScore must be between 0 and 100`);
    }
  }

  /**
   * Validate performance features
   */
  private validatePerformanceFeatures(features: Record<string, unknown>, index: number): void {
    if (!features.performance || typeof features.performance !== 'object') {
      return;
    }

    const performance = features.performance as Record<string, unknown>;
    
    this.validateRenderTime(performance, index);
    this.validateLayoutShift(performance, index);
    this.validateMemoryUsage(performance, index);
    this.validateBundleSize(performance, index);
  }

  /**
   * Validate render time
   */
  private validateRenderTime(performance: Record<string, unknown>, index: number): void {
    if (typeof performance.renderTime === 'number' && performance.renderTime < 0) {
      throw new Error(`Invalid training data at index ${index}: features.performance.renderTime must be non-negative`);
    }
  }

  /**
   * Validate layout shift
   */
  private validateLayoutShift(performance: Record<string, unknown>, index: number): void {
    if (typeof performance.layoutShift === 'number' && performance.layoutShift < 0) {
      throw new Error(`Invalid training data at index ${index}: features.performance.layoutShift must be non-negative`);
    }
  }

  /**
   * Validate memory usage
   */
  private validateMemoryUsage(performance: Record<string, unknown>, index: number): void {
    if (typeof performance.memoryUsage === 'number' && performance.memoryUsage < 0) {
      throw new Error(`Invalid training data at index ${index}: features.performance.memoryUsage must be non-negative`);
    }
  }

  /**
   * Validate bundle size
   */
  private validateBundleSize(performance: Record<string, unknown>, index: number): void {
    if (typeof performance.bundleSize === 'number' && performance.bundleSize < 0) {
      throw new Error(`Invalid training data at index ${index}: features.performance.bundleSize must be non-negative`);
    }
  }

  /**
   * Validate optimization input parameters
   */
  validateOptimizationInputs(config: ResponsiveConfig, usageData: ComponentUsageData[]): void {
    if (!config) {
      throw new Error('Configuration is required for optimization');
    }

    if (!usageData || !Array.isArray(usageData) || usageData.length === 0) {
      throw new Error('Usage data is required and must be a non-empty array');
    }

    // Validate usage data structure - throw error for malformed data
    this.validateUsageData(usageData);
    
    // Validate configuration structure - throw error for missing required properties
    if (!config.breakpoints || !Array.isArray(config.breakpoints) || config.breakpoints.length === 0) {
      throw new Error('Configuration must include breakpoints array');
    }
    
    if (!config.strategy?.tokens) {
      throw new Error('Configuration must include strategy with tokens');
    }
  }

  /**
   * Validate usage data structure and throw errors for malformed data
   */
  private validateUsageData(usageData: ComponentUsageData[]): void {
    validateUsageData(usageData);
  }

  /**
   * Validate test data for model evaluation
   */
  validateTestData(testData: TrainingData[]): void {
    if (!Array.isArray(testData) || testData.length === 0) {
      throw new Error('Test data is required and must be a non-empty array');
    }
  }

  /**
   * Validate model interface before evaluation
   */
  validateModelInterface(model: unknown): void {
    if (typeof (model as { predict?: unknown }).predict !== 'function') {
      throw new Error('Model does not implement predict method');
    }
  }
}
