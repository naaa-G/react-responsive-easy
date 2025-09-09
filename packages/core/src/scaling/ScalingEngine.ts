import {
  ResponsiveConfig,
  Breakpoint,
  ScalingToken,
  ScaledValue,
  ScaleOptions,
  PerformanceMetrics,
  ScalingError
} from '../types';

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
      // No token specified, use default scaling
      return this.calculateScaledValue(value, targetBreakpoint);
    }

    const tokenConfig: ScalingToken = this.config.strategy.tokens[options.token];
    if (!tokenConfig) {
      console.warn(`Token '${options.token}' not found in config, using default scaling`);
      return this.calculateScaledValue(value, targetBreakpoint);
    }

    // First apply viewport-based scaling
    let scaledValue = this.calculateScaledValue(value, targetBreakpoint);
    
    // Then apply token-specific scaling factor
    let scaleFactor = typeof tokenConfig.scale === 'function' 
      ? tokenConfig.scale(this.getScalingRatio(targetBreakpoint))
      : tokenConfig.scale;

    // Override with options if provided
    if (options.scale !== undefined) {
      scaleFactor = options.scale;
    }

    // Apply the token scale factor to the viewport-scaled value
    scaledValue = scaledValue * scaleFactor;

    // Apply scaling curve for non-linear scaling
    if (tokenConfig.curve && tokenConfig.curve !== 'linear') {
      const ratio = this.getScalingRatio(targetBreakpoint);
      scaledValue = this.applyScalingCurve(scaledValue, ratio, options);
    }

    // Apply constraints
    if (tokenConfig.min !== undefined || options.min !== undefined) {
      const minValue = options.min ?? tokenConfig.min ?? 0;
      if (scaledValue < minValue) {
        scaledValue = minValue;
      }
    }

    if (tokenConfig.max !== undefined || options.max !== undefined) {
      const maxValue = options.max ?? tokenConfig.max ?? Infinity;
      if (scaledValue > maxValue) {
        scaledValue = maxValue;
      }
    }

    // Apply step increment if specified
    if (tokenConfig.step !== undefined || options.step !== undefined) {
      const step = options.step ?? tokenConfig.step ?? 1;
      scaledValue = Math.round(scaledValue / step) * step;
    }

    // Apply precision
    const precision = tokenConfig.precision ?? 1;
    scaledValue = Math.round(scaledValue * Math.pow(10, precision)) / Math.pow(10, precision);

    return scaledValue;
  }

  /**
   * Apply scaling curve for non-linear scaling
   */
  private applyScalingCurve(
    value: number,
    ratio: number,
    options: ScaleOptions
  ): number {
    if (!options.token) return value;

    const tokenConfig = this.config.strategy.tokens[options.token];
    if (!tokenConfig?.curve || tokenConfig.curve === 'linear') {
      return value;
    }

    switch (tokenConfig.curve) {
      case 'ease-in':
        return value * Math.pow(ratio, 0.5);
      
      case 'ease-out':
        return value * Math.pow(ratio, 2);
      
      case 'ease-in-out':
        return value * (ratio < 0.5 
          ? 2 * ratio * ratio 
          : 1 - Math.pow(-2 * ratio + 2, 2) / 2);
      
      case 'golden-ratio': {
        const phi = 1.618033988749895;
        return value * Math.pow(ratio, 1 / phi);
      }
      
      default:
        return value;
    }
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
    
    // Check if min constraint was applied
    let minApplied = false;
    if (token?.min !== undefined || options.min !== undefined) {
      const minValue = options.min ?? token?.min ?? 0;
      minApplied = scaled === minValue;
    }
    
    // Check if max constraint was applied
    let maxApplied = false;
    if (token?.max !== undefined || options.max !== undefined) {
      const maxValue = options.max ?? token?.max ?? Infinity;
      maxApplied = scaled === maxValue;
    }
    
    // Check if step constraint was applied
    let stepApplied = false;
    if (token?.step !== undefined || options.step !== undefined) {
      const step = options.step ?? token?.step ?? 1;
      stepApplied = scaled % step === 0;
    }
    
    return {
      minApplied,
      maxApplied,
      stepApplied
    };
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
      options.token || 'default',
      options.scale?.toString() || 'default',
      options.min?.toString() || 'default',
      options.max?.toString() || 'default',
      options.step?.toString() || 'default'
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
    const currentMemory = this.cache.size * 100; // Rough estimate
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
