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
import { AI_OPTIMIZER_CONSTANTS } from '../../constants';

// Constants for test data generation
const TEST_CONSTANTS = {
  DEFAULT_SEED: 12345,
  RANDOM_MULTIPLIER: 9301,
  RANDOM_ADDEND: 49297,
  RANDOM_MODULUS: 233280,
  DEFAULT_BATCH_SIZE: 50,
  PERFORMANCE_THRESHOLD: 0.7,
  PERFORMANCE_VARIANCE: 0.3,
  SCALING_FACTOR: 1.1,
  SCALING_VARIANCE: 0.2,
  MEMORY_THRESHOLD: 0.1,
  CACHE_SIZE: 512,
  MAX_CACHE_SIZE: 2048,
  MIN_CACHE_SIZE: 1024,
  MAX_CACHE_SIZE_LARGE: 8192,
  DEFAULT_TIMEOUT: 10000,
  PERFORMANCE_SCORE: 0.5,
  CPU_THRESHOLD: 70,
  DEFAULT_ITERATIONS: 16,
  DEFAULT_ITERATIONS_EXTENDED: 14,
  DEFAULT_ITERATIONS_REDUCED: 12,
  DEFAULT_ITERATIONS_LARGE: 18,
  DEFAULT_ITERATIONS_XLARGE: 20,
  DEFAULT_ITERATIONS_XXLARGE: 28,
  DEFAULT_ITERATIONS_XXXLARGE: 32,
  DEFAULT_ITERATIONS_XXXXLARGE: 36,
  DEFAULT_ITERATIONS_XXXXXLARGE: 40,
  SCALING_MULTIPLIER: 2.5,
  // Scaling multiplier variants
  SCALING_VARIANT_1: 2.3,
  SCALING_VARIANT_2: 2.7,
  SCALING_VARIANT_3: 2.1,
  SCALING_VARIANT_4: 2.9,
  // Cache size multipliers
  CACHE_SIZE_MULT_1: 40,
  CACHE_SIZE_MULT_2: 37.5,
  CACHE_SIZE_MULT_3: 43.75,
  CACHE_SIZE_MULT_4: 34.375,
  CACHE_SIZE_MULT_5: 46.875,
  // Cache size small multipliers
  CACHE_SMALL_MULT_1: 0.9375,
  CACHE_SMALL_MULT_2: 1.09375,
  CACHE_SMALL_MULT_3: 0.859375,
  CACHE_SMALL_MULT_4: 1.171875,
  // Cache rate multipliers
  CACHE_RATE_MULT_1: 0.8,
  CACHE_RATE_MULT_2: 1.2,
  CACHE_RATE_MULT_3: 0.6,
  CACHE_RATE_MULT_4: 1.4,
  // Performance score values
  PERF_SCORE_1: 85,
  PERF_SCORE_2: 88,
  PERF_SCORE_3: 82,
  PERF_SCORE_4: 90,
  PERF_SCORE_5: 87,
  // Cache dimension values
  CACHE_DIM_WIDTH: 320,
  CACHE_DIM_HEIGHT: 568,
  // Additional constants for magic numbers
  // Font size values
  FONT_SIZE_1: 16,
  FONT_SIZE_2: 14,
  FONT_SIZE_3: 12,
  FONT_SIZE_4: 18,
  FONT_SIZE_5: 20,
  FONT_SIZE_6: 24,
  FONT_SIZE_7: 28,
  FONT_SIZE_8: 32,
  FONT_SIZE_9: 36,
  FONT_SIZE_10: 40,
  // Render time values
  RENDER_TIME_1: 2.5,
  RENDER_TIME_2: 2.3,
  RENDER_TIME_3: 2.7,
  RENDER_TIME_4: 2.1,
  RENDER_TIME_5: 2.9,
  CACHE_THRESHOLD: 50,
  // Computed arrays will be defined after constants
  EPOCHS: 100,
  BATCH_SIZE: 32,
  LEARNING_RATE: 0.001,
  VALIDATION_SPLIT: 0.2,
  SAVE_FREQUENCY: 10,
  FONT_SCALE: 0.87,
  FONT_MIN: 14,
  FONT_MAX: 68,
  SPACING_SCALE: 0.92,
  SPACING_MIN: 6,
  SPACING_MAX: 120,
  RADIUS_SCALE: 0.82,
  RADIUS_MIN: 2,
  RADIUS_MAX: 22,
  LINE_HEIGHT_SCALE: 1.22,
  LINE_HEIGHT_MIN: 1.1,
  LINE_HEIGHT_MAX: 1.9,
  SHADOW_SCALE: 0.85,
  SHADOW_MIN: 1,
  SHADOW_MAX: 20,
  BORDER_SCALE: 0.85,
  BORDER_MIN: 1,
  BORDER_MAX: 6,
  CONFIDENCE_HIGH: 0.85,
  CONFIDENCE_MEDIUM: 0.78,
  MOBILE_ADJUSTMENT: 0.1,
  TABLET_ADJUSTMENT: 0.05,
  DESKTOP_ADJUSTMENT: 0,
  ULTRAWIDE_ADJUSTMENT: -0.05,
  TABLET_ADJUSTMENT_LARGE: 0.08,
  ULTRAWIDE_ADJUSTMENT_LARGE: -0.08,
  MOBILE_ADJUSTMENT_LARGE: 0.15,
  TABLET_ADJUSTMENT_XLARGE: 0.08,
  ULTRAWIDE_ADJUSTMENT_XLARGE: -0.08,
  BUNDLE_SIZE_CURRENT: 51200,
  BUNDLE_SIZE_PREDICTED: 46080,
  BUNDLE_IMPROVEMENT: 10,
  RENDER_TIME_CURRENT: 2.5,
  RENDER_TIME_PREDICTED: 2.2,
  RENDER_IMPROVEMENT: 12,
  FONT_SIZE_CURRENT: 12,
  FONT_SIZE_RECOMMENDED: 14,
  PERFORMANCE_RENDER: 12,
  PERFORMANCE_BUNDLE: 10,
  PERFORMANCE_MEMORY: 8,
  PERFORMANCE_LAYOUT: 0.02,
  UX_INTERACTION: 8,
  UX_ACCESSIBILITY: 5,
  UX_VISUAL: 15,
  DX_CODE: 25,
  DX_MAINTENANCE: 30,
  DX_DEBUGGING: 40,
  CONFIDENCE_SCORE: 0.82,
  MOBILE_WIDTH: 375,
  MOBILE_HEIGHT: 667,
  MIN_FONT_SIZE: 12,
  MAX_FONT_SIZE: 16,
  MIN_SPACING: 4,
  MAX_SPACING: 16,
  MIN_RADIUS: 0,
  MAX_RADIUS: 8,
  MIN_LINE_HEIGHT: 1,
  MAX_LINE_HEIGHT: 1.5,
  MIN_SHADOW: 0,
  MAX_SHADOW: 4,
  MIN_BORDER: 0,
  MAX_BORDER: 2,
  MIN_TAP_TARGET: 44,
  EXTREME_FONT_SIZE: 1000,
  EXTREME_SPACING: 500,
  EXTREME_RADIUS: 100,
  EXTREME_LINE_HEIGHT: 5,
  EXTREME_SHADOW: 50,
  EXTREME_BORDER: 20,
  EXTREME_RENDER_TIME: 1000,
  EXTREME_LAYOUT_SHIFT: 10,
  EXTREME_MEMORY: 1000000,
  EXTREME_BUNDLE: 10000000,
  EXTREME_INTERACTION: 10000,
  EXTREME_ACCESSIBILITY: 200,
  LARGE_DATASET_SIZE: 1000,
  HIGH_FREQUENCY_SIZE: 100,
  HIGH_FREQUENCY_RATE: 0.95,
  HIGH_FREQUENCY_VIEW_TIME: 5000,
  HIGH_FREQUENCY_ACCESSIBILITY: 95,
  COMPLEX_BREAKPOINT_COUNT: 20,
  COMPLEX_BREAKPOINT_WIDTH_BASE: 320,
  COMPLEX_BREAKPOINT_WIDTH_INCREMENT: 100,
  COMPLEX_BREAKPOINT_HEIGHT_BASE: 568,
  COMPLEX_BREAKPOINT_HEIGHT_INCREMENT: 50,
  // Additional constants for magic numbers
  BASE_VALUE_OFFSET: 10,
  BASE_VALUE_MAX: 60,
  TABLET_SCALING_BASE: 1.2,
  TABLET_SCALING_VARIANCE: 0.3,
  RENDER_TIME_BASE: 1,
  RENDER_TIME_MAX: 10,
  VIEW_TIME_BASE: 1,
  ACCESSIBILITY_SCORE_BASE: 30,
  RANDOM_MULTIPLIER_100: 100,
  RANDOM_MULTIPLIER_1: 1,
  RANDOM_MULTIPLIER_16: 16,
  RANDOM_MULTIPLIER_14: 14,
  RANDOM_MULTIPLIER_12: 12,
  RANDOM_MULTIPLIER_18: 18,
  RANDOM_MULTIPLIER_20: 20,
  RANDOM_MULTIPLIER_28: 28,
  RANDOM_MULTIPLIER_32: 32,
  RANDOM_MULTIPLIER_36: 36,
  RANDOM_MULTIPLIER_40: 40,
  MAX_RESPONSIVE_VALUES: 4,
  DEFAULT_USAGE_DATA_COUNT: 10,
  EXTREME_VIEW_TIME_MULTIPLIER: 10,
} as const;

