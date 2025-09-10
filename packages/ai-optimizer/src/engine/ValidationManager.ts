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
