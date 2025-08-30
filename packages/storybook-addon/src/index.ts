/**
 * React Responsive Easy Storybook Addon
 * 
 * This addon provides comprehensive tools for documenting and testing
 * responsive React components within Storybook.
 */

// Export main addon functionality
export { ResponsiveDecorator } from './decorators/ResponsiveDecorator';
export { withResponsiveProvider } from './decorators/withResponsiveProvider';

// Export addon components
export { ResponsivePanel } from './components/ResponsivePanel';
export { BreakpointToolbar } from './components/BreakpointToolbar';
export { ResponsiveControls } from './components/ResponsiveControls';

// Export utilities
export { generateResponsiveArgs } from './utils/generateArgs';
export { createResponsiveStory } from './utils/createStory';
export { responsiveParameters } from './utils/parameters';

// Export types
export type {
  ResponsiveAddonConfig,
  ResponsiveStoryParameters,
  BreakpointConfig,
  ResponsiveArgs
} from './types';

// Export constants
export { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

// Version info
export const VERSION = '0.0.1';
