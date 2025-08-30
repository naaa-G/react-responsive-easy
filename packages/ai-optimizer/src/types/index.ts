import { ResponsiveConfig, Breakpoint, ScalingToken } from '@react-responsive-easy/core';

/**
 * Component usage data collected from real applications
 */
export interface ComponentUsageData {
  /** Component identifier */
  componentId: string;
  /** Component type (e.g., 'Button', 'Card', 'Text') */
  componentType: string;
  /** Responsive values used in this component */
  responsiveValues: ResponsiveValueUsage[];
  /** Performance metrics */
  performance: PerformanceMetrics;
  /** User interaction data */
  interactions: InteractionData;
  /** Visual hierarchy context */
  context: ComponentContext;
}

/**
 * Individual responsive value usage tracking
 */
export interface ResponsiveValueUsage {
  /** CSS property name */
  property: string;
  /** Base value used */
  baseValue: number;
  /** Token type used */
  token: string;
  /** Breakpoint-specific values */
  breakpointValues: Record<string, number>;
  /** How often this value is used */
  usageFrequency: number;
  /** User satisfaction score (from A/B testing) */
  satisfactionScore?: number;
}

/**
 * Performance metrics for components
 */
export interface PerformanceMetrics {
  /** Render time in milliseconds */
  renderTime: number;
  /** Layout shift score */
  layoutShift: number;
  /** Memory usage in bytes */
  memoryUsage: number;
  /** Bundle size impact */
  bundleSize: number;
}

/**
 * User interaction tracking
 */
export interface InteractionData {
  /** Click/tap rate */
  interactionRate: number;
  /** Time spent viewing component */
  viewTime: number;
  /** Scroll behavior around component */
  scrollBehavior: 'smooth' | 'jumpy' | 'normal';
  /** Accessibility compliance score */
  accessibilityScore: number;
}

/**
 * Component visual context
 */
export interface ComponentContext {
  /** Parent component type */
  parent?: string;
  /** Child components */
  children: string[];
  /** Position in layout */
  position: 'header' | 'main' | 'sidebar' | 'footer' | 'modal' | 'other';
  /** Importance level */
  importance: 'primary' | 'secondary' | 'tertiary';
}

/**
 * AI model optimization suggestions
 */
export interface OptimizationSuggestions {
  /** Suggested token configurations */
  suggestedTokens: Record<string, ScalingToken>;
  /** Scaling curve recommendations */
  scalingCurveRecommendations: ScalingCurveRecommendation[];
  /** Performance impact predictions */
  performanceImpacts: PerformanceImpact[];
  /** Accessibility warnings and improvements */
  accessibilityWarnings: AccessibilityWarning[];
  /** Overall confidence score (0-1) */
  confidenceScore: number;
  /** Estimated improvement metrics */
  estimatedImprovements: EstimatedImprovements;
}

/**
 * Scaling curve recommendation
 */
export interface ScalingCurveRecommendation {
  /** Token this applies to */
  token: string;
  /** Recommended scaling mode */
  mode: 'linear' | 'exponential' | 'logarithmic' | 'golden-ratio' | 'custom';
  /** Recommended scaling factor */
  scale: number;
  /** Breakpoint-specific adjustments */
  breakpointAdjustments: Record<string, number>;
  /** Confidence in this recommendation */
  confidence: number;
  /** Reasoning for the recommendation */
  reasoning: string;
}

/**
 * Performance impact prediction
 */
