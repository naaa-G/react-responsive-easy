// Core types for React Responsive Easy scaling engine

/**
 * Represents a breakpoint with width, height, and optional metadata
 */
export interface Breakpoint {
  /** Unique identifier for the breakpoint */
  name: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Optional alias (e.g., 'base', 'mobile', 'desktop') */
  alias?: string;
  /** Optional custom properties */
  custom?: Record<string, any>;
}

/**
 * Configuration for how a specific token type scales
 */
export interface ScalingToken {
  /** Scaling factor (0.5 = half size, 1.0 = same size, 2.0 = double size) */
  scale: number | ((ratio: number) => number);
  /** Minimum value to prevent scaling below accessibility thresholds */
  min?: number;
  /** Maximum value to prevent excessive scaling */
  max?: number;
  /** Step increment for discrete scaling (e.g., spacing) */
  step?: number;
  /** Scaling curve for non-linear scaling */
  curve?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'golden-ratio' | 'custom';
  /** CSS unit for the value */
  unit?: 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh';
  /** Decimal precision for rounding */
  precision?: number;
  /** Whether this token should scale responsively */
  responsive?: boolean;
}

/**
 * Primary scaling strategy configuration
 */
export interface ScalingStrategy {
  /** What dimension to use as the primary scaling factor */
  origin: 'width' | 'height' | 'min' | 'max' | 'diagonal' | 'area';
  /** Scaling mode for complex calculations */
  mode: 'linear' | 'exponential' | 'logarithmic' | 'golden-ratio' | 'custom';
  /** Token-specific scaling configurations */
  tokens: {
    fontSize: ScalingToken;
    spacing: ScalingToken;
    radius: ScalingToken;
    lineHeight: ScalingToken;
    shadow: ScalingToken;
    border: ScalingToken;
  };
  /** Rounding rules for scaled values */
  rounding: {
    mode: 'nearest' | 'up' | 'down' | 'custom';
    precision: number;
  };
  /** Accessibility constraints */
  accessibility: {
    minFontSize: number;
    minTapTarget: number;
    contrastPreservation: boolean;
  };
  /** Performance optimization settings */
  performance: {
    memoization: boolean;
    cacheStrategy: 'memory' | 'localStorage' | 'sessionStorage';
    precomputeValues: boolean;
  };
}

/**
 * Complete configuration for the responsive system
 */
export interface ResponsiveConfig {
  /** Base breakpoint (usually the largest) */
  base: Breakpoint;
  /** All breakpoints including base */
  breakpoints: Breakpoint[];
  /** Scaling strategy configuration */
  strategy: ScalingStrategy;
  /** Development and debugging options */
  development?: {
    enableDebugMode: boolean;
    showScalingInfo: boolean;
    logScalingCalculations: boolean;
  };
}

/**
 * Result of a scaling calculation
 */
export interface ScaledValue {
  /** The original value */
  original: number;
  /** The scaled value */
  scaled: number;
  /** The breakpoint this was scaled to */
  targetBreakpoint: Breakpoint;
  /** The scaling ratio used */
  ratio: number;
  /** Any constraints applied (min/max) */
  constraints: {
    minApplied: boolean;
    maxApplied: boolean;
    stepApplied: boolean;
  };
  /** Performance metrics */
  performance: {
    computationTime: number;
    cacheHit: boolean;
  };
}

/**
 * Context value for the responsive provider
 */
export interface ResponsiveContextValue {
  /** Current configuration */
  config: ResponsiveConfig;
  /** Current breakpoint */
  currentBreakpoint: Breakpoint;
  /** Pre-computed scaling ratios for performance */
  scalingRatios: Record<string, number>;
  /** Cache of computed values */
  computedValues: Map<string, ScaledValue>;
  /** Function to invalidate cache */
  invalidateCache: () => void;
  /** Function to force re-computation */
  forceRecompute: () => void;
}

/**
 * Options for scaling a value
 */
export interface ScaleOptions {
  /** Token type for specific scaling rules */
  token?: keyof ScalingStrategy['tokens'];
  /** Override scaling factor */
  scale?: number;
  /** Override minimum value */
  min?: number;
  /** Override maximum value */
  max?: number;
  /** Override step increment */
  step?: number;
  /** Override unit */
  unit?: string;
  /** Whether to bypass cache */
  bypassCache?: boolean;
}

/**
 * Performance metrics for the scaling engine
 */
export interface PerformanceMetrics {
  /** Total scaling operations performed */
  totalOperations: number;
  /** Cache hit rate percentage */
  cacheHitRate: number;
  /** Average computation time in milliseconds */
  averageComputationTime: number;
  /** Memory usage in bytes */
  memoryUsage: number;
  /** Peak memory usage in bytes */
  peakMemoryUsage: number;
}

/**
 * Error class for the scaling engine
 */
export class ScalingError extends Error {
  public code: 'INVALID_BREAKPOINT' | 'INVALID_CONFIG' | 'SCALING_FAILED' | 'CACHE_ERROR';
  public details?: any;

  constructor(message: string, code: ScalingError['code'] = 'SCALING_FAILED', details?: any) {
    super(message);
    this.name = 'ScalingError';
    this.code = code;
    this.details = details;
  }
}
