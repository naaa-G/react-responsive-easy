import { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';
import {
  ComponentUsageData,
  ModelFeatures,
  ConfigurationFeatures,
  UsageFeatures,
  PerformanceFeatures,
  ContextFeatures
} from '../types/index.js';
import { ADDITIONAL_CONSTANTS } from '../constants.js';
import { Logger } from '../utils/Logger.js';

/**
 * Feature extraction engine for AI optimization
 * 
 * Converts raw configuration and usage data into numerical features
 * that can be used by machine learning models.
 */
export class FeatureExtractor {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('FeatureExtractor');
  }

  /**
   * Extract comprehensive features from configuration and usage data
   */
  extractFeatures(
    config: ResponsiveConfig,
    usageData: ComponentUsageData[]
  ): ModelFeatures {
    return {
      config: this.extractConfigurationFeatures(config),
      usage: this.extractUsageFeatures(usageData),
      performance: this.extractPerformanceFeatures(usageData),
      context: this.extractContextFeatures(usageData)
    };
  }

  /**
   * Convert feature object to numerical vector for model input
   */
  featuresToVector(features: ModelFeatures): number[] {
    const vector: number[] = [];
    
    // Defensive null checks
    if (!features) {
      this.logger.warn('Features object is null/undefined, returning empty vector');
      return [];
    }
    
    // Add different feature types to vector
    vector.push(...this.extractConfigVector(features.config));
    vector.push(...this.extractUsageVector(features.usage));
    vector.push(...this.extractPerformanceVector(features.performance));
    vector.push(...this.extractContextVector(features.context));
    
    // Pad or truncate to exactly FEATURE_DIMENSION features
    return this.normalizeVectorLength(vector);
  }

  /**
   * Extract configuration features vector
   */
  private extractConfigVector(config: ConfigurationFeatures | undefined): number[] {
    const configData = config ?? this.getDefaultConfigurationFeatures();
    const vector: number[] = [];
    
    vector.push(configData.breakpointCount ?? 0);
    vector.push(...(configData.breakpointRatios ?? []));
    vector.push(configData.tokenComplexity ?? 0);
    vector.push(...Object.values(configData.originDistribution ?? {}));
    
    return vector;
  }

  /**
   * Extract usage features vector
   */
  private extractUsageVector(usage: UsageFeatures | undefined): number[] {
    const usageData = usage ?? this.getDefaultUsageFeatures();
    const vector: number[] = [];
    
    vector.push(...(usageData.commonValues ?? []));
    vector.push(...Object.values(usageData.componentFrequencies ?? {}).slice(0, ADDITIONAL_CONSTANTS.DEFAULT_STEP));
    vector.push(...Object.values(usageData.propertyPatterns ?? {}).slice(0, ADDITIONAL_CONSTANTS.DEFAULT_STEP));
    
    return vector;
  }

  /**
   * Extract performance features vector
   */
  private extractPerformanceVector(performance: PerformanceFeatures | undefined): number[] {
    const perfData = performance ?? this.getDefaultPerformanceFeatures();
    const vector: number[] = [];
    
    vector.push(...(perfData.avgRenderTimes ?? []));
    vector.push(...(perfData.bundleSizes ?? []));
    vector.push(...(perfData.memoryPatterns ?? []));
    vector.push(...(perfData.layoutShiftFreq ?? []));
    
    return vector;
  }

  /**
   * Extract context features vector
   */
  private extractContextVector(context: ContextFeatures | undefined): number[] {
    const contextData = context ?? this.getDefaultContextFeatures();
    const vector: number[] = [];
    
    vector.push(this.encodeApplicationType(contextData.applicationType));
    vector.push(...Object.values(contextData.deviceDistribution ?? {}));
    vector.push(...Object.values(contextData.userBehavior ?? {}));
    vector.push(this.encodeIndustry(contextData.industry));
    
    return vector;
  }

  /**
   * Normalize vector to exact feature dimension
   */
  private normalizeVectorLength(vector: number[]): number[] {
    while (vector.length < ADDITIONAL_CONSTANTS.FEATURE_DIMENSION) {
      vector.push(0);
    }
    
    return vector.slice(0, ADDITIONAL_CONSTANTS.FEATURE_DIMENSION);
  }

  /**
   * Extract configuration-based features
   */
  private extractConfigurationFeatures(config: ResponsiveConfig): ConfigurationFeatures {
    // Defensive programming - handle missing config properties
    if (!config?.breakpoints || !config.base || !config.strategy) {
      return this.getDefaultConfigurationFeatures();
    }

    const breakpoints = config.breakpoints;
    const breakpointRatios = this.calculateBreakpointRatios(breakpoints, config.base?.width);
    const tokenComplexity = this.calculateTokenComplexity(config.strategy?.tokens);
    const originDistribution = this.calculateOriginDistribution(config.strategy?.origin);
    
    return {
      breakpointCount: breakpoints?.length || 0,
      breakpointRatios: this.padArray(breakpointRatios, ADDITIONAL_CONSTANTS.DEFAULT_STEP, 1),
      tokenComplexity,
      originDistribution
    };
  }

  /**
   * Calculate breakpoint ratios
   */
  private calculateBreakpointRatios(breakpoints: Array<{ width?: number }>, baseWidth?: number): number[] {
    const defaultBaseWidth = ADDITIONAL_CONSTANTS.MOBILE_BASE_WIDTH;
    const actualBaseWidth = baseWidth ?? defaultBaseWidth;
    
    return breakpoints.map(bp => {
      if (!bp || typeof bp.width !== 'number') {
        return actualBaseWidth / actualBaseWidth; // Default to 1
      }
      return bp.width / actualBaseWidth;
    });
  }

  /**
   * Calculate token complexity
   */
  private calculateTokenComplexity(tokens: Record<string, unknown> | undefined): number {
    const tokenData = tokens ?? {};
    let complexity = 0;
    
    Object.values(tokenData).forEach(token => {
      if (!token) return;
      const tokenObj = token as { min?: number; max?: number; step?: number; responsive?: boolean };
      complexity += (tokenObj.min !== undefined ? 1 : 0);
      complexity += (tokenObj.max !== undefined ? 1 : 0);
      complexity += (tokenObj.step !== undefined ? 1 : 0);
      complexity += (tokenObj.responsive !== false ? 1 : 0);
    });
    
    return complexity;
  }

  /**
   * Calculate origin distribution
   */
  private calculateOriginDistribution(origin: string | undefined): Record<string, number> {
    const actualOrigin = origin ?? 'width';
    
    return {
      width: actualOrigin === 'width' ? 1 : 0,
      height: actualOrigin === 'height' ? 1 : 0,
      min: actualOrigin === 'min' ? 1 : 0,
      max: actualOrigin === 'max' ? 1 : 0,
      diagonal: actualOrigin === 'diagonal' ? 1 : 0,
      area: actualOrigin === 'area' ? 1 : 0
    };
  }

  /**
   * Extract usage pattern features
   */
  private extractUsageFeatures(usageData: ComponentUsageData[]): UsageFeatures {
    // Defensive programming - handle null/undefined usage data
    if (!usageData || !Array.isArray(usageData)) {
      return this.getDefaultUsageFeatures();
    }

    // Collect all responsive values
    const allValues: number[] = [];
    const componentTypes: Record<string, number> = {};
    const properties: Record<string, number> = {};
    const valueDistributions: Record<string, number[]> = {};
    
    usageData.forEach(data => {
      if (!data?.componentType) return;
      
      // Count component types
      componentTypes[data.componentType] = (componentTypes[data.componentType] ?? 0) + 1;
      
      // Handle null/undefined responsiveValues
      if (!data.responsiveValues || !Array.isArray(data.responsiveValues)) return;
      
      data.responsiveValues.forEach(value => {
        if (!value || typeof value.baseValue !== 'number') return;
        allValues.push(value.baseValue);
        
        // Count properties (raw occurrence count)
        properties[value.property] = (properties[value.property] || 0) + 1;
        
        // Collect value distributions by token
        if (!valueDistributions[value.token]) {
          valueDistributions[value.token] = [];
        }
        valueDistributions[value.token].push(value.baseValue);
      });
    });
    
    // Find most common values
    const valueFrequency: Record<number, number> = {};
    allValues.forEach(val => {
      valueFrequency[val] = (valueFrequency[val] ?? 0) + 1;
    });
    
    const commonValues = Object.entries(valueFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([val]) => parseFloat(val));
    
    // Normalize component frequencies
    const totalComponents = Object.values(componentTypes).reduce((sum, count) => sum + count, 0);
    const componentFrequencies: Record<string, number> = {};
    Object.entries(componentTypes).forEach(([type, count]) => {
      componentFrequencies[type] = count / totalComponents;
    });
    
    // Keep raw property counts (not normalized)
    const propertyPatterns: Record<string, number> = { ...properties };
    
    return {
      commonValues: this.padArray(commonValues, 10, 0),
      valueDistributions,
      componentFrequencies,
      propertyPatterns
    };
  }

  /**
   * Extract performance-based features
   */
  private extractPerformanceFeatures(usageData: ComponentUsageData[]): PerformanceFeatures {
    const renderTimes: number[] = [];
    const bundleSizes: number[] = [];
    const memoryUsages: number[] = [];
    const layoutShifts: number[] = [];
    
    usageData.forEach(data => {
      renderTimes.push(data.performance.renderTime);
      bundleSizes.push(data.performance.bundleSize);
      memoryUsages.push(data.performance.memoryUsage);
      layoutShifts.push(data.performance.layoutShift);
    });
    
    return {
      avgRenderTimes: this.calculateStatistics(renderTimes, 5), // mean, median, min, max, std
      bundleSizes: this.calculateStatistics(bundleSizes, 5), // mean, median, min, max, std
      memoryPatterns: this.calculateStatistics(memoryUsages, 5), // mean, median, min, max, std
      layoutShiftFreq: this.calculateStatistics(layoutShifts, 5) // mean, median, min, max, std
    };
  }

  /**
   * Extract context-based features
   */
  private extractContextFeatures(usageData: ComponentUsageData[]): ContextFeatures {
    // Defensive programming - handle null/undefined usage data
    if (!usageData || !Array.isArray(usageData)) {
      return this.getDefaultContextFeatures();
    }

    // Infer application type from component patterns
    const componentTypes = usageData
      .filter(d => d?.componentType)
      .map(d => d.componentType);
    const applicationType = this.inferApplicationType(componentTypes);
    
    // Calculate device distribution from context data
    const positions = usageData
      .filter(d => d?.context?.position)
      .map(d => d.context!.position);
    const deviceDistribution = this.calculateDeviceDistribution(positions);
    
    // Analyze user behavior patterns
    const interactions = usageData.map(d => d.interactions);
    const userBehavior = this.analyzeUserBehavior(interactions);
    
    // Infer industry context
    const industry = this.inferIndustry(componentTypes, applicationType);
    
    return {
      applicationType,
      deviceDistribution,
      userBehavior,
      industry
    };
  }

  /**
   * Calculate statistical features from numerical array
   */
  private calculateStatistics(values: number[], count: number): number[] {
    if (values.length === 0) {
      return new Array(count).fill(0);
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    // Calculate standard deviation - handle single value case
    let std = 0;
    if (values.length > 1) {
      std = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      );
    }
    
    return this.padArray([mean, median, min, max, std], count, 0);
  }

  /**
   * Infer application type from component patterns
   */
  private inferApplicationType(componentTypes: string[]): string {
    const typeFreq: Record<string, number> = {};
    componentTypes.forEach(type => {
      typeFreq[type] = (typeFreq[type] || 0) + 1;
    });
    
    // E-commerce indicators
    if (typeFreq['ProductCard'] || typeFreq['ShoppingCart'] || typeFreq['PriceTag']) {
      return 'e-commerce';
    }
    
    // Dashboard indicators
    if (typeFreq['Chart'] || typeFreq['DataTable'] || typeFreq['Widget']) {
      return 'dashboard';
    }
    
    // Blog indicators
    if (typeFreq['Article'] || typeFreq['BlogPost'] || typeFreq['Comment']) {
      return 'blog';
    }
    
    // Social media indicators
    if (typeFreq['Post'] || typeFreq['Profile'] || typeFreq['Feed']) {
      return 'social';
    }
    
    return 'general';
  }

  /**
   * Calculate device distribution from position data
   */
  private calculateDeviceDistribution(positions: string[]): Record<string, number> {
    if (!positions || positions.length === 0) {
      return { desktop: 0, tablet: 0, mobile: 0, other: 0 };
    }

    const positionFreq: Record<string, number> = {};
    positions.forEach(pos => {
      if (pos) {
        positionFreq[pos] = (positionFreq[pos] || 0) + 1;
      }
    });
    
    const total = positions.length;
    if (total === 0) {
      return { desktop: 0, tablet: 0, mobile: 0, other: 0 };
    }

    // More realistic device distribution mapping
    return {
      desktop: (positionFreq.main || 0) / total,
      tablet: (positionFreq.sidebar || 0) / total,
      mobile: (positionFreq.header || 0) / total,
      other: ((positionFreq.footer || 0) + (positionFreq.modal || 0)) / total
    };
  }

  /**
   * Analyze user behavior patterns
   */
  private analyzeUserBehavior(interactions: unknown[]): Record<string, number> {
    if (!interactions || interactions.length === 0) {
      return { engagement: 0, accessibility: 0, performance: 0 };
    }
    
    try {
      const validInteractions = interactions.filter(i => i && typeof i === 'object') as Array<{
        interactionRate?: number;
        accessibilityScore?: number;
        viewTime?: number;
      }>;
      if (validInteractions.length === 0) {
        return { engagement: 0, accessibility: 0, performance: 0 };
      }

      const avgInteractionRate = validInteractions.reduce((sum, i) => {
        return sum + (typeof i.interactionRate === 'number' ? i.interactionRate : 0);
      }, 0) / validInteractions.length;
      
      const avgAccessibilityScore = validInteractions.reduce((sum, i) => {
        return sum + (typeof i.accessibilityScore === 'number' ? i.accessibilityScore : 0);
      }, 0) / validInteractions.length;
      
      const avgViewTime = validInteractions.reduce((sum, i) => {
        return sum + (typeof i.viewTime === 'number' ? i.viewTime : 0);
      }, 0) / validInteractions.length;
      
      return {
        engagement: Math.max(0, Math.min(1, avgInteractionRate)), // Clamp between 0 and 1
        accessibility: Math.max(0, Math.min(100, avgAccessibilityScore)), // Clamp between 0 and 100
        performance: avgViewTime > ADDITIONAL_CONSTANTS.PERFORMANCE_THRESHOLD_MS ? 1 : 0 // Long view times indicate performance issues
      };
    } catch (error) {
      this.logger.error('Error analyzing user behavior', error instanceof Error ? error : new Error(String(error)));
      return { engagement: 0, accessibility: 0, performance: 0 };
    }
  }

  /**
   * Infer industry context
   */
  private inferIndustry(componentTypes: string[], applicationType: string): string {
    if (applicationType === 'e-commerce') return 'retail';
    if (applicationType === 'dashboard') return 'technology';
    if (applicationType === 'blog') return 'media';
    if (applicationType === 'social') return 'social-media';
    
    return 'general';
  }

  /**
   * Encode application type as numerical value
   */
  private encodeApplicationType(type: string): number {
    const mapping: Record<string, number> = {
      'e-commerce': 1,
      'dashboard': 2,
      'blog': 3,
      'social': 4,
      'general': 5
    };
    return mapping[type] || 5;
  }

  /**
   * Encode industry as numerical value
   */
  private encodeIndustry(industry: string): number {
    const mapping: Record<string, number> = {
      'retail': 1,
      'technology': 2,
      'media': 3,
      'social-media': 4,
      'finance': 5,
      'healthcare': 6,
      'education': 7,
      'general': ADDITIONAL_CONSTANTS.DEFAULT_INDUSTRY_CODE
    };
    return mapping[industry] || ADDITIONAL_CONSTANTS.DEFAULT_INDUSTRY_CODE;
  }

  /**
   * Pad array to specified length with fill value
   */
  private padArray(arr: number[], length: number, fillValue: number): number[] {
    const result = [...arr];
    while (result.length < length) {
      result.push(fillValue);
    }
    return result.slice(0, length);
  }

  /**
   * Get default configuration features for error cases
   */
  private getDefaultConfigurationFeatures(): ConfigurationFeatures {
    return {
      breakpointCount: 3,
      breakpointRatios: [1, ADDITIONAL_CONSTANTS.DEFAULT_BREAKPOINT_RATIO, 2],
      tokenComplexity: 0,
      originDistribution: {
        width: 1,
        height: 0,
        min: 0,
        max: 0,
        diagonal: 0,
        area: 0
      }
    };
  }

  /**
   * Get default usage features for error cases
   */
  private getDefaultUsageFeatures(): UsageFeatures {
    return {
      commonValues: new Array(ADDITIONAL_CONSTANTS.DEFAULT_STEP).fill(0),
      valueDistributions: {},
      componentFrequencies: {},
      propertyPatterns: {}
    };
  }

  /**
   * Get default performance features for error cases
   */
  private getDefaultPerformanceFeatures(): PerformanceFeatures {
    return {
      avgRenderTimes: new Array(ADDITIONAL_CONSTANTS.DEFAULT_STEP).fill(0),
      bundleSizes: new Array(ADDITIONAL_CONSTANTS.DEFAULT_STEP).fill(0),
      memoryPatterns: new Array(ADDITIONAL_CONSTANTS.DEFAULT_STEP).fill(0),
      layoutShiftFreq: new Array(ADDITIONAL_CONSTANTS.DEFAULT_STEP).fill(0)
    };
  }

  /**
   * Get default context features for error cases
   */
  private getDefaultContextFeatures(): ContextFeatures {
    return {
      applicationType: 'web',
      deviceDistribution: {
        mobile: 0.6,
        tablet: 0.3,
        desktop: 0.1
      },
      userBehavior: {
        interactionFrequency: 0.5,
        sessionDuration: 300,
        bounceRate: 0.3
      },
      industry: 'general'
    };
  }
}
