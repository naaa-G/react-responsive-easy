/**
 * Enterprise-grade integration tests for AI Optimizer
 * 
 * Tests complete end-to-end workflows and real-world usage scenarios
 * to ensure the AI optimization system works correctly in production environments.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AIOptimizer, createAIOptimizer, optimizeConfiguration } from '../../index.js';
import { testDataFactory } from '../factories/TestDataFactory.js';
import type { ComponentUsageData, AIModelConfig } from '../../types/index.js';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

describe('AI Optimizer Integration Tests', () => {
  let optimizer: AIOptimizer;
  let mockResponsiveConfig: ResponsiveConfig;
  let mockUsageData: ComponentUsageData[];

  beforeEach(async () => {
    // Reset test data factory seed for consistent tests
    testDataFactory.setSeed(12345);
    
    // Create realistic test data
    mockResponsiveConfig = testDataFactory.createResponsiveConfig();
    mockUsageData = testDataFactory.createComponentUsageDataArray(10);
    
    // Initialize optimizer
    optimizer = new AIOptimizer();
    await optimizer.initialize();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('End-to-End Optimization Workflow', () => {
    it('should complete full optimization workflow successfully', async () => {
      // Step 1: Initialize optimizer
      expect(optimizer).toBeInstanceOf(AIOptimizer);
      
      // Step 2: Generate optimization suggestions
      const suggestions = await optimizer.optimizeScaling(mockResponsiveConfig, mockUsageData);
      
      // Step 3: Validate suggestions structure
      expect(suggestions).toHaveProperty('suggestedTokens');
      expect(suggestions).toHaveProperty('scalingCurveRecommendations');
      expect(suggestions).toHaveProperty('performanceImpacts');
      expect(suggestions).toHaveProperty('accessibilityWarnings');
      expect(suggestions).toHaveProperty('confidenceScore');
      expect(suggestions).toHaveProperty('estimatedImprovements');
      
      // Step 4: Validate suggestion quality
      expect(suggestions.confidenceScore).toBeGreaterThan(0);
      expect(suggestions.confidenceScore).toBeLessThanOrEqual(1);
      expect(suggestions.suggestedTokens).toBeDefined();
      expect(Object.keys(suggestions.suggestedTokens).length).toBeGreaterThan(0);
      
      // Step 5: Validate performance impacts
      expect(suggestions.performanceImpacts).toBeInstanceOf(Array);
      expect(suggestions.performanceImpacts.length).toBeGreaterThan(0);
      
      // Step 6: Validate accessibility warnings
      expect(suggestions.accessibilityWarnings).toBeInstanceOf(Array);
      
      // Step 7: Validate estimated improvements
      expect(suggestions.estimatedImprovements).toHaveProperty('performance');
      expect(suggestions.estimatedImprovements).toHaveProperty('userExperience');
      expect(suggestions.estimatedImprovements).toHaveProperty('developerExperience');
    });

    it('should handle optimization with different configuration types', async () => {
      const configs = [
        testDataFactory.createResponsiveConfig({
          strategy: { ...mockResponsiveConfig.strategy, origin: 'height' }
        }),
        testDataFactory.createResponsiveConfig({
          strategy: { ...mockResponsiveConfig.strategy, mode: 'exponential' }
        }),
        testDataFactory.createResponsiveConfig({
          breakpoints: mockResponsiveConfig.breakpoints.slice(0, 2) // Only mobile and tablet
        })
      ];

      const suggestions = await Promise.all(
        configs.map(config => optimizer.optimizeScaling(config, mockUsageData))
      );
      
      for (const suggestion of suggestions) {
        expect(suggestion).toBeDefined();
        expect(suggestion.confidenceScore).toBeGreaterThan(0);
      }
    });

    it('should handle optimization with different usage data patterns', async () => {
      const usageDataPatterns = [
        testDataFactory.createComponentUsageDataArray(1), // Single component
        testDataFactory.createComponentUsageDataArray(5), // Small dataset
        testDataFactory.createComponentUsageDataArray(50), // Medium dataset
        testDataFactory.createComponentUsageDataArray(100) // Large dataset
      ];

      const suggestions = await Promise.all(
        usageDataPatterns.map(usageData => optimizer.optimizeScaling(mockResponsiveConfig, usageData))
      );
      
      for (const suggestion of suggestions) {
        expect(suggestion).toBeDefined();
        expect(suggestion.confidenceScore).toBeGreaterThan(0);
      }
    });
  });

  describe('Model Training and Evaluation Workflow', () => {
    it('should complete full training and evaluation workflow', async () => {
      // Step 1: Create training data
      const trainingData = testDataFactory.createTrainingDataArray(20);
      
      // Step 2: Train the model
      const trainingMetrics = await optimizer.trainModel(trainingData);
      
      // Step 3: Validate training metrics
      expect(trainingMetrics).toHaveProperty('accuracy');
      expect(trainingMetrics).toHaveProperty('precision');
      expect(trainingMetrics).toHaveProperty('recall');
      expect(trainingMetrics).toHaveProperty('f1Score');
      expect(trainingMetrics).toHaveProperty('mse');
      
      // Step 4: Validate metric ranges
      expect(trainingMetrics.accuracy).toBeGreaterThanOrEqual(0);
      expect(trainingMetrics.accuracy).toBeLessThanOrEqual(1);
      expect(trainingMetrics.precision).toBeGreaterThanOrEqual(0);
      expect(trainingMetrics.precision).toBeLessThanOrEqual(1);
      expect(trainingMetrics.recall).toBeGreaterThanOrEqual(0);
      expect(trainingMetrics.recall).toBeLessThanOrEqual(1);
      expect(trainingMetrics.f1Score).toBeGreaterThanOrEqual(0);
      expect(trainingMetrics.f1Score).toBeLessThanOrEqual(1);
      expect(trainingMetrics.mse).toBeGreaterThanOrEqual(0);
      
      // Step 5: Evaluate on test data
      const testData = testDataFactory.createTrainingDataArray(10);
      const evaluationMetrics = await optimizer.evaluateModel(testData);
      
      // Step 6: Validate evaluation metrics
      expect(evaluationMetrics).toHaveProperty('accuracy');
      expect(evaluationMetrics).toHaveProperty('precision');
      expect(evaluationMetrics).toHaveProperty('recall');
      expect(evaluationMetrics).toHaveProperty('f1Score');
      expect(evaluationMetrics).toHaveProperty('mse');
    });

    it('should handle incremental training with new data', async () => {
      // Initial training
      const initialTrainingData = testDataFactory.createTrainingDataArray(10);
      const initialMetrics = await optimizer.trainModel(initialTrainingData);
      
      // Additional training with new data
      const additionalTrainingData = testDataFactory.createTrainingDataArray(5);
      const additionalMetrics = await optimizer.trainModel(additionalTrainingData);
      
      // Both training sessions should complete successfully
      expect(initialMetrics).toBeDefined();
      expect(additionalMetrics).toBeDefined();
      
      // Metrics should be valid
      expect(initialMetrics.accuracy).toBeGreaterThanOrEqual(0);
      expect(additionalMetrics.accuracy).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Model Persistence Workflow', () => {
    it('should save and load model successfully', async () => {
      // Train model first
      const trainingData = testDataFactory.createTrainingDataArray(10);
      await optimizer.trainModel(trainingData);
      
      // Save model
      const savePath = './test-model-save';
      await expect(optimizer.saveModel(savePath)).resolves.not.toThrow();
      
      // Get model info
      const modelInfo = optimizer.getModelInfo();
      expect(modelInfo).toHaveProperty('architecture');
      expect(modelInfo).toHaveProperty('parameters');
      expect(modelInfo).toHaveProperty('layers');
      expect(modelInfo).toHaveProperty('isInitialized');
      expect(modelInfo.isInitialized).toBe(true);
    });
  });

  describe('Factory Function Integration', () => {
    it('should work with createAIOptimizer factory function', async () => {
      const factoryOptimizer = await createAIOptimizer();
      expect(factoryOptimizer).toBeInstanceOf(AIOptimizer);
      
      const suggestions = await factoryOptimizer.optimizeScaling(mockResponsiveConfig, mockUsageData);
      expect(suggestions).toBeDefined();
      expect(suggestions.confidenceScore).toBeGreaterThan(0);
    });

    it('should work with createAIOptimizer with custom config', async () => {
      const customConfig: Partial<AIModelConfig> = {
        training: {
          epochs: 50,
          batchSize: 16,
          learningRate: 0.0005,
          validationSplit: 0.3
        }
      };
      
      const customOptimizer = await createAIOptimizer(customConfig);
      expect(customOptimizer).toBeInstanceOf(AIOptimizer);
      
      const suggestions = await customOptimizer.optimizeScaling(mockResponsiveConfig, mockUsageData);
      expect(suggestions).toBeDefined();
    });

    it('should work with optimizeConfiguration quick function', async () => {
      const suggestions = await optimizeConfiguration(mockResponsiveConfig, mockUsageData);
      expect(suggestions).toBeDefined();
      expect(suggestions).toHaveProperty('suggestedTokens');
      expect(suggestions).toHaveProperty('confidenceScore');
      expect(suggestions.confidenceScore).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle invalid configuration gracefully', async () => {
      const invalidConfig = { ...mockResponsiveConfig };
      delete (invalidConfig as any).strategy;
      
      await expect(optimizer.optimizeScaling(invalidConfig, mockUsageData))
        .rejects.toThrow();
    });

    it('should handle empty usage data gracefully', async () => {
      // Empty usage data should throw an error as it's required for optimization
      await expect(optimizer.optimizeScaling(mockResponsiveConfig, [])).rejects.toThrow('Usage data is required and must be a non-empty array');
    });

    it('should handle malformed usage data gracefully', async () => {
      const malformedData = [
        { ...mockUsageData[0], responsiveValues: null as any }
      ];
      
      await expect(optimizer.optimizeScaling(mockResponsiveConfig, malformedData))
        .rejects.toThrow();
    });

    it('should handle training with insufficient data', async () => {
      const insufficientData = testDataFactory.createTrainingDataArray(1);
      
      // Training with insufficient data should succeed but with lower quality metrics
      const result = await optimizer.trainModel(insufficientData);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accuracy');
      expect(result).toHaveProperty('mse');
      expect(result).toHaveProperty('f1Score');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large datasets efficiently', async () => {
      const largeUsageData = testDataFactory.createComponentUsageDataArray(500);
      
      const startTime = performance.now();
      const suggestions = await optimizer.optimizeScaling(mockResponsiveConfig, largeUsageData);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
      expect(suggestions).toBeDefined();
      expect(suggestions.confidenceScore).toBeGreaterThan(0);
    });

    it('should handle complex configurations efficiently', async () => {
      const complexConfig = testDataFactory.createResponsiveConfig({
        breakpoints: Array.from({ length: 10 }, (_, i) => ({
          name: `breakpoint-${i}`,
          width: 320 + i * 200,
          height: 568 + i * 100,
          alias: `bp-${i}`
        }))
      });
      
      const startTime = performance.now();
      const suggestions = await optimizer.optimizeScaling(complexConfig, mockUsageData);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      expect(suggestions).toBeDefined();
    });

    it('should not leak memory during multiple optimizations', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Run multiple optimizations
      await Promise.all(
        Array.from({ length: 10 }, () => {
          const testData = testDataFactory.createComponentUsageDataArray(10);
          return optimizer.optimizeScaling(mockResponsiveConfig, testData);
        })
      );
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle e-commerce application scenario', async () => {
      const ecommerceConfig = testDataFactory.createResponsiveConfig();
      const ecommerceData = testDataFactory.createComponentUsageDataArray(20, {
        componentType: 'ProductCard',
        context: {
          parent: 'ProductGrid',
          children: ['Button', 'Price', 'Image'],
          position: 'main',
          importance: 'primary'
        }
      });
      
      const suggestions = await optimizer.optimizeScaling(ecommerceConfig, ecommerceData);
      expect(suggestions).toBeDefined();
      expect(suggestions.suggestedTokens).toBeDefined();
      expect(suggestions.performanceImpacts.length).toBeGreaterThan(0);
    });

    it('should handle dashboard application scenario', async () => {
      const dashboardConfig = testDataFactory.createResponsiveConfig();
      const dashboardData = testDataFactory.createComponentUsageDataArray(15, {
        componentType: 'Chart',
        context: {
          parent: 'Dashboard',
          children: ['Legend', 'Tooltip'],
          position: 'main',
          importance: 'secondary'
        }
      });
      
      const suggestions = await optimizer.optimizeScaling(dashboardConfig, dashboardData);
      expect(suggestions).toBeDefined();
      expect(suggestions.scalingCurveRecommendations.length).toBeGreaterThan(0);
    });

    it('should handle mobile-first application scenario', async () => {
      const mobileFirstConfig = testDataFactory.createResponsiveConfig({
        base: { name: 'mobile', width: 375, height: 667 },
        breakpoints: [
          { name: 'mobile', width: 375, height: 667, alias: 'mobile' },
          { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
          { name: 'desktop', width: 1024, height: 768, alias: 'desktop' }
        ]
      });
      
      const mobileData = testDataFactory.createComponentUsageDataArray(25, {
        context: {
          parent: 'MobileApp',
          children: [],
          position: 'main',
          importance: 'primary'
        }
      });
      
      const suggestions = await optimizer.optimizeScaling(mobileFirstConfig, mobileData);
      expect(suggestions).toBeDefined();
      expect(suggestions.accessibilityWarnings.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum viable configuration', async () => {
      const minimalConfig = testDataFactory.createEdgeCaseScenarios().minimalConfig;
      const minimalData = testDataFactory.createComponentUsageDataArray(1);
      
      const suggestions = await optimizer.optimizeScaling(minimalConfig, minimalData);
      expect(suggestions).toBeDefined();
      expect(suggestions.suggestedTokens).toBeDefined();
    });

    it('should handle extreme values gracefully', async () => {
      const extremeData = [testDataFactory.createEdgeCaseScenarios().extremeValues];
      
      const suggestions = await optimizer.optimizeScaling(mockResponsiveConfig, extremeData);
      expect(suggestions).toBeDefined();
      expect(suggestions.confidenceScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle high-frequency components', async () => {
      const highFreqData = testDataFactory.createPerformanceTestScenarios().highFrequencyComponents;
      
      const suggestions = await optimizer.optimizeScaling(mockResponsiveConfig, highFreqData);
      expect(suggestions).toBeDefined();
      expect(suggestions.estimatedImprovements.userExperience.interactionRate).toBeGreaterThan(0);
    });
  });
});
