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

// Constants for better maintainability
const TEST_VALUE_FOR_RATIO = 100;
const DEFAULT_RATIO = 1;
const DEFAULT_COMPUTATION_TIME = 0;

// Helper function to resolve initial breakpoint
const resolveInitialBreakpoint = (
  initialBreakpoint: Breakpoint | string | undefined,
  config: ResponsiveConfig
): Breakpoint => {
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
};

// Helper function to compute scaling ratios
const computeScalingRatios = (
  breakpoints: Breakpoint[],
  scalingEngine: ScalingEngine
): Record<string, number> => {
  const ratios: Record<string, number> = {};
  breakpoints.forEach(breakpoint => {
    try {
      const testResult = scalingEngine.scaleValue(TEST_VALUE_FOR_RATIO, breakpoint);
      ratios[breakpoint.name] = testResult.ratio;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn(`Failed to compute ratio for breakpoint ${breakpoint.name}:`, error);
      }
    }
  });
  return ratios;
};

// Helper function to find best matching breakpoint
const findBestMatchingBreakpoint = (
  width: number,
  height: number,
  breakpoints: Breakpoint[],
  base: Breakpoint
): Breakpoint => {
  let bestMatch = base;
  let bestScore = 0;
  
  breakpoints.forEach(breakpoint => {
    const widthScore = 1 - Math.abs(width - breakpoint.width) / Math.max(width, breakpoint.width);
    const heightScore = 1 - Math.abs(height - breakpoint.height) / Math.max(height, breakpoint.height);
    const score = (widthScore + heightScore) / 2;
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = breakpoint;
    }
  });
  
  return bestMatch;
};

// Helper function to create fallback scaled value
const createFallbackScaledValue = (
  value: number,
  currentBreakpoint: Breakpoint | null,
  base: Breakpoint
): ScaledValue => ({
  original: value,
  scaled: value,
  targetBreakpoint: currentBreakpoint ?? base,
  ratio: DEFAULT_RATIO,
  constraints: {
    minApplied: false,
    maxApplied: false,
    stepApplied: false
  },
  performance: {
    computationTime: DEFAULT_COMPUTATION_TIME,
    cacheHit: false
  }
});

// Custom hook for scaling ratios management
const useScalingRatios = (config: ResponsiveConfig, scalingEngine: ScalingEngine) => {
  const [scalingRatios, setScalingRatios] = useState<Record<string, number>>({});
  
  const computeRatios = useCallback(() => {
    const ratios = computeScalingRatios(config.breakpoints, scalingEngine);
    setScalingRatios(ratios);
  }, [config.breakpoints, scalingEngine]);
  
  useEffect(() => {
    computeRatios();
  }, [computeRatios]);
  
  return { scalingRatios, computeRatios };
};

// Custom hook for handling initial breakpoint updates
const useInitialBreakpoint = (
  initialBreakpoint: Breakpoint | string | undefined,
  resolvedInitialBreakpoint: Breakpoint,
  currentBreakpoint: Breakpoint,
  setCurrentBreakpoint: (bp: Breakpoint) => void
) => {
  useEffect(() => {
    if (initialBreakpoint && currentBreakpoint.name !== resolvedInitialBreakpoint.name) {
      setCurrentBreakpoint(resolvedInitialBreakpoint);
    }
  }, [initialBreakpoint, resolvedInitialBreakpoint, currentBreakpoint.name, setCurrentBreakpoint]);
};

// Custom hook for viewport-based breakpoint detection
const useViewportBreakpoint = (
  config: ResponsiveConfig,
  initialBreakpoint: Breakpoint | string | undefined,
  resolvedInitialBreakpoint: Breakpoint
) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(resolvedInitialBreakpoint);
  
  useInitialBreakpoint(initialBreakpoint, resolvedInitialBreakpoint, currentBreakpoint, setCurrentBreakpoint);
  
  useEffect(() => {
    if (initialBreakpoint) {
      return;
    }
    
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const bestMatch = findBestMatchingBreakpoint(width, height, config.breakpoints, config.base);
      setCurrentBreakpoint(bestMatch);
    };
    
    updateBreakpoint();
    
    const handleResize = () => updateBreakpoint();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [config.breakpoints, config.base, initialBreakpoint]);
  
  return currentBreakpoint;
};

// Custom hook for scaling functionality
const useScalingFunction = (
  scalingEngine: ScalingEngine,
  currentBreakpoint: Breakpoint,
  config: ResponsiveConfig,
  setComputedValues: React.Dispatch<React.SetStateAction<Map<string, ScaledValue>>>
) => {
  return useCallback((value: number, options: ScaleOptions = {}): ScaledValue => {
    try {
      if (!currentBreakpoint) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('No current breakpoint available, using base breakpoint');
        }
        return scalingEngine.scaleValue(value, config.base, options);
      }
      
      const result = scalingEngine.scaleValue(value, currentBreakpoint, options);
      
      if (!options.bypassCache) {
        const cacheKey = `${value}-${currentBreakpoint.name}-${JSON.stringify(options)}`;
        setComputedValues(prev => {
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
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Failed to scale value with options:', error);
      }
      return createFallbackScaledValue(value, currentBreakpoint, config.base);
    }
  }, [scalingEngine, currentBreakpoint, config.base, setComputedValues]);
};

// Custom hook for debug logging
const useDebugLogging = (
  debug: boolean,
  currentBreakpoint: Breakpoint,
  scalingRatios: Record<string, number>,
  computedValues: Map<string, ScaledValue>,
  config: ResponsiveConfig
) => {
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
};

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
  const resolvedInitialBreakpoint = useMemo(() => 
    resolveInitialBreakpoint(initialBreakpoint, config),
    [initialBreakpoint, config]
  );

  // State for computed values cache
  const [computedValues, setComputedValues] = useState<Map<string, ScaledValue>>(new Map());
  
  // Use custom hooks for complex logic
  const { scalingRatios, computeRatios } = useScalingRatios(config, scalingEngine);
  const currentBreakpoint = useViewportBreakpoint(config, initialBreakpoint, resolvedInitialBreakpoint);
  
  // Function to invalidate cache
  const invalidateCache = useCallback(() => {
    scalingEngine.clearCache();
    setComputedValues(new Map());
  }, [scalingEngine]);
  
  // Function to force re-computation
  const forceRecompute = useCallback(() => {
    invalidateCache();
    computeRatios();
  }, [invalidateCache, computeRatios]);

  // Enhanced scaling function that uses ScaleOptions
  const scaleValueWithOptions = useScalingFunction(scalingEngine, currentBreakpoint, config, setComputedValues);
  
  // Debug logging
  useDebugLogging(debug, currentBreakpoint, scalingRatios, computedValues, config);
  
  // Create the context value
  const contextValue: ResponsiveContextValue = useMemo(() => ({
    config,
    currentBreakpoint,
    scalingRatios,
    computedValues,
    invalidateCache,
    forceRecompute,
    scaleValueWithOptions
  }), [config, currentBreakpoint, scalingRatios, computedValues, invalidateCache, forceRecompute, scaleValueWithOptions]);
  
  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Export the context for advanced usage
export { ResponsiveContext };
