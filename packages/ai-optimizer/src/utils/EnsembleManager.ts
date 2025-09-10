import * as tf from '@tensorflow/tfjs';
import { EventEmitter } from 'events';
import { AI_OPTIMIZER_CONSTANTS, type ModelPerformanceMetrics as BaseModelPerformanceMetrics } from '../constants.js';
import { Logger } from './Logger.js';
import { ModelFactory, type ModelConfig, type MockModel } from './ModelFactory.js';

export type ModelPerformanceMetrics = BaseModelPerformanceMetrics;

export interface ModelEnsembleConfig {
  models: Array<{
    name: string;
    weight: number;
    type: 'neural-network' | 'linear-regression' | 'decision-tree' | 'random-forest';
    config: ModelConfig;
  }>;
  votingStrategy: 'weighted' | 'majority' | 'stacking';
  confidenceThreshold: number;
  enableAdaptiveWeights: boolean;
}

/**
 * Manages ensemble of machine learning models
 */
export class EnsembleManager extends EventEmitter {
  private ensembleConfig: ModelEnsembleConfig;
  private models: Map<string, tf.LayersModel | MockModel> = new Map();
  private performanceMetrics: Map<string, ModelPerformanceMetrics> = new Map();
  private modelFactory: ModelFactory;
  private logger: Logger;

  constructor(ensembleConfig: Partial<ModelEnsembleConfig> = {}) {
    super();
    this.logger = new Logger('EnsembleManager');
    this.modelFactory = new ModelFactory();
    
    this.ensembleConfig = {
      models: [
        {
          name: 'neural-network',
          weight: AI_OPTIMIZER_CONSTANTS.OPTIMIZATION_WEIGHTS.ACCURACY,
          type: 'neural-network',
          config: { 
            layers: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.EPOCHS / 10, 
            neurons: AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.FEATURE_DIMENSION 
          }
        },
        {
          name: 'linear-regression',
          weight: AI_OPTIMIZER_CONSTANTS.OPTIMIZATION_WEIGHTS.EFFICIENCY,
          type: 'linear-regression',
          config: { regularization: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.LEARNING_RATE * 10 }
        },
        {
          name: 'decision-tree',
          weight: AI_OPTIMIZER_CONSTANTS.OPTIMIZATION_WEIGHTS.MEMORY,
          type: 'decision-tree',
          config: { maxDepth: AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.DEFAULT_STEP + 2 }
        }
      ],
      votingStrategy: 'weighted',
      confidenceThreshold: AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD,
      enableAdaptiveWeights: true,
      ...ensembleConfig
    };

    this.initializeModels();
  }

