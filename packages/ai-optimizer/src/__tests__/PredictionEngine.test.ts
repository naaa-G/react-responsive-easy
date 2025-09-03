import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PredictionEngine } from '../engine/PredictionEngine.js';

// Use global TensorFlow.js mock from setup.ts

describe('PredictionEngine', () => {
  let predictionEngine: PredictionEngine;
  let mockModel: any;
  let mockFeatures: any;

  beforeEach(() => {
    predictionEngine = new PredictionEngine();
    vi.clearAllMocks();
    
    // Reset mock model for each test
    mockModel = {
      predict: vi.fn().mockReturnValue({
        data: vi.fn().mockResolvedValue(new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5])),
        dispose: vi.fn(),
        shape: [1, 5]
      }),
      evaluate: vi.fn().mockResolvedValue([0.25, 0.8]), // [loss, accuracy]
      save: vi.fn().mockResolvedValue({}),
      countParams: vi.fn().mockReturnValue(100000),
      layers: { length: 5 }
    };

    mockFeatures = {
      data: vi.fn().mockResolvedValue(new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5])),
      dispose: vi.fn(),
      shape: [1, 5]
    };
  });

  describe('Constructor', () => {
    it('should create PredictionEngine instance', () => {
      expect(predictionEngine).toBeInstanceOf(PredictionEngine);
      expect(predictionEngine).toBeDefined();
    });
  });

  describe('Basic Prediction', () => {
    it('should generate predictions successfully', async () => {
      const predictions = await predictionEngine.predict(mockModel as any, mockFeatures as any);
      
      expect(predictions).toBeDefined();
      expect(mockModel.predict).toHaveBeenCalled();
    });

    it('should handle prediction errors gracefully', async () => {
      mockModel.predict.mockImplementation(() => {
        throw new Error('Prediction failed');
      });
      
      await expect(predictionEngine.predict(mockModel as any, mockFeatures as any)).rejects.toThrow('Prediction failed');
    });
  });

  describe('Batch Prediction', () => {
    it('should handle batch predictions', async () => {
      const batchFeatures = {
        data: vi.fn().mockResolvedValue(new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5])),
        dispose: vi.fn(),
        shape: [2, 5]
      };
      
      const batchPredictions = await predictionEngine.predictBatch(mockModel as any, batchFeatures as any);
      
      expect(batchPredictions).toBeDefined();
      expect(mockModel.predict).toHaveBeenCalled();
    });

    it('should handle batch prediction errors gracefully', async () => {
      mockModel.predict.mockImplementation(() => {
        throw new Error('Batch prediction failed');
      });
      
      const batchFeatures = {
        data: vi.fn().mockResolvedValue(new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5])),
        dispose: vi.fn(),
        shape: [2, 5]
      };
      
      await expect(predictionEngine.predictBatch(mockModel as any, batchFeatures as any)).rejects.toThrow('Batch prediction failed');
    });
  });

  describe('Prediction Confidence', () => {
    it('should calculate prediction confidence', async () => {
      const confidence = await predictionEngine.getPredictionConfidence(mockModel as any, mockFeatures as any);
      
      expect(confidence).toBeDefined();
      expect(confidence).toHaveProperty('mean');
      expect(confidence).toHaveProperty('variance');
      expect(confidence).toHaveProperty('confidence');
      expect(typeof confidence.confidence).toBe('number');
      expect(confidence.confidence).toBeGreaterThanOrEqual(0);
      expect(confidence.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle confidence calculation errors gracefully', async () => {
      mockModel.predict.mockImplementation(() => {
        throw new Error('Confidence calculation failed');
      });
      
      await expect(predictionEngine.getPredictionConfidence(mockModel as any, mockFeatures as any)).rejects.toThrow('Confidence calculation failed');
    });
  });

  describe('Prediction Explanation', () => {
    it('should explain predictions using feature importance', async () => {
      const featureNames = ['breakpointCount', 'tokenComplexity', 'originDistribution'];
      const explanation = await predictionEngine.explainPrediction(mockModel as any, mockFeatures as any, featureNames);
      
      expect(explanation).toBeDefined();
      expect(explanation).toHaveProperty('featureImportance');
      expect(explanation).toHaveProperty('topFeatures');
      expect(Array.isArray(explanation.topFeatures)).toBe(true);
    });

    it('should handle explanation errors gracefully', async () => {
      // Test with invalid model (missing predict method)
      const invalidModel = {};
      
      const featureNames = ['breakpointCount', 'tokenComplexity'];
      await expect(predictionEngine.explainPrediction(invalidModel as any, mockFeatures as any, featureNames)).rejects.toThrow('Invalid model: missing predict method');
    });
  });

  describe('Prediction Validation', () => {
    it('should validate prediction quality', async () => {
      const prediction = {
        data: vi.fn().mockResolvedValue(new Float32Array([0.1, 0.2, 0.3])),
        dispose: vi.fn(),
        shape: [1, 3]
      };
      
      const expectedRanges: Record<string, [number, number]> = {
        'param1': [0, 1],
        'param2': [0, 1],
        'param3': [0, 1]
      };
      
      const validation = await predictionEngine.validatePrediction(prediction as any, expectedRanges);
      
      expect(validation).toBeDefined();
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('violations');
      expect(validation).toHaveProperty('confidence');
      expect(typeof validation.isValid).toBe('boolean');
      expect(Array.isArray(validation.violations)).toBe(true);
      expect(typeof validation.confidence).toBe('number');
    });

    it('should handle validation errors gracefully', async () => {
      const invalidPrediction = {
        data: vi.fn().mockRejectedValue(new Error('Data access failed')),
        dispose: vi.fn(),
        shape: [1, 3]
      };
      
      const expectedRanges: Record<string, [number, number]> = { 'param1': [0, 1] };
      
      await expect(predictionEngine.validatePrediction(invalidPrediction as any, expectedRanges)).rejects.toThrow('Prediction validation failed');
    });
  });

  describe('Post-processing', () => {
    it('should post-process predictions with constraints', async () => {
      const predictions = {
        data: vi.fn().mockResolvedValue(new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2])),
        dispose: vi.fn(),
        shape: [1, 32]
      };
      
      const constraints = {
        tokenConstraints: {
          'fontSize': { min: 12, max: 72, step: 1 },
          'spacing': { min: 4, max: 128, step: 4 },
          'radius': { min: 0, max: 24, step: 2 },
          'lineHeight': { min: 1, max: 2, step: 0.1 },
          'shadow': { min: 0, max: 24, step: 1 },
          'border': { min: 0, max: 8, step: 1 }
        },
        performanceConstraints: [
          { min: 0, max: 1 },
          { min: 0, max: 1 }
        ]
      };
      
      const processedPredictions = await predictionEngine.postProcessPredictions(predictions as any, constraints);
      
      expect(processedPredictions).toBeDefined();
    });

    it('should handle post-processing errors gracefully', async () => {
      const invalidPredictions = {
        data: vi.fn().mockRejectedValue(new Error('Data access failed')),
        dispose: vi.fn(),
        shape: [1, 32]
      };
      
      const constraints = {
        tokenConstraints: { 'fontSize': { min: 12, max: 72 } },
        performanceConstraints: [{ min: 0, max: 1 }]
      };
      
      await expect(predictionEngine.postProcessPredictions(invalidPredictions as any, constraints)).rejects.toThrow('Post-processing failed');
    });
  });

  describe('Performance and Memory', () => {
    it('should complete predictions within reasonable time', async () => {
      const startTime = performance.now();
      await predictionEngine.predict(mockModel as any, mockFeatures as any);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle memory efficiently', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Make multiple predictions
      for (let i = 0; i < 3; i++) {
        await predictionEngine.predict(mockModel as any, mockFeatures as any);
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });
});
