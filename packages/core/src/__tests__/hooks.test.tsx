import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ResponsiveProvider } from '../provider/ResponsiveContext';
import { createDefaultConfig } from '../utils/defaultConfig';
import {
  useResponsiveValue,
  useResponsiveValueWithUnit,
  useResponsiveValues,
  useResponsiveValueInfo,
  useScaledStyle,
  useBreakpoint,
  useBreakpointMatch,
  useBreakpointRange,
  useBreakpointValue,
  useBreakpoints,
  useBaseBreakpoint,
  useIsBaseBreakpoint
} from '../hooks';

// Wrapper component for testing hooks
const createWrapper = (config: any, initialBreakpoint?: any) => {
  return ({ children }: { children: React.ReactNode }) => (
    <ResponsiveProvider 
      config={config}
      initialBreakpoint={initialBreakpoint || config.base}
      debug={false}
    >
      {children}
    </ResponsiveProvider>
  );
};

describe('React Hooks', () => {
  let config: any;
  let wrapper: any;

  beforeEach(() => {
    config = createDefaultConfig();
    wrapper = createWrapper(config);
    
    // Reset window size to desktop for base tests
    Object.defineProperty(window, 'innerWidth', { 
      value: 1920, 
      writable: true,
      configurable: true 
    });
    Object.defineProperty(window, 'innerHeight', { 
      value: 1080, 
      writable: true,
      configurable: true 
    });
    
    // Ensure window properties are properly set
    window.dispatchEvent(new Event('resize'));
  });

  describe('useResponsiveValue', () => {
    it('should return original value at base breakpoint', () => {
      const { result } = renderHook(
        () => useResponsiveValue(24, { token: 'fontSize' }),
        { wrapper }
      );

      expect(result.current).toBe(24);
    });

    it('should scale value for non-base breakpoints', () => {
      // Create a wrapper with mobile breakpoint
      const mobileBreakpoint = config.breakpoints.find((bp: any) => bp.alias === 'mobile')!;
      const mobileWrapper = createWrapper(config, mobileBreakpoint);
      
      const { result } = renderHook(
        () => useResponsiveValue(24, { token: 'fontSize' }),
        { wrapper: mobileWrapper }
      );

      // Should apply min constraint (12px) for mobile
      expect(result.current).toBe(12);
    });

    it('should handle custom constraints', () => {
      // Create a wrapper with mobile breakpoint
      const mobileBreakpoint = config.breakpoints.find((bp: any) => bp.alias === 'mobile')!;
      const mobileWrapper = createWrapper(config, mobileBreakpoint);
      
      const { result } = renderHook(
        () => useResponsiveValue(24, { token: 'fontSize', min: 16 }),
        { wrapper: mobileWrapper }
      );

      expect(result.current).toBe(16);
    });
  });

  describe('useResponsiveValueWithUnit', () => {
    it('should add units to scaled values', () => {
      // Create a wrapper with mobile breakpoint
      const mobileBreakpoint = config.breakpoints.find((bp: any) => bp.alias === 'mobile')!;
      const mobileWrapper = createWrapper(config, mobileBreakpoint);
      
      const { result } = renderHook(
        () => useResponsiveValueWithUnit(24, 'px', { token: 'fontSize' }),
        { wrapper: mobileWrapper }
      );

      expect(result.current).toBe('12px');
    });
  });

  describe('useResponsiveValues', () => {
    it('should scale multiple values at once', () => {
      // Create a wrapper with mobile breakpoint
      const mobileBreakpoint = config.breakpoints.find((bp: any) => bp.alias === 'mobile')!;
      const mobileWrapper = createWrapper(config, mobileBreakpoint);
      
      const { result } = renderHook(
        () => useResponsiveValues({
          fontSize: 24,
          padding: 16,
          borderRadius: 8
        }, { token: 'fontSize' }),
        { wrapper: mobileWrapper }
      );

      expect(result.current.fontSize).toBe(12); // Min constraint applied
      expect(result.current.padding).toBeLessThanOrEqual(16); // Scaled down or constrained
      expect(result.current.borderRadius).toBeLessThanOrEqual(12); // Scaled down or constrained (may have min constraints)
    });
  });

  describe('useResponsiveValueInfo', () => {
    it('should return detailed scaling information', () => {
      // Create a wrapper with mobile breakpoint
      const mobileBreakpoint = config.breakpoints.find((bp: any) => bp.alias === 'mobile')!;
      const mobileWrapper = createWrapper(config, mobileBreakpoint);
      
      const { result } = renderHook(
        () => useResponsiveValueInfo(24, { token: 'fontSize' }),
        { wrapper: mobileWrapper }
      );

      expect(result.current.original).toBe(24);
      expect(result.current.scaled).toBe(12);
      expect(result.current.targetBreakpoint.name).toBe('mobile');
      expect(result.current.constraints.minApplied).toBe(true);
    });
  });

  describe('useScaledStyle', () => {
    it('should scale entire style objects', () => {
      // Create a wrapper with mobile breakpoint
      const mobileBreakpoint = config.breakpoints.find((bp: any) => bp.alias === 'mobile')!;
      const mobileWrapper = createWrapper(config, mobileBreakpoint);
      
      const { result } = renderHook(
        () => useScaledStyle({
          fontSize: 24,
          padding: 16,
          margin: 8
        }, { token: 'fontSize' }),
        { wrapper: mobileWrapper }
      );

      expect(result.current.fontSize).toBe(12); // Min constraint
      expect(result.current.padding).toBeLessThanOrEqual(16); // Scaled or constrained
      expect(result.current.margin).toBeLessThanOrEqual(12); // Scaled or constrained (may have min constraints)
    });
  });

  describe('useBreakpoint', () => {
    it('should return current breakpoint information', () => {
      const { result } = renderHook(() => useBreakpoint(), { wrapper });

      expect(result.current.name).toBe('desktop');
      expect(result.current.width).toBe(1920);
      expect(result.current.height).toBe(1080);
    });
  });

  describe('useBreakpointMatch', () => {
    it('should match breakpoint by name', () => {
      const { result } = renderHook(() => useBreakpointMatch('desktop'), { wrapper });
      expect(result.current).toBe(true);
    });

    it('should match breakpoint by alias', () => {
      const { result } = renderHook(() => useBreakpointMatch('base'), { wrapper });
      expect(result.current).toBe(true);
    });

    it('should not match different breakpoints', () => {
      const { result } = renderHook(() => useBreakpointMatch('mobile'), { wrapper });
      expect(result.current).toBe(false);
    });
  });

  describe('useBreakpointRange', () => {
    it('should detect breakpoints within range', () => {
      const { result } = renderHook(
        () => useBreakpointRange('tablet', 'laptop'),
        { wrapper }
      );
      expect(result.current).toBe(false); // Desktop is not in tablet-laptop range
    });
  });

  describe('useBreakpointValue', () => {
    it('should return breakpoint-specific values', () => {
      const { result } = renderHook(
        () => useBreakpointValue({
          mobile: 14,
          tablet: 16,
          desktop: 18,
          fallback: 16
        }),
        { wrapper }
      );

      expect(result.current).toBe(18); // Should match desktop
    });

    it('should return fallback for unknown breakpoints', () => {
      const { result } = renderHook(
        () => useBreakpointValue({
          mobile: 14,
          tablet: 16,
          fallback: 20
        }),
        { wrapper }
      );

      expect(result.current).toBe(20); // Should return fallback
    });
  });

  describe('useBreakpoints', () => {
    it('should return all available breakpoints', () => {
      const { result } = renderHook(() => useBreakpoints(), { wrapper });

      expect(result.current).toHaveLength(4);
      expect(result.current.map(bp => bp.name)).toEqual([
        'mobile', 'tablet', 'laptop', 'desktop'
      ]);
    });
  });

  describe('useBaseBreakpoint', () => {
    it('should return base breakpoint', () => {
      const { result } = renderHook(() => useBaseBreakpoint(), { wrapper });

      expect(result.current.name).toBe('desktop');
      expect(result.current.alias).toBe('base');
    });
  });

  describe('useIsBaseBreakpoint', () => {
    it('should return true for base breakpoint', () => {
      const { result } = renderHook(() => useIsBaseBreakpoint(), { wrapper });
      expect(result.current).toBe(true);
    });

    it('should return false for non-base breakpoints', () => {
      // Create a wrapper with mobile breakpoint
      const mobileBreakpoint = config.breakpoints.find((bp: any) => bp.alias === 'mobile')!;
      const mobileWrapper = createWrapper(config, mobileBreakpoint);
      
      const { result } = renderHook(() => useIsBaseBreakpoint(), { wrapper: mobileWrapper });
      expect(result.current).toBe(false);
    });
  });
});
