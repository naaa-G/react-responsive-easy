/**
 * Scaling engine for responsive value calculations
 */

import type { ResponsiveConfig, Viewport, Breakpoint } from './types';

export class ScalingEngine {
  private config: ResponsiveConfig;
  private cache = new Map<string, number>();

  constructor(config: ResponsiveConfig) {
    this.config = config;
  }

  /**
   * Scale a value from base breakpoint to target breakpoint
   */
  scaleValue(
    baseValue: number,
    fromBreakpoint: Viewport,
    toBreakpoint: Breakpoint,
    token?: string
  ): number {
    // Create cache key
    const cacheKey = `${baseValue}-${fromBreakpoint.width}-${toBreakpoint.width}-${token ?? 'default'}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const fromSize = this.getSize(fromBreakpoint);
    const toSize = this.getSize(toBreakpoint);
    const ratio = toSize / fromSize;
    
    // Apply viewport scaling first
    let scaledValue = baseValue * ratio;
    
    // Then apply token-specific rules (but don't apply scale again)
    if (token && this.config.strategy.tokens[token]) {
      scaledValue = this.applyTokenRules(scaledValue, token, 1); // Pass 1 as ratio to avoid double scaling
    }
    
    // Apply rounding
    scaledValue = this.applyRounding(scaledValue);
    
    // Cache the result
    this.cache.set(cacheKey, scaledValue);
    
    return scaledValue;
  }

  /**
   * Get size value based on strategy origin
   */
  private getSize(breakpoint: Viewport | Breakpoint): number {
    switch (this.config.strategy.origin) {
      case 'width':
        return breakpoint.width;
      case 'height':
        return breakpoint.height;
      case 'min':
        return Math.min(breakpoint.width, breakpoint.height);
      case 'max':
        return Math.max(breakpoint.width, breakpoint.height);
      case 'diagonal':
        return Math.sqrt(breakpoint.width ** 2 + breakpoint.height ** 2);
      case 'area':
        return breakpoint.width * breakpoint.height;
      default:
        return breakpoint.width;
    }
  }

  /**
   * Apply token-specific scaling rules
   */
  private applyTokenRules(value: number, token: string, ratio: number): number {
    const tokenConfig = this.config.strategy.tokens[token];
    if (!tokenConfig) return value;

    let scaledValue = value;

    // Apply scale function
    if (tokenConfig.scale) {
      if (typeof tokenConfig.scale === 'function') {
        scaledValue = tokenConfig.scale(value, ratio);
      } else {
        scaledValue = value * tokenConfig.scale;
      }
    }

    // Apply step first (before constraints)
    if (tokenConfig.step !== undefined) {
      scaledValue = Math.round(scaledValue / tokenConfig.step) * tokenConfig.step;
    }

    // Apply constraints after step
    if (tokenConfig.min !== undefined && scaledValue < tokenConfig.min) {
      scaledValue = tokenConfig.min;
    }
    if (tokenConfig.max !== undefined && scaledValue > tokenConfig.max) {
      scaledValue = tokenConfig.max;
    }

    return scaledValue;
  }

  /**
   * Apply rounding rules
   */
  private applyRounding(value: number): number {
    const { mode, precision } = this.config.strategy.rounding;
    
    if (precision <= 0) return value;

    switch (mode) {
      case 'floor':
        return Math.floor(value / precision) * precision;
      case 'ceil':
        return Math.ceil(value / precision) * precision;
      case 'nearest':
      default:
        return Math.round(value / precision) * precision;
    }
  }

  /**
   * Scale value for all breakpoints
   */
  scaleForAllBreakpoints(baseValue: number, token?: string): Record<string, number> {
    const result: Record<string, number> = {};
    
    for (const breakpoint of this.config.breakpoints) {
      result[breakpoint.name] = this.scaleValue(
        baseValue,
        this.config.base,
        breakpoint,
        token
      );
    }
    
    return result;
  }

  /**
   * Get CSS custom properties for a value
   */
  getCSSProperties(baseValue: number, propertyName: string, token?: string): Record<string, string> {
    const scaledValues = this.scaleForAllBreakpoints(baseValue, token);
    const result: Record<string, string> = {};
    
    for (const [breakpoint, value] of Object.entries(scaledValues)) {
      const unit = (token && this.config.strategy.tokens[token]?.unit) ?? 'px';
      result[`--${propertyName}-${breakpoint}`] = `${value}${unit}`;
    }
    
    return result;
  }

  /**
   * Update configuration
   */
  updateConfig(config: ResponsiveConfig): void {
    this.config = config;
  }

  /**
   * Get current configuration
   */
  getConfig(): ResponsiveConfig {
    return this.config;
  }
}
