import * as tf from '@tensorflow/tfjs';
import { TrainingData, ModelLabels, AIModelConfig } from '../types/index.js';
import { FeatureExtractor } from './FeatureExtractor.js';
import { AI_OPTIMIZER_CONSTANTS } from '../constants.js';

/**
 * Handles data preprocessing for model training
 */
export class DataPreprocessor {
  private featureExtractor: FeatureExtractor;
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
    this.featureExtractor = new FeatureExtractor();
  }

  /**
   * Prepare training data for model consumption
   */
  prepareTrainingData(trainingData: TrainingData[]): {
    features: tf.Tensor2D;
    labels: tf.Tensor2D;
  } {
    // Extract features
    const featureVectors: number[][] = [];
    const labelVectors: number[][] = [];
    
    trainingData.forEach((data, index) => {
      // Validate features - throw error for malformed data (null features or null properties)
      if (!data.features || data.features === null) {
        throw new Error(`Invalid training data at index ${index}: features cannot be null`);
      }
      
      // Check for null properties within features (malformed data)
      if (data.features.config === null || data.features.usage === null || 
          data.features.performance === null || data.features.context === null) {
        throw new Error(`Invalid training data at index ${index}: features contain null properties`);
      }
      
      // Convert features to numerical vector
      const featureVector = this.featureExtractor.featuresToVector(data.features);
      featureVectors.push(featureVector);
      
      // Convert labels to numerical vector
      const labelVector = this.labelsToVector(data.labels);
      labelVectors.push(labelVector);
    });
    
    // Create tensors
    const features = tf.tensor2d(featureVectors);
    const labels = tf.tensor2d(labelVectors);
    
    // Apply normalization if configured
    const normalizedFeatures = this.normalizeFeatures(features);
    const normalizedLabels = this.normalizeLabels(labels);
    
    // Clean up intermediate tensors
    features.dispose();
    labels.dispose();
    
    return {
      features: normalizedFeatures,
      labels: normalizedLabels
    };
  }

  /**
   * Convert model labels to numerical vector
   */
  private labelsToVector(labels: ModelLabels): number[] {
    const vector: number[] = [];
    
    // Token optimization targets (24 values - 6 tokens × 4 parameters each)
    const tokenNames = ['fontSize', 'spacing', 'radius', 'lineHeight', 'shadow', 'border'];
    tokenNames.forEach(tokenName => {
      const token = labels.optimalTokens[tokenName];
      if (token) {
        vector.push(typeof token.scale === 'number' ? token.scale : AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD);
        vector.push(token.min ?? AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP);
        vector.push(token.max ?? 100);
        vector.push(token.step ?? 1);
      } else {
        vector.push(AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD, AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP, 100, 1); // Default values
      }
    });
    
    // Performance scores (4 values)
    vector.push(labels.performanceScores.renderTime ?? 0);
    vector.push(labels.performanceScores.bundleSize ?? 0);
    vector.push(labels.performanceScores.memoryUsage ?? 0);
    vector.push(labels.performanceScores.layoutShift ?? 0);
    
    // Satisfaction ratings (2 values - mean and std)
    const satisfactionMean = labels.satisfactionRatings.length > 0
      ? labels.satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / labels.satisfactionRatings.length
      : AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_ALPHA;
    const satisfactionStd = this.calculateStandardDeviation(labels.satisfactionRatings);
    vector.push(satisfactionMean);
    vector.push(satisfactionStd);
    
    // Accessibility scores (2 values)
    vector.push(labels.accessibilityScores.fontSizeCompliance ?? 0);
    vector.push(labels.accessibilityScores.tapTargetCompliance ?? 0);
    
    // Pad to exactly 32 values (matching model output)
    while (vector.length < AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_BLOCK_SIZE) {
      vector.push(0);
    }
    
    return vector.slice(0, AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_BLOCK_SIZE);
  }

  /**
   * Normalize feature tensors
   */
  private normalizeFeatures(features: tf.Tensor2D): tf.Tensor2D {
    switch (this.config.features.normalization) {
      case 'standard':
        return this.standardNormalize(features);
      case 'minmax':
        return this.minMaxNormalize(features);
      case 'robust':
        return this.robustNormalize(features);
      default:
        return features;
    }
  }

  /**
   * Normalize label tensors
   */
  private normalizeLabels(labels: tf.Tensor2D): tf.Tensor2D {
    // Apply min-max normalization to labels to ensure they're in [0, 1] range
    return this.minMaxNormalize(labels);
  }

  /**
   * Standard normalization (z-score)
   */
  private standardNormalize(tensor: tf.Tensor2D): tf.Tensor2D {
    const mean = tensor.mean(0, true);
    const std = tensor.sub(mean).square().mean(0, true).sqrt();
    
    // Avoid division by zero
    const normalizedStd = std.add(tf.scalar(AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.WEIGHT_DECAY));
    
    const normalized = tensor.sub(mean).div(normalizedStd);
    
    // Clean up intermediate tensors
    mean.dispose();
    std.dispose();
    normalizedStd.dispose();
    
    return normalized as tf.Tensor2D;
  }

  /**
   * Min-max normalization
   */
  private minMaxNormalize(tensor: tf.Tensor2D): tf.Tensor2D {
    const min = tensor.min(0, true);
    const max = tensor.max(0, true);
    const range = max.sub(min);
    
    // Avoid division by zero
    const normalizedRange = range.add(tf.scalar(AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.WEIGHT_DECAY));
    
    const normalized = tensor.sub(min).div(normalizedRange);
    
    // Clean up intermediate tensors
    min.dispose();
    max.dispose();
    range.dispose();
    normalizedRange.dispose();
    
    return normalized as tf.Tensor2D;
  }

  /**
   * Robust normalization (using median and IQR)
   */
  private robustNormalize(tensor: tf.Tensor2D): tf.Tensor2D {
    // For simplicity, fall back to standard normalization
    // In a production implementation, you'd calculate median and IQR
    return this.standardNormalize(tensor);
  }

  /**
   * Scale features to a specific range
   * Useful for custom feature scaling requirements
   */
  public scaleFeatures(features: Record<string, unknown> | number[]): number[] {
    // Handle different input types
    if (!features || typeof features !== 'object') {
      return [];
    }

    // If it's a feature object, extract numerical values
    let values: number[] = [];
    if (Array.isArray(features)) {
      values = features;
    } else if (features.config && typeof features.config === 'object') {
      // Extract values from feature object
      const config = features.config as {
        breakpointCount?: number;
        breakpointRatios?: number[];
        tokenComplexity?: number;
      };
      values = [
        config.breakpointCount ?? 0,
        ...(config.breakpointRatios ?? []),
        config.tokenComplexity ?? 0
      ];
    } else {
      return [];
    }

    if (values.length === 0) {
      return [];
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    const DEFAULT_CONSTANT_VALUE = 0.5;
    if (range === 0) return values.map(() => DEFAULT_CONSTANT_VALUE); // Default to 0.5 for constant values
    
    return values.map(value => (value - min) / range);
  }

  /**
   * Preprocess training data for model consumption
   * This is a public method for external data preprocessing
   */
  public preprocessTrainingData(trainingData: TrainingData[]): {
    features: tf.Tensor2D;
    labels: tf.Tensor2D;
    metadata: {
      featureCount: number;
      sampleCount: number;
      normalizationApplied: string;
    };
  } {
    const { features, labels } = this.prepareTrainingData(trainingData);
    
    return {
      features,
      labels,
      metadata: {
        featureCount: features.shape[1],
        sampleCount: features.shape[0],
        normalizationApplied: this.config.features.normalization
      }
    };
  }

  /**
   * Calculate standard deviation of an array
   */
  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }
}
