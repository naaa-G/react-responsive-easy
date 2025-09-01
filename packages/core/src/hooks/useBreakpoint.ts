import { useMemo } from 'react';
import { useResponsiveContext } from '../provider/ResponsiveContext';
import { Breakpoint } from '../types';

/**
 * Hook to get the current breakpoint information
 * 
 * @returns Current breakpoint object with name, width, height, and alias
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const breakpoint = useBreakpoint();
 *   
 *   return (
 *     <div>
 *       Current breakpoint: {breakpoint.name} ({breakpoint.width}x{breakpoint.height})
 *     </div>
 *   );
 * };
 * ```
 */
export const useBreakpoint = (): Breakpoint => {
  const { currentBreakpoint } = useResponsiveContext();
  return currentBreakpoint;
};

/**
 * Hook to check if current breakpoint matches a specific breakpoint
 * 
 * @param targetBreakpoint - Breakpoint name or alias to check against
 * @returns Boolean indicating if current breakpoint matches
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const isMobile = useBreakpointMatch('mobile');
 *   const isTablet = useBreakpointMatch('tablet');
 *   
 *   return (
 *     <div>
 *       {isMobile && <MobileLayout />}
 *       {isTablet && <TabletLayout />}
 *     </div>
 *   );
 * };
 * ```
 */
export const useBreakpointMatch = (targetBreakpoint: string): boolean => {
  const { currentBreakpoint } = useResponsiveContext();
  
  return useMemo(() => {
    return currentBreakpoint.name === targetBreakpoint || 
           currentBreakpoint.alias === targetBreakpoint;
  }, [currentBreakpoint, targetBreakpoint]);
};

/**
 * Hook to check if current breakpoint is within a range
 * 
 * @param minBreakpoint - Minimum breakpoint name/alias
 * @param maxBreakpoint - Maximum breakpoint name/alias
 * @returns Boolean indicating if current breakpoint is within range
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const isMediumScreen = useBreakpointRange('tablet', 'laptop');
 *   
 *   return (
 *     <div>
 *       {isMediumScreen && <MediumScreenLayout />}
 *     </div>
 *   );
 * };
 * ```
 */
export const useBreakpointRange = (minBreakpoint: string, maxBreakpoint: string): boolean => {
  const { currentBreakpoint, config } = useResponsiveContext();
  
  return useMemo(() => {
    const breakpoints = config.breakpoints;
    
    // Find min and max breakpoint indices
    const minIndex = breakpoints.findIndex(bp => 
      bp.name === minBreakpoint || bp.alias === minBreakpoint
    );
    const maxIndex = breakpoints.findIndex(bp => 
      bp.name === maxBreakpoint || bp.alias === maxBreakpoint
    );
    const currentIndex = breakpoints.findIndex(bp => 
      bp.name === currentBreakpoint.name
    );
    
    if (minIndex === -1 || maxIndex === -1 || currentIndex === -1) {
      return false;
    }
    
    // Check if current breakpoint is within range
    return currentIndex >= minIndex && currentIndex <= maxIndex;
  }, [currentBreakpoint, config]);
};

/**
 * Hook to get breakpoint-specific values
 * 
 * @param values - Object with breakpoint names/aliases as keys
 * @returns Value for current breakpoint, or fallback value
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const fontSize = useBreakpointValue({
 *     mobile: 14,
 *     tablet: 16,
 *     desktop: 18,
 *     fallback: 16
 *   });
 *   
 *   return <div style={{ fontSize }}>Responsive text</div>;
 * };
 * ```
 */
export const useBreakpointValue = <T>(
  values: Record<string, T> & { fallback: T }
): T => {
  const { currentBreakpoint, config } = useResponsiveContext();
  
  return useMemo(() => {
    // Try to find exact match by name or alias
    for (const [key, value] of Object.entries(values)) {
      if (key === 'fallback') continue;
      
      if (currentBreakpoint.name === key || currentBreakpoint.alias === key) {
        return value;
      }
    }
    
    // Return fallback value
    return values.fallback;
  }, [currentBreakpoint, values, config]);
};

/**
 * Hook to get all breakpoints for advanced usage
 * 
 * @returns Array of all available breakpoints
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const breakpoints = useBreakpoints();
 *   
 *   return (
 *     <div>
 *       {breakpoints.map(bp => (
 *         <div key={bp.name}>
 *           {bp.name}: {bp.width}x{bp.height}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export const useBreakpoints = (): Breakpoint[] => {
  const { config } = useResponsiveContext();
  return config.breakpoints;
};

/**
 * Hook to get the base breakpoint
 * 
 * @returns Base breakpoint object
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const baseBreakpoint = useBaseBreakpoint();
 *   
 *   return (
 *     <div>
 *       Base breakpoint: {baseBreakpoint.name} ({baseBreakpoint.width}x{baseBreakpoint.height})
 *     </div>
 *   );
 * };
 * ```
 */
export const useBaseBreakpoint = (): Breakpoint => {
  const { config } = useResponsiveContext();
  return config.base;
};

/**
 * Hook to check if current breakpoint is the base breakpoint
 * 
 * @returns Boolean indicating if current breakpoint is the base
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const isBaseBreakpoint = useIsBaseBreakpoint();
 *   
 *   return (
 *     <div>
 *       {isBaseBreakpoint ? 'At base breakpoint' : 'Scaled breakpoint'}
 *     </div>
 *   );
 * };
 * ```
 */
export const useIsBaseBreakpoint = (): boolean => {
  const { currentBreakpoint, config } = useResponsiveContext();
  
  return useMemo(() => {
    return currentBreakpoint.name === config.base.name || 
           currentBreakpoint.alias === config.base.alias;
  }, [currentBreakpoint, config]);
};
