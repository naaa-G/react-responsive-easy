import { describe, it, expect, beforeEach } from 'vitest';
import { ScalingEngine } from '../scaling/ScalingEngine';
import { createDefaultConfig } from '../utils/defaultConfig';
import { ResponsiveConfig } from '../types';

describe('ScalingEngine', () => {
  let engine: ScalingEngine;
  let config: ResponsiveConfig;

  beforeEach(() => {
    config = createDefaultConfig();
    engine = new ScalingEngine(config);
  });

  describe('Basic Scaling', () => {
    it('should scale font size correctly from desktop to mobile', () => {
      const desktopFontSize = 24;
      const mobileBreakpoint = config.breakpoints.find(bp => bp.alias === 'mobile')!;
      
      const result = engine.scaleValue(desktopFontSize, mobileBreakpoint, { token: 'fontSize' });
      
      // Desktop: 1920px, Mobile: 390px
      // Expected ratio: 390/1920 = 0.203125
      // With fontSize scale factor: 0.203125 * 0.85 = 0.17265625
      // Expected result: 24 * 0.17265625 = 4.14375
      // With min constraint of 12px: Math.max(4.14375, 12) = 12
      expect(result.scaled).toBe(12);
      expect(result.original).toBe(24);
      expect(result.targetBreakpoint).toBe(mobileBreakpoint);
      expect(result.constraints.minApplied).toBe(true);
    });

    it('should scale spacing correctly', () => {
      const desktopSpacing = 32;
      const tabletBreakpoint = config.breakpoints.find(bp => bp.alias === 'tablet')!;
      
      const result = engine.scaleValue(desktopSpacing, tabletBreakpoint, { token: 'spacing' });
      
      // Desktop: 1920px, Tablet: 768px
      // Expected ratio: 768/1920 = 0.4
      // With spacing scale factor: 0.4 * 0.9 = 0.36
      // Expected result: 32 * 0.36 = 11.52
      // With step constraint of 2: Math.round(11.52 / 2) * 2 = 12
      expect(result.scaled).toBe(12);
      expect(result.constraints.stepApplied).toBe(true);
    });

    it('should handle different scaling origins', () => {
      // Test height-based scaling
      const heightConfig = { ...config };
      heightConfig.strategy.origin = 'height';
      
      const heightEngine = new ScalingEngine(heightConfig);
      const desktopValue = 100;
      const mobileBreakpoint = config.breakpoints.find(bp => bp.alias === 'mobile')!;
      
      const result = heightEngine.scaleValue(desktopValue, mobileBreakpoint);
      
      // Desktop height: 1080px, Mobile height: 844px
      // Expected ratio: 844/1080 = 0.781481
      // Expected result: 100 * 0.781481 = 78.1481
      expect(result.scaled).toBeCloseTo(78, 0);
    });
  });

  describe('Performance and Caching', () => {
    it('should cache results for identical inputs', () => {
      const value = 24;
      const breakpoint = config.breakpoints.find(bp => bp.alias === 'mobile')!;
      const options = { token: 'fontSize' as const };
      
      // First call should compute
      const firstResult = engine.scaleValue(value, breakpoint, options);
      expect(firstResult.performance.cacheHit).toBe(false);
      
      // Second call should use cache
      const secondResult = engine.scaleValue(value, breakpoint, options);
      expect(secondResult.performance.cacheHit).toBe(true);
      
      // Results should be identical
      expect(firstResult.scaled).toBe(secondResult.scaled);
    });

    it('should track performance metrics', () => {
      // Perform some operations first to generate metrics
      const value = 24;
      const breakpoint = config.breakpoints.find(bp => bp.alias === 'mobile')!;
      engine.scaleValue(value, breakpoint, { token: 'fontSize' });
      
      const metrics = engine.getPerformanceMetrics();
      
      expect(metrics.totalOperations).toBeGreaterThan(0);
      expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheHitRate).toBeLessThanOrEqual(1);
      expect(metrics.averageComputationTime).toBeGreaterThan(0);
    });
  });

  describe('Constraints and Validation', () => {
    it('should apply minimum constraints', () => {
      const smallValue = 8;
      const mobileBreakpoint = config.breakpoints.find(bp => bp.alias === 'mobile')!;
      
      const result = engine.scaleValue(smallValue, mobileBreakpoint, { 
        token: 'fontSize',
        min: 16 
      });
      
      expect(result.scaled).toBe(16);
      expect(result.constraints.minApplied).toBe(true);
    });

    it('should apply maximum constraints', () => {
      const largeValue = 100;
      const mobileBreakpoint = config.breakpoints.find(bp => bp.alias === 'mobile')!;
      
      const result = engine.scaleValue(largeValue, mobileBreakpoint, { 
        token: 'fontSize',
        max: 15 
      });
      
      expect(result.scaled).toBe(15);
      expect(result.constraints.maxApplied).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid breakpoint', () => {
      const invalidBreakpoint = { name: 'invalid', width: 100, height: 100 };
      
      expect(() => {
        engine.scaleValue(24, invalidBreakpoint);
      }).toThrow('No scaling ratio found for desktop-invalid');
    });
  });
});
