/**
 * Constants for React Responsive Easy Storybook Addon
 */

export const ADDON_ID = 'react-responsive-easy';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = 'responsiveEasy';
export const EVENTS = {
  BREAKPOINT_CHANGED: `${ADDON_ID}/breakpoint-changed`,
  CONFIG_UPDATED: `${ADDON_ID}/config-updated`,
  PERFORMANCE_DATA: `${ADDON_ID}/performance-data`,
  RESET_VIEWPORT: `${ADDON_ID}/reset-viewport`,
  TOGGLE_OVERLAY: `${ADDON_ID}/toggle-overlay`
} as const;

export const DEFAULT_BREAKPOINTS = [
  { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
  { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
  { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
] as const;

export const TOOLBAR_ID = `${ADDON_ID}/toolbar`;
