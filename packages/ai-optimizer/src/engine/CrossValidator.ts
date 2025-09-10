import * as tf from '@tensorflow/tfjs';
import { TrainingData, ModelEvaluationMetrics } from '../types/index.js';
import { logger } from '../utils/Logger.js';

/**
 * Handles cross-validation for model training
 */
export class CrossValidator {
  /**
   * Perform k-fold cross validation
   * Robust model evaluation technique
   */
  public async crossValidate(
    _model: tf.LayersModel,
    trainingData: TrainingData[],
    k: number = 5,
    _trainFunction: (_model: tf.LayersModel, _data: TrainingData[]) => Promise<ModelEvaluationMetrics>,
    _evaluateFunction: (_model: tf.LayersModel, _data: TrainingData[]) => Promise<ModelEvaluationMetrics>
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
    this.validateCrossValidationInputs(trainingData, k);
    const foldSize = Math.floor(trainingData.length / k);
    const metrics = await this.executeCrossValidationFolds(
      _model, 
      trainingData, 
      k, 
      foldSize, 
      _trainFunction, 
      _evaluateFunction
    );
    
    if (metrics.length === 0) {
      return this.getDefaultCrossValidationMetrics();
    }

    return this.calculateCrossValidationMetrics(metrics);
  }

  /**
   * Validate cross validation inputs
   */
  private validateCrossValidationInputs(trainingData: TrainingData[], k: number): void {
    if (trainingData.length < k) {
      throw new Error(`Insufficient data for ${k}-fold cross validation. Need at least ${k} samples.`);
    }
  }

  /**
   * Execute cross validation folds
   */
  private async executeCrossValidationFolds(
    _model: tf.LayersModel,
    trainingData: TrainingData[],
    k: number,
    foldSize: number,
    _trainFunction: (_model: tf.LayersModel, _data: TrainingData[]) => Promise<ModelEvaluationMetrics>,
    _evaluateFunction: (_model: tf.LayersModel, _data: TrainingData[]) => Promise<ModelEvaluationMetrics>
  ): Promise<Array<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    mse: number;
  }>> {
    const foldPromises = [];
    for (let i = 0; i < k; i++) {
      const { validationData, trainData } = this.createFoldData(trainingData, i, foldSize, k);
      
      if (trainData.length === 0) continue;

      const foldPromise = this.executeFold(
        _model, 
        trainData, 
        validationData, 
        i, 
        _trainFunction, 
        _evaluateFunction
      );
      foldPromises.push(foldPromise);
    }

    const foldResults = await Promise.all(foldPromises);
    return foldResults.filter(result => result !== null);
  }

  /**
   * Create fold data for cross validation
   */
  private createFoldData(trainingData: TrainingData[], i: number, foldSize: number, k: number): {
    validationData: TrainingData[];
    trainData: TrainingData[];
  } {
    const startIndex = i * foldSize;
    const endIndex = i === k - 1 ? trainingData.length : (i + 1) * foldSize;
    
    const validationData = trainingData.slice(startIndex, endIndex);
    const trainData = [
      ...trainingData.slice(0, startIndex),
      ...trainingData.slice(endIndex)
    ];

    return { validationData, trainData };
  }

  /**
   * Execute a single fold
   */
  private async executeFold(
    _model: tf.LayersModel,
    trainData: TrainingData[],
    validationData: TrainingData[],
    foldIndex: number,
    _trainFunction: (_model: tf.LayersModel, _data: TrainingData[]) => Promise<ModelEvaluationMetrics>,
    _evaluateFunction: (_model: tf.LayersModel, _data: TrainingData[]) => Promise<ModelEvaluationMetrics>
  ): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    mse: number;
  } | null> {
    try {
      await _trainFunction(_model, trainData);
      const valMetrics = await _evaluateFunction(_model, validationData);
      return valMetrics;
    } catch (error) {
      logger.warn(`Fold ${foldIndex + 1} failed: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Get default cross validation metrics when all folds fail
   */
  private getDefaultCrossValidationMetrics(): {
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
  } {
    logger.warn('All cross-validation folds failed, returning default metrics');
    return {
      meanAccuracy: 0,
      stdAccuracy: 0,
      meanPrecision: 0,
      stdPrecision: 0,
      meanRecall: 0,
      stdRecall: 0,
      meanF1Score: 0,
      stdF1Score: 0,
      meanMSE: 0,
      stdMSE: 0
    };
  }

  /**
   * Calculate cross validation metrics
   */
  private calculateCrossValidationMetrics(metrics: Array<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    mse: number;
  }>): {
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
  } {
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
   * Calculate mean of an array of numbers
   * Utility method for statistical calculations
   */
  private calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate standard deviation of an array
   * Utility method for statistical calculations
   */
  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = this.calculateMean(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }
}
