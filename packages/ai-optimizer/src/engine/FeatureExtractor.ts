import { ResponsiveConfig } from '@react-responsive-easy/core';
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
    
    // Configuration features (20 values)
    vector.push(features.config.breakpointCount);
    vector.push(...features.config.breakpointRatios);
    vector.push(features.config.tokenComplexity);
    vector.push(...Object.values(features.config.originDistribution));
    
    // Usage features (30 values)
    vector.push(...features.usage.commonValues);
    vector.push(...Object.values(features.usage.componentFrequencies).slice(0, 10));
    vector.push(...Object.values(features.usage.propertyPatterns).slice(0, 10));
    
    // Performance features (25 values)
    vector.push(...features.performance.avgRenderTimes);
    vector.push(...features.performance.bundleSizes);
    vector.push(...features.performance.memoryPatterns);
    vector.push(...features.performance.layoutShiftFreq);
    
    // Context features (53 values)
    vector.push(this.encodeApplicationType(features.context.applicationType));
    vector.push(...Object.values(features.context.deviceDistribution));
    vector.push(...Object.values(features.context.userBehavior));
    vector.push(this.encodeIndustry(features.context.industry));
    
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
    const breakpoints = config.breakpoints;
    
    // Calculate breakpoint ratios
    const baseWidth = config.base.width;
    const breakpointRatios = breakpoints.map(bp => bp.width / baseWidth);
    
    // Calculate token complexity
    const tokens = config.strategy.tokens;
    let tokenComplexity = 0;
    Object.values(tokens).forEach(token => {
      tokenComplexity += (token.min !== undefined ? 1 : 0);
      tokenComplexity += (token.max !== undefined ? 1 : 0);
      tokenComplexity += (token.step !== undefined ? 1 : 0);
      tokenComplexity += (token.responsive !== false ? 1 : 0);
    });
    
    // Origin distribution
    const originDistribution: Record<string, number> = {
      width: config.strategy.origin === 'width' ? 1 : 0,
      height: config.strategy.origin === 'height' ? 1 : 0,
      min: config.strategy.origin === 'min' ? 1 : 0,
      max: config.strategy.origin === 'max' ? 1 : 0,
      diagonal: config.strategy.origin === 'diagonal' ? 1 : 0,
      area: config.strategy.origin === 'area' ? 1 : 0
    };
    
    return {
      breakpointCount: breakpoints.length,
      breakpointRatios: this.padArray(breakpointRatios, 8, 1),
      tokenComplexity,
      originDistribution
    };
  }

  /**
   * Extract usage pattern features
   */
  private extractUsageFeatures(usageData: ComponentUsageData[]): UsageFeatures {
    // Collect all responsive values
    const allValues: number[] = [];
    const componentTypes: Record<string, number> = {};
    const properties: Record<string, number> = {};
    const valueDistributions: Record<string, number[]> = {};
    
    usageData.forEach(data => {
      // Count component types
      componentTypes[data.componentType] = (componentTypes[data.componentType] || 0) + 1;
      
      data.responsiveValues.forEach(value => {
        allValues.push(value.baseValue);
        
        // Count properties
        properties[value.property] = (properties[value.property] || 0) + value.usageFrequency;
        
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
    
    // Normalize property patterns
    const totalPropertyUsage = Object.values(properties).reduce((sum, count) => sum + count, 0);
    const propertyPatterns: Record<string, number> = {};
    Object.entries(properties).forEach(([prop, count]) => {
      propertyPatterns[prop] = count / totalPropertyUsage;
    });
    
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
    // Infer application type from component patterns
    const componentTypes = usageData.map(d => d.componentType);
    const applicationType = this.inferApplicationType(componentTypes);
    
    // Calculate device distribution from context data
    const positions = usageData.map(d => d.context.position);
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
    const median = sorted[Math.floor(sorted.length / 2)];
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
    const positionFreq: Record<string, number> = {};
    positions.forEach(pos => {
      positionFreq[pos] = (positionFreq[pos] || 0) + 1;
    });
    
    const total = positions.length;
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
    if (interactions.length === 0) {
      return { engagement: 0, accessibility: 0, performance: 0 };
    }
    
    const avgInteractionRate = interactions.reduce((sum, i) => sum + i.interactionRate, 0) / interactions.length;
    const avgAccessibilityScore = interactions.reduce((sum, i) => sum + i.accessibilityScore, 0) / interactions.length;
    const avgViewTime = interactions.reduce((sum, i) => sum + i.viewTime, 0) / interactions.length;
    
    return {
      engagement: avgInteractionRate,
      accessibility: avgAccessibilityScore,
      performance: avgViewTime > 5000 ? 1 : 0 // Long view times indicate performance issues
    };
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
}
