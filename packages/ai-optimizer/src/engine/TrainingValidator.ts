import * as tf from '@tensorflow/tfjs';
import { TrainingData, AIModelConfig } from '../types/index.js';
import { logger } from '../utils/Logger.js';

// Training constants
const TRAINING_CONSTANTS = {
  CACHE_SIZE_LARGE: 10000,
  CACHE_SIZE_SMALL: 1024,
  CACHE_SIZE_MEDIUM: 500
} as const;

/**
 * Handles validation logic for model training
 */
export class TrainingValidator {
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  /**
   * Validate model before training
   */
  validateModelForTraining(model: tf.LayersModel): void {
    if (!model) {
      throw new Error('Model is null or undefined');
    }
    
    if (typeof model.fit !== 'function') {
      throw new Error('Model does not implement fit method');
    }
  }

  /**
   * Validate and process training data
   */
  validateAndProcessTrainingData(trainingData: TrainingData[]): TrainingData[] {
    if (!Array.isArray(trainingData) || trainingData.length === 0) {
      logger.warn('Empty training data provided, returning default metrics');
      throw new Error('Empty training data provided');
    }

    // Validate each training data item for content quality
    this.validateAllSamples(trainingData);

    let processedTrainingData = trainingData;
    if (processedTrainingData.length < 2) {
      logger.warn('Insufficient data points for training, using single data point for both training and validation');
      const singleData = processedTrainingData[0];
      processedTrainingData = [singleData, singleData];
    }

    return processedTrainingData;
  }

  /**
   * Validate model architecture before training
   * Ensures the model is properly configured
   */
  public validateModel(model: tf.LayersModel | unknown): boolean {
    try {
      if (!this.isModelValid(model)) {
        return false;
      }

      if (!this.hasValidLayers(model)) {
        return false;
      }

      if (!this.isModelCompiled(model)) {
        return false;
      }

      if (!this.hasRequiredMethods(model)) {
        return false;
      }

      if (!this.hasValidShapes(model)) {
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Model validation failed', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  /**
   * Check if model is valid (not null/undefined)
   */
  private isModelValid(model: tf.LayersModel | unknown): boolean {
    if (!model) {
      logger.warn('Model validation failed: model is null or undefined');
      return false;
    }
    return true;
  }

  /**
   * Check if model has layers
   */
  private hasValidLayers(model: tf.LayersModel | unknown): boolean {
    const modelWithLayers = model as { layers?: unknown[] };
    if (!modelWithLayers.layers || modelWithLayers.layers.length === 0) {
      logger.warn('Model validation failed: no layers found');
      return false;
    }
    return true;
  }

  /**
   * Check if model is compiled
   */
  private isModelCompiled(model: tf.LayersModel | unknown): boolean {
    const modelWithOptimizer = model as { optimizer?: unknown };
    if (!modelWithOptimizer.optimizer) {
      logger.warn('Model validation failed: model not compiled (no optimizer)');
      return false;
    }
    return true;
  }

  /**
   * Check if model has required methods
   */
  private hasRequiredMethods(model: tf.LayersModel | unknown): boolean {
    const requiredMethods = ['fit', 'evaluate', 'predict', 'save'];
    const modelWithMethods = model as Record<string, unknown>;
    for (const method of requiredMethods) {
      if (typeof modelWithMethods[method] !== 'function') {
        logger.warn(`Model validation failed: missing required method '${method}'`);
        return false;
      }
    }
    return true;
  }

  /**
   * Check if model has valid input/output shapes
   */
  private hasValidShapes(model: tf.LayersModel | unknown): boolean {
    const modelWithShapes = model as { 
      inputs?: Array<{ shape?: unknown }>; 
      outputs?: Array<{ shape?: unknown }> 
    };
    const inputShape = modelWithShapes.inputs?.[0]?.shape;
    const outputShape = modelWithShapes.outputs?.[0]?.shape;
    
    if (inputShape && outputShape) {
      if (!inputShape || !outputShape) {
        logger.warn('Model validation failed: invalid input/output shapes');
        return false;
      }
    }
    return true;
  }

  /**
   * Validate training data quality and structure
   * Ensures data is suitable for training
   */
  public validateTrainingData(trainingData: TrainingData[]): boolean {
    try {
      if (!this.isValidDataArray(trainingData)) {
        return false;
      }

      if (!this.hasMinimumData(trainingData)) {
        return false;
      }

      this.validateAllSamples(trainingData);
      return true;
    } catch (error) {
      logger.error('Training data validation failed', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  /**
   * Check if data is a valid array
   */
  private isValidDataArray(trainingData: TrainingData[]): boolean {
    if (!Array.isArray(trainingData)) {
      logger.warn('Training data validation failed: data is not an array');
      return false;
    }

    if (trainingData.length === 0) {
      logger.warn('Training data validation failed: empty dataset');
      return false;
    }

    return true;
  }

  /**
   * Check if data meets minimum requirements
   */
  private hasMinimumData(trainingData: TrainingData[]): boolean {
    if (trainingData.length < 2) {
      logger.warn('Training data validation failed: insufficient data points (minimum 2 required)');
      return false;
    }
    return true;
  }

  /**
   * Validate all training samples
   */
  private validateAllSamples(trainingData: TrainingData[]): void {
    for (let i = 0; i < trainingData.length; i++) {
      this.validateSample(trainingData[i], i);
    }
  }

  /**
   * Validate a single training sample
   */
  private validateSample(sample: TrainingData, index: number): void {
    if (!sample) {
      throw new Error(`Invalid training data at index ${index}: sample is null or undefined`);
    }

    if (!sample.features || !sample.labels) {
      throw new Error(`Invalid training data at index ${index}: missing features or labels`);
    }

    this.validateFeatureStructure(sample.features, index);
    this.validateLabelStructure(sample.labels, index);
    this.validateFeatureContent(sample.features, index);
  }

  /**
   * Validate feature structure
   */
  private validateFeatureStructure(features: Record<string, unknown>, index: number): void {
    if (!features.config || !features.usage || 
        !features.performance || !features.context) {
      throw new Error(`Invalid training data at index ${index}: incomplete feature structure - missing required sections`);
    }
  }

  /**
   * Validate label structure
   */
  private validateLabelStructure(labels: Record<string, unknown>, index: number): void {
    if (!labels.optimalTokens || !labels.performanceScores ||
        !labels.satisfactionRatings || !labels.accessibilityScores) {
      throw new Error(`Invalid training data at index ${index}: incomplete label structure - missing required sections`);
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
   * Validate training configuration parameters
   * Ensures configuration is valid before training
   */
  public validateTrainingConfig(trainingConfig: {
    epochs: number;
    batchSize: number;
    learningRate: number;
    validationSplit: number;
  }): boolean {
    // Validate epochs
    if (trainingConfig.epochs < 1 || trainingConfig.epochs > TRAINING_CONSTANTS.CACHE_SIZE_LARGE) {
      return false;
    }

    // Validate batch size
    if (trainingConfig.batchSize < 1 || trainingConfig.batchSize > TRAINING_CONSTANTS.CACHE_SIZE_SMALL) {
      return false;
    }

    // Validate learning rate
    if (trainingConfig.learningRate <= 0 || trainingConfig.learningRate > 1) {
      return false;
    }

    // Validate validation split
    if (trainingConfig.validationSplit < 0 || trainingConfig.validationSplit >= 1) {
      return false;
    }

    return true;
  }
}
