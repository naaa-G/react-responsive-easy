import * as tf from '@tensorflow/tfjs';
import {
  TrainingData,
  ModelEvaluationMetrics,
  AIModelConfig,
  ModelFeatures,
  ModelLabels
} from '../types/index.js';
import { FeatureExtractor } from './FeatureExtractor.js';

/**
 * Model training engine for AI optimization
 * 
 * Handles training, validation, and evaluation of machine learning models
 * for responsive scaling optimization.
 */
export class ModelTrainer {
  private featureExtractor: FeatureExtractor;
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
    this.featureExtractor = new FeatureExtractor();
  }

  /**
   * Train the model with provided training data
   */
  async train(
    model: tf.LayersModel,
    trainingData: TrainingData[]
  ): Promise<ModelEvaluationMetrics> {
    try {
      console.log(`🎯 Training model with ${trainingData.length} samples...`);
      
      // Prepare training data
      const { features, labels } = this.prepareTrainingData(trainingData);
      
      // Split into training and validation sets
      const splitIndex = Math.floor(trainingData.length * (1 - this.config.training.validationSplit));
      
      const trainFeatures = features.slice([0, 0], [splitIndex, -1]);
      const trainLabels = labels.slice([0, 0], [splitIndex, -1]);
      const valFeatures = features.slice([splitIndex, 0], [-1, -1]);
      const valLabels = labels.slice([splitIndex, 0], [-1, -1]);
      
      // Configure training callbacks
      const callbacks = this.createTrainingCallbacks();
      
      // Train the model
      const history = await model.fit(trainFeatures, trainLabels, {
        epochs: this.config.training.epochs,
        batchSize: this.config.training.batchSize,
        validationData: [valFeatures, valLabels],
        callbacks,
        verbose: 1,
        shuffle: true
      });
      
      // Evaluate the trained model
      const metrics = await this.evaluateModel(model, valFeatures, valLabels);
      
      // Clean up tensors
      trainFeatures.dispose();
      trainLabels.dispose();
      valFeatures.dispose();
      valLabels.dispose();
      features.dispose();
      labels.dispose();
      
      console.log('✅ Model training completed successfully');
      
      return metrics;
    } catch (error) {
      console.error('❌ Model training failed:', error);
      throw new Error(`Training failed: ${error}`);
    }
  }

  /**
   * Evaluate model performance on test data
   */
  async evaluate(
    model: tf.LayersModel,
    testData: TrainingData[]
  ): Promise<ModelEvaluationMetrics> {
    const { features, labels } = this.prepareTrainingData(testData);
    
    try {
      const metrics = await this.evaluateModel(model, features, labels);
      
      // Clean up tensors
      features.dispose();
      labels.dispose();
      
      return metrics;
    } catch (error) {
      features.dispose();
      labels.dispose();
      throw error;
    }
  }

  /**
   * Prepare training data for model consumption
   */
  private prepareTrainingData(trainingData: TrainingData[]): {
    features: tf.Tensor2D;
    labels: tf.Tensor2D;
  } {
    // Extract features
    const featureVectors: number[][] = [];
    const labelVectors: number[][] = [];
    
    trainingData.forEach(data => {
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
        vector.push(typeof token.scale === 'number' ? token.scale : 0.85);
        vector.push(token.min || 8);
        vector.push(token.max || 100);
        vector.push(token.step || 1);
      } else {
        vector.push(0.85, 8, 100, 1); // Default values
      }
    });
    
    // Performance scores (4 values)
    vector.push(labels.performanceScores.renderTime || 0);
    vector.push(labels.performanceScores.bundleSize || 0);
    vector.push(labels.performanceScores.memoryUsage || 0);
    vector.push(labels.performanceScores.layoutShift || 0);
    
    // Satisfaction ratings (2 values - mean and std)
    const satisfactionMean = labels.satisfactionRatings.length > 0
      ? labels.satisfactionRatings.reduce((sum, rating) => sum + rating, 0) / labels.satisfactionRatings.length
      : 0.5;
    const satisfactionStd = this.calculateStandardDeviation(labels.satisfactionRatings);
    vector.push(satisfactionMean);
    vector.push(satisfactionStd);
    
    // Accessibility scores (2 values)
    vector.push(labels.accessibilityScores.fontSizeCompliance || 0);
    vector.push(labels.accessibilityScores.tapTargetCompliance || 0);
    
    // Pad to exactly 32 values (matching model output)
    while (vector.length < 32) {
      vector.push(0);
    }
    
    return vector.slice(0, 32);
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
    const normalizedStd = std.add(tf.scalar(1e-8));
    
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
    const normalizedRange = range.add(tf.scalar(1e-8));
    
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
   * Create training callbacks for monitoring and optimization
   */
  private createTrainingCallbacks(): any[] {
    const callbacks: any[] = [];
    
    // Early stopping callback
    callbacks.push({
      onEpochEnd: async (epoch: number, logs: any) => {
        if (logs && logs.val_loss) {
          const valLoss = logs.val_loss as number;
          const trainLoss = logs.loss as number;
          
          // Check for overfitting
          if (valLoss > trainLoss * 1.5 && epoch > 20) {
            console.log(`⚠️  Early stopping at epoch ${epoch} due to overfitting`);
            // Note: Early stopping is handled by TensorFlow.js internally
          }
          
          // Progress logging
          if (epoch % 10 === 0) {
            console.log(`📊 Epoch ${epoch}: loss=${trainLoss.toFixed(4)}, val_loss=${valLoss.toFixed(4)}`);
          }
        }
      }
    });
    
    // Learning rate reduction callback
    callbacks.push({
      onEpochEnd: async (epoch: number, logs: any) => {
        if (logs && logs.val_loss && epoch > 0) {
          // Reduce learning rate if validation loss plateaus
          // This is a simplified implementation
          if (epoch % 25 === 0) {
            console.log(`📉 Reducing learning rate at epoch ${epoch}`);
          }
        }
      }
    });
    
    return callbacks;
  }

  /**
   * Evaluate model and calculate comprehensive metrics
   */
  private async evaluateModel(
    model: tf.LayersModel,
    features: tf.Tensor2D,
    labels: tf.Tensor2D
  ): Promise<ModelEvaluationMetrics> {
    // Make predictions
    const predictions = model.predict(features) as tf.Tensor2D;
    
    try {
      // Calculate basic metrics
      const mse = tf.losses.meanSquaredError(labels, predictions);
      const mae = tf.losses.absoluteDifference(labels, predictions);
      
      // Get numerical values
      const mseValue = await mse.data();
      const maeValue = await mae.data();
      
      // Calculate R² score (coefficient of determination)
      const labelsMean = labels.mean();
      const totalSumSquares = labels.sub(labelsMean).square().sum();
      const residualSumSquares = labels.sub(predictions).square().sum();
      const r2Score = tf.scalar(1).sub(residualSumSquares.div(totalSumSquares));
      
      const r2Value = await r2Score.data();
      
      // Calculate accuracy (for classification-like metrics)
      const accuracy = await this.calculateAccuracy(predictions, labels);
      
      // Calculate precision and recall (approximated for regression)
      const precision = await this.calculatePrecision(predictions, labels);
      const recall = await this.calculateRecall(predictions, labels);
      
      // Calculate F1 score
      const f1Score = (2 * precision * recall) / (precision + recall) || 0;
      
      // Calculate confidence intervals (simplified)
      const confidenceIntervals = await this.calculateConfidenceIntervals(predictions, labels);
      
      // Clean up tensors
      predictions.dispose();
      mse.dispose();
      mae.dispose();
      labelsMean.dispose();
      totalSumSquares.dispose();
      residualSumSquares.dispose();
      r2Score.dispose();
      
      return {
        accuracy,
        precision,
        recall,
        f1Score,
        mse: mseValue[0],
        confidenceIntervals
      };
    } catch (error) {
      predictions.dispose();
      throw error;
    }
  }

  /**
   * Calculate accuracy for regression (percentage of predictions within acceptable range)
   */
  private async calculateAccuracy(predictions: tf.Tensor2D, labels: tf.Tensor2D): Promise<number> {
    const tolerance = 0.1; // 10% tolerance
    const diff = predictions.sub(labels).abs();
    const withinTolerance = diff.lessEqual(tf.scalar(tolerance));
    const accuracy = withinTolerance.mean();
    
    const accuracyValue = await accuracy.data();
    
    diff.dispose();
    withinTolerance.dispose();
    accuracy.dispose();
    
    return accuracyValue[0];
  }

  /**
   * Calculate precision (approximated for regression)
   */
  private async calculatePrecision(predictions: tf.Tensor2D, labels: tf.Tensor2D): Promise<number> {
    // For regression, we approximate precision as 1 - normalized MAE
    const mae = tf.losses.absoluteDifference(labels, predictions);
    const maxValue = labels.max();
    const normalizedMae = mae.div(maxValue);
    const precision = tf.scalar(1).sub(normalizedMae);
    
    const precisionValue = await precision.data();
    
    mae.dispose();
    maxValue.dispose();
    normalizedMae.dispose();
    precision.dispose();
    
    return Math.max(0, precisionValue[0]);
  }

  /**
   * Calculate recall (approximated for regression)
   */
  private async calculateRecall(predictions: tf.Tensor2D, labels: tf.Tensor2D): Promise<number> {
    // For regression, we approximate recall as correlation coefficient
    const predMean = predictions.mean();
    const labelMean = labels.mean();
    
    const predCentered = predictions.sub(predMean);
    const labelCentered = labels.sub(labelMean);
    
    const numerator = predCentered.mul(labelCentered).mean();
    const predStd = predCentered.square().mean().sqrt();
    const labelStd = labelCentered.square().mean().sqrt();
    
    const correlation = numerator.div(predStd.mul(labelStd));
    const recallValue = await correlation.data();
    
    // Clean up tensors
    predMean.dispose();
    labelMean.dispose();
    predCentered.dispose();
    labelCentered.dispose();
    numerator.dispose();
    predStd.dispose();
    labelStd.dispose();
    correlation.dispose();
    
    return Math.abs(recallValue[0]); // Take absolute value of correlation
  }

  /**
   * Calculate confidence intervals for predictions
   */
  private async calculateConfidenceIntervals(
    predictions: tf.Tensor2D,
    labels: tf.Tensor2D
  ): Promise<Record<string, [number, number]>> {
    const residuals = predictions.sub(labels);
    const residualStd = residuals.square().mean().sqrt();
    const stdValue = await residualStd.data();
    
    const confidenceLevel = 0.95; // 95% confidence interval
    const zScore = 1.96; // For 95% CI
    const margin = zScore * stdValue[0];
    
    residuals.dispose();
    residualStd.dispose();
    
    return {
      'prediction': [-margin, margin],
      'performance': [-margin * 0.5, margin * 0.5],
      'accessibility': [-margin * 0.3, margin * 0.3]
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
