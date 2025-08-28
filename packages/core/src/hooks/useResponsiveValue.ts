import { useMemo, useCallback } from 'react';
import { useResponsiveContext } from '../provider/ResponsiveContext';
import { ScaleOptions, ScaledValue } from '../types';
import { ScalingEngine } from '../scaling/ScalingEngine';

/**
 * Hook to get a responsively scaled value based on the current breakpoint
 * 
 * @param value - The base value (usually for the largest breakpoint)
 * @param options - Scaling options including token type and constraints
 * @returns The scaled value for the current breakpoint
 * 
 * @example
 * ```tsx
 * const Button = () => {
 *   const fontSize = useResponsiveValue(18, { token: 'fontSize' });
 *   const padding = useResponsiveValue(16, { token: 'spacing' });
 *   
 *   return <button style={{ fontSize, padding }}>Click me</button>;
 * };
 * ```
 */
export const useResponsiveValue = (
  value: number,
  options: ScaleOptions = {}
): number => {
  const { config, currentBreakpoint } = useResponsiveContext();
  
  // Memoize the scaled value to avoid unnecessary recalculations
  const scaledValue = useMemo(() => {
    // If we're at the base breakpoint, return the original value
    if (currentBreakpoint.name === config.base.name || 
        currentBreakpoint.alias === config.base.alias) {
      return value;
    }
    
    // Create a temporary scaling engine for this calculation
    // In a real implementation, this would be shared across the app
    const engine = new ScalingEngine(config);
    
    try {
      const result = engine.scaleValue(value, currentBreakpoint, options);
      return result.scaled;
    } catch (error) {
      console.warn('Failed to scale value:', error);
      return value; // Fallback to original value
    }
  }, [value, currentBreakpoint, config, options]);
  
  return scaledValue;
};

/**
 * Hook to get a responsively scaled value with units
 * 
 * @param value - The base value
 * @param unit - The CSS unit (px, rem, em, etc.)
 * @param options - Scaling options
 * @returns The scaled value with units as a string
 * 
 * @example
 * ```tsx
 * const Button = () => {
 *   const fontSize = useResponsiveValueWithUnit(18, 'px', { token: 'fontSize' });
 *   // Returns "18px" on desktop, "12px" on mobile, etc.
 *   
 *   return <button style={{ fontSize }}>Click me</button>;
 * };
 * ```
 */
export const useResponsiveValueWithUnit = (
  value: number,
  unit: string,
  options: ScaleOptions = {}
): string => {
  const scaledValue = useResponsiveValue(value, options);
  return `${scaledValue}${unit}`;
};

/**
 * Hook to get multiple responsive values at once
 * 
 * @param values - Object with base values
 * @param options - Scaling options (applied to all values)
 * @returns Object with scaled values
 * 
 * @example
 * ```tsx
 * const Button = () => {
 *   const styles = useResponsiveValues({
 *     fontSize: 18,
 *     padding: 16,
 *     borderRadius: 8
 *   }, { token: 'fontSize' });
 *   
 *   return <button style={styles}>Click me</button>;
 * };
 * ```
 */
export const useResponsiveValues = <T extends Record<string, number>>(
  values: T,
  options: ScaleOptions = {}
): T => {
  const result = {} as T;
  
  for (const [key, value] of Object.entries(values)) {
    result[key as keyof T] = useResponsiveValue(value, options) as T[keyof T];
  }
  
  return result;
};

/**
 * Hook to get detailed scaling information
 * 
 * @param value - The base value
 * @param options - Scaling options
 * @returns Full ScaledValue object with metadata
 * 
 * @example
 * ```tsx
 * const Button = () => {
 *   const fontSizeInfo = useResponsiveValueInfo(18, { token: 'fontSize' });
 *   
 *   console.log(fontSizeInfo);
 *   // {
 *   //   original: 18,
 *   //   scaled: 12,
 *   //   targetBreakpoint: { name: 'mobile', width: 390, height: 844 },
 *   //   ratio: 0.203125,
 *   //   constraints: { minApplied: true, maxApplied: false, stepApplied: false },
 *   //   performance: { computationTime: 0.5, cacheHit: false }
 *   // }
 *   
 *   return <button style={{ fontSize: fontSizeInfo.scaled }}>Click me</button>;
 * };
 * ```
 */
export const useResponsiveValueInfo = (
  value: number,
  options: ScaleOptions = {}
): ScaledValue => {
  const { config, currentBreakpoint } = useResponsiveContext();
  
  return useMemo(() => {
    // If we're at the base breakpoint, return a mock result
    if (currentBreakpoint.name === config.base.name || 
        currentBreakpoint.alias === config.base.alias) {
      return {
        original: value,
        scaled: value,
        targetBreakpoint: currentBreakpoint,
        ratio: 1,
        constraints: {
          minApplied: false,
          maxApplied: false,
          stepApplied: false
        },
        performance: {
          computationTime: 0,
          cacheHit: true
        }
      };
    }
    
    // Create a temporary scaling engine for this calculation
    const engine = new ScalingEngine(config);
    
    try {
      return engine.scaleValue(value, currentBreakpoint, options);
    } catch (error) {
      console.warn('Failed to get scaling info:', error);
      // Return fallback info
      return {
        original: value,
        scaled: value,
        targetBreakpoint: currentBreakpoint,
        ratio: 1,
        constraints: {
          minApplied: false,
          maxApplied: false,
          stepApplied: false
        },
        performance: {
          computationTime: 0,
          cacheHit: false
        }
      };
    }
  }, [value, currentBreakpoint, config, options]);
};
