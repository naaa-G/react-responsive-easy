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
      return found || config.base;
    }
    
    // If it's already a Breakpoint object, use it
    return initialBreakpoint;
  }, [initialBreakpoint, config]);

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
        console.warn(`Failed to compute ratio for breakpoint ${breakpoint.name}:`, error);
      }
    });
    setScalingRatios(ratios);
  }, [config, scalingEngine]);
  
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
        console.warn(`Failed to compute ratio for breakpoint ${breakpoint.name}:`, error);
      }
    });
    setScalingRatios(ratios);
  }, [config, scalingEngine, invalidateCache]);
  
  // Update current breakpoint based on viewport
  useEffect(() => {
    // Function to determine current breakpoint
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
    
    // If we have an initialBreakpoint, use it first but still set up responsive behavior
    if (initialBreakpoint) {
      setCurrentBreakpoint(resolvedInitialBreakpoint);
    } else {
      // Initial update for dynamic detection
      updateBreakpoint();
    }
    
    // Always listen for resize events to enable responsive behavior
    const handleResize = () => {
      updateBreakpoint();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [config, initialBreakpoint, resolvedInitialBreakpoint]);
  
  // Debug logging
  useEffect(() => {
    if (debug) {
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
  }, [debug, currentBreakpoint, scalingRatios, computedValues.size, config]);
  
  // Create the context value
  const contextValue: ResponsiveContextValue = useMemo(() => ({
    config,
    currentBreakpoint,
    scalingRatios,
    computedValues,
    invalidateCache,
    forceRecompute
  }), [config, currentBreakpoint, scalingRatios, computedValues, invalidateCache, forceRecompute]);
  
  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Export the context for advanced usage
export { ResponsiveContext };
