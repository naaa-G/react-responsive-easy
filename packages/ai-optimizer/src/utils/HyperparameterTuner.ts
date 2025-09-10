import { Logger } from './Logger.js';
import { AI_OPTIMIZER_CONSTANTS } from '../constants.js';

export interface HyperparameterConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  hiddenLayers: number[];
  dropoutRate: number;
  regularization: number;
}

export interface OptimizationResult {
  bestParams: HyperparameterConfig;
  bestScore: number;
  history: Array<{
    params: HyperparameterConfig;
    score: number;
    timestamp: number;
  }>;
}

export class HyperparameterTuner {
  // Constants for parameter optimization
  private static readonly LEARNING_RATES = [
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.LEARNING_RATE,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.LEARNING_RATE * 10,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.LEARNING_RATE * 100
  ] as const;
  private static readonly BATCH_SIZES = [
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.BATCH_SIZE,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.BATCH_SIZE * 2,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.BATCH_SIZE * 4
  ] as const;
  private static readonly EPOCHS = [
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.EPOCHS / 2,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.EPOCHS,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.EPOCHS * 2
  ] as const;
  private static readonly HIDDEN_LAYERS = [
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_BLOCK_SIZE,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_BLOCK_SIZE * 2,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_BLOCK_SIZE * 4
  ] as const;
  private static readonly DROPOUT_RATES = [
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.DROPOUT_RATE,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.DROPOUT_RATE * 2,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.DROPOUT_RATE * 3
  ] as const;
  private static readonly REGULARIZATION_RATES = [
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.REGULARIZATION,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.REGULARIZATION * 2,
    AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.REGULARIZATION * 4
  ] as const;
  private static readonly BATCH_SIZE = 5;
  private static readonly MIN_SCORE = AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.MIN_SCORE;
  private static readonly MAX_SCORE = AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.MAX_SCORE;

  private logger: Logger;
  private optimizationHistory: Array<{
    params: HyperparameterConfig;
    score: number;
    timestamp: number;
  }> = [];

  constructor() {
    this.logger = new Logger('HyperparameterTuner');
  }

  /**
   * Optimize hyperparameters using grid search
   */
  async optimize(
    createModel: (_params: HyperparameterConfig) => Promise<unknown>,
    _trainingData: { features: unknown; labels: unknown },
    validationData: { features: unknown; labels: unknown }
  ): Promise<Map<string, unknown>> {
    this.logger.info('Starting hyperparameter optimization');

    const paramGrid = this.generateParameterGrid();
    let bestScore = -Infinity;
    let bestParams: HyperparameterConfig | null = null;

    // Process parameters in parallel batches to avoid await in loop
    const batches = [];
    
    for (let i = 0; i < paramGrid.length; i += HyperparameterTuner.BATCH_SIZE) {
      batches.push(paramGrid.slice(i, i + HyperparameterTuner.BATCH_SIZE));
    }

    // Process all batches in parallel to avoid await in loop
    const allBatchPromises = batches.map(async (batch) => {
      const batchPromises = batch.map(async (params) => {
        try {
          const model = await createModel(params);
          const score = this.evaluateModel(model, validationData);
          
          this.optimizationHistory.push({
            params,
            score,
            timestamp: Date.now()
          });

          return { params, score, success: true };
        } catch (error) {
          this.logger.warn(`Failed to evaluate parameters:`, { error: error instanceof Error ? error.message : String(error) });
          return { params, score: -Infinity, success: false };
        }
      });

      return Promise.all(batchPromises);
    });

    const allBatchResults = await Promise.all(allBatchPromises);
    
    // Update best parameters from all batches
    for (const batchResults of allBatchResults) {
      for (const result of batchResults) {
        if (result.success && result.score > bestScore) {
          bestScore = result.score;
          bestParams = result.params;
        }
      }
    }

    const result = new Map<string, unknown>();
    if (bestParams) {
      result.set('learningRate', bestParams.learningRate);
      result.set('batchSize', bestParams.batchSize);
      result.set('epochs', bestParams.epochs);
      result.set('hiddenLayers', bestParams.hiddenLayers);
      result.set('dropoutRate', bestParams.dropoutRate);
      result.set('regularization', bestParams.regularization);
      result.set('bestScore', bestScore);
    }

    return result;
  }

  /**
   * Generate parameter grid for optimization
   */
  private generateParameterGrid(): HyperparameterConfig[] {
    const learningRates = HyperparameterTuner.LEARNING_RATES;
    const batchSizes = HyperparameterTuner.BATCH_SIZES;
    const epochs = HyperparameterTuner.EPOCHS;
    const HIDDEN_LAYER_64 = AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_BLOCK_SIZE;
    const HIDDEN_LAYER_128 = AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_BLOCK_SIZE * 2;
    const HIDDEN_LAYER_32 = AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_BLOCK_SIZE / 2;
    const hiddenLayersOptions = [[HIDDEN_LAYER_64], [HIDDEN_LAYER_128], [HIDDEN_LAYER_64, HIDDEN_LAYER_32], [HIDDEN_LAYER_128, HIDDEN_LAYER_64]];
    const dropoutRates = HyperparameterTuner.DROPOUT_RATES;
    const regularizations = HyperparameterTuner.REGULARIZATION_RATES;

    const grid: HyperparameterConfig[] = [];

    for (const lr of learningRates) {
      for (const batchSize of batchSizes) {
        for (const epoch of epochs) {
          for (const hiddenLayers of hiddenLayersOptions) {
            for (const dropoutRate of dropoutRates) {
              for (const regularization of regularizations) {
                grid.push({
                  learningRate: lr,
                  batchSize,
                  epochs: epoch,
                  hiddenLayers,
                  dropoutRate,
                  regularization
                });
              }
            }
          }
        }
      }
    }

    return grid;
  }

  /**
   * Evaluate model performance
   */
  private evaluateModel(_model: unknown, _validationData: { features: unknown; labels: unknown }): number {
    // Mock evaluation - in real implementation, this would evaluate the model
    return Math.random() * (HyperparameterTuner.MAX_SCORE - HyperparameterTuner.MIN_SCORE) + HyperparameterTuner.MIN_SCORE;
  }

  /**
   * Get optimization history
   */
  getOptimizationHistory(): Array<{
    params: HyperparameterConfig;
    score: number;
    timestamp: number;
  }> {
    return [...this.optimizationHistory];
  }

  /**
   * Clear optimization history
   */
  clearHistory(): void {
    this.optimizationHistory = [];
  }
}
