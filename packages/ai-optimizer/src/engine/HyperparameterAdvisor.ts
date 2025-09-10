import { TrainingData, AIModelConfig } from '../types/index.js';

// Training constants
const TRAINING_CONSTANTS = {
  OVERFITTING_THRESHOLD: 1.5,
  VALIDATION_THRESHOLD: 0.5,
  LEARNING_RATE_MIN: 0.01,
  CACHE_SIZE_LARGE: 10000,
  BATCH_SIZE_LARGE: 50,
  BATCH_SIZE_SMALL: 8,
  LARGE_DATASET_SIZE: 5000,
  DEFAULT_BATCH_SIZE: 128,
  CACHE_SIZE_MEDIUM: 500
} as const;

/**
 * Provides hyperparameter optimization suggestions based on training data analysis
 */
export class HyperparameterAdvisor {
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
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
    const featureCount = this.getFeatureCount(trainingData);

    const learningRateSuggestion = this.suggestLearningRate(sampleCount);
    const batchSizeSuggestion = this.suggestBatchSize(sampleCount);
    const epochsSuggestion = this.suggestEpochs(sampleCount);
    const architectureSuggestion = this.suggestArchitecture(featureCount);

    return {
      learningRate: learningRateSuggestion,
      batchSize: batchSizeSuggestion,
      epochs: epochsSuggestion,
      architecture: architectureSuggestion
    };
  }

  /**
   * Get feature count from training data
   */
  private getFeatureCount(trainingData: TrainingData[]): number {
    return trainingData[0]?.features ? 
      Object.keys(trainingData[0].features).length : 0;
  }

  /**
   * Suggest learning rate based on sample count
   */
  private suggestLearningRate(sampleCount: number): { current: number; suggested: number; reason: string } {
    let suggestedLR = this.config.training.learningRate;
    let lrReason = 'Current learning rate is appropriate';
    
    if (sampleCount < 100) {
      suggestedLR = Math.min(suggestedLR * TRAINING_CONSTANTS.VALIDATION_THRESHOLD, TRAINING_CONSTANTS.LEARNING_RATE_MIN);
      lrReason = 'Reduced learning rate for small dataset to prevent overfitting';
    } else if (sampleCount > TRAINING_CONSTANTS.CACHE_SIZE_LARGE) {
      suggestedLR = Math.min(suggestedLR * TRAINING_CONSTANTS.OVERFITTING_THRESHOLD, TRAINING_CONSTANTS.LEARNING_RATE_MIN * 10);
      lrReason = 'Increased learning rate for large dataset to speed up convergence';
    }

    return {
      current: this.config.training.learningRate,
      suggested: suggestedLR,
      reason: lrReason
    };
  }

  /**
   * Suggest batch size based on sample count
   */
  private suggestBatchSize(sampleCount: number): { current: number; suggested: number; reason: string } {
    let suggestedBatchSize = this.config.training.batchSize;
    let batchReason = 'Current batch size is appropriate';
    
    if (sampleCount < TRAINING_CONSTANTS.BATCH_SIZE_LARGE) {
      suggestedBatchSize = Math.max(suggestedBatchSize / 2, TRAINING_CONSTANTS.BATCH_SIZE_SMALL);
      batchReason = 'Reduced batch size for very small dataset';
    } else if (sampleCount > TRAINING_CONSTANTS.LARGE_DATASET_SIZE) {
      suggestedBatchSize = Math.min(suggestedBatchSize * 2, TRAINING_CONSTANTS.DEFAULT_BATCH_SIZE);
      batchReason = 'Increased batch size for large dataset to improve training stability';
    }

    return {
      current: this.config.training.batchSize,
      suggested: suggestedBatchSize,
      reason: batchReason
    };
  }

  /**
   * Suggest epochs based on sample count
   */
  private suggestEpochs(sampleCount: number): { current: number; suggested: number; reason: string } {
    let suggestedEpochs = this.config.training.epochs;
    let epochsReason = 'Current epoch count is appropriate';
    
    if (sampleCount < 100) {
      suggestedEpochs = Math.min(suggestedEpochs * 2, TRAINING_CONSTANTS.CACHE_SIZE_MEDIUM);
      epochsReason = 'Increased epochs for small dataset to ensure convergence';
    } else if (sampleCount > TRAINING_CONSTANTS.CACHE_SIZE_LARGE) {
      suggestedEpochs = Math.max(suggestedEpochs / 2, TRAINING_CONSTANTS.BATCH_SIZE_LARGE);
      epochsReason = 'Reduced epochs for large dataset to prevent overfitting';
    }

    return {
      current: this.config.training.epochs,
      suggested: suggestedEpochs,
      reason: epochsReason
    };
  }

  /**
   * Suggest architecture based on feature count
   */
  private suggestArchitecture(featureCount: number): { current: string; suggested: string; reason: string } {
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
      current: this.config.architecture,
      suggested: suggestedArchitecture,
      reason: archReason
    };
  }
}