  /**
   * Initialize ensemble models
   */
  private initializeModels(): void {
    for (const modelConfig of this.ensembleConfig.models) {
      try {
        const modelType = modelConfig.type === 'random-forest' ? 'decision-tree' : modelConfig.type;
        const model = this.modelFactory.createModel(modelType as 'neural-network' | 'linear-regression' | 'decision-tree', modelConfig.config);
        this.models.set(modelConfig.name, model);
        
        // Initialize performance metrics
        this.performanceMetrics.set(modelConfig.name, {
          accuracy: 0,
          precision: 0,
          recall: 0,
          f1Score: 0,
          auc: 0,
          mse: 0,
          mae: 0,
          r2Score: 0,
          confidence: 0,
          predictionTime: 0,
          lastUpdated: Date.now()
        });
      } catch (error) {
        this.logger.error(`Failed to initialize model ${modelConfig.name}:`, error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  /**
   * Train all models in the ensemble
   */
  async trainEnsemble(features: number[][], labels: number[]): Promise<void> {
    const trainingPromises = Array.from(this.models.entries()).map(async ([name, model]) => {
      try {
        this.logger.info(`Training model: ${name}`);
        const startTime = Date.now();
        
        const featuresTensor = tf.tensor2d(features);
        const labelsTensor = tf.tensor1d(labels);
        
        if ('fit' in model && typeof model.fit === 'function') {
          await (model as tf.LayersModel).fit(featuresTensor, labelsTensor, {
            epochs: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.EPOCHS,
            batchSize: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.BATCH_SIZE,
            validationSplit: 0.2, // Use default validation split
            verbose: 0
          });
        }
        
        // Dispose tensors to prevent memory leaks
        featuresTensor.dispose();
        labelsTensor.dispose();
        
        const trainingTime = Date.now() - startTime;
        this.logger.info(`Model ${name} trained in ${trainingTime}ms`);
        
        this.emit('modelTrained', { modelName: name, trainingTime });
      } catch (error) {
        this.logger.error(`Failed to train model ${name}:`, error instanceof Error ? error : new Error(String(error)));
        this.emit('modelTrainingFailed', { modelName: name, error });
      }
    });

    await Promise.all(trainingPromises);
  }

  /**
   * Make predictions using ensemble voting
   */
  async predict(features: number[][]): Promise<{
    prediction: number[];
    confidence: number;
    individualPredictions: Array<{
      modelName: string;
      prediction: number[];
      confidence: number;
      weight: number;
    }>;
  }> {
    const individualPredictions: Array<{
      modelName: string;
      prediction: number[];
      confidence: number;
      weight: number;
    }> = [];

    // Get predictions from all models
    const predictionPromises = Array.from(this.models.entries()).map(async ([name, model]) => {
      try {
        const modelConfig = this.ensembleConfig.models.find(m => m.name === name);
        if (!modelConfig) return null;

        const featuresTensor = tf.tensor2d(features);
        
        let prediction: tf.Tensor;
        if ('predict' in model && typeof model.predict === 'function') {
          const predictResult = (model as tf.LayersModel).predict(featuresTensor);
          prediction = predictResult instanceof Promise ? await predictResult as tf.Tensor : predictResult as tf.Tensor;
        } else {
          // Mock model - generate random prediction
          prediction = tf.randomNormal([features.length, 1]);
        }
        
        const predictionData = await prediction.data();
        const predictionArray = Array.from(predictionData);
        
        // Dispose tensors to prevent memory leaks
        featuresTensor.dispose();
        (prediction as tf.Tensor).dispose();
        
        // Calculate confidence based on model performance
        const metrics = this.performanceMetrics.get(name);
        const DEFAULT_CONFIDENCE = 0.5;
        const confidence = metrics ? this.calculateConfidence(metrics) : DEFAULT_CONFIDENCE;
        
        const result = {
          modelName: name,
          prediction: predictionArray as number[],
          confidence,
          weight: modelConfig.weight
        };

        // Dispose prediction tensor
        if (prediction && typeof (prediction as tf.Tensor).dispose === 'function') {
          (prediction as tf.Tensor).dispose();
        }

        return result;
      } catch (error) {
        this.logger.warn(`Failed to get prediction from model ${name}:`, { error: error instanceof Error ? error.message : String(error) });
        return null;
      }
    });

    const predictionResults = await Promise.all(predictionPromises);
    individualPredictions.push(...predictionResults.filter((result): result is NonNullable<typeof result> => result !== null));

    // Combine predictions based on voting strategy
    const ensemblePrediction = this.combinePredictions(individualPredictions);
    const ensembleConfidence = this.calculateEnsembleConfidence(individualPredictions);

    return {
      prediction: ensemblePrediction,
      confidence: ensembleConfidence,
      individualPredictions
    };
  }

  /**
   * Combine predictions based on voting strategy
   */
  private combinePredictions(individualPredictions: Array<{
    modelName: string;
    prediction: number[];
    confidence: number;
    weight: number;
  }>): number[] {
    if (individualPredictions.length === 0) {
      return [];
    }

    const predictionLength = individualPredictions[0].prediction.length;
    const combinedPrediction = new Array(predictionLength).fill(0);
    let totalWeight = 0;

    for (const pred of individualPredictions) {
      const effectiveWeight = this.ensembleConfig.enableAdaptiveWeights 
        ? pred.weight * pred.confidence 
        : pred.weight;
      
      for (let i = 0; i < predictionLength; i++) {
        combinedPrediction[i] += pred.prediction[i] * effectiveWeight;
      }
      totalWeight += effectiveWeight;
    }

    // Normalize by total weight
    if (totalWeight > 0) {
      for (let i = 0; i < predictionLength; i++) {
        combinedPrediction[i] /= totalWeight;
      }
    }

    return combinedPrediction;
  }

  /**
   * Calculate ensemble confidence
   */
  private calculateEnsembleConfidence(individualPredictions: Array<{
    modelName: string;
    prediction: number[];
    confidence: number;
    weight: number;
  }>): number {
    if (individualPredictions.length === 0) {
      return 0;
    }

    let weightedConfidence = 0;
    let totalWeight = 0;

    for (const pred of individualPredictions) {
      const effectiveWeight = this.ensembleConfig.enableAdaptiveWeights 
        ? pred.weight * pred.confidence 
        : pred.weight;
      
      weightedConfidence += pred.confidence * effectiveWeight;
      totalWeight += effectiveWeight;
    }

    return totalWeight > 0 ? weightedConfidence / totalWeight : 0;
  }

  /**
   * Calculate model confidence based on performance metrics
   */
  private calculateConfidence(metrics: ModelPerformanceMetrics): number {
    const accuracyWeight = 0.4;
    const f1Weight = 0.3;
    const r2Weight = 0.3;

    return (
      metrics.accuracy * accuracyWeight +
      metrics.f1Score * f1Weight +
      metrics.r2Score * r2Weight
    );
  }

  /**
   * Update model performance metrics
   */
  updateModelMetrics(modelName: string, metrics: Partial<ModelPerformanceMetrics>): void {
    const currentMetrics = this.performanceMetrics.get(modelName);
    if (currentMetrics) {
      this.performanceMetrics.set(modelName, {
        ...currentMetrics,
        ...metrics,
        lastUpdated: Date.now()
      });
    }
  }

  /**
   * Get model performance metrics
   */
  getModelMetrics(modelName: string): ModelPerformanceMetrics | undefined {
    return this.performanceMetrics.get(modelName);
  }

  /**
   * Get all model performance metrics
   */
  getAllModelMetrics(): Map<string, ModelPerformanceMetrics> {
    return new Map(this.performanceMetrics);
  }

  /**
   * Get ensemble configuration
   */
  getEnsembleConfig(): ModelEnsembleConfig {
    return { ...this.ensembleConfig };
  }

  /**
   * Update ensemble configuration
   */
  updateEnsembleConfig(config: Partial<ModelEnsembleConfig>): void {
    this.ensembleConfig = { ...this.ensembleConfig, ...config };
  }

  /**
   * Dispose all models
   */
  dispose(): void {
    for (const model of this.models.values()) {
      if (model && typeof model.dispose === 'function') {
        model.dispose();
      }
    }
    this.models.clear();
    this.performanceMetrics.clear();
  }
}
