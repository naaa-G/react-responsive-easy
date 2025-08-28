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
      
      case 'diagonal':
        const fromDiagonal = Math.sqrt(from.width ** 2 + from.height ** 2);
        const toDiagonal = Math.sqrt(to.width ** 2 + to.height ** 2);
        return toDiagonal / fromDiagonal;
      
      case 'area':
        const fromArea = from.width * from.height;
        const toArea = to.width * to.height;
        return toArea / fromArea;
      
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
      // Return cached result with updated cacheHit flag
      return {
        ...cached,
        performance: {
          ...cached.performance,
          cacheHit: true
        }
      };
    }

    try {
      // Perform scaling calculation
      const scaledValue = this.performScaling(value, targetBreakpoint, options);
      
      // Apply constraints (min, max, step)
      const { value: constrainedValue, constraints } = this.applyConstraints(scaledValue, options);
      
      // Create result object
      const result: ScaledValue = {
        original: value,
        scaled: constrainedValue,
        targetBreakpoint,
        ratio: this.getScalingRatio(targetBreakpoint),
        constraints: constraints,
        performance: {
          computationTime: performance.now() - startTime,
          cacheHit: false
        }
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      // Update performance metrics
      this.updatePerformanceMetrics(false, result.performance.computationTime);
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new ScalingError(`Scaling failed: ${errorMessage}`);
    }
  }

  /**
   * Perform the actual scaling calculation
   */
  private performScaling(
    value: number,
    targetBreakpoint: Breakpoint,
    options: ScaleOptions
  ): number {
    const baseRatio = this.getScalingRatio(targetBreakpoint);
    let tokenRatio = 1;

    // Apply token-specific scaling if specified
    if (options.token) {
      const tokenConfig = this.config.strategy.tokens[options.token];
      if (tokenConfig) {
        tokenRatio = typeof tokenConfig.scale === 'function' 
          ? tokenConfig.scale(baseRatio)
          : tokenConfig.scale;
      }
    }

    // Apply custom scale override if provided
    if (options.scale !== undefined) {
      tokenRatio = options.scale;
    }

    // Calculate final scaled value
    const scaledValue = value * baseRatio * tokenRatio;

    // Apply scaling curve if specified
    return this.applyScalingCurve(scaledValue, baseRatio, options);
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
      
      case 'golden-ratio':
        const phi = 1.618033988749895;
        return value * Math.pow(ratio, 1 / phi);
      
      default:
        return value;
    }
  }

  /**
   * Apply constraints to the scaled value
   */
  private applyConstraints(value: number, options: ScaleOptions): { 
    value: number; 
    constraints: { minApplied: boolean; maxApplied: boolean; stepApplied: boolean; } 
  } {
    let result = value;
    let minApplied = false;
    let maxApplied = false;
    let stepApplied = false;

    // Apply minimum constraint (from options or token config)
    let minConstraint = options.min;
    if (options.token) {
      const tokenConfig = this.config.strategy.tokens[options.token];
      if (tokenConfig?.min !== undefined) {
        minConstraint = minConstraint !== undefined ? Math.max(minConstraint, tokenConfig.min) : tokenConfig.min;
      }
    }
    
    if (minConstraint !== undefined) {
      const beforeMin = result;
      result = Math.max(result, minConstraint);
      minApplied = beforeMin !== result;
    }

    // Apply maximum constraint (from options or token config)
    let maxConstraint = options.max;
    if (options.token) {
      const tokenConfig = this.config.strategy.tokens[options.token];
      if (tokenConfig?.max !== undefined) {
        maxConstraint = maxConstraint !== undefined ? Math.min(maxConstraint, tokenConfig.max) : tokenConfig.max;
      }
    }
    
    if (maxConstraint !== undefined) {
      const beforeMax = result;
      result = Math.min(result, maxConstraint);
      maxApplied = beforeMax !== result;
    }

    // Apply step constraint (from options or token config)
    let stepConstraint = options.step;
    if (options.token) {
      const tokenConfig = this.config.strategy.tokens[options.token];
      if (tokenConfig?.step !== undefined) {
        stepConstraint = stepConstraint !== undefined ? stepConstraint : tokenConfig.step;
      }
    }
    
    if (stepConstraint !== undefined) {
      const beforeStep = result;
      result = Math.round(result / stepConstraint) * stepConstraint;
      stepApplied = beforeStep !== result;
    }

    // Apply rounding based on strategy
    const { rounding } = this.config.strategy;
    switch (rounding.mode) {
      case 'up':
        result = Math.ceil(result / rounding.precision) * rounding.precision;
        break;
      case 'down':
        result = Math.floor(result / rounding.precision) * rounding.precision;
        break;
      case 'nearest':
      default:
        result = Math.round(result / rounding.precision) * rounding.precision;
        break;
    }

    return { value: result, constraints: { minApplied, maxApplied, stepApplied } };
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
