import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ModelTrainer } from '../engine/ModelTrainer.js';
import type { AIModelConfig, TrainingData, ModelEvaluationMetrics } from '../types/index.js';

// TensorFlow.js is mocked globally in setup.ts

const mockConfig: AIModelConfig = {
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

const mockTrainingData: TrainingData[] = [
  {
    features: {
      config: { 
        breakpointCount: 3, 
        breakpointRatios: [0.4, 0.53, 1], 
        tokenComplexity: 12, 
        originDistribution: { width: 1, height: 0, min: 0, max: 0, diagonal: 0, area: 0 } 
      },
      usage: { 
        commonValues: [16, 14, 15], 
        valueDistributions: {}, 
        componentFrequencies: { Button: 1 }, 
        propertyPatterns: { fontSize: 1 } 
      },
      performance: { 
        avgRenderTimes: [2.5, 2.5, 2.5, 2.5, 2.5], 
        bundleSizes: [5120, 5120, 5120, 5120, 5120], 
        memoryPatterns: [1024, 1024, 1024, 1024, 1024], 
        layoutShiftFreq: [0.01, 0.01, 0.01, 0.01, 0.01] 
      },
      context: { 
        applicationType: 'general', 
        deviceDistribution: { desktop: 1, tablet: 0, mobile: 0, other: 0 }, 
        userBehavior: { engagement: 0.85, accessibility: 95, performance: 0 }, 
        industry: 'general' 
      }
    },
    labels: {
      optimalTokens: {},
      performanceScores: {},
      satisfactionRatings: [95],
      accessibilityScores: {}
    },
    metadata: {
      timestamp: new Date(),
      source: 'test',
      qualityScore: 0.9,
      sampleSize: 1,
      region: 'test'
    }
  },
  {
    features: {
      config: { 
        breakpointCount: 4, 
        breakpointRatios: [0.3, 0.5, 0.8, 1], 
        tokenComplexity: 18, 
        originDistribution: { width: 0, height: 1, min: 0, max: 0, diagonal: 0, area: 0 } 
      },
      usage: { 
        commonValues: [20, 18, 16], 
        valueDistributions: {}, 
        componentFrequencies: { Card: 1 }, 
        propertyPatterns: { padding: 1 } 
      },
      performance: { 
        avgRenderTimes: [3.2, 3.2, 3.2, 3.2, 3.2], 
        bundleSizes: [8192, 8192, 8192, 8192, 8192], 
        memoryPatterns: [2048, 2048, 2048, 2048, 2048], 
        layoutShiftFreq: [0.02, 0.02, 0.02, 0.02, 0.02] 
      },
      context: { 
        applicationType: 'dashboard', 
        deviceDistribution: { desktop: 0, tablet: 1, mobile: 0, other: 0 }, 
        userBehavior: { engagement: 0.65, accessibility: 88, performance: 1 }, 
        industry: 'technology' 
      }
    },
    labels: {
      optimalTokens: {},
      performanceScores: {},
      satisfactionRatings: [88],
      accessibilityScores: {}
    },
    metadata: {
      timestamp: new Date(),
      source: 'test',
      qualityScore: 0.85,
      sampleSize: 1,
      region: 'test'
    }
  }
];

describe('ModelTrainer', () => {
  let modelTrainer: ModelTrainer;
  let mockModel: any;

  beforeEach(() => {
    modelTrainer = new ModelTrainer(mockConfig);
    mockModel = {
      fit: vi.fn().mockResolvedValue({
        history: {
          loss: [0.5, 0.3, 0.2],
          accuracy: [0.7, 0.8, 0.85],
          val_loss: [0.6, 0.4, 0.25],
          val_accuracy: [0.65, 0.75, 0.8]
        }
      }),
      evaluate: vi.fn().mockResolvedValue([0.25, 0.8]), // [loss, accuracy]
      predict: vi.fn().mockReturnValue({
        data: vi.fn(() => Promise.resolve(new Float32Array([0.8, 0.9, 0.7]))),
        dataSync: vi.fn(() => new Float32Array([0.8, 0.9, 0.7])),
        dispose: vi.fn(),
        shape: [1, 3],
        sub: vi.fn().mockReturnThis(),
        add: vi.fn().mockReturnThis(),
        div: vi.fn().mockReturnThis(),
        mul: vi.fn().mockReturnThis(),
        square: vi.fn().mockReturnThis(),
        sqrt: vi.fn().mockReturnThis(),
        abs: vi.fn().mockReturnThis(),
        mean: vi.fn().mockReturnThis(),
        min: vi.fn().mockReturnThis(),
        max: vi.fn().mockReturnThis(),
        sum: vi.fn().mockReturnThis(),
        lessEqual: vi.fn().mockReturnThis(),
        greater: vi.fn().mockReturnThis(),
        equal: vi.fn().mockReturnThis(),
        slice: vi.fn().mockReturnThis(),
        reshape: vi.fn().mockReturnThis(),
        transpose: vi.fn().mockReturnThis(),
        expandDims: vi.fn().mockReturnThis(),
        squeeze: vi.fn().mockReturnThis(),
        cast: vi.fn().mockReturnThis(),
        grad: vi.fn().mockReturnThis(),
        async: vi.fn().mockReturnThis()
      }),
      save: vi.fn().mockResolvedValue({}),
      countParams: vi.fn().mockReturnValue(100000),
      layers: { length: 5 },
      optimizer: { applyGradients: vi.fn() },
      inputs: [{ shape: [null, 128] }],
      outputs: [{ shape: [null, 64] }]
    };
  });

  describe('Constructor', () => {
    it('should create ModelTrainer with configuration', () => {
      expect(modelTrainer).toBeInstanceOf(ModelTrainer);
      expect(modelTrainer).toBeDefined();
    });

    it('should accept custom configuration', () => {
      const customConfig: AIModelConfig = {
        ...mockConfig,
        training: {
          ...mockConfig.training,
          epochs: 200,
          batchSize: 64
        }
      };
      
      const customTrainer = new ModelTrainer(customConfig);
      expect(customTrainer).toBeInstanceOf(ModelTrainer);
    });
  });

  describe('Training', () => {
    it('should train model successfully', async () => {
      const metrics = await modelTrainer.train(mockModel, mockTrainingData);
      
      expect(metrics).toBeDefined();
      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('precision');
      expect(metrics).toHaveProperty('recall');
      expect(metrics).toHaveProperty('f1Score');
      expect(metrics).toHaveProperty('mse');
      
      expect(mockModel.fit).toHaveBeenCalled();
    });

    it('should handle training with single data point', async () => {
      const singleData = [mockTrainingData[0]];
      const metrics = await modelTrainer.train(mockModel, singleData);
      
      expect(metrics).toBeDefined();
      expect(mockModel.fit).toHaveBeenCalled();
    });

    it('should handle training with empty data', async () => {
      // Empty data should be handled gracefully by creating empty tensors
      const metrics = await modelTrainer.train(mockModel, []);
      expect(metrics).toBeDefined();
      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('mse');
    });

    it('should use correct training parameters', async () => {
      await modelTrainer.train(mockModel, mockTrainingData);
      
      expect(mockModel.fit).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          epochs: mockConfig.training.epochs,
          batchSize: mockConfig.training.batchSize,
          validationData: expect.any(Array),
          callbacks: expect.any(Array),
          shuffle: true,
          verbose: 1
        })
      );
    });

    it('should handle training errors gracefully', async () => {
      mockModel.fit.mockRejectedValue(new Error('Training failed'));
      
      await expect(modelTrainer.train(mockModel, mockTrainingData)).rejects.toThrow('Training failed');
    });
  });

  describe('Evaluation', () => {
        it('should evaluate model successfully', async () => {
      const metrics = await modelTrainer.evaluate(mockModel, mockTrainingData);
      
      expect(metrics).toBeDefined();
      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('precision');
      expect(metrics).toHaveProperty('recall');
      expect(metrics).toHaveProperty('f1Score');
      expect(metrics).toHaveProperty('mse');

      // The evaluate method uses model.predict internally, not model.evaluate
      expect(mockModel.predict).toHaveBeenCalled();
    });

    it('should handle evaluation with single data point', async () => {
      const singleData = [mockTrainingData[0]];
      const metrics = await modelTrainer.evaluate(mockModel, singleData);
      
      expect(metrics).toBeDefined();
      expect(mockModel.predict).toHaveBeenCalled();
    });

    it('should handle evaluation with empty data', async () => {
      // Empty data should be handled gracefully by creating empty tensors
      const metrics = await modelTrainer.evaluate(mockModel, []);
      expect(metrics).toBeDefined();
      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('mse');
    });

    it('should handle evaluation errors gracefully', async () => {
      // Mock model.predict to throw an error
      mockModel.predict.mockImplementation(() => {
        throw new Error('Prediction failed');
      });
      
      await expect(modelTrainer.evaluate(mockModel, mockTrainingData)).rejects.toThrow('Prediction failed');
    });
  });

  describe('Data Preprocessing', () => {
    it('should preprocess training data correctly', async () => {
      const preprocessedData = modelTrainer.preprocessTrainingData(mockTrainingData);
      
      expect(preprocessedData).toBeDefined();
      expect(preprocessedData.features).toBeDefined();
      expect(preprocessedData.labels).toBeDefined();
    });

    it('should handle feature scaling', () => {
      const scaledFeatures = modelTrainer.scaleFeatures(mockTrainingData[0].features);
      
      expect(scaledFeatures).toBeDefined();
      expect(Array.isArray(scaledFeatures)).toBe(true);
    });
  });

  describe('Model Validation', () => {
    it('should validate model before training', () => {
      const isValid = modelTrainer.validateModel(mockModel);
      expect(isValid).toBe(true);
    });

    it('should validate training data', () => {
      const isValid = modelTrainer.validateTrainingData(mockTrainingData);
      expect(isValid).toBe(true);
    });

    it('should reject invalid training data', () => {
      const invalidData = [
        { ...mockTrainingData[0], features: null as any }
      ];
      
      const isValid = modelTrainer.validateTrainingData(invalidData);
      expect(isValid).toBe(false);
    });
  });

  describe('Performance Metrics', () => {
    it('should calculate F1 score correctly', () => {
      const precision = 0.8;
      const recall = 0.8;
      
      const f1Score = modelTrainer.calculateF1Score(precision, recall);
      expect(f1Score).toBeCloseTo(0.8, 1); // Harmonic mean of precision and recall
    });

    it('should calculate MSE correctly', () => {
      const predictions = [0.8, 0.9, 0.7];
      const actuals = [0.8, 0.9, 0.7];
      
      const mse = modelTrainer.calculateMSE(predictions, actuals);
      expect(mse).toBe(0); // Perfect match
    });
  });

  describe('Cross Validation', () => {
    it('should perform k-fold cross validation', async () => {
      const cvMetrics = await modelTrainer.crossValidate(mockModel, mockTrainingData, 2);
      
      expect(cvMetrics).toBeDefined();
      expect(cvMetrics).toHaveProperty('meanAccuracy');
      expect(cvMetrics).toHaveProperty('stdAccuracy');
      expect(cvMetrics).toHaveProperty('meanPrecision');
      expect(cvMetrics).toHaveProperty('meanRecall');
      expect(cvMetrics).toHaveProperty('meanF1Score');
      expect(cvMetrics).toHaveProperty('meanMSE');
    });

    it('should handle cross validation with insufficient data', async () => {
      const singleData = [mockTrainingData[0]];
      
      await expect(modelTrainer.crossValidate(mockModel, singleData, 2)).rejects.toThrow();
    });
  });

  describe('Hyperparameter Tuning', () => {
    it('should suggest hyperparameter improvements', () => {
      const suggestions = modelTrainer.suggestHyperparameters(mockTrainingData);
      
      expect(suggestions).toBeDefined();
      expect(suggestions).toHaveProperty('learningRate');
      expect(suggestions).toHaveProperty('batchSize');
      expect(suggestions).toHaveProperty('epochs');
    });

    it('should analyze training history for insights', () => {
      const history = {
        loss: [0.5, 0.3, 0.2],
        accuracy: [0.7, 0.8, 0.85],
        val_loss: [0.6, 0.4, 0.25],
        val_accuracy: [0.65, 0.75, 0.8]
      };
      
      const insights = modelTrainer.analyzeTrainingHistory(history);
      
      expect(insights).toBeDefined();
      expect(insights).toHaveProperty('overfitting');
      expect(insights).toHaveProperty('convergence');
      expect(insights).toHaveProperty('recommendations');
    });
  });

  describe('Model Persistence', () => {
    it('should save model checkpoints', async () => {
      const checkpointPath = await modelTrainer.saveCheckpoint(mockModel, 'test-checkpoint');
      
      expect(checkpointPath).toBeDefined();
      expect(mockModel.save).toHaveBeenCalled();
    });

    it('should load model checkpoints', async () => {
      const loadedModel = await modelTrainer.loadCheckpoint('test-checkpoint');
      
      expect(loadedModel).toBeDefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle null model gracefully', async () => {
      await expect(modelTrainer.train(null as any, mockTrainingData)).rejects.toThrow();
    });

    it('should handle model without required methods', async () => {
      const invalidModel = { fit: null, evaluate: null };
      
      await expect(modelTrainer.train(invalidModel as any, mockTrainingData)).rejects.toThrow();
    });

    it('should handle training data with missing features', async () => {
      const invalidData = [
        { ...mockTrainingData[0], features: { config: null, usage: null, performance: null, context: null } }
      ];
      
      await expect(modelTrainer.train(mockModel, invalidData as any)).rejects.toThrow();
    });

    it('should handle training data with missing labels', async () => {
      const invalidData = [
        { ...mockTrainingData[0], labels: null }
      ];
      
      await expect(modelTrainer.train(mockModel, invalidData as any)).rejects.toThrow();
    });
  });

  describe('Configuration Validation', () => {
    it('should validate training configuration', () => {
      const isValid = modelTrainer.validateTrainingConfig(mockConfig.training);
      expect(isValid).toBe(true);
    });

    it('should reject invalid training configuration', () => {
      const invalidConfig = {
        ...mockConfig.training,
        epochs: -1,
        batchSize: 0,
        learningRate: 0
      };
      
      const isValid = modelTrainer.validateTrainingConfig(invalidConfig);
      expect(isValid).toBe(false);
    });
  });
});