export interface PerformanceImpact {
  /** What aspect of performance is affected */
  aspect: 'bundle-size' | 'render-time' | 'memory' | 'layout-shift';
  /** Current value */
  currentValue: number;
  /** Predicted value with optimization */
  predictedValue: number;
  /** Improvement percentage */
  improvementPercent: number;
  /** Impact severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Accessibility warning or improvement
 */
export interface AccessibilityWarning {
  /** Type of accessibility issue */
  type: 'font-size' | 'tap-target' | 'contrast' | 'spacing' | 'motion';
  /** Current value that's problematic */
  currentValue: number;
  /** Recommended value */
  recommendedValue: number;
  /** WCAG guideline reference */
  wcagReference: string;
  /** Severity level */
  severity: 'AA' | 'AAA' | 'best-practice';
  /** Description of the issue */
  description: string;
}

/**
 * Estimated improvements from applying suggestions
 */
export interface EstimatedImprovements {
  /** Performance improvements */
  performance: {
    renderTime: number; // percentage improvement
    bundleSize: number; // percentage reduction
    memoryUsage: number; // percentage reduction
    layoutShift: number; // CLS improvement
  };
  /** User experience improvements */
  userExperience: {
    interactionRate: number; // percentage improvement
    accessibilityScore: number; // score improvement
    visualHierarchy: number; // clarity improvement
  };
  /** Developer experience improvements */
  developerExperience: {
    codeReduction: number; // percentage less code needed
    maintenanceEffort: number; // percentage less maintenance
    debuggingTime: number; // percentage faster debugging
  };
}

/**
 * Training data for the AI model
 */
export interface TrainingData {
  /** Input features */
  features: ModelFeatures;
  /** Expected output */
  labels: ModelLabels;
  /** Data source metadata */
  metadata: TrainingMetadata;
}

/**
 * Features extracted for machine learning
 */
export interface ModelFeatures {
  /** Configuration features */
  config: ConfigurationFeatures;
  /** Usage pattern features */
  usage: UsageFeatures;
  /** Performance features */
  performance: PerformanceFeatures;
  /** Context features */
  context: ContextFeatures;
}

/**
 * Configuration-based features
 */
export interface ConfigurationFeatures {
  /** Number of breakpoints */
  breakpointCount: number;
  /** Breakpoint size ratios */
  breakpointRatios: number[];
  /** Token configuration complexity */
  tokenComplexity: number;
  /** Scaling origin distribution */
  originDistribution: Record<string, number>;
}

/**
 * Usage pattern features
 */
export interface UsageFeatures {
  /** Most common responsive values */
  commonValues: number[];
  /** Value distribution patterns */
  valueDistributions: Record<string, number[]>;
  /** Component type frequencies */
  componentFrequencies: Record<string, number>;
  /** Property usage patterns */
  propertyPatterns: Record<string, number>;
}

/**
 * Performance-based features
 */
export interface PerformanceFeatures {
  /** Average render times */
  avgRenderTimes: number[];
  /** Bundle size distribution */
  bundleSizes: number[];
  /** Memory usage patterns */
  memoryPatterns: number[];
  /** Layout shift frequencies */
  layoutShiftFreq: number[];
}

/**
 * Context-based features
 */
export interface ContextFeatures {
  /** Application type (e.g., 'e-commerce', 'blog', 'dashboard') */
  applicationType: string;
  /** Target device distribution */
  deviceDistribution: Record<string, number>;
  /** User behavior patterns */
  userBehavior: Record<string, number>;
  /** Industry context */
  industry: string;
}

/**
 * Training labels (expected outputs)
 */
export interface ModelLabels {
  /** Optimal token configurations */
  optimalTokens: Record<string, ScalingToken>;
  /** Performance scores */
  performanceScores: Record<string, number>;
  /** User satisfaction ratings */
  satisfactionRatings: number[];
  /** Accessibility compliance scores */
  accessibilityScores: Record<string, number>;
}

/**
 * Training data metadata
 */
export interface TrainingMetadata {
  /** Data collection timestamp */
  timestamp: Date;
  /** Application source */
  source: string;
  /** Data quality score */
  qualityScore: number;
  /** Sample size */
  sampleSize: number;
  /** Geographic region */
  region: string;
}

/**
 * Model evaluation metrics
 */
export interface ModelEvaluationMetrics {
  /** Prediction accuracy */
  accuracy: number;
  /** Precision score */
  precision: number;
  /** Recall score */
  recall: number;
  /** F1 score */
  f1Score: number;
  /** Mean squared error */
  mse: number;
  /** Confidence intervals */
  confidenceIntervals: Record<string, [number, number]>;
}

/**
 * AI model configuration
 */
export interface AIModelConfig {
  /** Model architecture type */
  architecture: 'neural-network' | 'random-forest' | 'gradient-boosting' | 'ensemble';
  /** Training parameters */
  training: {
    epochs: number;
    batchSize: number;
    learningRate: number;
    validationSplit: number;
  };
  /** Feature engineering settings */
  features: {
    normalization: 'standard' | 'minmax' | 'robust';
    dimensionalityReduction: boolean;
    featureSelection: boolean;
  };
  /** Model persistence settings */
  persistence: {
    saveFrequency: number;
    modelVersioning: boolean;
    backupStrategy: 'local' | 'cloud' | 'both';
  };
}
