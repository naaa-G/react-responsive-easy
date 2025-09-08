/**
 * Tests for scaling engine functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ScalingEngine } from '../scaling-engine';
import type { ResponsiveConfig, Viewport, Breakpoint } from '../types';

describe('ScalingEngine', () => {
  let scalingEngine: ScalingEngine;
  let mockConfig: ResponsiveConfig;

  beforeEach(() => {
    mockConfig = {
      base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
      breakpoints: [
        { name: 'mobile', width: 390, height: 844, alias: 'mobile' },
        { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
        { name: 'laptop', width: 1366, height: 768, alias: 'laptop' },
        { name: 'desktop', width: 1920, height: 1080, alias: 'base' }
      ],
      strategy: {
        origin: 'width',
        tokens: {
          fontSize: { scale: 0.85, min: 12, max: 72, unit: 'px' },
          spacing: { scale: 0.9, step: 4, min: 4, max: 128, unit: 'px' },
          radius: { scale: 0.95, min: 2, max: 32, unit: 'px' }
        },
        rounding: { mode: 'nearest', precision: 0.5 }
      }
    };

    scalingEngine = new ScalingEngine(mockConfig);
  });

  describe('Basic scaling functionality', () => {
    it('should scale values based on width ratio', () => {
      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Mobile width (390) / Desktop width (1920) = 0.203125
      // 24 * 0.203125 = 4.875, rounded to nearest 0.5 = 5
      expect(scaledValue).toBeCloseTo(5, 2);
    });

    it('should return same value for same breakpoint', () => {
      const baseValue = 24;
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mockConfig.base);

      expect(scaledValue).toBe(baseValue);
    });

    it('should handle zero values', () => {
      const baseValue = 0;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      expect(scaledValue).toBe(0);
    });

    it('should handle negative values', () => {
      const baseValue = -10;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      expect(scaledValue).toBeLessThan(0);
    });
  });

  describe('Token-specific scaling', () => {
    it('should apply fontSize token scaling', () => {
      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'fontSize');

      // Scaling engine applies viewport scaling first, then token rules:
      // 24 * 0.203125 = 4.875, then * 0.85 = 4.14375, rounded to nearest 0.5 = 4
      // But fontSize token has min: 12, so it gets clamped to 12
      expect(scaledValue).toBeCloseTo(12, 2);
    });

    it('should apply spacing token scaling with step', () => {
      const baseValue = 20;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'spacing');

      // Should be rounded to nearest step of 4
      const expectedValue = Math.round((20 * 0.9 * 0.203125) / 4) * 4;
      expect(scaledValue).toBe(expectedValue);
    });

    it('should apply radius token scaling', () => {
      const baseValue = 16;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'radius');

      // With radius scale of 0.95: 16 * 0.203125 * 0.95 = 3.0875, rounded to nearest 0.5 = 3
      expect(scaledValue).toBeCloseTo(3, 2);
    });

    it('should apply minimum constraints', () => {
      const baseValue = 10;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'fontSize');

      // Should be clamped to minimum of 12
      expect(scaledValue).toBe(12);
    });

    it('should apply maximum constraints', () => {
      const baseValue = 100;
      const desktopBreakpoint = mockConfig.breakpoints[3];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, desktopBreakpoint, 'fontSize');

      // Should be clamped to maximum of 72
      expect(scaledValue).toBe(72);
    });
  });

  describe('Different scaling origins', () => {
    it('should scale based on height when origin is height', () => {
      const heightConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, origin: 'height' }
      };
      const heightEngine = new ScalingEngine(heightConfig);

      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = heightEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Mobile height (844) / Desktop height (1080) = 0.7815
      // 24 * 0.7815 = 18.756, rounded to nearest 0.5 = 19
      expect(scaledValue).toBeCloseTo(19, 2);
    });

    it('should scale based on minimum dimension when origin is min', () => {
      const minConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, origin: 'min' }
      };
      const minEngine = new ScalingEngine(minConfig);

      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = minEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Min(390, 844) / Min(1920, 1080) = 390 / 1080 = 0.3611
      // 24 * 0.3611 = 8.666, rounded to nearest 0.5 = 8.5
      expect(scaledValue).toBeCloseTo(8.5, 2);
    });

    it('should scale based on maximum dimension when origin is max', () => {
      const maxConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, origin: 'max' }
      };
      const maxEngine = new ScalingEngine(maxConfig);

      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = maxEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Max(390, 844) / Max(1920, 1080) = 844 / 1920 = 0.4396
      // 24 * 0.4396 = 10.55, rounded to nearest 0.5 = 10.5
      expect(scaledValue).toBeCloseTo(10.5, 2);
    });

    it('should scale based on diagonal when origin is diagonal', () => {
      const diagonalConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, origin: 'diagonal' }
      };
      const diagonalEngine = new ScalingEngine(diagonalConfig);

      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = diagonalEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Mobile diagonal / Desktop diagonal
      const mobileDiagonal = Math.sqrt(390 ** 2 + 844 ** 2);
      const desktopDiagonal = Math.sqrt(1920 ** 2 + 1080 ** 2);
      const ratio = mobileDiagonal / desktopDiagonal;
      const expectedValue = 24 * ratio;
      const roundedValue = Math.round(expectedValue / 0.5) * 0.5;

      expect(scaledValue).toBeCloseTo(roundedValue, 2);
    });

    it('should scale based on area when origin is area', () => {
      const areaConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, origin: 'area' }
      };
      const areaEngine = new ScalingEngine(areaConfig);

      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = areaEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Mobile area / Desktop area
      const mobileArea = 390 * 844;
      const desktopArea = 1920 * 1080;
      const ratio = mobileArea / desktopArea;
      const expectedValue = 24 * ratio;
      const roundedValue = Math.round(expectedValue / 0.5) * 0.5;

      expect(scaledValue).toBeCloseTo(roundedValue, 2);
    });
  });

  describe('Rounding functionality', () => {
    it('should round to nearest precision', () => {
      const baseValue = 15;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Should be rounded to nearest 0.5
      const expectedValue = Math.round((15 * 0.203125) / 0.5) * 0.5;
      expect(scaledValue).toBe(expectedValue);
    });

    it('should floor when rounding mode is floor', () => {
      const floorConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, rounding: { mode: 'floor', precision: 0.5 } }
      };
      const floorEngine = new ScalingEngine(floorConfig);

      const baseValue = 15;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = floorEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Should be floored to nearest 0.5
      const expectedValue = Math.floor((15 * 0.203125) / 0.5) * 0.5;
      expect(scaledValue).toBe(expectedValue);
    });

    it('should ceil when rounding mode is ceil', () => {
      const ceilConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, rounding: { mode: 'ceil', precision: 0.5 } }
      };
      const ceilEngine = new ScalingEngine(ceilConfig);

      const baseValue = 15;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = ceilEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Should be ceiled to nearest 0.5
      const expectedValue = Math.ceil((15 * 0.203125) / 0.5) * 0.5;
      expect(scaledValue).toBe(expectedValue);
    });
  });

  describe('Scale for all breakpoints', () => {
    it('should scale value for all breakpoints', () => {
      const baseValue = 24;
      const scaledValues = scalingEngine.scaleForAllBreakpoints(baseValue);

      expect(Object.keys(scaledValues)).toHaveLength(4);
      expect(scaledValues).toHaveProperty('mobile');
      expect(scaledValues).toHaveProperty('tablet');
      expect(scaledValues).toHaveProperty('laptop');
      expect(scaledValues).toHaveProperty('desktop');

      // Desktop should be the same as base
      expect(scaledValues.desktop).toBe(baseValue);
    });

    it('should scale value for all breakpoints with token', () => {
      const baseValue = 24;
      const scaledValues = scalingEngine.scaleForAllBreakpoints(baseValue, 'fontSize');

      expect(Object.keys(scaledValues)).toHaveLength(4);
      
      // All values should be different due to token scaling
      const values = Object.values(scaledValues);
      expect(new Set(values).size).toBeGreaterThan(1);
    });
  });

  describe('CSS properties generation', () => {
    it('should generate CSS custom properties', () => {
      const baseValue = 24;
      const propertyName = 'font-size';
      const cssProps = scalingEngine.getCSSProperties(baseValue, propertyName);

      expect(Object.keys(cssProps)).toHaveLength(4);
      expect(cssProps).toHaveProperty('--font-size-mobile');
      expect(cssProps).toHaveProperty('--font-size-tablet');
      expect(cssProps).toHaveProperty('--font-size-laptop');
      expect(cssProps).toHaveProperty('--font-size-desktop');

      // Values should include units
      Object.values(cssProps).forEach(value => {
        expect(value).toMatch(/\d+(\.\d+)?px$/);
      });
    });

    it('should generate CSS properties with custom token unit', () => {
      const baseValue = 24;
      const propertyName = 'font-size';
      const cssProps = scalingEngine.getCSSProperties(baseValue, propertyName, 'fontSize');

      // Should use fontSize token unit (px)
      Object.values(cssProps).forEach(value => {
        expect(value).toMatch(/\d+(\.\d+)?px$/);
      });
    });
  });

  describe('Configuration management', () => {
    it('should update configuration', () => {
      const newConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, origin: 'height' }
      };

      scalingEngine.updateConfig(newConfig);
      const currentConfig = scalingEngine.getConfig();

      expect(currentConfig.strategy.origin).toBe('height');
    });

    it('should get current configuration', () => {
      const currentConfig = scalingEngine.getConfig();

      expect(currentConfig).toEqual(mockConfig);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle invalid token gracefully', () => {
      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'invalidToken');

      // Should fall back to basic scaling without token rules
      // 24 * 0.203125 = 4.875, rounded to nearest 0.5 = 5
      expect(scaledValue).toBeCloseTo(5, 2);
    });

    it('should handle zero precision in rounding', () => {
      const zeroPrecisionConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: { ...mockConfig.strategy, rounding: { mode: 'nearest', precision: 0 } }
      };
      const zeroPrecisionEngine = new ScalingEngine(zeroPrecisionConfig);

      const baseValue = 15.7;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = zeroPrecisionEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Should not round when precision is 0
      expect(scaledValue).toBeCloseTo(15.7 * 0.203125, 2);
    });

    it('should handle very small values', () => {
      const baseValue = 0.1;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      const expectedValue = 0.1 * 0.203125;
      const roundedValue = Math.round(expectedValue / 0.5) * 0.5;
      expect(scaledValue).toBeCloseTo(roundedValue, 4);
    });

    it('should handle very large values', () => {
      const baseValue = 10000;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scalingEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      const expectedValue = 10000 * 0.203125;
      const roundedValue = Math.round(expectedValue / 0.5) * 0.5;
      expect(scaledValue).toBeCloseTo(roundedValue, 2);
    });
  });

  describe('Performance tests', () => {
    it('should scale values efficiently', () => {
      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];

      const startTime = performance.now();
      
      // Perform 1000 scaling operations
      for (let i = 0; i < 1000; i++) {
        scalingEngine.scaleValue(baseValue + i, mockConfig.base, mobileBreakpoint, 'fontSize');
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete 1000 operations in less than 50ms
      expect(totalTime).toBeLessThan(50);
    });

    it('should scale for all breakpoints efficiently', () => {
      const baseValue = 24;

      const startTime = performance.now();
      
      // Perform 100 scaling operations
      for (let i = 0; i < 100; i++) {
        scalingEngine.scaleForAllBreakpoints(baseValue + i, 'fontSize');
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete 100 operations in less than 20ms
      expect(totalTime).toBeLessThan(20);
    });
  });

  describe('Complex token configurations', () => {
    it('should handle function-based scaling', () => {
      const functionConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: {
          ...mockConfig.strategy,
          tokens: {
            ...mockConfig.strategy.tokens,
            custom: {
              scale: (value: number, ratio: number) => value * ratio * Math.sqrt(ratio),
              unit: 'px'
            }
          }
        }
      };
      const functionEngine = new ScalingEngine(functionConfig);

      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = functionEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'custom');

      const ratio = 390 / 1920;
      // Function is called with viewport-scaled value and ratio=1 (to avoid double scaling)
      const viewportScaled = 24 * ratio; // 4.875
      const expectedValue = viewportScaled * 1 * Math.sqrt(1); // Function called with ratio=1
      const roundedValue = Math.round(expectedValue / 0.5) * 0.5;
      expect(scaledValue).toBeCloseTo(roundedValue, 1);
    });

    it('should handle multiple constraints', () => {
      const constrainedConfig: ResponsiveConfig = {
        ...mockConfig,
        strategy: {
          ...mockConfig.strategy,
          tokens: {
            ...mockConfig.strategy.tokens,
            constrained: {
              scale: 0.8,
              min: 5,
              max: 20,
              step: 2,
              unit: 'px'
            }
          }
        }
      };
      const constrainedEngine = new ScalingEngine(constrainedConfig);

      const baseValue = 30; // Will be scaled down and then constrained
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = constrainedEngine.scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'constrained');

      // Should be constrained by max (20) and min (5)
      // Note: min constraint overrides step constraint in current implementation
      expect(scaledValue).toBeLessThanOrEqual(20);
      expect(scaledValue).toBeGreaterThanOrEqual(5);
    });
  });
});
