/**
 * Tests for transformation logic and edge cases
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { transformCodeForSnapshots } from './utils/test-helpers';
import { scaleValue } from '../index';

// Helper to extract specific parts of transformed code
function extractUseMemo(code: string) {
  const useMemoMatch = code.match(/\(0,\s*_react\.useMemo\)/g);
  return useMemoMatch ? useMemoMatch[0] : null;
}

function extractSwitchStatement(code: string) {
  const switchMatch = code.match(/switch\s*\([^)]+\)\s*\{[^}]*\}/s);
  return switchMatch ? switchMatch[0] : null;
}

describe('Transformation Logic', () => {
  describe('scaleValue function', () => {
    const mockConfig = {
      base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
      breakpoints: [
        { name: 'mobile', width: 390, height: 844, alias: 'mobile' },
        { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
        { name: 'desktop', width: 1920, height: 1080, alias: 'base' }
      ],
      strategy: {
        origin: 'width' as const,
        tokens: {
          fontSize: { scale: 0.85, min: 12, max: 72 },
          spacing: { scale: 0.9, step: 4, min: 4, max: 128 },
          radius: { scale: 0.95, min: 2, max: 32 }
        },
        rounding: { mode: 'nearest' as const, precision: 0.5 }
      }
    };

    it('should scale values correctly based on width ratio', () => {
      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Mobile width (390) / Desktop width (1920) = 0.203125
      // 24 * 0.203125 = 4.875, rounded to nearest 0.5 = 5
      expect(scaledValue).toBeCloseTo(5, 2);
    });

    it('should apply token-specific scaling', () => {
      const baseValue = 24;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'fontSize');

      // With fontSize scale of 0.85: 24 * 0.203125 * 0.85 = 4.14375, rounded to nearest 0.5 = 4
      // But fontSize token has min: 12, so it gets clamped to 12
      expect(scaledValue).toBeCloseTo(12, 2);
    });

    it('should apply minimum constraints', () => {
      const baseValue = 10;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'fontSize');

      // Should be clamped to minimum of 12
      expect(scaledValue).toBe(12);
    });

    it('should apply maximum constraints', () => {
      const baseValue = 100;
      const desktopBreakpoint = mockConfig.breakpoints[2];
      const scaledValue = scaleValue(baseValue, mockConfig.base, desktopBreakpoint, 'fontSize');

      // Desktop width (1920) / Desktop width (1920) = 1.0
      // 100 * 1.0 = 100, then apply fontSize scale 0.85 = 85
      // Apply step (none for fontSize), then apply max constraint of 22 (from default config)
      // So final value should be 22 (clamped to max)
      expect(scaledValue).toBe(22);
    });

    it('should apply step constraints', () => {
      const baseValue = 20;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scaleValue(baseValue, mockConfig.base, mobileBreakpoint, 'spacing');

      // Should be rounded to nearest step of 4
      const expectedValue = Math.round((20 * 0.9 * 0.203125) / 4) * 4;
      expect(scaledValue).toBe(expectedValue);
    });

    it('should apply rounding precision', () => {
      const baseValue = 15;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Should be rounded to nearest 0.5
      const expectedValue = Math.round((15 * 0.203125) / 0.5) * 0.5;
      expect(scaledValue).toBe(expectedValue);
    });

    it('should handle zero base value', () => {
      const baseValue = 0;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      expect(scaledValue).toBe(0);
    });

    it('should handle negative base value', () => {
      const baseValue = -10;
      const mobileBreakpoint = mockConfig.breakpoints[0];
      const scaledValue = scaleValue(baseValue, mockConfig.base, mobileBreakpoint);

      // Should preserve negative scaling
      expect(scaledValue).toBeLessThan(0);
    });
  });

  describe('useResponsiveValue transformations', () => {
    it('should transform simple numeric literal', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('useMemo');
      expect(output).toContain('currentBreakpoint.name');
      expect(output).toContain('24px');
    });

    it('should transform with token configuration', () => {
      const input = `
        const fontSize = useResponsiveValue(18, { token: 'fontSize' });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('useMemo');
      expect(output).toContain('switch');
      expect(output).toContain('mobile');
      expect(output).toContain('tablet');
      expect(output).toContain('desktop');
    });

    it('should generate correct switch cases for all breakpoints', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      // Should contain all breakpoint cases
      expect(output).toContain('case "mobile"');
      expect(output).toContain('case "tablet"');
      expect(output).toContain('case "laptop"');
      expect(output).toContain('case "desktop"');
      expect(output).toContain('default:');
    });

    it('should not transform when precompute is disabled', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: false });
      
      expect(output).toContain('useResponsiveValue(24)');
      expect(output).not.toContain('useMemo');
    });

    it('should not transform non-static values', () => {
      const input = `
        const fontSize = useResponsiveValue(dynamicValue);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('useResponsiveValue(dynamicValue)');
      expect(output).not.toContain('useMemo');
    });

    it('should not transform when first argument is not numeric', () => {
      const input = `
        const fontSize = useResponsiveValue("24px");
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('useResponsiveValue("24px")');
      expect(output).not.toContain('useMemo');
    });

    it('should handle missing second argument', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('useMemo');
      expect(output).toContain('24px');
    });

    it('should handle malformed options object', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { invalid: true });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('useMemo');
      // Should still transform but without token-specific scaling
    });

    it('should handle complex expressions in arguments', () => {
      const input = `
        const fontSize = useResponsiveValue(baseSize + 4, {
          token: getToken(),
          min: calculateMin()
        });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      // Should not transform complex expressions
      expect(output).toContain('useResponsiveValue(baseSize + 4');
      expect(output).not.toContain('useMemo');
    });
  });

  describe('useScaledStyle transformations', () => {
    it('should transform simple style object', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 18,
          padding: 16
        });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('mobile');
      expect(output).toContain('tablet');
      expect(output).toContain('desktop');
    });

    it('should preserve non-numeric properties', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 18,
          color: 'red',
          backgroundColor: '#fff'
        });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('color');
      expect(output).toContain('backgroundColor');
      expect(output).toContain('red');
      expect(output).toContain('#fff');
    });

    it('should handle mixed numeric and non-numeric properties', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 18,
          color: 'blue',
          padding: 12,
          margin: 8
        });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      // Should transform numeric properties
      expect(output).toContain('fontSize');
      expect(output).toContain('padding');
      expect(output).toContain('margin');
      
      // Should preserve non-numeric properties
      expect(output).toContain('color');
      expect(output).toContain('blue');
    });

    it('should not transform when precompute is disabled', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 18,
          padding: 16
        });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: false });
      
      expect(output).toContain('useScaledStyle({');
      expect(output).not.toContain('mobile');
    });

    it('should handle empty style object', () => {
      const input = `
        const styles = useScaledStyle({});
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('useScaledStyle({})');
    });

    it('should handle non-object argument', () => {
      const input = `
        const styles = useScaledStyle(null);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('useScaledStyle(null)');
    });
  });

  describe('import handling', () => {
    it('should add React imports when needed', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('var _react = require("react")');
    });

    it('should add RRE imports when needed', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('var _reactResponsiveEasy = require("react-responsive-easy")');
    });

    it('should use custom import source', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { 
        precompute: true,
        importSource: '@my-org/responsive'
      });
      
      expect(output).toContain('var _responsive = require("@my-org/responsive")');
    });

    it('should not add imports when no transformations occur', () => {
      const input = `
        const fontSize = useResponsiveValue(dynamicValue);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).not.toContain('import { useMemo } from "react"');
      expect(output).not.toContain('import { useBreakpoint } from "react-responsive-easy"');
    });

    it('should handle existing imports gracefully', () => {
      const input = `
        import React from 'react';
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('var _react = require("react")');
    });
  });

  describe('development mode', () => {
    it('should add comments in development mode', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCodeForSnapshots(input, { 
        precompute: true,
        development: true
      });
      
      expect(output).toContain('Optimized by @react-responsive-easy/babel-plugin');
      expect(output).toContain('useResponsiveValue(24');
    });

    it('should not add comments in production mode', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { 
        precompute: true,
        development: false
      });
      
      expect(output).not.toContain('Optimized by @react-responsive-easy/babel-plugin');
    });

    it('should add comments for useScaledStyle transformations', () => {
      const input = `
        const styles = useScaledStyle({ fontSize: 18 });
      `;
      
      const output = transformCodeForSnapshots(input, { 
        precompute: true,
        development: true
      });
      
      expect(output).toContain('Optimized by @react-responsive-easy/babel-plugin');
      expect(output).toContain('style object pre-computed');
    });
  });

  describe('error handling', () => {
    it('should handle malformed function calls gracefully', () => {
      const input = `
        const fontSize = useResponsiveValue();
      `;
      
      expect(() => transformCodeForSnapshots(input, { precompute: true })).not.toThrow();
    });

    it('should handle syntax errors gracefully', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' // missing closing brace
      `;
      
      expect(() => transformCodeForSnapshots(input, { precompute: true })).not.toThrow();
    });

    it('should handle invalid AST nodes gracefully', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 123 });
      `;
      
      expect(() => transformCodeForSnapshots(input, { precompute: true })).not.toThrow();
    });
  });

  describe('performance considerations', () => {
    it('should generate efficient switch statements', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      const switchStatement = extractSwitchStatement(output);
      
      expect(switchStatement).toBeTruthy();
      expect(switchStatement).toContain('currentBreakpoint.name');
    });

    it('should use useMemo for React optimization', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      const useMemoCall = extractUseMemo(output);
      
      expect(useMemoCall).toBeTruthy();
      expect(useMemoCall).toContain('useMemo');
    });

    it('should include proper dependencies in useMemo', () => {
      const input = `
        const fontSize = useResponsiveValue(24);
      `;
      
      const output = transformCodeForSnapshots(input, { precompute: true });
      
      expect(output).toContain('[currentBreakpoint.name]');
    });
  });
});