// Add computed arrays that depend on the constants
const SCALING_MULTIPLIER_VARIANTS = [
  TEST_CONSTANTS.SCALING_VARIANT_1,
  TEST_CONSTANTS.SCALING_VARIANT_2,
  TEST_CONSTANTS.SCALING_VARIANT_3,
  TEST_CONSTANTS.SCALING_VARIANT_4
] as const;

// Computed arrays using the constants
const COMPUTED_ARRAYS = {
  CACHE_SIZES: [
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_1,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_2,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_3,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_4,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_5
  ],
  CACHE_SIZES_SMALL: [
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES * TEST_CONSTANTS.CACHE_SMALL_MULT_1,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES * TEST_CONSTANTS.CACHE_SMALL_MULT_2,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES * TEST_CONSTANTS.CACHE_SMALL_MULT_3,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES * TEST_CONSTANTS.CACHE_SMALL_MULT_4
  ],
  CACHE_RATES: [
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD * TEST_CONSTANTS.CACHE_RATE_MULT_1,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD * TEST_CONSTANTS.CACHE_RATE_MULT_2,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD * TEST_CONSTANTS.CACHE_RATE_MULT_3,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD * TEST_CONSTANTS.CACHE_RATE_MULT_4
  ],
  PERFORMANCE_SCORES: [TEST_CONSTANTS.PERF_SCORE_1, TEST_CONSTANTS.PERF_SCORE_2, TEST_CONSTANTS.PERF_SCORE_3, TEST_CONSTANTS.PERF_SCORE_4, TEST_CONSTANTS.PERF_SCORE_5],
  CACHE_DIMENSIONS: [TEST_CONSTANTS.CACHE_DIM_WIDTH, TEST_CONSTANTS.CACHE_DIM_HEIGHT],
  FONT_SIZES: [TEST_CONSTANTS.FONT_SIZE_1, TEST_CONSTANTS.FONT_SIZE_2, TEST_CONSTANTS.FONT_SIZE_3, TEST_CONSTANTS.FONT_SIZE_4, TEST_CONSTANTS.FONT_SIZE_5, TEST_CONSTANTS.FONT_SIZE_6, TEST_CONSTANTS.FONT_SIZE_7, TEST_CONSTANTS.FONT_SIZE_8, TEST_CONSTANTS.FONT_SIZE_9, TEST_CONSTANTS.FONT_SIZE_10] as number[],
  RENDER_TIMES: [TEST_CONSTANTS.RENDER_TIME_1, TEST_CONSTANTS.RENDER_TIME_2, TEST_CONSTANTS.RENDER_TIME_3, TEST_CONSTANTS.RENDER_TIME_4, TEST_CONSTANTS.RENDER_TIME_5] as number[],
  SCALING_MULTIPLIER_VARIANTS,
  BUNDLE_SIZES: [
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_1,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_2,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_3,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_4,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.CACHE_ENTRY_SIZE * TEST_CONSTANTS.CACHE_SIZE_MULT_5
  ] as number[],
  MEMORY_PATTERNS: [
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES * TEST_CONSTANTS.CACHE_SMALL_MULT_1,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES * TEST_CONSTANTS.CACHE_SMALL_MULT_2,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES * TEST_CONSTANTS.CACHE_SMALL_MULT_3,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.KB_TO_BYTES * TEST_CONSTANTS.CACHE_SMALL_MULT_4
  ] as number[],
  LAYOUT_SHIFT_FREQ: [
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD * TEST_CONSTANTS.CACHE_RATE_MULT_1,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD * TEST_CONSTANTS.CACHE_RATE_MULT_2,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD * TEST_CONSTANTS.CACHE_RATE_MULT_3,
    AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_THRESHOLD * TEST_CONSTANTS.CACHE_RATE_MULT_4
  ] as number[]
} as const;

