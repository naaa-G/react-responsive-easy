// Main entry point for React Responsive Easy Core

// Export all types
export * from './types';

// Export core scaling engine
export { ScalingEngine } from './scaling/ScalingEngine';

// Export React runtime components
export { ResponsiveProvider, useResponsiveContext } from './provider/ResponsiveContext';
export * from './hooks';

// Export configuration utilities
export { 
  createDefaultConfig, 
  configPresets, 
  validateConfig 
} from './utils/defaultConfig';

// Export version information
export const VERSION = '0.0.1';
export const PACKAGE_NAME = '@react-responsive-easy/core';

// Re-export commonly used types for convenience
export type {
  ResponsiveConfig,
  Breakpoint,
  ScalingToken,
  ScaledValue,
  ScaleOptions,
  ResponsiveContextValue
} from './types';
