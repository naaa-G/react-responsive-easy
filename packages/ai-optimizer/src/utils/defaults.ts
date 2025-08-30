import { AIModelConfig } from '../types/index.js';

/**
 * Create default AI configuration
 */
export function createDefaultAIConfig(): AIModelConfig {
  return {
    architecture: 'neural-network',
    training: {
      epochs: 100,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2
    },
    features: {
      normalization: 'standard',
      dimensionalityReduction: true,
      featureSelection: true
    },
    persistence: {
      saveFrequency: 10,
      modelVersioning: true,
      backupStrategy: 'local'
    }
  };
}

/**
 * Create optimized AI configuration for production use
 */
export function createProductionAIConfig(): AIModelConfig {
  return {
    architecture: 'ensemble',
    training: {
      epochs: 200,
      batchSize: 64,
      learningRate: 0.0005,
      validationSplit: 0.15
    },
    features: {
      normalization: 'robust',
      dimensionalityReduction: true,
      featureSelection: true
    },
    persistence: {
      saveFrequency: 5,
      modelVersioning: true,
      backupStrategy: 'both'
    }
  };
}

/**
 * Create lightweight AI configuration for development
 */
export function createDevelopmentAIConfig(): AIModelConfig {
  return {
    architecture: 'neural-network',
    training: {
      epochs: 50,
      batchSize: 16,
      learningRate: 0.01,
      validationSplit: 0.3
    },
    features: {
      normalization: 'minmax',
      dimensionalityReduction: false,
      featureSelection: false
    },
    persistence: {
      saveFrequency: 20,
      modelVersioning: false,
      backupStrategy: 'local'
    }
  };
}