/**
 * Test data factory for generating realistic AI optimization test scenarios
 */
export class TestDataFactory {
  private static instance: TestDataFactory;
  private seed: number = TEST_CONSTANTS.DEFAULT_SEED;

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
    this.seed = (this.seed * TEST_CONSTANTS.RANDOM_MULTIPLIER + TEST_CONSTANTS.RANDOM_ADDEND) % TEST_CONSTANTS.RANDOM_MODULUS;
    return this.seed / TEST_CONSTANTS.RANDOM_MODULUS;
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

    const componentType = overrides.componentType ?? componentTypes[Math.floor(this.seededRandom() * componentTypes.length)];
    const position = overrides.context?.position ?? positions[Math.floor(this.seededRandom() * positions.length)];
    const importance = overrides.context?.importance ?? importanceLevels[Math.floor(this.seededRandom() * importanceLevels.length)];

    const responsiveValues: ResponsiveValueUsage[] = [];
    const numValues = Math.floor(this.seededRandom() * TEST_CONSTANTS.MAX_RESPONSIVE_VALUES) + TEST_CONSTANTS.RANDOM_MULTIPLIER_1; // 1-4 responsive values

    for (let i = 0; i < numValues; i++) {
      const property = properties[Math.floor(this.seededRandom() * properties.length)];
      const token = tokens[Math.floor(this.seededRandom() * tokens.length)];
      const baseValue = Math.floor(this.seededRandom() * TEST_CONSTANTS.DEFAULT_BATCH_SIZE) + TEST_CONSTANTS.BASE_VALUE_OFFSET; // 10-60

      responsiveValues.push({
        property,
        baseValue,
        token,
        breakpointValues: {
          mobile: Math.floor(baseValue * (TEST_CONSTANTS.PERFORMANCE_THRESHOLD + this.seededRandom() * TEST_CONSTANTS.PERFORMANCE_VARIANCE)),
          tablet: Math.floor(baseValue * (TEST_CONSTANTS.TABLET_SCALING_BASE + this.seededRandom() * TEST_CONSTANTS.TABLET_SCALING_VARIANCE)),
          desktop: baseValue,
          ultrawide: Math.floor(baseValue * (TEST_CONSTANTS.SCALING_FACTOR + this.seededRandom() * TEST_CONSTANTS.SCALING_VARIANCE))
        },
        usageFrequency: Math.floor(this.seededRandom() * TEST_CONSTANTS.RANDOM_MULTIPLIER_100) + TEST_CONSTANTS.RANDOM_MULTIPLIER_1
      });
    }

