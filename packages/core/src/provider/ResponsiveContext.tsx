import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import { ScalingEngine } from '../scaling/ScalingEngine';
import { 
  ResponsiveConfig, 
  ResponsiveContextValue, 
  Breakpoint, 
  ScaledValue, 
  ScaleOptions 
} from '../types';

// Create the context with a default value
const ResponsiveContext = createContext<ResponsiveContextValue | null>(null);

// Hook to use the responsive context
export const useResponsiveContext = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsiveContext must be used within a ResponsiveProvider');
  }
  return context;
};

// Props for the ResponsiveProvider
export interface ResponsiveProviderProps {
  config: ResponsiveConfig;
  // Optional: Override the current breakpoint for testing or SSR
  initialBreakpoint?: Breakpoint | string;
  // Optional: Enable debug mode
  debug?: boolean;
}

// The main provider component  
export const ResponsiveProvider = ({
  config,
  initialBreakpoint,
  debug = false,
  children
}: React.PropsWithChildren<ResponsiveProviderProps>) => {
  // Create the scaling engine instance
  const scalingEngine = useMemo(() => new ScalingEngine(config), [config]);
  
  // Resolve initial breakpoint
  const resolvedInitialBreakpoint = useMemo(() => {
    if (!initialBreakpoint) return config.base;
    
    // If initialBreakpoint is a string, find the matching breakpoint
    if (typeof initialBreakpoint === 'string') {
      const found = config.breakpoints.find(bp => 
        bp.name === initialBreakpoint || bp.alias === initialBreakpoint
      );
      return found ?? config.base;
    }
    
    // If it's already a Breakpoint object, use it
    return initialBreakpoint;
  }, [initialBreakpoint, config.breakpoints, config.base]);

  // State for current breakpoint
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(
    resolvedInitialBreakpoint
  );
  
  // State for scaling ratios (pre-computed for performance)
  const [scalingRatios, setScalingRatios] = useState<Record<string, number>>({});
  
  // State for computed values cache
  const [computedValues, setComputedValues] = useState<Map<string, ScaledValue>>(new Map());
  
  // Pre-compute scaling ratios for all breakpoints
  useEffect(() => {
    const ratios: Record<string, number> = {};
    config.breakpoints.forEach(breakpoint => {
      try {
        // Use a simple test value to get the ratio
        const testResult = scalingEngine.scaleValue(100, breakpoint);
        ratios[breakpoint.name] = testResult.ratio;
      } catch (error) {
        // Log error in development mode only
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(`Failed to compute ratio for breakpoint ${breakpoint.name}:`, error);
        }
      }
    });
    setScalingRatios(ratios);
  }, [config.breakpoints, scalingEngine]);
  
  // Function to invalidate cache
  const invalidateCache = useCallback(() => {
    scalingEngine.clearCache();
    setComputedValues(new Map());
  }, [scalingEngine]);
  
  // Function to force re-computation
  const forceRecompute = useCallback(() => {
    invalidateCache();
    // Re-compute ratios
    const ratios: Record<string, number> = {};
    config.breakpoints.forEach(breakpoint => {
      try {
        const testResult = scalingEngine.scaleValue(100, breakpoint);
        ratios[breakpoint.name] = testResult.ratio;
      } catch (error) {
        // Log error in development mode only
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(`Failed to compute ratio for breakpoint ${breakpoint.name}:`, error);
        }
      }
    });
    setScalingRatios(ratios);
  }, [config.breakpoints, scalingEngine, invalidateCache]);

  // Enhanced scaling function that uses ScaleOptions
  const scaleValueWithOptions = useCallback((value: number, options: ScaleOptions = {}): ScaledValue => {
    try {
      // Ensure we have a valid currentBreakpoint
      if (!currentBreakpoint) {
        // Log warning in development mode only
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('No current breakpoint available, using base breakpoint');
        }
        const result = scalingEngine.scaleValue(value, config.base, options);
        return result;
      }
      
      const result = scalingEngine.scaleValue(value, currentBreakpoint, options);
      
      // Cache the result if caching is enabled
      if (!options.bypassCache) {
        const cacheKey = `${value}-${currentBreakpoint.name}-${JSON.stringify(options)}`;
        setComputedValues(prev => {
          // Only update if the value is different
          if (prev.get(cacheKey)?.scaled !== result.scaled) {
            const newMap = new Map(prev);
            newMap.set(cacheKey, result);
            return newMap;
          }
          return prev;
        });
      }
      
      return result;
    } catch (error) {
      // Log error in development mode only
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Failed to scale value with options:', error);
      }
      // Return fallback value
      return {
        original: value,
        scaled: value,
        targetBreakpoint: currentBreakpoint || config.base,
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
  }, [scalingEngine, currentBreakpoint.name, currentBreakpoint.width, currentBreakpoint.height, config.base.name, config.base.width, config.base.height]);
  
  // Update current breakpoint based on viewport (only if no initialBreakpoint is provided)
  useEffect(() => {
    // If we have an initialBreakpoint, use it and don't set up viewport-based detection
    if (initialBreakpoint) {
      // Only update if the current breakpoint is different
      if (currentBreakpoint.name !== resolvedInitialBreakpoint.name) {
        setCurrentBreakpoint(resolvedInitialBreakpoint);
      }
      return;
    }
    
    // Only set up viewport-based detection if no initialBreakpoint is provided
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Find the best matching breakpoint
      let bestMatch = config.base;
      let bestScore = 0;
      
      config.breakpoints.forEach(breakpoint => {
        // Calculate how well this breakpoint matches current viewport
        const widthScore = 1 - Math.abs(width - breakpoint.width) / Math.max(width, breakpoint.width);
        const heightScore = 1 - Math.abs(height - breakpoint.height) / Math.max(height, breakpoint.height);
        const score = (widthScore + heightScore) / 2;
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = breakpoint;
        }
      });
      
      setCurrentBreakpoint(bestMatch);
    };
    
    // Initial update for dynamic detection
    updateBreakpoint();
    
    // Listen for resize events to enable responsive behavior
    const handleResize = () => {
      updateBreakpoint();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [config.breakpoints, config.base, initialBreakpoint, resolvedInitialBreakpoint]);
  
  // Debug logging
  useEffect(() => {
    if (debug && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('🔍 ResponsiveProvider Debug:', {
        currentBreakpoint,
        scalingRatios,
        cacheSize: computedValues.size,
        config: {
          base: config.base.name,
          breakpoints: config.breakpoints.map(bp => bp.name),
          strategy: config.strategy.origin
        }
      });
    }
  }, [debug, currentBreakpoint, scalingRatios, computedValues.size, config.base.name, config.breakpoints, config.strategy.origin]);
  
  // Create the context value
  const contextValue: ResponsiveContextValue = useMemo(() => ({
    config,
    currentBreakpoint,
    scalingRatios,
    computedValues,
    invalidateCache,
    forceRecompute,
    scaleValueWithOptions // Add the new scaling function
  }), [config, currentBreakpoint, scalingRatios, computedValues, invalidateCache, forceRecompute, scaleValueWithOptions]);
  
  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Export the context for advanced usage
export { ResponsiveContext };
