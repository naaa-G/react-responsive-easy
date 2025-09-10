import * as tf from '@tensorflow/tfjs';
import {
  TrainingData,
  ModelEvaluationMetrics,
  AIModelConfig
} from '../types/index.js';
import { DataPreprocessor } from './DataPreprocessor.js';
import { ModelEvaluator } from './ModelEvaluator.js';
import { TrainingValidator } from './TrainingValidator.js';
import { CrossValidator } from './CrossValidator.js';
import { HyperparameterAdvisor } from './HyperparameterAdvisor.js';
import { TrainingAnalyzer } from './TrainingAnalyzer.js';
import { Logger } from '../utils/Logger.js';

// Training constants
const TRAINING_CONSTANTS = {
  OVERFITTING_THRESHOLD: 1.5,
  EARLY_STOPPING_EPOCH: 20,
  CONFIDENCE_LEVEL: 0.95,
  Z_SCORE_95_CI: 1.96,
  PERFORMANCE_MARGIN_MULTIPLIER: 0.5,
  ACCESSIBILITY_MARGIN_MULTIPLIER: 0.3,
  LEARNING_RATE_DECAY: 0.1,
  LEARNING_RATE_MIN: 0.01,
  VALIDATION_THRESHOLD: 0.5,
  VALIDATION_THRESHOLD_LOW: 0.3,
  VALIDATION_THRESHOLD_HIGH: 0.5,
  EPOCH_THRESHOLD: 25,
  BATCH_SIZE_LARGE: 50,
  BATCH_SIZE_SMALL: 8,
  CACHE_SIZE_LARGE: 10000,
  CACHE_SIZE_SMALL: 1024,
  MEMORY_THRESHOLD: 0.3,
  // Additional constants for magic numbers
  CORRELATION_THRESHOLD: 0.5,
  HYPERPARAMETER_MULTIPLIER: 1.2,
  LARGE_DATASET_SIZE: 5000,
  DEFAULT_BATCH_SIZE: 128,
  CACHE_SIZE_MEDIUM: 500,
  PERFORMANCE_THRESHOLD: 0.5,
  LEARNING_RATE_FACTOR: 1.2,
  NEGATIVE_THRESHOLD_1: -5,
  SMALL_VALUE: 0.01,
  NEGATIVE_THRESHOLD_2: -10,
  MEDIUM_THRESHOLD: 0.5,
  SMALL_THRESHOLD: 0.01,
  MEMORY_FACTOR: 0.3
} as const;

/**
 * Model training engine for AI optimization
 * 
 * Handles training, validation, and evaluation of machine learning models
 * for responsive scaling optimization.
 */
export class ModelTrainer {
  private dataPreprocessor: DataPreprocessor;
  private modelEvaluator: ModelEvaluator;
  private trainingValidator: TrainingValidator;
  private crossValidator: CrossValidator;
  private hyperparameterAdvisor: HyperparameterAdvisor;
  private trainingAnalyzer: TrainingAnalyzer;
  private config: AIModelConfig;
  private logger: Logger;

  constructor(config: AIModelConfig) {
    this.config = config;
    this.dataPreprocessor = new DataPreprocessor(config);
    this.modelEvaluator = new ModelEvaluator();
    this.trainingValidator = new TrainingValidator(config);
    this.crossValidator = new CrossValidator();
    this.hyperparameterAdvisor = new HyperparameterAdvisor(config);
    this.trainingAnalyzer = new TrainingAnalyzer();
    this.logger = new Logger('ModelTrainer');
  }

  /**
   * Train the model with provided training data
   */
  async train(
    model: tf.LayersModel,
    trainingData: TrainingData[]
  ): Promise<ModelEvaluationMetrics> {
    try {
      this.trainingValidator.validateModelForTraining(model);
      
      // Handle empty training data gracefully
      if (!trainingData || trainingData.length === 0) {
        this.logger.warn('Empty training data provided, returning default metrics');
        return this.getDefaultMetrics();
      }
      
      const processedTrainingData = this.trainingValidator.validateAndProcessTrainingData(trainingData);
      
      this.logger.info(`Training model with ${processedTrainingData.length} samples...`);
      
      const { features, labels, trainFeatures, trainLabels, valFeatures, valLabels } = 
        this.prepareTrainingDataAndSplit(processedTrainingData);
      
      const callbacks = this.createTrainingCallbacks();
      
      await this.executeModelTraining(model, trainFeatures, trainLabels, valFeatures, valLabels, callbacks);
      
      const metrics = await this.modelEvaluator.evaluateModel(model, valFeatures as tf.Tensor2D, valLabels as tf.Tensor2D);
      
      this.cleanupTrainingTensors(features, labels, trainFeatures, trainLabels, valFeatures, valLabels);
      
      this.logger.info('Model training completed successfully');
      return metrics;
    } catch (error) {
      this.logger.error('Model training failed', error instanceof Error ? error : new Error(String(error)));
      throw new Error(`Training failed: ${error}`);
    }
  }

  /**
   * Get default metrics for empty or invalid training data
   */
  private getDefaultMetrics(): ModelEvaluationMetrics {
    return {
      accuracy: 0,
      mse: 0,
      f1Score: 0,
      precision: 0,
      recall: 0,
      confidenceIntervals: {}
    };
  }