    const performance: PerformanceMetrics = {
      renderTime: TEST_CONSTANTS.RENDER_TIME_BASE + this.seededRandom() * TEST_CONSTANTS.RENDER_TIME_MAX, // 1-11ms
      layoutShift: this.seededRandom() * TEST_CONSTANTS.MEMORY_THRESHOLD, // 0-0.1 CLS
      memoryUsage: Math.floor(TEST_CONSTANTS.CACHE_SIZE + this.seededRandom() * TEST_CONSTANTS.MAX_CACHE_SIZE), // 512-2560KB
      bundleSize: Math.floor(TEST_CONSTANTS.MIN_CACHE_SIZE + this.seededRandom() * TEST_CONSTANTS.MAX_CACHE_SIZE_LARGE) // 1-9KB
    };

    const interactions: InteractionData = {
      interactionRate: this.seededRandom(), // 0-1
      viewTime: Math.floor(TEST_CONSTANTS.VIEW_TIME_BASE + this.seededRandom() * TEST_CONSTANTS.DEFAULT_TIMEOUT), // 1-11s
      scrollBehavior: this.seededRandom() > TEST_CONSTANTS.PERFORMANCE_SCORE ? 'smooth' : 'normal',
      accessibilityScore: Math.floor(TEST_CONSTANTS.CPU_THRESHOLD + this.seededRandom() * TEST_CONSTANTS.ACCESSIBILITY_SCORE_BASE) // 70-100
    };

