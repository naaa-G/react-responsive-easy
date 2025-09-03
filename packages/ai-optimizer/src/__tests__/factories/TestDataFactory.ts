/**
 * Enterprise-grade test data factory for AI Optimizer
 * 
 * Provides comprehensive, realistic test data generation for all AI optimization scenarios.
 * Follows factory pattern for maintainable and consistent test data creation.
 */

import type {
  ComponentUsageData,
  TrainingData,
  ModelFeatures,
  ModelLabels,
  OptimizationSuggestions,
  AIModelConfig,
  PerformanceMetrics,
  InteractionData,
  ComponentContext,
  ResponsiveValueUsage
} from '../../types/index.js';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

/**
 * Test data factory for generating realistic AI optimization test scenarios
 */
export class TestDataFactory {
  private static instance: TestDataFactory;
  private seed: number = 12345;

  private constructor() {}

  static getInstance(): TestDataFactory {
    if (!TestDataFactory.instance) {
      TestDataFactory.instance = new TestDataFactory();
    }
    return TestDataFactory.instance;
  }

  /**
   * Set seed for reproducible test data generation
   */
  setSeed(seed: number): void {
    this.seed = seed;
  }

  /**
   * Simple seeded random number generator for consistent test data
   */
  private seededRandom(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Generate realistic responsive configuration for testing
   */
  createResponsiveConfig(overrides: Partial<ResponsiveConfig> = {}): ResponsiveConfig {
    const baseConfig: ResponsiveConfig = {
      base: { name: 'desktop', width: 1920, height: 1080 },
      breakpoints: [
        { name: 'mobile', width: 375, height: 667, alias: 'mobile' },
        { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
        { name: 'laptop', width: 1366, height: 768, alias: 'laptop' },
        { name: 'desktop', width: 1920, height: 1080, alias: 'desktop' },
        { name: 'ultrawide', width: 2560, height: 1440, alias: 'ultrawide' }
      ],
      strategy: {
        origin: 'width',
        mode: 'linear',
        tokens: {
          fontSize: { scale: 0.85, min: 12, max: 72, step: 1, responsive: true },
          spacing: { scale: 0.9, min: 4, max: 128, step: 4, responsive: true },
          radius: { scale: 0.8, min: 0, max: 24, step: 2, responsive: true },
          lineHeight: { scale: 1.2, min: 1, max: 2, step: 0.1, responsive: true },
          shadow: { scale: 0.8, min: 0, max: 24, step: 1, responsive: true },
          border: { scale: 0.8, min: 0, max: 8, step: 1, responsive: true }
        },
        accessibility: {
          minFontSize: 12,
          minTapTarget: 44,
          contrastPreservation: true
        },
        rounding: { mode: 'nearest', precision: 2 },
        performance: {
          memoization: true,
          cacheStrategy: 'memory',
          precomputeValues: true
        }
      }
    };

    return { ...baseConfig, ...overrides };
  }

  /**
   * Generate realistic component usage data
   */
  createComponentUsageData(overrides: Partial<ComponentUsageData> = {}): ComponentUsageData {
    const componentTypes = ['Button', 'Card', 'Input', 'Modal', 'Navigation', 'Header', 'Footer', 'Sidebar'];
    const properties = ['fontSize', 'padding', 'margin', 'borderRadius', 'boxShadow', 'lineHeight'];
    const tokens = ['fontSize', 'spacing', 'radius', 'shadow', 'lineHeight', 'border'];
    const positions: Array<'header' | 'main' | 'sidebar' | 'footer' | 'modal' | 'other'> = ['header', 'main', 'sidebar', 'footer', 'modal', 'other'];
    const importanceLevels: Array<'primary' | 'secondary' | 'tertiary'> = ['primary', 'secondary', 'tertiary'];

    const componentType = overrides.componentType || componentTypes[Math.floor(this.seededRandom() * componentTypes.length)];
    const position = overrides.context?.position || positions[Math.floor(this.seededRandom() * positions.length)];
    const importance = overrides.context?.importance || importanceLevels[Math.floor(this.seededRandom() * importanceLevels.length)];

    const responsiveValues: ResponsiveValueUsage[] = [];
    const numValues = Math.floor(this.seededRandom() * 4) + 1; // 1-4 responsive values

    for (let i = 0; i < numValues; i++) {
      const property = properties[Math.floor(this.seededRandom() * properties.length)];
      const token = tokens[Math.floor(this.seededRandom() * tokens.length)];
      const baseValue = Math.floor(this.seededRandom() * 50) + 10; // 10-60

      responsiveValues.push({
        property,
        baseValue,
        token,
        breakpointValues: {
          mobile: Math.floor(baseValue * (0.7 + this.seededRandom() * 0.3)),
          tablet: Math.floor(baseValue * (0.8 + this.seededRandom() * 0.2)),
          desktop: baseValue,
          ultrawide: Math.floor(baseValue * (1.1 + this.seededRandom() * 0.2))
        },
        usageFrequency: Math.floor(this.seededRandom() * 100) + 1
      });
    }

    const performance: PerformanceMetrics = {
      renderTime: 1 + this.seededRandom() * 10, // 1-11ms
      layoutShift: this.seededRandom() * 0.1, // 0-0.1 CLS
      memoryUsage: Math.floor(512 + this.seededRandom() * 2048), // 512-2560KB
      bundleSize: Math.floor(1024 + this.seededRandom() * 8192) // 1-9KB
    };

    const interactions: InteractionData = {
      interactionRate: this.seededRandom(), // 0-1
      viewTime: Math.floor(1000 + this.seededRandom() * 10000), // 1-11s
      scrollBehavior: this.seededRandom() > 0.5 ? 'smooth' : 'normal',
      accessibilityScore: Math.floor(70 + this.seededRandom() * 30) // 70-100
    };

    const context: ComponentContext = {
      parent: overrides.context?.parent || 'Root',
      children: overrides.context?.children || [],
      position,
      importance
    };

    return {
      componentId: overrides.componentId || `component-${Math.floor(this.seededRandom() * 10000)}`,
      componentType,
      responsiveValues,
      performance,
      interactions,
      context,
      ...overrides
    };
  }

  /**
   * Generate multiple component usage data entries
   */
  createComponentUsageDataArray(count: number, overrides: Partial<ComponentUsageData> = {}): ComponentUsageData[] {
    return Array.from({ length: count }, (_, index) => 
      this.createComponentUsageData({
        ...overrides,
        componentId: overrides.componentId || `component-${index}`
      })
    );
  }

  /**
   * Generate realistic training data
   */
  createTrainingData(overrides: Partial<TrainingData> = {}): TrainingData {
    const config = this.createResponsiveConfig();
    const usageData = this.createComponentUsageDataArray(5);

    const features: ModelFeatures = {
      config: {
        breakpointCount: config.breakpoints.length,
        breakpointRatios: config.breakpoints.map((bp: any) => bp.width / config.base.width),
        tokenComplexity: Object.keys(config.strategy.tokens).length * 4,
        originDistribution: {
          width: config.strategy.origin === 'width' ? 1 : 0,
          height: config.strategy.origin === 'height' ? 1 : 0,
          min: config.strategy.origin === 'min' ? 1 : 0,
          max: config.strategy.origin === 'max' ? 1 : 0,
          diagonal: config.strategy.origin === 'diagonal' ? 1 : 0,
          area: config.strategy.origin === 'area' ? 1 : 0
        }
      },
      usage: {
        commonValues: [16, 14, 12, 18, 20, 24, 28, 32, 36, 40],
        valueDistributions: {},
        componentFrequencies: { Button: 0.3, Card: 0.25, Input: 0.2, Modal: 0.15, Navigation: 0.1 },
        propertyPatterns: { fontSize: 0.4, padding: 0.3, margin: 0.2, borderRadius: 0.1 }
      },
      performance: {
        avgRenderTimes: [2.5, 2.3, 2.7, 2.1, 2.9],
        bundleSizes: [5120, 4800, 5600, 4400, 6000],
        memoryPatterns: [1024, 960, 1120, 880, 1200],
        layoutShiftFreq: [0.01, 0.008, 0.012, 0.006, 0.014]
      },
      context: {
        applicationType: 'general',
        deviceDistribution: { desktop: 0.4, tablet: 0.3, mobile: 0.3, other: 0 },
        userBehavior: { engagement: 0.75, accessibility: 85, performance: 0.2 },
        industry: 'technology'
      }
    };

    const labels: ModelLabels = {
      optimalTokens: {
        fontSize: { scale: 0.85, min: 12, max: 72, step: 1, responsive: true },
        spacing: { scale: 0.9, min: 4, max: 128, step: 4, responsive: true },
        radius: { scale: 0.8, min: 0, max: 24, step: 2, responsive: true }
      },
      performanceScores: {
        renderTime: 0.8,
        bundleSize: 0.7,
        memoryUsage: 0.9,
        layoutShift: 0.95
      },
      satisfactionRatings: [85, 88, 82, 90, 87],
      accessibilityScores: {
        fontSizeCompliance: 0.9,
        tapTargetCompliance: 0.85
      }
    };

    return {
      features,
      labels,
      metadata: {
        timestamp: new Date(),
        source: 'test-factory',
        qualityScore: 0.9,
        sampleSize: usageData.length,
        region: 'test'
      },
      ...overrides
    };
  }

  /**
   * Generate multiple training data entries
   */
  createTrainingDataArray(count: number, overrides: Partial<TrainingData> = {}): TrainingData[] {
    return Array.from({ length: count }, () => this.createTrainingData(overrides));
  }

  /**
   * Generate realistic AI model configuration
   */
  createAIModelConfig(overrides: Partial<AIModelConfig> = {}): AIModelConfig {
    const baseConfig: AIModelConfig = {
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

    return { ...baseConfig, ...overrides };
  }

  /**
   * Generate realistic optimization suggestions
   */
  createOptimizationSuggestions(overrides: Partial<OptimizationSuggestions> = {}): OptimizationSuggestions {
    const suggestedTokens = {
      fontSize: { scale: 0.87, min: 14, max: 68, step: 1, responsive: true },
      spacing: { scale: 0.92, min: 6, max: 120, step: 4, responsive: true },
      radius: { scale: 0.82, min: 2, max: 22, step: 2, responsive: true },
      lineHeight: { scale: 1.22, min: 1.1, max: 1.9, step: 0.1, responsive: true },
      shadow: { scale: 0.85, min: 1, max: 20, step: 1, responsive: true },
      border: { scale: 0.85, min: 1, max: 6, step: 1, responsive: true }
    };

    const scalingCurveRecommendations = [
      {
        token: 'fontSize',
        mode: 'linear' as const,
        scale: 0.87,
        breakpointAdjustments: { mobile: 0.1, tablet: 0.05, desktop: 0, ultrawide: -0.05 },
        confidence: 0.85,
        reasoning: 'Optimized for better readability across devices'
      },
      {
        token: 'spacing',
        mode: 'exponential' as const,
        scale: 0.92,
        breakpointAdjustments: { mobile: 0.15, tablet: 0.08, desktop: 0, ultrawide: -0.08 },
        confidence: 0.78,
        reasoning: 'Improved spacing hierarchy for better visual flow'
      }
    ];

    const performanceImpacts = [
      {
        aspect: 'bundle-size' as const,
        currentValue: 51200,
        predictedValue: 46080,
        improvementPercent: 10,
        severity: 'medium' as const
      },
      {
        aspect: 'render-time' as const,
        currentValue: 2.5,
        predictedValue: 2.2,
        improvementPercent: 12,
        severity: 'high' as const
      }
    ];

    const accessibilityWarnings = [
      {
        type: 'font-size' as const,
        currentValue: 12,
        recommendedValue: 14,
        wcagReference: 'WCAG 2.1 AA - 1.4.4 Resize text',
        severity: 'AA' as const,
        description: 'Minimum font size should be increased for better readability'
      }
    ];

    const estimatedImprovements = {
      performance: {
        renderTime: 12,
        bundleSize: 10,
        memoryUsage: 8,
        layoutShift: 0.02
      },
      userExperience: {
        interactionRate: 8,
        accessibilityScore: 5,
        visualHierarchy: 15
      },
      developerExperience: {
        codeReduction: 25,
        maintenanceEffort: 30,
        debuggingTime: 40
      }
    };

    return {
      suggestedTokens,
      scalingCurveRecommendations,
      performanceImpacts,
      accessibilityWarnings,
      confidenceScore: 0.82,
      estimatedImprovements,
      ...overrides
    };
  }

  /**
   * Generate edge case scenarios for comprehensive testing
   */
  createEdgeCaseScenarios(): {
    emptyUsageData: ComponentUsageData[];
    minimalConfig: ResponsiveConfig;
    extremeValues: ComponentUsageData;
    malformedData: Partial<ComponentUsageData>;
  } {
    return {
      emptyUsageData: [],
      minimalConfig: {
        base: { name: 'mobile', width: 375, height: 667 },
        breakpoints: [{ name: 'mobile', width: 375, height: 667, alias: 'mobile' }],
        strategy: {
          origin: 'width',
          mode: 'linear',
          tokens: {
            fontSize: { scale: 1, min: 12, max: 16, step: 1, responsive: true },
            spacing: { scale: 1, min: 4, max: 16, step: 1, responsive: true },
            radius: { scale: 1, min: 0, max: 8, step: 1, responsive: true },
            lineHeight: { scale: 1, min: 1, max: 1.5, step: 0.1, responsive: true },
            shadow: { scale: 1, min: 0, max: 4, step: 1, responsive: true },
            border: { scale: 1, min: 0, max: 2, step: 1, responsive: true }
          },
          accessibility: { minFontSize: 12, minTapTarget: 44, contrastPreservation: true },
          rounding: { mode: 'nearest', precision: 2 },
          performance: { memoization: false, cacheStrategy: 'memory', precomputeValues: false }
        }
      },
      extremeValues: {
        componentId: 'extreme-component',
        componentType: 'ExtremeComponent',
        responsiveValues: [
          {
            property: 'fontSize',
            baseValue: 1000,
            token: 'fontSize',
            breakpointValues: { mobile: 50, tablet: 100, desktop: 1000, ultrawide: 2000 },
            usageFrequency: 999999
          }
        ],
        performance: {
          renderTime: 1000,
          layoutShift: 1.0,
          memoryUsage: 1000000,
          bundleSize: 1000000
        },
        interactions: {
          interactionRate: 1.0,
          viewTime: 60000,
          scrollBehavior: 'smooth',
          accessibilityScore: 100
        },
        context: {
          parent: 'ExtremeParent',
          children: ['Child1', 'Child2', 'Child3'],
          position: 'other',
          importance: 'primary'
        }
      },
      malformedData: {
        componentId: 'malformed-component',
        componentType: 'MalformedComponent',
        responsiveValues: null as any,
        performance: {
          renderTime: -1,
          layoutShift: -0.1,
          memoryUsage: -100,
          bundleSize: -50
        },
        interactions: {
          interactionRate: 1.5,
          viewTime: -1000,
          scrollBehavior: 'invalid' as any,
          accessibilityScore: 150
        },
        context: {
          parent: null as any,
          children: null as any,
          position: null as any,
          importance: null as any
        }
      }
    };
  }

  /**
   * Generate performance test scenarios
   */
  createPerformanceTestScenarios(): {
    largeDataset: ComponentUsageData[];
    highFrequencyComponents: ComponentUsageData[];
    complexConfiguration: ResponsiveConfig;
  } {
    return {
      largeDataset: this.createComponentUsageDataArray(1000),
      highFrequencyComponents: this.createComponentUsageDataArray(100, {
        interactions: {
          interactionRate: 0.95,
          viewTime: 5000,
          scrollBehavior: 'smooth',
          accessibilityScore: 95
        }
      }),
      complexConfiguration: this.createResponsiveConfig({
        breakpoints: Array.from({ length: 20 }, (_, i) => ({
          name: `breakpoint-${i}`,
          width: 320 + i * 100,
          height: 568 + i * 50,
          alias: `bp-${i}`
        }))
      })
    };
  }
}

/**
 * Convenience function to get the singleton instance
 */
export const testDataFactory = TestDataFactory.getInstance();
