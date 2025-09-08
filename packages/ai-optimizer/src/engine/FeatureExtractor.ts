import { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';
import {
  ComponentUsageData,
  ModelFeatures,
  ConfigurationFeatures,
  UsageFeatures,
  PerformanceFeatures,
  ContextFeatures
} from '../types/index.js';

/**
 * Feature extraction engine for AI optimization
 * 
 * Converts raw configuration and usage data into numerical features
 * that can be used by machine learning models.
 */
export class FeatureExtractor {
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
      console.warn('⚠️ Features object is null/undefined, returning empty vector');
      return [];
    }
    
    // Configuration features (20 values) - with null checks
    const config = features.config || {};
    vector.push(config.breakpointCount || 0);
    vector.push(...(config.breakpointRatios || []));
    vector.push(config.tokenComplexity || 0);
    vector.push(...Object.values(config.originDistribution || {}));
    
    // Usage features (30 values) - with null checks
    const usage = features.usage || {};
    vector.push(...(usage.commonValues || []));
    vector.push(...Object.values(usage.componentFrequencies || {}).slice(0, 10));
    vector.push(...Object.values(usage.propertyPatterns || {}).slice(0, 10));
    
    // Performance features (25 values) - with null checks
    const performance = features.performance || {};
    vector.push(...(performance.avgRenderTimes || []));
    vector.push(...(performance.bundleSizes || []));
    vector.push(...(performance.memoryPatterns || []));
    vector.push(...(performance.layoutShiftFreq || []));
    
    // Context features (53 values) - with null checks
    const context = features.context || {};
    vector.push(this.encodeApplicationType(context.applicationType));
    vector.push(...Object.values(context.deviceDistribution || {}));
    vector.push(...Object.values(context.userBehavior || {}));
    vector.push(this.encodeIndustry(context.industry));
    
    // Pad or truncate to exactly 128 features
    while (vector.length < 128) {
      vector.push(0);
    }
    
    return vector.slice(0, 128);
  }

  /**
   * Extract configuration-based features
   */
  private extractConfigurationFeatures(config: ResponsiveConfig): ConfigurationFeatures {
    // Defensive programming - handle missing config properties
    if (!config || !config.breakpoints || !config.base || !config.strategy) {
      return this.getDefaultConfigurationFeatures();
    }

    const breakpoints = config.breakpoints;
    
    // Calculate breakpoint ratios with null safety
    const baseWidth = config.base?.width || 375; // Default mobile width
    const breakpointRatios = breakpoints.map(bp => {
      if (!bp || typeof bp.width !== 'number') {
        return baseWidth / baseWidth; // Default to 1
      }
      return bp.width / baseWidth;
    });
    
    // Calculate token complexity with null safety
    const tokens = config.strategy?.tokens || {};
    let tokenComplexity = 0;
    Object.values(tokens).forEach(token => {
      if (!token) return;
      tokenComplexity += (token.min !== undefined ? 1 : 0);
      tokenComplexity += (token.max !== undefined ? 1 : 0);
      tokenComplexity += (token.step !== undefined ? 1 : 0);
      tokenComplexity += (token.responsive !== false ? 1 : 0);
    });
    
    // Origin distribution with null safety
    const origin = config.strategy?.origin || 'width';
    const originDistribution: Record<string, number> = {
      width: origin === 'width' ? 1 : 0,
      height: origin === 'height' ? 1 : 0,
      min: origin === 'min' ? 1 : 0,
      max: origin === 'max' ? 1 : 0,
      diagonal: origin === 'diagonal' ? 1 : 0,
      area: origin === 'area' ? 1 : 0
    };
    
    return {
      breakpointCount: breakpoints?.length || 0,
      breakpointRatios: this.padArray(breakpointRatios, 8, 1),
      tokenComplexity,
      originDistribution
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
      if (!data || !data.componentType) return;
      
      // Count component types
      componentTypes[data.componentType] = (componentTypes[data.componentType] || 0) + 1;
      
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
      valueFrequency[val] = (valueFrequency[val] || 0) + 1;
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
      avgRenderTimes: this.calculateStatistics(renderTimes, 5),
      bundleSizes: this.calculateStatistics(bundleSizes, 5),
      memoryPatterns: this.calculateStatistics(memoryUsages, 5),
      layoutShiftFreq: this.calculateStatistics(layoutShifts, 5)
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
      .filter(d => d && d.componentType)
      .map(d => d.componentType);
    const applicationType = this.inferApplicationType(componentTypes);
    
    // Calculate device distribution from context data
    const positions = usageData
      .filter(d => d && d.context && d.context.position)
      .map(d => d.context.position);
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
    const std = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );
    
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
  private analyzeUserBehavior(interactions: any[]): Record<string, number> {
    if (!interactions || interactions.length === 0) {
      return { engagement: 0, accessibility: 0, performance: 0 };
    }
    
    try {
      const validInteractions = interactions.filter(i => i && typeof i === 'object');
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
        performance: avgViewTime > 5000 ? 1 : 0 // Long view times indicate performance issues
      };
    } catch (error) {
      console.warn('⚠️ Error analyzing user behavior:', error);
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
      'general': 8
    };
    return mapping[industry] || 8;
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
      breakpointRatios: [1, 1.5, 2],
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
      commonValues: new Array(10).fill(0),
      valueDistributions: {},
      componentFrequencies: {},
      propertyPatterns: {}
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