    const context: ComponentContext = {
      parent: overrides.context?.parent ?? 'Root',
      children: overrides.context?.children ?? [],
      position,
      importance
    };

    return {
      componentId: overrides.componentId ?? `component-${Math.floor(this.seededRandom() * TEST_CONSTANTS.DEFAULT_TIMEOUT)}`,
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
        componentId: overrides.componentId ?? `component-${index}`
      })
    );
  }

  /**
   * Generate realistic training data
   */
  createTrainingData(overrides: Partial<TrainingData> = {}): TrainingData {
    const config = this.createResponsiveConfig();
    const usageData = this.createComponentUsageDataArray(TEST_CONSTANTS.DEFAULT_USAGE_DATA_COUNT);

    const features: ModelFeatures = {
      config: {
        breakpointCount: config.breakpoints.length,
        breakpointRatios: config.breakpoints.map((bp: { width: number }) => bp.width / config.base.width),
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
        commonValues: COMPUTED_ARRAYS.FONT_SIZES,
        valueDistributions: {},
        componentFrequencies: { Button: 0.3, Card: 0.25, Input: 0.2, Modal: 0.15, Navigation: 0.1 },
        propertyPatterns: { fontSize: 0.4, padding: 0.3, margin: 0.2, borderRadius: 0.1 }
      },
      performance: {
        avgRenderTimes: COMPUTED_ARRAYS.RENDER_TIMES,
        bundleSizes: COMPUTED_ARRAYS.BUNDLE_SIZES,
        memoryPatterns: COMPUTED_ARRAYS.MEMORY_PATTERNS,
        layoutShiftFreq: COMPUTED_ARRAYS.LAYOUT_SHIFT_FREQ
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
      satisfactionRatings: [...COMPUTED_ARRAYS.PERFORMANCE_SCORES],
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
        epochs: TEST_CONSTANTS.EPOCHS,
        batchSize: TEST_CONSTANTS.BATCH_SIZE,
        learningRate: TEST_CONSTANTS.LEARNING_RATE,
        validationSplit: TEST_CONSTANTS.VALIDATION_SPLIT
      },
      features: {
        normalization: 'standard',
        dimensionalityReduction: true,
        featureSelection: true
      },
      persistence: {
        saveFrequency: TEST_CONSTANTS.SAVE_FREQUENCY,
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
      fontSize: { scale: TEST_CONSTANTS.FONT_SCALE, min: TEST_CONSTANTS.FONT_MIN, max: TEST_CONSTANTS.FONT_MAX, step: 1, responsive: true },
      spacing: { scale: TEST_CONSTANTS.SPACING_SCALE, min: TEST_CONSTANTS.SPACING_MIN, max: TEST_CONSTANTS.SPACING_MAX, step: 4, responsive: true },
      radius: { scale: TEST_CONSTANTS.RADIUS_SCALE, min: TEST_CONSTANTS.RADIUS_MIN, max: TEST_CONSTANTS.RADIUS_MAX, step: 2, responsive: true },
      lineHeight: { scale: TEST_CONSTANTS.LINE_HEIGHT_SCALE, min: TEST_CONSTANTS.LINE_HEIGHT_MIN, max: TEST_CONSTANTS.LINE_HEIGHT_MAX, step: 0.1, responsive: true },
      shadow: { scale: TEST_CONSTANTS.SHADOW_SCALE, min: TEST_CONSTANTS.SHADOW_MIN, max: TEST_CONSTANTS.SHADOW_MAX, step: 1, responsive: true },
      border: { scale: TEST_CONSTANTS.BORDER_SCALE, min: TEST_CONSTANTS.BORDER_MIN, max: TEST_CONSTANTS.BORDER_MAX, step: 1, responsive: true }
    };

    const scalingCurveRecommendations = [
      {
        token: 'fontSize',
        mode: 'linear' as const,
        scale: TEST_CONSTANTS.FONT_SCALE,
        breakpointAdjustments: { mobile: TEST_CONSTANTS.MOBILE_ADJUSTMENT, tablet: TEST_CONSTANTS.TABLET_ADJUSTMENT, desktop: TEST_CONSTANTS.DESKTOP_ADJUSTMENT, ultrawide: TEST_CONSTANTS.ULTRAWIDE_ADJUSTMENT },
        confidence: TEST_CONSTANTS.CONFIDENCE_HIGH,
        reasoning: 'Optimized for better readability across devices'
      },
      {
        token: 'spacing',
        mode: 'exponential' as const,
        scale: TEST_CONSTANTS.SPACING_SCALE,
        breakpointAdjustments: { mobile: TEST_CONSTANTS.MOBILE_ADJUSTMENT_LARGE, tablet: TEST_CONSTANTS.TABLET_ADJUSTMENT_LARGE, desktop: TEST_CONSTANTS.DESKTOP_ADJUSTMENT, ultrawide: TEST_CONSTANTS.ULTRAWIDE_ADJUSTMENT_LARGE },
        confidence: TEST_CONSTANTS.CONFIDENCE_MEDIUM,
        reasoning: 'Improved spacing hierarchy for better visual flow'
      }
    ];

    const performanceImpacts = [
      {
        aspect: 'bundle-size' as const,
        currentValue: TEST_CONSTANTS.BUNDLE_SIZE_CURRENT,
        predictedValue: TEST_CONSTANTS.BUNDLE_SIZE_PREDICTED,
        improvementPercent: TEST_CONSTANTS.BUNDLE_IMPROVEMENT,
        severity: 'medium' as const
      },
      {
        aspect: 'render-time' as const,
        currentValue: TEST_CONSTANTS.RENDER_TIME_CURRENT,
        predictedValue: TEST_CONSTANTS.RENDER_TIME_PREDICTED,
        improvementPercent: TEST_CONSTANTS.RENDER_IMPROVEMENT,
        severity: 'high' as const
      }
    ];

    const accessibilityWarnings = [
      {
        type: 'font-size' as const,
        currentValue: TEST_CONSTANTS.FONT_SIZE_CURRENT,
        recommendedValue: TEST_CONSTANTS.FONT_SIZE_RECOMMENDED,
        wcagReference: 'WCAG 2.1 AA - 1.4.4 Resize text',
        severity: 'AA' as const,
        description: 'Minimum font size should be increased for better readability'
      }
    ];

    const estimatedImprovements = {
      performance: {
        renderTime: TEST_CONSTANTS.PERFORMANCE_RENDER,
        bundleSize: TEST_CONSTANTS.PERFORMANCE_BUNDLE,
        memoryUsage: TEST_CONSTANTS.PERFORMANCE_MEMORY,
        layoutShift: TEST_CONSTANTS.PERFORMANCE_LAYOUT
      },
      userExperience: {
        interactionRate: TEST_CONSTANTS.UX_INTERACTION,
        accessibilityScore: TEST_CONSTANTS.UX_ACCESSIBILITY,
        visualHierarchy: TEST_CONSTANTS.UX_VISUAL
      },
      developerExperience: {
        codeReduction: TEST_CONSTANTS.DX_CODE,
        maintenanceEffort: TEST_CONSTANTS.DX_MAINTENANCE,
        debuggingTime: TEST_CONSTANTS.DX_DEBUGGING
      }
    };

    return {
      suggestedTokens,
      scalingCurveRecommendations,
      performanceImpacts,
      accessibilityWarnings,
      confidenceScore: TEST_CONSTANTS.CONFIDENCE_SCORE,
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
        base: { name: 'mobile', width: TEST_CONSTANTS.MOBILE_WIDTH, height: TEST_CONSTANTS.MOBILE_HEIGHT },
        breakpoints: [{ name: 'mobile', width: TEST_CONSTANTS.MOBILE_WIDTH, height: TEST_CONSTANTS.MOBILE_HEIGHT, alias: 'mobile' }],
        strategy: {
          origin: 'width',
          mode: 'linear',
          tokens: {
            fontSize: { scale: 1, min: TEST_CONSTANTS.MIN_FONT_SIZE, max: TEST_CONSTANTS.MAX_FONT_SIZE, step: 1, responsive: true },
            spacing: { scale: 1, min: TEST_CONSTANTS.MIN_SPACING, max: TEST_CONSTANTS.MAX_SPACING, step: 1, responsive: true },
            radius: { scale: 1, min: TEST_CONSTANTS.MIN_RADIUS, max: TEST_CONSTANTS.MAX_RADIUS, step: 1, responsive: true },
            lineHeight: { scale: 1, min: TEST_CONSTANTS.MIN_LINE_HEIGHT, max: TEST_CONSTANTS.MAX_LINE_HEIGHT, step: 0.1, responsive: true },
            shadow: { scale: 1, min: TEST_CONSTANTS.MIN_SHADOW, max: TEST_CONSTANTS.MAX_SHADOW, step: 1, responsive: true },
            border: { scale: 1, min: TEST_CONSTANTS.MIN_BORDER, max: TEST_CONSTANTS.MAX_BORDER, step: 1, responsive: true }
          },
          accessibility: { minFontSize: TEST_CONSTANTS.MIN_FONT_SIZE, minTapTarget: TEST_CONSTANTS.MIN_TAP_TARGET, contrastPreservation: true },
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
            baseValue: TEST_CONSTANTS.EXTREME_FONT_SIZE,
            token: 'fontSize',
            breakpointValues: { mobile: 50, tablet: 100, desktop: TEST_CONSTANTS.EXTREME_FONT_SIZE, ultrawide: 2000 },
            usageFrequency: 999999
          }
        ],
        performance: {
          renderTime: TEST_CONSTANTS.EXTREME_RENDER_TIME,
          layoutShift: 1.0,
          memoryUsage: TEST_CONSTANTS.EXTREME_MEMORY,
          bundleSize: TEST_CONSTANTS.EXTREME_MEMORY
        },
        interactions: {
          interactionRate: 1.0,
          viewTime: TEST_CONSTANTS.DEFAULT_TIMEOUT * TEST_CONSTANTS.EXTREME_VIEW_TIME_MULTIPLIER,
          scrollBehavior: 'smooth',
          accessibilityScore: TEST_CONSTANTS.EXTREME_ACCESSIBILITY
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
        responsiveValues: undefined as ResponsiveValueUsage[] | undefined,
        performance: {
          renderTime: -1,
          layoutShift: -0.1,
          memoryUsage: -100,
          bundleSize: -50
        },
        interactions: {
          interactionRate: 1.5,
          viewTime: -1000,
          scrollBehavior: 'invalid' as 'smooth' | 'normal',
          accessibilityScore: 150
        },
        context: {
          parent: undefined as string | undefined,
          children: [] as string[],
          position: 'other' as 'header' | 'main' | 'sidebar' | 'footer' | 'modal' | 'other',
          importance: 'primary' as 'primary' | 'secondary' | 'tertiary'
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
      largeDataset: this.createComponentUsageDataArray(TEST_CONSTANTS.LARGE_DATASET_SIZE),
      highFrequencyComponents: this.createComponentUsageDataArray(TEST_CONSTANTS.HIGH_FREQUENCY_SIZE, {
        interactions: {
          interactionRate: TEST_CONSTANTS.HIGH_FREQUENCY_RATE,
          viewTime: TEST_CONSTANTS.HIGH_FREQUENCY_VIEW_TIME,
          scrollBehavior: 'smooth',
          accessibilityScore: TEST_CONSTANTS.HIGH_FREQUENCY_ACCESSIBILITY
        }
      }),
      complexConfiguration: this.createResponsiveConfig({
        breakpoints: Array.from({ length: TEST_CONSTANTS.COMPLEX_BREAKPOINT_COUNT }, (_, i) => ({
          name: `breakpoint-${i}`,
          width: TEST_CONSTANTS.COMPLEX_BREAKPOINT_WIDTH_BASE + i * TEST_CONSTANTS.COMPLEX_BREAKPOINT_WIDTH_INCREMENT,
          height: TEST_CONSTANTS.COMPLEX_BREAKPOINT_HEIGHT_BASE + i * TEST_CONSTANTS.COMPLEX_BREAKPOINT_HEIGHT_INCREMENT,
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
