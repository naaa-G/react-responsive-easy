import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AIOptimizer, createAIOptimizer, optimizeConfiguration, type ComponentUsageData, type AIModelConfig } from '../index.js';
import { testDataFactory } from './factories/TestDataFactory.js';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

/**
 * Enterprise-grade unit tests for AI Optimizer
 * 
 * These tests focus on individual component behavior, edge cases,
 * and unit-level functionality with comprehensive coverage.
 */

describe('AIOptimizer Unit Tests', () => {
  let optimizer: AIOptimizer;
  let mockResponsiveConfig: ResponsiveConfig;
  let mockUsageData: ComponentUsageData[];

  beforeEach(async () => {
    // Reset test data factory seed for consistent tests
    testDataFactory.setSeed(12345);
    
    // Create realistic test data using factory
    mockResponsiveConfig = testDataFactory.createResponsiveConfig();
    mockUsageData = testDataFactory.createComponentUsageDataArray(5);
    
    // Initialize optimizer
    optimizer = new AIOptimizer();
    await optimizer.initialize();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor and Configuration', () => {
    it('should create an AIOptimizer instance with default config', () => {
      expect(optimizer).toBeInstanceOf(AIOptimizer);
      expect(optimizer).toBeDefined();
    });

    it('should accept custom configuration', () => {
      const customConfig: Partial<AIModelConfig> = {
        architecture: 'neural-network',
        training: {
          epochs: 200,
          batchSize: 64,
          learningRate: 0.0005,
          validationSplit: 0.3
        }
      };
      
      const customOptimizer = new AIOptimizer(customConfig);
      expect(customOptimizer).toBeInstanceOf(AIOptimizer);
    });

    it('should merge custom config with defaults', () => {
      const customConfig: Partial<AIModelConfig> = {
        training: { 
          epochs: 150,
          batchSize: 32,
          learningRate: 0.001,
          validationSplit: 0.2
        }
      };
      
      const customOptimizer = new AIOptimizer(customConfig);
      expect(customOptimizer).toBeDefined();
    });
  });

  describe('Initialization', () => {
    it('should initialize with new model', async () => {
      await expect(optimizer.initialize()).resolves.not.toThrow();
    });

    it('should handle initialization errors gracefully', async () => {
      // Mock TensorFlow to throw an error
      const mockTf = await import('@tensorflow/tfjs');
      vi.spyOn(mockTf, 'sequential').mockImplementation(() => {
        throw new Error('TensorFlow initialization failed');
      });

      const testOptimizer = new AIOptimizer();
      await expect(testOptimizer.initialize()).rejects.toThrow('AI Optimizer initialization failed');
      
      // Clean up the spy
      vi.restoreAllMocks();
    });

    it('should get model information after initialization', async () => {
      await optimizer.initialize();
      const info = optimizer.getModelInfo();
      
      expect(info).toHaveProperty('architecture');
      expect(info).toHaveProperty('parameters');
      expect(info).toHaveProperty('layers');
      expect(info).toHaveProperty('isInitialized');
      expect(info.isInitialized).toBe(true);
    });
  });

  describe('Optimization', () => {
    beforeEach(async () => {
      await optimizer.initialize();
    });

    it('should generate optimization suggestions', async () => {
      const suggestions = await optimizer.optimizeScaling(mockResponsiveConfig, mockUsageData);
      
      expect(suggestions).toHaveProperty('suggestedTokens');
      expect(suggestions).toHaveProperty('scalingCurveRecommendations');
      expect(suggestions).toHaveProperty('performanceImpacts');
      expect(suggestions).toHaveProperty('accessibilityWarnings');
      expect(suggestions).toHaveProperty('confidenceScore');
      expect(suggestions).toHaveProperty('estimatedImprovements');
    });

    it('should handle empty usage data gracefully', async () => {
      // Empty usage data should throw an error as it's required for optimization
      await expect(optimizer.optimizeScaling(mockResponsiveConfig, [])).rejects.toThrow('Usage data is required and must be a non-empty array');
    });

    it('should throw error when not initialized', async () => {
      const uninitializedOptimizer = new AIOptimizer();
      
      await expect(
        uninitializedOptimizer.optimizeScaling(mockResponsiveConfig, mockUsageData)
      ).rejects.toThrow('AI Optimizer not initialized');
    });
  });

  describe('Model Training', () => {
    beforeEach(async () => {
      await optimizer.initialize();
    });

    it('should train model with training data', async () => {
      const trainingData = [
        {
          features: {
            config: { breakpointCount: 3, breakpointRatios: [0.4, 0.53, 1], tokenComplexity: 12, originDistribution: { width: 1, height: 0, min: 0, max: 0, diagonal: 0, area: 0 } },
            usage: { commonValues: [16, 14, 15], valueDistributions: {}, componentFrequencies: { Button: 1 }, propertyPatterns: { fontSize: 1 } },
            performance: { avgRenderTimes: [2.5, 2.5, 2.5, 2.5, 2.5], bundleSizes: [5120, 5120, 5120, 5120, 5120], memoryPatterns: [1024, 1024, 1024, 1024, 1024], layoutShiftFreq: [0.01, 0.01, 0.01, 0.01, 0.01] },
            context: { applicationType: 'general', deviceDistribution: { desktop: 1, tablet: 0, mobile: 0, other: 0 }, userBehavior: { engagement: 0.85, accessibility: 95, performance: 0 }, industry: 'general' }
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
            config: { breakpointCount: 4, breakpointRatios: [0.3, 0.5, 0.7, 1], tokenComplexity: 15, originDistribution: { width: 0.8, height: 0.2, min: 0, max: 0, diagonal: 0, area: 0 } },
            usage: { commonValues: [20, 18, 22], valueDistributions: {}, componentFrequencies: { Card: 1 }, propertyPatterns: { padding: 1 } },
            performance: { avgRenderTimes: [3.1, 3.1, 3.1, 3.1, 3.1], bundleSizes: [6144, 6144, 6144, 6144, 6144], memoryPatterns: [1280, 1280, 1280, 1280, 1280], layoutShiftFreq: [0.02, 0.02, 0.02, 0.02, 0.02] },
            context: { applicationType: 'ecommerce', deviceDistribution: { desktop: 0.7, tablet: 0.2, mobile: 0.1, other: 0 }, userBehavior: { engagement: 0.92, accessibility: 98, performance: 0 }, industry: 'ecommerce' }
          },
          labels: {
            optimalTokens: {},
            performanceScores: {},
            satisfactionRatings: [98],
            accessibilityScores: {}
          },
          metadata: {
            timestamp: new Date(),
            source: 'test',
            qualityScore: 0.95,
            sampleSize: 1,
            region: 'test'
          }
        }
      ];

      const metrics = await optimizer.trainModel(trainingData);
      
      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('precision');
      expect(metrics).toHaveProperty('recall');
      expect(metrics).toHaveProperty('f1Score');
      expect(metrics).toHaveProperty('mse');
    });

    it('should evaluate model performance', async () => {
      const testData = [{
        features: {
          config: { breakpointCount: 3, breakpointRatios: [0.4, 0.53, 1], tokenComplexity: 12, originDistribution: { width: 1, height: 0, min: 0, max: 0, diagonal: 0, area: 0 } },
          usage: { commonValues: [16, 14, 15], valueDistributions: {}, componentFrequencies: { Button: 1 }, propertyPatterns: { fontSize: 1 } },
          performance: { avgRenderTimes: [2.5, 2.5, 2.5, 2.5, 2.5], bundleSizes: [5120, 5120, 5120, 5120, 5120], memoryPatterns: [1024, 1024, 1024, 1024, 1024], layoutShiftFreq: [0.01, 0.01, 0.01, 0.01, 0.01] },
          context: { applicationType: 'general', deviceDistribution: { desktop: 1, tablet: 0, mobile: 0, other: 0 }, userBehavior: { engagement: 0.85, accessibility: 95, performance: 0 }, industry: 'general' }
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
      }];

      const metrics = await optimizer.evaluateModel(testData);
      
      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('precision');
      expect(metrics).toHaveProperty('recall');
      expect(metrics).toHaveProperty('f1Score');
    });
  });

  describe('Model Persistence', () => {
    beforeEach(async () => {
      await optimizer.initialize();
    });

    it('should save model successfully', async () => {
      await expect(optimizer.saveModel('./test-model')).resolves.not.toThrow();
    });

    it('should handle save errors gracefully', async () => {
      // Mock the model manager's saveModel method to throw error
      const mockModelManager = (optimizer as any).modelManager;
      vi.spyOn(mockModelManager, 'saveModel').mockRejectedValue(new Error('Save failed'));

      await expect(optimizer.saveModel('./invalid-path')).rejects.toThrow('Save failed');
    });
  });

  describe('Factory Functions', () => {
    it('should create optimizer via factory function', async () => {
      const instance = await createAIOptimizer();
      expect(instance).toBeInstanceOf(AIOptimizer);
    });

    it('should create optimizer with custom config via factory', async () => {
      const customConfig: Partial<AIModelConfig> = {
        training: { 
          epochs: 150,
          batchSize: 32,
          learningRate: 0.001,
          validationSplit: 0.2
        }
      };
      
      const instance = await createAIOptimizer(customConfig);
      expect(instance).toBeInstanceOf(AIOptimizer);
    });

    it('should optimize configuration via quick function', async () => {
      const suggestions = await optimizeConfiguration(mockResponsiveConfig, mockUsageData);
      
      expect(suggestions).toHaveProperty('suggestedTokens');
      expect(suggestions).toHaveProperty('confidenceScore');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid configuration gracefully', async () => {
      const invalidConfig = { ...mockResponsiveConfig };
      delete (invalidConfig as any).strategy;
      
      const testOptimizer = new AIOptimizer();
      await testOptimizer.initialize();
      
      // Should handle invalid config gracefully - expect error for truly invalid config
      await expect(testOptimizer.optimizeScaling(invalidConfig, mockUsageData)).rejects.toThrow();
    });

    it('should handle malformed usage data', async () => {
      const malformedData = [
        { ...mockUsageData[0], responsiveValues: null as any }
      ];
      
      const testOptimizer = new AIOptimizer();
      await testOptimizer.initialize();
      
      // Should handle malformed data gracefully - expect error for truly malformed data
      await expect(testOptimizer.optimizeScaling(mockResponsiveConfig, malformedData)).rejects.toThrow();
    });
  });
});

describe('FeatureExtractor', () => {
  it('should be exported and accessible', async () => {
    const { FeatureExtractor } = await import('../index.js');
    expect(FeatureExtractor).toBeDefined();
    expect(typeof FeatureExtractor).toBe('function');
  });
});

describe('ModelTrainer', () => {
  it('should be exported and accessible', async () => {
    const { ModelTrainer } = await import('../index.js');
    expect(ModelTrainer).toBeDefined();
    expect(typeof ModelTrainer).toBe('function');
  });
});

describe('PredictionEngine', () => {
  it('should be exported and accessible', async () => {
    const { PredictionEngine } = await import('../index.js');
    expect(PredictionEngine).toBeDefined();
    expect(typeof PredictionEngine).toBe('function');
  });
});

describe('Utility Functions', () => {
  it('should export createDefaultAIConfig', async () => {
    const { createDefaultAIConfig } = await import('../index.js');
    expect(createDefaultAIConfig).toBeDefined();
    expect(typeof createDefaultAIConfig).toBe('function');
  });

  it('should export DataCollector', async () => {
    const { DataCollector } = await import('../index.js');
    expect(DataCollector).toBeDefined();
    expect(typeof DataCollector).toBe('function');
  });

  it('should export OptimizationReporter', async () => {
    const { OptimizationReporter } = await import('../index.js');
    expect(OptimizationReporter).toBeDefined();
    expect(typeof OptimizationReporter).toBe('function');
  });
});

describe('Type Exports', () => {
  it('should export all required runtime exports', async () => {
    const exports = await import('../index.js');
    
    // Runtime exports that should be available
    expect(exports).toHaveProperty('AIOptimizer');
    expect(exports).toHaveProperty('FeatureExtractor');
    expect(exports).toHaveProperty('ModelTrainer');
    expect(exports).toHaveProperty('PredictionEngine');
    expect(exports).toHaveProperty('createDefaultAIConfig');
    expect(exports).toHaveProperty('DataCollector');
    expect(exports).toHaveProperty('OptimizationReporter');
    expect(exports).toHaveProperty('createAIOptimizer');
    expect(exports).toHaveProperty('optimizeConfiguration');
    expect(exports).toHaveProperty('VERSION');
    
    // TypeScript types are compile-time only and not testable at runtime
    // This is the correct enterprise approach for type testing
  });


});

describe('Performance and Memory', () => {
  let performanceOptimizer: AIOptimizer;
  let performanceConfig: ResponsiveConfig;
  let performanceUsageData: ComponentUsageData[];

  beforeEach(async () => {
    testDataFactory.setSeed(12345);
    performanceConfig = testDataFactory.createResponsiveConfig();
    performanceUsageData = testDataFactory.createComponentUsageDataArray(5);
    
    performanceOptimizer = new AIOptimizer();
    await performanceOptimizer.initialize();
  });

  it('should not leak memory during optimization', async () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Run multiple optimizations
    const optimizationPromises = Array.from({ length: 5 }, () => 
      performanceOptimizer.optimizeScaling(performanceConfig, performanceUsageData)
    );
    await Promise.all(optimizationPromises);
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  it('should complete optimization within reasonable time', async () => {
    const startTime = performance.now();
    await performanceOptimizer.optimizeScaling(performanceConfig, performanceUsageData);
    const endTime = performance.now();
    
    const duration = endTime - startTime;
    // Should complete within 5 seconds
    expect(duration).toBeLessThan(5000);
  });
});
