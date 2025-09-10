/**
 * Model helper for AI Optimizer
 * 
 * Contains model creation and management logic extracted from AIOptimizer
 * to reduce file size and improve maintainability.
 */

import * as tf from '@tensorflow/tfjs';
import { AI_OPTIMIZER_CONSTANTS } from '../constants.js';
import { logger } from '../utils/Logger.js';

const { ADDITIONAL_CONSTANTS } = AI_OPTIMIZER_CONSTANTS;

/**
 * Create a base model for AI optimization
 */
export function createBaseModel(): tf.LayersModel {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [ADDITIONAL_CONSTANTS.FEATURE_DIMENSION],
        units: ADDITIONAL_CONSTANTS.FEATURE_DIMENSION * 2,
        activation: 'relu',
        kernelRegularizer: tf.regularizers.l2({ l2: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.REGULARIZATION })
      }),
      tf.layers.dropout({ rate: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.DROPOUT_RATE }),
      tf.layers.dense({
        units: ADDITIONAL_CONSTANTS.FEATURE_DIMENSION,
        activation: 'relu',
        kernelRegularizer: tf.regularizers.l2({ l2: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.REGULARIZATION })
      }),
      tf.layers.dropout({ rate: AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.DROPOUT_RATE }),
      tf.layers.dense({
        units: ADDITIONAL_CONSTANTS.MODEL_INPUT_SIZE,
        activation: 'linear'
      })
    ]
  });

  model.compile({
    optimizer: tf.train.adam(AI_OPTIMIZER_CONSTANTS.ML_PARAMETERS.LEARNING_RATE),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });

  return model;
}

/**
 * Create a mock model for test environments where TensorFlow is not available
 */
export function createMockModel(): tf.LayersModel {
  return {
    fit: async (_features: tf.Tensor, _labels: tf.Tensor, _options?: tf.ModelFitArgs) => {
      logger.info('Mock model training (test environment)');
      await new Promise(resolve => setTimeout(resolve, 0)); // Simulate async operation
      return {
        history: {
          loss: [AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.MIN_SCORE, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.WARNING_THRESHOLD, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.WARNING_THRESHOLD],
          val_loss: [AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.WARNING_THRESHOLD],
          accuracy: [AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD],
          val_accuracy: [AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.GOOD_THRESHOLD, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD]
        }
      };
    },
    predict: async (_features: tf.Tensor) => {
      logger.info('Mock model prediction (test environment)');
      await new Promise(resolve => setTimeout(resolve, 0)); // Simulate async operation
      // Return mock prediction data that behaves like a TensorFlow tensor
      const mockTensor = {
        data: () => Promise.resolve(new Float32Array(ADDITIONAL_CONSTANTS.MODEL_INPUT_SIZE).fill(AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.MIN_SCORE)),
        dataSync: () => new Float32Array(ADDITIONAL_CONSTANTS.MODEL_INPUT_SIZE).fill(AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.MIN_SCORE),
        dispose: () => {},
        shape: [1, ADDITIONAL_CONSTANTS.MODEL_INPUT_SIZE],
        rank: 2,
        size: ADDITIONAL_CONSTANTS.MODEL_INPUT_SIZE,
        dtype: 'float32'
      } as unknown as tf.Tensor;
      
      return mockTensor;
    },
    evaluate: async (_features: tf.Tensor, _labels: tf.Tensor) => {
      logger.info('Mock model evaluation (test environment)');
      await new Promise(resolve => setTimeout(resolve, 0)); // Simulate async operation
      return [AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.MIN_SCORE, AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.WARNING_THRESHOLD];
    },
    save: async (_path: string) => {
      logger.info('Mock model save (test environment)');
      await new Promise(resolve => setTimeout(resolve, 0)); // Simulate async operation
      return { modelArtifactsInfo: { dateSaved: new Date().toISOString() } };
    },
    dispose: () => {
      logger.info('Mock model disposed (test environment)');
    }
  } as unknown as tf.LayersModel;
}
