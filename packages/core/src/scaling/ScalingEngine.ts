import {
  ResponsiveConfig,
  Breakpoint,
  ScalingToken,
  ScaledValue,
  ScaleOptions,
  PerformanceMetrics,
  ScalingError
} from '../types';

// Constants for better maintainability and enterprise-grade code
const EASE_IN_POWER = 0.5;
const EASE_OUT_POWER = 2;
const EASE_IN_OUT_THRESHOLD = 0.5;
const EASE_IN_OUT_MULTIPLIER = 2;
const EASE_IN_OUT_OFFSET = 2;
const EASE_IN_OUT_DIVISOR = 2;
const GOLDEN_RATIO = 1.618033988749895;
const MEMORY_ESTIMATE_MULTIPLIER = 100;
const DEFAULT_PRECISION = 1;
const DEFAULT_STEP = 1;
const DEFAULT_MIN_VALUE = 0;

/**
 * Core scaling engine that converts values between breakpoints
 * using mathematical precision and performance optimization
 */
export class ScalingEngine {
  private config: ResponsiveConfig;
  private cache: Map<string, ScaledValue>;
  private performanceMetrics: PerformanceMetrics;
  private scalingRatios: Map<string, number>;

  constructor(config: ResponsiveConfig) {
    this.config = config;
    this.cache = new Map();
    this.scalingRatios = new Map();
    this.performanceMetrics = {
      totalOperations: 0,
      cacheHitRate: 0,
      averageComputationTime: 0,
      memoryUsage: 0,
      peakMemoryUsage: 0
    };

    this.precomputeScalingRatios();
  }

  /**
   * Pre-compute scaling ratios for all breakpoint combinations
   * This dramatically improves performance for repeated calculations
   */
  private precomputeScalingRatios(): void {
    const { base, breakpoints } = this.config;
    
    breakpoints.forEach(targetBreakpoint => {
      const key = `${base.name}-${targetBreakpoint.name}`;
      const ratio = this.calculateBaseRatio(base, targetBreakpoint);
      this.scalingRatios.set(key, ratio);
    });
  }

  /**
   * Calculate the base scaling ratio between two breakpoints
   * This is the foundation of all scaling calculations
   */
  private calculateBaseRatio(from: Breakpoint, to: Breakpoint): number {
    const { origin } = this.config.strategy;
    
    switch (origin) {
      case 'width':
        return to.width / from.width;
      
      case 'height':
        return to.height / from.height;
      
      case 'min':
        return Math.min(to.width, to.height) / Math.min(from.width, from.height);
      
      case 'max':
        return Math.max(to.width, to.height) / Math.max(from.width, from.height);
      
      case 'diagonal': {
        const fromDiagonal = Math.sqrt(from.width ** 2 + from.height ** 2);
        const toDiagonal = Math.sqrt(to.width ** 2 + to.height ** 2);
        return toDiagonal / fromDiagonal;
      }
      
      case 'area': {
        const fromArea = from.width * from.height;
        const toArea = to.width * to.height;
        return toArea / fromArea;
      }
      
      default:
        throw new ScalingError(`Invalid scaling origin: ${origin}`, 'INVALID_CONFIG');
    }
  }

  /**
   * Scale a value from the base breakpoint to a target breakpoint
   * This is the main public API for scaling values
   */
  public scaleValue(
    value: number,
    targetBreakpoint: Breakpoint,
    options: ScaleOptions = {}
  ): ScaledValue {
    const startTime = performance.now();
    
    // Generate cache key
    const cacheKey = this.generateCacheKey(value, targetBreakpoint, options);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    
    if (cached && !options.bypassCache) {
      this.updatePerformanceMetrics(true, 0);
      // Return cached result with updated performance metrics
      return {
        ...cached,
        performance: {
          ...cached.performance,
          cacheHit: true
        }
      };
    }

    // Apply token-specific scaling rules if token is specified
    const scaledValue = this.applyTokenScaling(value, targetBreakpoint, options);
    
    // Calculate the result
    const result: ScaledValue = {
      original: value,
      scaled: scaledValue,
      targetBreakpoint,
      ratio: scaledValue / value,
      constraints: this.getAppliedConstraints(value, scaledValue, options),
      performance: {
        computationTime: performance.now() - startTime,
        cacheHit: false
      }
    };

    // Cache the result
    if (!options.bypassCache) {
      this.cache.set(cacheKey, result);
    }

    // Update performance metrics
    this.updatePerformanceMetrics(false, result.performance.computationTime);

    return result;
  }

