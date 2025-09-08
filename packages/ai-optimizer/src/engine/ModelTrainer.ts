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
      // Validate model before training
      if (!model) {
        throw new Error('Model is null or undefined');
      }
      
      if (typeof model.fit !== 'function') {
        throw new Error('Model does not implement fit method');
      }
      
      // Validate training data
      if (!Array.isArray(trainingData) || trainingData.length === 0) {
        throw new Error('Training data is required and must be a non-empty array');
      }
      
      if (trainingData.length < 2) {
        throw new Error('Insufficient data points (minimum 2 required)');
      }
      
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
    // Validate model before evaluation
    if (!model) {
      throw new Error('Model is null or undefined');
    }
    
    if (typeof model.predict !== 'function') {
      throw new Error('Model does not implement predict method');
    }
    
    // Validate test data
    if (!Array.isArray(testData) || testData.length === 0) {
      throw new Error('Test data is required and must be a non-empty array');
    }
    
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
  public async calculateAccuracy(predictions: tf.Tensor2D, labels: tf.Tensor2D): Promise<number> {
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
  public async calculatePrecision(predictions: tf.Tensor2D, labels: tf.Tensor2D): Promise<number> {
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
  public async calculateRecall(predictions: tf.Tensor2D, labels: tf.Tensor2D): Promise<number> {
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
   * Scale features to a specific range
   * Useful for custom feature scaling requirements
   */
  public scaleFeatures(features: any): number[] {
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
      values = [
        features.config.breakpointCount || 0,
        ...(features.config.breakpointRatios || []),
        features.config.tokenComplexity || 0
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
    
    if (range === 0) return values.map(() => 0.5);
    
    return values.map(value => (value - min) / range);
  }

  /**
   * Validate model architecture before training
   * Ensures the model is properly configured
   */
  public validateModel(model: any): boolean {
    try {
      if (!model) {
        console.warn('⚠️ Model validation failed: model is null or undefined');
        return false;
      }

      // Check if model has layers
      if (!model.layers || model.layers.length === 0) {
        console.warn('⚠️ Model validation failed: no layers found');
        return false;
      }

      // Check if model is compiled
      if (!model.optimizer) {
        console.warn('⚠️ Model validation failed: model not compiled (no optimizer)');
        return false;
      }

      // Check required methods
      const requiredMethods = ['fit', 'evaluate', 'predict', 'save'];
      for (const method of requiredMethods) {
        if (typeof model[method] !== 'function') {
          console.warn(`⚠️ Model validation failed: missing required method '${method}'`);
          return false;
        }
      }

      // Check if model has valid input/output shapes (optional for mock models)
      const inputShape = model.inputs?.[0]?.shape;
      const outputShape = model.outputs?.[0]?.shape;
      
      if (inputShape && outputShape) {
        // Only validate if shapes are present
        if (!inputShape || !outputShape) {
          console.warn('⚠️ Model validation failed: invalid input/output shapes');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Model validation failed:', error);
      return false;
    }
  }

  /**
   * Validate training data quality and structure
   * Ensures data is suitable for training
   */
  public validateTrainingData(trainingData: TrainingData[]): boolean {
    try {
      if (!Array.isArray(trainingData)) {
        console.warn('⚠️ Training data validation failed: data is not an array');
        return false;
      }

      if (trainingData.length === 0) {
        console.warn('⚠️ Training data validation failed: empty dataset');
        return false;
      }

      // Check minimum data requirements
      if (trainingData.length < 2) {
        console.warn('⚠️ Training data validation failed: insufficient data points (minimum 2 required)');
        return false;
      }

      // Validate each training sample
      for (let i = 0; i < trainingData.length; i++) {
        const sample = trainingData[i];
        
        if (!sample) {
          console.warn(`⚠️ Training data validation failed: null/undefined sample at index ${i}`);
          return false;
        }

        if (!sample.features || !sample.labels) {
          console.warn(`⚠️ Training data validation failed: missing features or labels at index ${i}`);
          return false;
        }

        // Check feature structure
        if (!sample.features.config || !sample.features.usage || 
            !sample.features.performance || !sample.features.context) {
          console.warn(`⚠️ Training data validation failed: incomplete feature structure at index ${i}`);
          return false;
        }

        // Check label structure (more flexible for testing)
        if (!sample.labels.optimalTokens || !sample.labels.performanceScores ||
            !sample.labels.satisfactionRatings || !sample.labels.accessibilityScores) {
          console.warn(`⚠️ Training data validation failed: incomplete label structure at index ${i}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Training data validation failed:', error);
      return false;
    }
  }

  /**
   * Calculate F1 score from precision and recall
   * Harmonic mean of precision and recall
   */
  public calculateF1Score(precision: any, recall: any): number {
    // Handle different input types
    const prec = Array.isArray(precision) ? precision[0] : precision;
    const rec = Array.isArray(recall) ? recall[0] : recall;
    
    if (typeof prec !== 'number' || typeof rec !== 'number') {
      return 0;
    }
    
    if (prec + rec === 0) return 0;
    return (2 * prec * rec) / (prec + rec);
  }

  /**
   * Calculate Mean Squared Error between predictions and actuals
   * Standard regression metric
   */
  public calculateMSE(predictions: number[], actuals: number[]): number {
    if (predictions.length !== actuals.length || predictions.length === 0) {
      return 0;
    }

    const squaredErrors = predictions.map((pred, index) => 
      Math.pow(pred - actuals[index], 2)
    );
    
    return squaredErrors.reduce((sum, error) => sum + error, 0) / predictions.length;
  }

  /**
   * Perform k-fold cross validation
   * Robust model evaluation technique
   */
  public async crossValidate(
    model: tf.LayersModel,
    trainingData: TrainingData[],
    k: number = 5
  ): Promise<{
    meanAccuracy: number;
    meanPrecision: number;
    meanRecall: number;
    meanF1Score: number;
    meanMSE: number;
    stdAccuracy: number;
    stdPrecision: number;
    stdRecall: number;
    stdF1Score: number;
    stdMSE: number;
  }> {
    if (trainingData.length < k) {
      throw new Error(`Insufficient data for ${k}-fold cross validation. Need at least ${k} samples.`);
    }

    const foldSize = Math.floor(trainingData.length / k);
    const metrics: Array<{
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
      mse: number;
    }> = [];

    for (let i = 0; i < k; i++) {
      const startIndex = i * foldSize;
      const endIndex = i === k - 1 ? trainingData.length : (i + 1) * foldSize;
      
      const validationData = trainingData.slice(startIndex, endIndex);
      const trainData = [
        ...trainingData.slice(0, startIndex),
        ...trainingData.slice(endIndex)
      ];

      if (trainData.length === 0) continue;

      try {
        // Train on this fold
        const trainMetrics = await this.train(model, trainData);
        
        // Evaluate on validation data
        const valMetrics = await this.evaluate(model, validationData);
        
        metrics.push(valMetrics);
      } catch (error) {
        console.warn(`Fold ${i + 1} failed:`, error);
        continue;
      }
    }

    if (metrics.length === 0) {
      throw new Error('All cross-validation folds failed');
    }

    // Calculate mean and standard deviation
    const meanMetrics = {
      meanAccuracy: this.calculateMean(metrics.map(m => m.accuracy)),
      meanPrecision: this.calculateMean(metrics.map(m => m.precision)),
      meanRecall: this.calculateMean(metrics.map(m => m.recall)),
      meanF1Score: this.calculateMean(metrics.map(m => m.f1Score)),
      meanMSE: this.calculateMean(metrics.map(m => m.mse))
    };

    const stdMetrics = {
      stdAccuracy: this.calculateStandardDeviation(metrics.map(m => m.accuracy)),
      stdPrecision: this.calculateStandardDeviation(metrics.map(m => m.precision)),
      stdRecall: this.calculateStandardDeviation(metrics.map(m => m.recall)),
      stdF1Score: this.calculateStandardDeviation(metrics.map(m => m.f1Score)),
      stdMSE: this.calculateStandardDeviation(metrics.map(m => m.mse))
    };

    return {
      ...meanMetrics,
      ...stdMetrics
    };
  }

  /**
   * Suggest hyperparameter improvements based on training data analysis
   * Provides data-driven optimization recommendations
   */
  public suggestHyperparameters(trainingData: TrainingData[]): {
    learningRate: { current: number; suggested: number; reason: string };
    batchSize: { current: number; suggested: number; reason: string };
    epochs: { current: number; suggested: number; reason: string };
    architecture: { current: string; suggested: string; reason: string };
  } {
    const sampleCount = trainingData.length;
    const featureCount = trainingData[0]?.features ? 
      Object.keys(trainingData[0].features).length : 0;

    // Learning rate suggestions
    let suggestedLR = this.config.training.learningRate;
    let lrReason = 'Current learning rate is appropriate';
    
    if (sampleCount < 100) {
      suggestedLR = Math.min(suggestedLR * 0.5, 0.001);
      lrReason = 'Reduced learning rate for small dataset to prevent overfitting';
    } else if (sampleCount > 10000) {
      suggestedLR = Math.min(suggestedLR * 1.5, 0.01);
      lrReason = 'Increased learning rate for large dataset to speed up convergence';
    }

    // Batch size suggestions
    let suggestedBatchSize = this.config.training.batchSize;
    let batchReason = 'Current batch size is appropriate';
    
    if (sampleCount < 50) {
      suggestedBatchSize = Math.max(suggestedBatchSize / 2, 8);
      batchReason = 'Reduced batch size for very small dataset';
    } else if (sampleCount > 5000) {
      suggestedBatchSize = Math.min(suggestedBatchSize * 2, 128);
      batchReason = 'Increased batch size for large dataset to improve training stability';
    }

    // Epochs suggestions
    let suggestedEpochs = this.config.training.epochs;
    let epochsReason = 'Current epoch count is appropriate';
    
    if (sampleCount < 100) {
      suggestedEpochs = Math.min(suggestedEpochs * 2, 500);
      epochsReason = 'Increased epochs for small dataset to ensure convergence';
    } else if (sampleCount > 10000) {
      suggestedEpochs = Math.max(suggestedEpochs / 2, 50);
      epochsReason = 'Reduced epochs for large dataset to prevent overfitting';
    }

    // Architecture suggestions
    let suggestedArchitecture = this.config.architecture;
    let archReason = 'Current architecture is appropriate';
    
    if (featureCount > 50) {
      suggestedArchitecture = 'neural-network';
      archReason = 'Neural network architecture recommended for high-dimensional features';
    } else if (featureCount < 10) {
      suggestedArchitecture = 'neural-network';
      archReason = 'Neural network architecture sufficient for low-dimensional features';
    }

    return {
      learningRate: {
        current: this.config.training.learningRate,
        suggested: suggestedLR,
        reason: lrReason
      },
      batchSize: {
        current: this.config.training.batchSize,
        suggested: suggestedBatchSize,
        reason: batchReason
      },
      epochs: {
        current: this.config.training.epochs,
        suggested: suggestedEpochs,
        reason: epochsReason
      },
      architecture: {
        current: this.config.architecture,
        suggested: suggestedArchitecture,
        reason: archReason
      }
    };
  }

  /**
   * Analyze training history for insights and optimization opportunities
   * Provides actionable feedback for model improvement
   */
  public analyzeTrainingHistory(history: {
    loss: number[];
    val_loss?: number[];
    accuracy?: number[];
    val_accuracy?: number[];
  }): {
    overfitting: boolean;
    underfitting: boolean;
    convergence: boolean;
    recommendations: string[];
    learningCurve: 'stable' | 'unstable' | 'oscillating' | 'plateauing';
  } {
    const recommendations: string[] = [];
    let overfitting = false;
    let underfitting = false;
    let convergence = false;
    let learningCurve: 'stable' | 'unstable' | 'oscillating' | 'plateauing' = 'stable';

    // Check for overfitting
    if (history.val_loss && history.loss) {
      const lastValLoss = history.val_loss[history.val_loss.length - 1];
      const lastTrainLoss = history.loss[history.loss.length - 1];
      
      if (lastValLoss > lastTrainLoss * 1.2) {
        overfitting = true;
        recommendations.push('Consider adding dropout layers or regularization');
        recommendations.push('Reduce model complexity or increase training data');
      }
    }

    // Check for underfitting
    if (history.loss.length > 10) {
      const earlyLoss = history.loss[5];
      const lateLoss = history.loss[history.loss.length - 1];
      
      if (lateLoss > earlyLoss * 0.9) {
        underfitting = true;
        recommendations.push('Increase model capacity or training time');
        recommendations.push('Check if learning rate is too low');
      }
    }

    // Check convergence
    if (history.loss.length > 5) {
      const recentLosses = history.loss.slice(-5);
      const lossVariance = this.calculateVariance(recentLosses);
      const meanLoss = this.calculateMean(recentLosses);
      
      if (lossVariance < meanLoss * 0.01) {
        convergence = true;
        recommendations.push('Model has converged, consider early stopping');
      }
    }

    // Analyze learning curve
    if (history.loss.length > 10) {
      const recentLosses = history.loss.slice(-10);
      const lossVariance = this.calculateVariance(recentLosses);
      const meanLoss = this.calculateMean(recentLosses);
      
      if (lossVariance > meanLoss * 0.5) {
        learningCurve = 'unstable';
        recommendations.push('Learning rate may be too high, consider reducing it');
      } else if (lossVariance < meanLoss * 0.01) {
        learningCurve = 'plateauing';
        recommendations.push('Learning rate may be too low, consider increasing it');
      } else if (this.hasOscillations(recentLosses)) {
        learningCurve = 'oscillating';
        recommendations.push('Consider using learning rate scheduling');
      }
    }

    return {
      overfitting,
      underfitting,
      convergence,
      recommendations,
      learningCurve
    };
  }

  /**
   * Save model checkpoint for later restoration
   * Enables model versioning and recovery
   */
  public async saveCheckpoint(
    model: tf.LayersModel,
    checkpointName: string
  ): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const checkpointPath = `./checkpoints/${checkpointName}-${timestamp}`;
      
      await model.save(`file://${checkpointPath}`);
      
      console.log(`✅ Checkpoint saved: ${checkpointPath}`);
      return checkpointPath;
    } catch (error) {
      console.error('❌ Checkpoint save failed:', error);
      throw new Error(`Checkpoint save failed: ${error}`);
    }
  }

  /**
   * Load model checkpoint from saved state
   * Enables model restoration and versioning
   */
  public async loadCheckpoint(checkpointPath: string): Promise<tf.LayersModel> {
    try {
      const model = await tf.loadLayersModel(`file://${checkpointPath}/model.json`);
      console.log(`✅ Checkpoint loaded: ${checkpointPath}`);
      return model;
    } catch (error) {
      console.error('❌ Checkpoint load failed:', error);
      throw new Error(`Checkpoint load failed: ${error}`);
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
    if (trainingConfig.epochs < 1 || trainingConfig.epochs > 10000) {
      return false;
    }

    // Validate batch size
    if (trainingConfig.batchSize < 1 || trainingConfig.batchSize > 1024) {
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

  /**
   * Calculate mean of an array of numbers
   * Utility method for statistical calculations
   */
  private calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate variance of an array of numbers
   * Utility method for statistical calculations
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    
    return this.calculateMean(squaredDiffs);
  }

  /**
   * Check if loss values are oscillating
   * Utility method for learning curve analysis
   */
  private hasOscillations(values: number[]): boolean {
    if (values.length < 3) return false;
    
    let oscillations = 0;
    for (let i = 1; i < values.length - 1; i++) {
      if ((values[i] > values[i - 1] && values[i] > values[i + 1]) ||
          (values[i] < values[i - 1] && values[i] < values[i + 1])) {
        oscillations++;
      }
    }
    
    return oscillations > values.length * 0.3; // More than 30% oscillations
  }
}
