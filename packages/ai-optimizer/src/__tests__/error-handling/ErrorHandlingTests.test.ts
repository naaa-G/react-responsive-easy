/**
 * Enterprise-grade error handling tests for AI Optimizer
 * 
 * Tests comprehensive error scenarios, edge cases, and recovery mechanisms
 * to ensure robust error handling in production environments.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AIOptimizer, createAIOptimizer, optimizeConfiguration } from '../../index.js';
import { testDataFactory } from '../factories/TestDataFactory.js';
import type { ComponentUsageData, AIModelConfig } from '../../types/index.js';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

describe('AI Optimizer Error Handling Tests', () => {
  let optimizer: AIOptimizer;
  let validConfig: ResponsiveConfig;
  let validUsageData: ComponentUsageData[];

  beforeEach(async () => {
    testDataFactory.setSeed(12345);
    validConfig = testDataFactory.createResponsiveConfig();
    validUsageData = testDataFactory.createComponentUsageDataArray(5);
    
    optimizer = new AIOptimizer();
    await optimizer.initialize();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Input Validation Errors', () => {
    it('should handle null configuration gracefully', async () => {
      await expect(optimizer.optimizeScaling(null as any, validUsageData))
        .rejects.toThrow('Configuration is required for optimization');
    });

    it('should handle undefined configuration gracefully', async () => {
      await expect(optimizer.optimizeScaling(undefined as any, validUsageData))
        .rejects.toThrow('Configuration is required for optimization');
    });

    it('should handle null usage data gracefully', async () => {
      await expect(optimizer.optimizeScaling(validConfig, null as any))
        .rejects.toThrow('Usage data is required and must be a non-empty array');
    });

    it('should handle undefined usage data gracefully', async () => {
      await expect(optimizer.optimizeScaling(validConfig, undefined as any))
        .rejects.toThrow('Usage data is required and must be a non-empty array');
    });

    it('should handle empty usage data array gracefully', async () => {
      await expect(optimizer.optimizeScaling(validConfig, []))
        .rejects.toThrow('Usage data is required and must be a non-empty array');
    });

    it('should handle non-array usage data gracefully', async () => {
      await expect(optimizer.optimizeScaling(validConfig, 'invalid' as any))
        .rejects.toThrow('Usage data is required and must be a non-empty array');
    });
  });

  describe('Configuration Structure Errors', () => {
    it('should handle missing strategy in configuration', async () => {
      const invalidConfig = { ...validConfig };
      delete (invalidConfig as any).strategy;
      
      await expect(optimizer.optimizeScaling(invalidConfig, validUsageData))
        .rejects.toThrow();
    });

    it('should handle missing breakpoints in configuration', async () => {
      const invalidConfig = { ...validConfig };
      delete (invalidConfig as any).breakpoints;
      
      await expect(optimizer.optimizeScaling(invalidConfig, validUsageData))
        .rejects.toThrow();
    });

    it('should handle missing base configuration', async () => {
      const invalidConfig = { ...validConfig };
      delete (invalidConfig as any).base;
      
      // Should handle gracefully with default values
      const result = await optimizer.optimizeScaling(invalidConfig, validUsageData);
      expect(result).toBeDefined();
      expect(result.suggestedTokens).toBeDefined();
      expect(result.scalingCurveRecommendations).toBeDefined();
      expect(result.performanceImpacts).toBeDefined();
      expect(result.estimatedImprovements).toBeDefined();
    });

    it('should handle invalid breakpoint structure', async () => {
      const invalidConfig = {
        ...validConfig,
        breakpoints: [
          { name: 'mobile', width: 'invalid', height: 667, alias: 'mobile' } as any
        ]
      };
      
      // Invalid breakpoint structure should be handled gracefully
      const result = await optimizer.optimizeScaling(invalidConfig, validUsageData);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('suggestedTokens');
      expect(result).toHaveProperty('confidenceScore');
    });

    it('should handle missing token configuration', async () => {
      const invalidConfig = {
        ...validConfig,
        strategy: {
          ...validConfig.strategy,
          tokens: {}
        }
      };
      
      const suggestions = await optimizer.optimizeScaling(invalidConfig, validUsageData);
      expect(suggestions).toBeDefined();
    });
  });

  describe('Usage Data Structure Errors', () => {
    it('should handle malformed component usage data', async () => {
      const malformedData = [
        { ...validUsageData[0], responsiveValues: null as any }
      ];
      
      await expect(optimizer.optimizeScaling(validConfig, malformedData))
        .rejects.toThrow();
    });

    it('should handle missing component ID', async () => {
      const malformedData = [
        { ...validUsageData[0], componentId: undefined as any }
      ];
      
      // Missing component ID should be handled gracefully
      const result = await optimizer.optimizeScaling(validConfig, malformedData);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('suggestedTokens');
      expect(result).toHaveProperty('confidenceScore');
    });

    it('should handle missing component type', async () => {
      const malformedData = [
        { ...validUsageData[0], componentType: undefined as any }
      ];
      
      // Missing component type should be handled gracefully
      const result = await optimizer.optimizeScaling(validConfig, malformedData);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('suggestedTokens');
      expect(result).toHaveProperty('confidenceScore');
    });

    it('should handle invalid performance metrics', async () => {
      const malformedData = [
        {
          ...validUsageData[0],
          performance: {
            renderTime: -1,
            layoutShift: -0.1,
            memoryUsage: -100,
            bundleSize: -50
          }
        }
      ];
      
      const suggestions = await optimizer.optimizeScaling(validConfig, malformedData);
      expect(suggestions).toBeDefined();
    });

    it('should handle invalid interaction data', async () => {
      const malformedData = [
        {
          ...validUsageData[0],
          interactions: {
            interactionRate: 1.5, // Invalid: should be 0-1
            viewTime: -1000, // Invalid: negative time
            scrollBehavior: 'invalid' as any,
            accessibilityScore: 150 // Invalid: should be 0-100
          }
        }
      ];
      
      const suggestions = await optimizer.optimizeScaling(validConfig, malformedData);
      expect(suggestions).toBeDefined();
    });

    it('should handle missing context data', async () => {
      const malformedData = [
        { ...validUsageData[0], context: null as any }
      ];
      
      // Should handle gracefully with default context values
      const result = await optimizer.optimizeScaling(validConfig, malformedData);
      expect(result).toBeDefined();
      expect(result.suggestedTokens).toBeDefined();
      expect(result.scalingCurveRecommendations).toBeDefined();
      expect(result.performanceImpacts).toBeDefined();
      expect(result.estimatedImprovements).toBeDefined();
    });
  });

  describe('Model Initialization Errors', () => {
    // These tests need their own isolated setup since they test initialization failures
    let isolatedConfig: ResponsiveConfig;
    let isolatedUsageData: ComponentUsageData[];

    beforeEach(() => {
      // Don't use the global optimizer here - each test will handle its own initialization
      testDataFactory.setSeed(12345);
      isolatedConfig = testDataFactory.createResponsiveConfig();
      isolatedUsageData = testDataFactory.createComponentUsageDataArray(5);
    });
    it('should handle initialization failure gracefully', async () => {
      // Mock TensorFlow to throw an error during initialization
      const mockTf = await import('@tensorflow/tfjs');
      const spy = vi.spyOn(mockTf, 'sequential').mockImplementation(() => {
        throw new Error('TensorFlow initialization failed');
      });

      const newOptimizer = new AIOptimizer();
      await expect(newOptimizer.initialize()).rejects.toThrow('AI Optimizer initialization failed');
      
      // Clean up the spy to prevent interference with other tests
      spy.mockRestore();
    });

    it('should handle model loading failure gracefully', async () => {
      const newOptimizer = new AIOptimizer();
      // Model loading should be handled gracefully, not throw errors
      const result = await newOptimizer.initialize('invalid-model-path');
      expect(result).toBeUndefined(); // initialize method returns void
    });

    it('should prevent operations on uninitialized optimizer', async () => {
      const uninitializedOptimizer = new AIOptimizer();
      
      await expect(
        uninitializedOptimizer.optimizeScaling(isolatedConfig, isolatedUsageData)
      ).rejects.toThrow('AI Optimizer not initialized');
    });
  });

  describe('Training Data Errors', () => {
    // These tests need their own isolated setup to avoid initialization conflicts
    let isolatedOptimizer: AIOptimizer;

    beforeEach(async () => {
      isolatedOptimizer = new AIOptimizer();
      await isolatedOptimizer.initialize();
    });
    it('should handle empty training data', async () => {
      // Empty training data should be handled gracefully
      const result = await isolatedOptimizer.trainModel([]);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accuracy');
      expect(result).toHaveProperty('mse');
    });

    it('should handle null training data', async () => {
      await expect(isolatedOptimizer.trainModel(null as any)).rejects.toThrow();
    });

    it('should handle malformed training data', async () => {
      const malformedTrainingData = [
        { ...testDataFactory.createTrainingData(), features: null as any }
      ];
      
      await expect(isolatedOptimizer.trainModel(malformedTrainingData)).rejects.toThrow();
    });

    it('should handle training data with missing labels', async () => {
      const malformedTrainingData = [
        { ...testDataFactory.createTrainingData(), labels: null as any }
      ];
      
      await expect(isolatedOptimizer.trainModel(malformedTrainingData)).rejects.toThrow();
    });

    it('should handle training data with invalid features', async () => {
      const malformedTrainingData = [
        {
          ...testDataFactory.createTrainingData(),
          features: {
            config: null,
            usage: null,
            performance: null,
            context: null
          }
        }
      ];
      
      await expect(isolatedOptimizer.trainModel(malformedTrainingData)).rejects.toThrow();
    });
  });

  describe('Model Persistence Errors', () => {
    it('should handle model save failure gracefully', async () => {
      // Mock model save to throw error
      const mockModel = (optimizer as any).model;
      vi.spyOn(mockModel, 'save').mockRejectedValue(new Error('Save failed'));

      await expect(optimizer.saveModel('./invalid-path')).rejects.toThrow('Model save failed');
    });

    it('should handle save on uninitialized model', async () => {
      const uninitializedOptimizer = new AIOptimizer();
      
      await expect(uninitializedOptimizer.saveModel('./test-path')).rejects.toThrow('No model to save');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle extreme values in usage data', async () => {
      const extremeData = [testDataFactory.createEdgeCaseScenarios().extremeValues];
      
      const suggestions = await optimizer.optimizeScaling(validConfig, extremeData);
      expect(suggestions).toBeDefined();
      expect(suggestions.confidenceScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle minimal configuration', async () => {
      const minimalConfig = testDataFactory.createEdgeCaseScenarios().minimalConfig;
      const minimalData = testDataFactory.createComponentUsageDataArray(1);
      
      const suggestions = await optimizer.optimizeScaling(minimalConfig, minimalData);
      expect(suggestions).toBeDefined();
    });

    it('should handle very large datasets', async () => {
      const largeDataset = testDataFactory.createComponentUsageDataArray(10000);
      
      const suggestions = await optimizer.optimizeScaling(validConfig, largeDataset);
      expect(suggestions).toBeDefined();
    });

    it('should handle very small datasets', async () => {
      const smallDataset = testDataFactory.createComponentUsageDataArray(1);
      
      const suggestions = await optimizer.optimizeScaling(validConfig, smallDataset);
      expect(suggestions).toBeDefined();
    });

    it('should handle zero values in performance metrics', async () => {
      const zeroPerformanceData = [
        {
          ...validUsageData[0],
          performance: {
            renderTime: 0,
            layoutShift: 0,
            memoryUsage: 0,
            bundleSize: 0
          }
        }
      ];
      
      const suggestions = await optimizer.optimizeScaling(validConfig, zeroPerformanceData);
      expect(suggestions).toBeDefined();
    });

    it('should handle very high values in performance metrics', async () => {
      const highPerformanceData = [
        {
          ...validUsageData[0],
          performance: {
            renderTime: 10000,
            layoutShift: 1.0,
            memoryUsage: 1000000,
            bundleSize: 1000000
          }
        }
      ];
      
      const suggestions = await optimizer.optimizeScaling(validConfig, highPerformanceData);
      expect(suggestions).toBeDefined();
    });
  });

  describe('Concurrent Operation Errors', () => {
    it('should handle concurrent optimization requests gracefully', async () => {
      const promises = Array.from({ length: 5 }, () => 
        optimizer.optimizeScaling(validConfig, validUsageData)
      );
      
      const results = await Promise.allSettled(promises);
      
      // All operations should complete (either success or failure)
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.status).toBe('fulfilled');
      });
    });

    it('should handle concurrent training requests gracefully', async () => {
      const trainingData = testDataFactory.createTrainingDataArray(10);
      
      const promises = Array.from({ length: 3 }, () => 
        optimizer.trainModel(trainingData)
      );
      
      const results = await Promise.allSettled(promises);
      
      // At least one should succeed
      const successfulResults = results.filter(r => r.status === 'fulfilled');
      expect(successfulResults.length).toBeGreaterThan(0);
    });
  });

  describe('Memory and Resource Errors', () => {
    it('should handle memory pressure gracefully', async () => {
      // Simulate memory pressure by creating many large datasets
      const largeDatasets = Array.from({ length: 10 }, () => 
        testDataFactory.createComponentUsageDataArray(1000)
      );
      
      const promises = largeDatasets.map(dataset => 
        optimizer.optimizeScaling(validConfig, dataset)
      );
      
      const results = await Promise.allSettled(promises);
      
      // Most operations should complete successfully
      const successfulResults = results.filter(r => r.status === 'fulfilled');
      expect(successfulResults.length).toBeGreaterThan(5);
    });

    it('should handle resource cleanup during errors', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      try {
        // Attempt operations that will fail
        await optimizer.optimizeScaling(null as any, validUsageData);
      } catch (error) {
        // Expected to fail
      }
      
      // Force garbage collection
      if ((global as any).gc) {
        (global as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Factory Function Error Handling', () => {
    it('should handle createAIOptimizer with invalid config', async () => {
      const invalidConfig = {
        training: {
          epochs: -1, // Invalid
          batchSize: 0, // Invalid
          learningRate: 0, // Invalid
          validationSplit: 1.5 // Invalid
        }
      } as any;
      
      // Invalid config should be handled gracefully, not throw errors
      const result = await createAIOptimizer(invalidConfig);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(AIOptimizer);
    });

    it('should handle optimizeConfiguration with invalid inputs', async () => {
      await expect(optimizeConfiguration(null as any, validUsageData))
        .rejects.toThrow();
      
      await expect(optimizeConfiguration(validConfig, null as any))
        .rejects.toThrow();
    });
  });

  describe('Recovery and Resilience', () => {
    it('should recover from temporary failures', async () => {
      // First, cause a failure
      try {
        await optimizer.optimizeScaling(null as any, validUsageData);
      } catch (error) {
        // Expected to fail
      }
      
      // Then, successful operation should work
      const suggestions = await optimizer.optimizeScaling(validConfig, validUsageData);
      expect(suggestions).toBeDefined();
    });

    it('should maintain state consistency after errors', async () => {
      const modelInfoBefore = optimizer.getModelInfo();
      
      try {
        await optimizer.optimizeScaling(null as any, validUsageData);
      } catch (error) {
        // Expected to fail
      }
      
      const modelInfoAfter = optimizer.getModelInfo();
      
      // Model state should remain consistent
      expect(modelInfoAfter.isInitialized).toBe(modelInfoBefore.isInitialized);
      expect(modelInfoAfter.architecture).toBe(modelInfoBefore.architecture);
    });

    it('should handle partial failures gracefully', async () => {
      const mixedData = [
        validUsageData[0], // Valid
        { ...validUsageData[1], responsiveValues: null as any }, // Invalid
        validUsageData[2] // Valid
      ];
      
      await expect(optimizer.optimizeScaling(validConfig, mixedData))
        .rejects.toThrow();
    });
  });
});