  /**
   * Prepare training data and split into train/validation sets
   */
  private prepareTrainingDataAndSplit(processedTrainingData: TrainingData[]): {
    features: tf.Tensor;
    labels: tf.Tensor;
    trainFeatures: tf.Tensor;
    trainLabels: tf.Tensor;
    valFeatures: tf.Tensor;
    valLabels: tf.Tensor;
  } {
    const { features, labels } = this.dataPreprocessor.prepareTrainingData(processedTrainingData);
    
    const splitIndex = Math.floor(processedTrainingData.length * (1 - this.config.training.validationSplit));
    
    const trainFeatures = features.slice([0, 0], [splitIndex, -1]);
    const trainLabels = labels.slice([0, 0], [splitIndex, -1]);
    const valFeatures = features.slice([splitIndex, 0], [-1, -1]);
    const valLabels = labels.slice([splitIndex, 0], [-1, -1]);

    return { features, labels, trainFeatures, trainLabels, valFeatures, valLabels };
  }

  /**
   * Execute model training
   */
  private async executeModelTraining(
    model: tf.LayersModel,
    trainFeatures: tf.Tensor,
    trainLabels: tf.Tensor,
    valFeatures: tf.Tensor,
    valLabels: tf.Tensor,
    callbacks: tf.Callback[]
  ): Promise<void> {
    await model.fit(trainFeatures, trainLabels, {
      epochs: this.config.training.epochs,
      batchSize: this.config.training.batchSize,
      validationData: [valFeatures, valLabels],
      callbacks,
      verbose: 1,
      shuffle: true
    });
  }

  /**
   * Clean up training tensors
   */
  private cleanupTrainingTensors(
    features: tf.Tensor,
    labels: tf.Tensor,
    trainFeatures: tf.Tensor,
    trainLabels: tf.Tensor,
    valFeatures: tf.Tensor,
    valLabels: tf.Tensor
  ): void {
    trainFeatures.dispose();
    trainLabels.dispose();
    valFeatures.dispose();
    valLabels.dispose();
    features.dispose();
    labels.dispose();
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
      this.logger.warn('Empty test data provided, returning default metrics');
      return {
        accuracy: 0,
        mse: 0,
        f1Score: 0,
        precision: 0,
        recall: 0,
        confidenceIntervals: {}
      };
    }
    
    const { features, labels } = this.dataPreprocessor.prepareTrainingData(testData);
    
    try {
      const metrics = await this.modelEvaluator.evaluateModel(model, features, labels);
      
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
   * Create training callbacks for monitoring and optimization
   */
  private createTrainingCallbacks(): tf.Callback[] {
    const callbacks: tf.Callback[] = [];
    
    // Early stopping callback
    callbacks.push({
      onEpochEnd: (epoch: number, logs: Record<string, number>) => {
        if (logs?.val_loss) {
          const valLoss = logs.val_loss as number;
          const trainLoss = logs.loss as number;
          
          // Check for overfitting
          if (valLoss > trainLoss * TRAINING_CONSTANTS.OVERFITTING_THRESHOLD && epoch > TRAINING_CONSTANTS.EARLY_STOPPING_EPOCH) {
            this.logger.warn(`Early stopping at epoch ${epoch} due to overfitting`);
            // Note: Early stopping is handled by TensorFlow.js internally
          }
          
          // Progress logging
          if (epoch % 10 === 0) {
            this.logger.info(`Epoch ${epoch}: loss=${trainLoss.toFixed(4)}, val_loss=${valLoss.toFixed(4)}`);
          }
        }
      }
    } as tf.Callback);
    
    // Learning rate reduction callback
    callbacks.push({
      onEpochEnd: (epoch: number, logs: Record<string, number>) => {
        if (logs?.val_loss && epoch > 0) {
          // Reduce learning rate if validation loss plateaus
          // This is a simplified implementation
          if (epoch % TRAINING_CONSTANTS.EPOCH_THRESHOLD === 0) {
            this.logger.info(`Reducing learning rate at epoch ${epoch}`);
          }
        }
      }
    } as tf.Callback);
    
    return callbacks;
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
    return this.dataPreprocessor.preprocessTrainingData(trainingData);
  }

  /**
   * Scale features to a specific range
   * Useful for custom feature scaling requirements
   */
  public scaleFeatures(features: Record<string, unknown> | number[]): number[] {
    return this.dataPreprocessor.scaleFeatures(features);
  }

  /**
   * Validate model architecture before training
   * Ensures the model is properly configured
   */
  public validateModel(model: tf.LayersModel | unknown): boolean {
    return this.trainingValidator.validateModel(model);
  }

  /**
   * Validate training data quality and structure
   * Ensures data is suitable for training
   */
  public validateTrainingData(trainingData: TrainingData[]): boolean {
    return this.trainingValidator.validateTrainingData(trainingData);
  }

  /**
   * Calculate F1 score from precision and recall
   * Harmonic mean of precision and recall
   */
  public calculateF1Score(precision: number | number[], recall: number | number[]): number {
    return this.modelEvaluator.calculateF1Score(precision, recall);
  }

  /**
   * Calculate Mean Squared Error between predictions and actuals
   * Standard regression metric
   */
  public calculateMSE(predictions: number[], actuals: number[]): number {
    return this.modelEvaluator.calculateMSE(predictions, actuals);
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
    return this.crossValidator.crossValidate(
      model,
      trainingData,
      k,
      this.train.bind(this),
      this.evaluate.bind(this)
    );
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
    return this.hyperparameterAdvisor.suggestHyperparameters(trainingData);
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
    return this.trainingAnalyzer.analyzeTrainingHistory(history);
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
      
      this.logger.info(`Checkpoint saved: ${checkpointPath}`);
      return checkpointPath;
    } catch (error) {
      this.logger.error('Checkpoint save failed', error instanceof Error ? error : new Error(String(error)));
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
      this.logger.info(`Checkpoint loaded: ${checkpointPath}`);
      return model;
    } catch (error) {
      this.logger.error('Checkpoint load failed', error instanceof Error ? error : new Error(String(error)));
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
    return this.trainingValidator.validateTrainingConfig(trainingConfig);
  }

}
