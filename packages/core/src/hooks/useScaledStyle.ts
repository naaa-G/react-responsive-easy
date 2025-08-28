import { useMemo } from 'react';
import { useResponsiveContext } from '../provider/ResponsiveContext';
import { ScaleOptions } from '../types';
import { ScalingEngine } from '../scaling/ScalingEngine';

// Type for style objects that can contain numeric values
type StyleObject = Record<string, string | number>;

// Type for style objects with numeric values that can be scaled
type ScalableStyleObject = Record<string, number>;

/**
 * Hook to scale an entire style object responsively
 * 
 * @param styles - Object with numeric values to scale
 * @param options - Scaling options applied to all values
 * @returns Scaled style object
 * 
 * @example
 * ```tsx
 * const Button = () => {
 *   const scaledStyles = useScaledStyle({
 *     fontSize: 18,
 *     padding: 16,
 *     margin: 8,
 *     borderRadius: 8
 *   }, { token: 'fontSize' });
 *   
 *   return <button style={scaledStyles}>Click me</button>;
 * };
 * ```
 */
export const useScaledStyle = (
  styles: ScalableStyleObject,
  options: ScaleOptions = {}
): StyleObject => {
  const { config, currentBreakpoint } = useResponsiveContext();
  
  return useMemo(() => {
    // If we're at the base breakpoint, return original styles
    if (currentBreakpoint.name === config.base.name || 
        currentBreakpoint.alias === config.base.alias) {
      return styles;
    }
    
    // Create a temporary scaling engine for this calculation
    const engine = new ScalingEngine(config);
    
    const scaledStyles: StyleObject = {};
    
    try {
      for (const [key, value] of Object.entries(styles)) {
        if (typeof value === 'number') {
          const result = engine.scaleValue(value, currentBreakpoint, options);
          scaledStyles[key] = result.scaled;
        } else {
          scaledStyles[key] = value;
        }
      }
    } catch (error) {
      console.warn('Failed to scale styles:', error);
      return styles; // Fallback to original styles
    }
    
    return scaledStyles;
  }, [styles, currentBreakpoint, config, options]);
};

/**
 * Hook to scale styles with specific token mappings
 * 
 * @param styles - Object with numeric values and optional token specifications
 * @returns Scaled style object
 * 
 * @example
 * ```tsx
 * const Button = () => {
 *   const scaledStyles = useScaledStyleWithTokens({
 *     fontSize: { value: 18, token: 'fontSize' },
 *     padding: { value: 16, token: 'spacing' },
 *     borderRadius: { value: 8, token: 'radius' }
 *   });
 *   
 *   return <button style={scaledStyles}>Click me</button>;
 * };
 * ```
 */
export const useScaledStyleWithTokens = (
  styles: Record<string, { value: number; token?: keyof any; options?: ScaleOptions }>
): StyleObject => {
  const { config, currentBreakpoint } = useResponsiveContext();
  
  return useMemo(() => {
    // If we're at the base breakpoint, return original values
    if (currentBreakpoint.name === config.base.name || 
        currentBreakpoint.alias === config.base.alias) {
      const result: StyleObject = {};
      for (const [key, { value }] of Object.entries(styles)) {
        result[key] = value;
      }
      return result;
    }
    
    // Create a temporary scaling engine for this calculation
    const engine = new ScalingEngine(config);
    
    const scaledStyles: StyleObject = {};
    
    try {
      for (const [key, { value, token, options = {} }] of Object.entries(styles)) {
        const scaleOptions: ScaleOptions = {
          ...options,
          token: token as any || options.token
        };
        
        const result = engine.scaleValue(value, currentBreakpoint, scaleOptions);
        scaledStyles[key] = result.scaled;
      }
    } catch (error) {
      console.warn('Failed to scale styles with tokens:', error);
      // Fallback to original values
      for (const [key, { value }] of Object.entries(styles)) {
        scaledStyles[key] = value;
      }
    }
    
    return scaledStyles;
  }, [styles, currentBreakpoint, config]);
};

/**
 * Hook to create responsive CSS custom properties
 * 
 * @param variables - Object with CSS variable names and numeric values
 * @param options - Scaling options applied to all values
 * @returns Object with CSS custom properties
 * 
 * @example
 * ```tsx
 * const Button = () => {
 *   const cssVars = useResponsiveCSSVariables({
 *     '--button-font-size': 18,
 *     '--button-padding': 16,
 *     '--button-radius': 8
 *   }, { token: 'fontSize' });
 *   
 *   return (
 *     <button style={cssVars}>
 *       Click me
 *     </button>
 *   );
 * };
 * ```
 */
export const useResponsiveCSSVariables = (
  variables: Record<string, number>,
  options: ScaleOptions = {}
): Record<string, string> => {
  const { config, currentBreakpoint } = useResponsiveContext();
  
  return useMemo(() => {
    // If we're at the base breakpoint, return original values
    if (currentBreakpoint.name === config.base.name || 
        currentBreakpoint.alias === config.base.alias) {
      const result: Record<string, string> = {};
      for (const [key, value] of Object.entries(variables)) {
        result[key] = `${value}px`;
      }
      return result;
    }
    
    // Create a temporary scaling engine for this calculation
    const engine = new ScalingEngine(config);
    
    const cssVars: Record<string, string> = {};
    
    try {
      for (const [key, value] of Object.entries(variables)) {
        const result = engine.scaleValue(value, currentBreakpoint, options);
        cssVars[key] = `${result.scaled}px`;
      }
    } catch (error) {
      console.warn('Failed to create responsive CSS variables:', error);
      // Fallback to original values
      for (const [key, value] of Object.entries(variables)) {
        cssVars[key] = `${value}px`;
      }
    }
    
    return cssVars;
  }, [variables, currentBreakpoint, config, options]);
};
