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

      if (!this.validateAllSamples(trainingData)) {
        return false;
      }

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
  private validateAllSamples(trainingData: TrainingData[]): boolean {
    for (let i = 0; i < trainingData.length; i++) {
      if (!this.validateSample(trainingData[i], i)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validate a single training sample
   */
  private validateSample(sample: TrainingData, index: number): boolean {
    if (!sample) {
      logger.warn(`Training data validation failed: null/undefined sample at index ${index}`);
      return false;
    }

    if (!sample.features || !sample.labels) {
      logger.warn(`Training data validation failed: missing features or labels at index ${index}`);
      return false;
    }

    if (!this.validateFeatureStructure(sample.features, index)) {
      return false;
    }

    if (!this.validateLabelStructure(sample.labels, index)) {
      return false;
    }

    return true;
  }

  /**
   * Validate feature structure
   */
  private validateFeatureStructure(features: Record<string, unknown>, index: number): boolean {
    if (!features.config || !features.usage || 
        !features.performance || !features.context) {
      logger.warn(`Training data validation failed: incomplete feature structure at index ${index}`);
      return false;
    }
    return true;
  }

  /**
   * Validate label structure
   */
  private validateLabelStructure(labels: Record<string, unknown>, index: number): boolean {
    if (!labels.optimalTokens || !labels.performanceScores ||
        !labels.satisfactionRatings || !labels.accessibilityScores) {
      logger.warn(`Training data validation failed: incomplete label structure at index ${index}`);
      return false;
    }
    return true;
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