  /**
   * Apply token-specific scaling rules using ScalingToken configuration
   */
  private applyTokenScaling(value: number, targetBreakpoint: Breakpoint, options: ScaleOptions): number {
    if (!options.token) {
      return this.calculateScaledValue(value, targetBreakpoint);
    }

    const tokenConfig = this.getTokenConfig(options.token);
    if (!tokenConfig) {
      return this.calculateScaledValue(value, targetBreakpoint);
    }

    let scaledValue = this.calculateScaledValue(value, targetBreakpoint);
    scaledValue = this.applyTokenScaleFactor(scaledValue, tokenConfig, targetBreakpoint, options);
    scaledValue = this.applyScalingCurve(scaledValue, targetBreakpoint, options);
    scaledValue = this.applyConstraints(scaledValue, tokenConfig, options);
    scaledValue = this.applyStepIncrement(scaledValue, tokenConfig, options);
    scaledValue = this.applyPrecision(scaledValue, tokenConfig);

    return scaledValue;
  }

  /**
   * Get token configuration with fallback handling
   */
  private getTokenConfig(token: string): ScalingToken | null {
    const tokenConfig = this.config.strategy.tokens[token as keyof typeof this.config.strategy.tokens];
    if (!tokenConfig) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn(`Token '${token}' not found in config, using default scaling`);
      }
      return null;
    }
    return tokenConfig;
  }

  /**
   * Apply token-specific scale factor
   */
  private applyTokenScaleFactor(
    scaledValue: number,
    tokenConfig: ScalingToken,
    targetBreakpoint: Breakpoint,
    options: ScaleOptions
  ): number {
    let scaleFactor = typeof tokenConfig.scale === 'function' 
      ? tokenConfig.scale(this.getScalingRatio(targetBreakpoint))
      : tokenConfig.scale;

    if (options.scale !== undefined) {
      scaleFactor = options.scale;
    }

    return scaledValue * scaleFactor;
  }

  /**
   * Apply scaling curve for non-linear scaling
   */
  private applyScalingCurve(
    scaledValue: number,
    targetBreakpoint: Breakpoint,
    options: ScaleOptions
  ): number {
    if (!options.token) return scaledValue;

    const tokenConfig = this.config.strategy.tokens[options.token];
    if (!tokenConfig?.curve || tokenConfig.curve === 'linear') {
      return scaledValue;
    }

    const ratio = this.getScalingRatio(targetBreakpoint);
    return this.applyScalingCurveByType(scaledValue, ratio, tokenConfig.curve);
  }

  /**
   * Apply specific scaling curve type
   */
  private applyScalingCurveByType(value: number, ratio: number, curve: string): number {
    switch (curve) {
      case 'ease-in':
        return value * Math.pow(ratio, EASE_IN_POWER);
      
      case 'ease-out':
        return value * Math.pow(ratio, EASE_OUT_POWER);
      
      case 'ease-in-out':
        return value * (ratio < EASE_IN_OUT_THRESHOLD 
          ? EASE_IN_OUT_MULTIPLIER * ratio * ratio 
          : 1 - Math.pow(-EASE_IN_OUT_OFFSET * ratio + EASE_IN_OUT_OFFSET, EASE_IN_OUT_OFFSET) / EASE_IN_OUT_DIVISOR);
      
      case 'golden-ratio':
        return value * Math.pow(ratio, 1 / GOLDEN_RATIO);
      
      default:
        return value;
    }
  }

  /**
   * Apply min/max constraints
   */
  private applyConstraints(
    scaledValue: number,
    tokenConfig: ScalingToken,
    options: ScaleOptions
  ): number {
    let result = scaledValue;
    
    // Apply minimum constraint
    if (tokenConfig.min !== undefined || options.min !== undefined) {
      const minValue = options.min ?? tokenConfig.min ?? DEFAULT_MIN_VALUE;
      if (result < minValue) {
        result = minValue;
      }
    }

    // Apply maximum constraint
    if (tokenConfig.max !== undefined || options.max !== undefined) {
      const maxValue = options.max ?? tokenConfig.max ?? Infinity;
      if (result > maxValue) {
        result = maxValue;
      }
    }

    return result;
  }

  /**
   * Apply step increment
   */
  private applyStepIncrement(
    scaledValue: number,
    tokenConfig: ScalingToken,
    options: ScaleOptions
  ): number {
    if (tokenConfig.step !== undefined || options.step !== undefined) {
      const step = options.step ?? tokenConfig.step ?? DEFAULT_STEP;
      return Math.round(scaledValue / step) * step;
    }
    return scaledValue;
  }

  /**
   * Apply precision rounding
   */
  private applyPrecision(scaledValue: number, tokenConfig: ScalingToken): number {
    const precision = tokenConfig.precision ?? DEFAULT_PRECISION;
    return Math.round(scaledValue * Math.pow(10, precision)) / Math.pow(10, precision);
  }


  /**
   * Get pre-computed scaling ratio for a target breakpoint
   */
  private getScalingRatio(targetBreakpoint: Breakpoint): number {
    const key = `${this.config.base.name}-${targetBreakpoint.name}`;
    const ratio = this.scalingRatios.get(key);
    
    if (ratio === undefined) {
      throw new ScalingError(`No scaling ratio found for ${key}`, 'INVALID_BREAKPOINT');
    }
    
    return ratio;
  }

  /**
   * Calculate scaled value using the base scaling ratio
   */
  private calculateScaledValue(value: number, targetBreakpoint: Breakpoint): number {
    const ratio = this.getScalingRatio(targetBreakpoint);
    return value * ratio;
  }

  /**
   * Get information about which constraints were applied
   */
  private getAppliedConstraints(original: number, scaled: number, options: ScaleOptions): ScaledValue['constraints'] {
    const token = options.token ? this.config.strategy.tokens[options.token] : null;
    
    return {
      minApplied: this.checkMinConstraintApplied(scaled, token, options),
      maxApplied: this.checkMaxConstraintApplied(scaled, token, options),
      stepApplied: this.checkStepConstraintApplied(scaled, token, options)
    };
  }

  /**
   * Check if minimum constraint was applied
   */
  private checkMinConstraintApplied(
    scaled: number,
    token: ScalingToken | null,
    options: ScaleOptions
  ): boolean {
    if (token?.min === undefined && options.min === undefined) {
      return false;
    }
    const minValue = options.min ?? token?.min ?? DEFAULT_MIN_VALUE;
    return scaled === minValue;
  }

  /**
   * Check if maximum constraint was applied
   */
  private checkMaxConstraintApplied(
    scaled: number,
    token: ScalingToken | null,
    options: ScaleOptions
  ): boolean {
    if (token?.max === undefined && options.max === undefined) {
      return false;
    }
    const maxValue = options.max ?? token?.max ?? Infinity;
    return scaled === maxValue;
  }

  /**
   * Check if step constraint was applied
   */
  private checkStepConstraintApplied(
    scaled: number,
    token: ScalingToken | null,
    options: ScaleOptions
  ): boolean {
    if (token?.step === undefined && options.step === undefined) {
      return false;
    }
    const step = options.step ?? token?.step ?? DEFAULT_STEP;
    return scaled % step === 0;
  }

  /**
   * Generate cache key for storing/retrieving scaled values
   */
  private generateCacheKey(
    value: number,
    targetBreakpoint: Breakpoint,
    options: ScaleOptions
  ): string {
    const parts = [
      value.toString(),
      targetBreakpoint.name,
      options.token ?? 'default',
      options.scale?.toString() ?? 'default',
      options.min?.toString() ?? 'default',
      options.max?.toString() ?? 'default',
      options.step?.toString() ?? 'default'
    ];
    
    return parts.join('|');
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(cacheHit: boolean, computationTime: number): void {
    this.performanceMetrics.totalOperations++;
    
    if (cacheHit) {
      this.performanceMetrics.cacheHitRate = 
        (this.performanceMetrics.cacheHitRate * (this.performanceMetrics.totalOperations - 1) + 1) / 
        this.performanceMetrics.totalOperations;
    } else {
      this.performanceMetrics.cacheHitRate = 
        (this.performanceMetrics.cacheHitRate * (this.performanceMetrics.totalOperations - 1)) / 
        this.performanceMetrics.totalOperations;
      
      this.performanceMetrics.averageComputationTime = 
        (this.performanceMetrics.averageComputationTime * (this.performanceMetrics.totalOperations - 1) + computationTime) / 
        this.performanceMetrics.totalOperations;
    }

    // Update memory usage
    const currentMemory = this.cache.size * MEMORY_ESTIMATE_MULTIPLIER; // Rough estimate
    this.performanceMetrics.memoryUsage = currentMemory;
    this.performanceMetrics.peakMemoryUsage = Math.max(
      this.performanceMetrics.peakMemoryUsage,
      currentMemory
    );
  }

  /**
   * Get current performance metrics
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Clear the cache to free memory
   */
  public clearCache(): void {
    this.cache.clear();
    this.performanceMetrics.memoryUsage = 0;
  }

  /**
   * Invalidate specific cache entries
   */
  public invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.clearCache();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Update configuration (useful for dynamic updates)
   */
  public updateConfig(newConfig: ResponsiveConfig): void {
    this.config = newConfig;
    this.scalingRatios.clear();
    this.precomputeScalingRatios();
    this.clearCache(); // Clear cache when config changes
  }
}
