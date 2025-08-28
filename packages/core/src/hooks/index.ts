// Main exports for React Responsive Easy hooks

// Core responsive value hooks
export { 
  useResponsiveValue,
  useResponsiveValueWithUnit,
  useResponsiveValues,
  useResponsiveValueInfo
} from './useResponsiveValue';

// Style scaling hooks
export {
  useScaledStyle,
  useScaledStyleWithTokens,
  useResponsiveCSSVariables
} from './useScaledStyle';

// Breakpoint utility hooks
export {
  useBreakpoint,
  useBreakpointMatch,
  useBreakpointRange,
  useBreakpointValue,
  useBreakpoints,
  useBaseBreakpoint,
  useIsBaseBreakpoint
} from './useBreakpoint';

// Re-export types for convenience
export type { ScaleOptions, ScaledValue } from '../types';
