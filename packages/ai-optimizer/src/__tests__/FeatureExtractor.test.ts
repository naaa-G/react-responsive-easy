import { describe, it, expect, beforeEach } from 'vitest';
import { FeatureExtractor } from '../engine/FeatureExtractor.js';
import type { ComponentUsageData } from '../types/index.js';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

const mockResponsiveConfig: ResponsiveConfig = {
  base: { name: 'desktop', width: 1920, height: 1080 },
  breakpoints: [
    { name: 'mobile', width: 768, height: 1024, alias: 'mobile' },
    { name: 'tablet', width: 1024, height: 768, alias: 'tablet' },
    { name: 'desktop', width: 1920, height: 1080, alias: 'desktop' }
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

const mockUsageData: ComponentUsageData[] = [
  {
    componentId: 'button-1',
    componentType: 'Button',
    responsiveValues: [
      {
        property: 'fontSize',
        baseValue: 16,
        token: 'fontSize',
        breakpointValues: { mobile: 14, tablet: 15, desktop: 16 },
        usageFrequency: 100
      },
      {
        property: 'padding',
        baseValue: 12,
        token: 'spacing',
        breakpointValues: { mobile: 8, tablet: 10, desktop: 12 },
        usageFrequency: 80
      }
    ],
    performance: {
      renderTime: 2.5,
      layoutShift: 0.01,
      memoryUsage: 1024,
      bundleSize: 5120
    },
    interactions: {
      interactionRate: 0.85,
      viewTime: 3000,
      scrollBehavior: 'smooth',
      accessibilityScore: 95
    },
    context: {
      parent: 'Header',
      children: [],
      position: 'header',
      importance: 'primary'
    }
  },
  {
    componentId: 'card-1',
    componentType: 'Card',
    responsiveValues: [
      {
        property: 'fontSize',
        baseValue: 18,
        token: 'fontSize',
        breakpointValues: { mobile: 16, tablet: 17, desktop: 18 },
        usageFrequency: 60
      }
    ],
    performance: {
      renderTime: 3.2,
      layoutShift: 0.02,
      memoryUsage: 2048,
      bundleSize: 8192
    },
    interactions: {
      interactionRate: 0.65,
      viewTime: 5000,
      scrollBehavior: 'normal',
      accessibilityScore: 88
    },
    context: {
      parent: 'Main',
      children: ['Button', 'Text'],
      position: 'main',
      importance: 'secondary'
    }
  }
];

describe('FeatureExtractor', () => {
  let featureExtractor: FeatureExtractor;

  beforeEach(() => {
    featureExtractor = new FeatureExtractor();
  });

  describe('extractFeatures', () => {
    it('should extract all feature categories', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);

      expect(features).toHaveProperty('config');
      expect(features).toHaveProperty('usage');
      expect(features).toHaveProperty('performance');
      expect(features).toHaveProperty('context');
    });

    it('should handle empty usage data', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, []);

      expect(features.config).toBeDefined();
      expect(features.usage).toBeDefined();
      expect(features.performance).toBeDefined();
      expect(features.context).toBeDefined();
    });
  });

  describe('Configuration Features', () => {
    it('should extract breakpoint count correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.config.breakpointCount).toBe(3);
    });

    it('should calculate breakpoint ratios correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.config.breakpointRatios).toEqual([0.4, 0.5333333333333333, 1, 1, 1, 1, 1, 1]);
    });

    it('should calculate token complexity correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      // 6 tokens * 4 properties each = 24
      expect(features.config.tokenComplexity).toBe(24);
    });

    it('should extract origin distribution correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.config.originDistribution.width).toBe(1);
      expect(features.config.originDistribution.height).toBe(0);
      expect(features.config.originDistribution.min).toBe(0);
      expect(features.config.originDistribution.max).toBe(0);
      expect(features.config.originDistribution.diagonal).toBe(0);
      expect(features.config.originDistribution.area).toBe(0);
    });
  });

  describe('Usage Features', () => {
    it('should extract common values correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.usage.commonValues).toContain(16);
      expect(features.usage.commonValues).toContain(12);
      expect(features.usage.commonValues).toContain(18);
    });

    it('should calculate component frequencies correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.usage.componentFrequencies.Button).toBe(0.5); // 1 out of 2
      expect(features.usage.componentFrequencies.Card).toBe(0.5); // 1 out of 2
    });

    it('should calculate property patterns correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.usage.propertyPatterns.fontSize).toBe(2); // fontSize used twice
      expect(features.usage.propertyPatterns.padding).toBe(1); // padding used once
    });
  });

  describe('Performance Features', () => {
    it('should extract render times correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.performance.avgRenderTimes).toContain(2.5);
      expect(features.performance.avgRenderTimes).toContain(3.2);
    });

    it('should extract bundle sizes correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.performance.bundleSizes).toContain(5120);
      expect(features.performance.bundleSizes).toContain(8192);
    });

    it('should extract memory usage correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.performance.memoryPatterns).toContain(1024);
      expect(features.performance.memoryPatterns).toContain(2048);
    });

    it('should extract layout shift data correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.performance.layoutShiftFreq).toContain(0.01);
      expect(features.performance.layoutShiftFreq).toContain(0.02);
    });
  });

  describe('Context Features', () => {
    it('should infer application type correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      // Should infer 'general' for mixed component types
      expect(features.context.applicationType).toBe('general');
    });

    it('should calculate device distribution correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      // Based on position data: header=1, main=1
      expect(features.context.deviceDistribution.desktop).toBe(0.5);
      expect(features.context.deviceDistribution.tablet).toBe(0);
      expect(features.context.deviceDistribution.mobile).toBe(0.5);
      expect(features.context.deviceDistribution.other).toBe(0);
    });

    it('should analyze user behavior correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.context.userBehavior.engagement).toBeGreaterThan(0);
      expect(features.context.userBehavior.accessibility).toBeGreaterThan(0);
      expect(features.context.userBehavior.performance).toBeGreaterThanOrEqual(0);
    });

    it('should infer industry correctly', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      expect(features.context.industry).toBe('general');
    });
  });

  describe('featuresToVector', () => {
    it('should convert features to numerical vector', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      const vector = featureExtractor.featuresToVector(features);
      
      expect(Array.isArray(vector)).toBe(true);
      expect(vector.length).toBe(128);
      expect(vector.every(val => typeof val === 'number')).toBe(true);
    });

    it('should handle edge cases in vector conversion', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, []);
      const vector = featureExtractor.featuresToVector(features);
      
      expect(vector.length).toBe(128);
      expect(vector.every(val => typeof val === 'number')).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing token properties gracefully', () => {
      const configWithMissingTokens = {
        ...mockResponsiveConfig,
        strategy: {
          ...mockResponsiveConfig.strategy,
          tokens: {
            fontSize: { scale: 0.85, min: 12, max: 72, step: 1, responsive: true },
            spacing: { scale: 0.9, min: 4, max: 128, step: 4, responsive: true },
            radius: { scale: 0.8, min: 0, max: 24, step: 2, responsive: true },
            lineHeight: { scale: 1.2, min: 1, max: 2, step: 0.1, responsive: true },
            shadow: { scale: 0.8, min: 0, max: 24, step: 1, responsive: true },
            border: { scale: 0.8, min: 0, max: 8, step: 1, responsive: true }
          }
        }
      };

      const features = featureExtractor.extractFeatures(configWithMissingTokens, mockUsageData);
      expect(features.config.tokenComplexity).toBeGreaterThan(0);
    });

    it('should handle empty responsive values', () => {
      const dataWithEmptyValues = [
        { ...mockUsageData[0], responsiveValues: [] }
      ];

      const features = featureExtractor.extractFeatures(mockResponsiveConfig, dataWithEmptyValues);
      expect(features.usage.commonValues.every(val => val === 0)).toBe(true);
    });

    it('should handle null/undefined values gracefully', () => {
      const dataWithNullValues = [
        { ...mockUsageData[0], performance: { ...mockUsageData[0].performance, renderTime: null as any } }
      ];

      const features = featureExtractor.extractFeatures(mockResponsiveConfig, dataWithNullValues);
      expect(features.performance.avgRenderTimes).toBeDefined();
    });
  });

  describe('Statistical Calculations', () => {
    it('should calculate statistics correctly for single values', () => {
      const singleValueData = [mockUsageData[0]];
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, singleValueData);
      
      expect(features.performance.avgRenderTimes[0]).toBe(2.5); // mean
      expect(features.performance.avgRenderTimes[1]).toBe(2.5); // median
      expect(features.performance.avgRenderTimes[2]).toBe(2.5); // min
      expect(features.performance.avgRenderTimes[3]).toBe(2.5); // max
      expect(features.performance.avgRenderTimes[4]).toBe(0); // std dev for single value
    });

    it('should calculate statistics correctly for multiple values', () => {
      const features = featureExtractor.extractFeatures(mockResponsiveConfig, mockUsageData);
      
      // Bundle sizes: [5120, 8192]
      // Note: Mean = (5120 + 8192) / 2 = 6656, Median = 6656, Min = 5120, Max = 8192
      expect(features.performance.bundleSizes[0]).toBe(6656); // mean
      expect(features.performance.bundleSizes[1]).toBe(6656); // median
      expect(features.performance.bundleSizes[2]).toBe(5120); // min
      expect(features.performance.bundleSizes[3]).toBe(8192); // max
      expect(features.performance.bundleSizes[4]).toBeCloseTo(1536, 1); // std dev
    });
  });
});
