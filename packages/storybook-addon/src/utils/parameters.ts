/**
 * Utility functions for Storybook parameters
 */

import type { ResponsiveStoryParameters, BreakpointConfig } from '../types';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';
import { DEFAULT_BREAKPOINTS } from '../constants';

/**
 * Create responsive parameters for Storybook stories
 */
export function responsiveParameters(
  options: {
    config?: ResponsiveConfig;
    breakpoints?: BreakpointConfig[];
    performance?: {
      enabled?: boolean;
      thresholds?: Record<string, number>;
    };
    visual?: {
      showOverlay?: boolean;
      showGrid?: boolean;
      showRulers?: boolean;
    };
    disable?: boolean;
  } = {}
): ResponsiveStoryParameters {
  return {
    responsiveEasy: {
      config: options.config,
      breakpoints: options.breakpoints ?? [...DEFAULT_BREAKPOINTS],
      disable: options.disable ?? false,
      performance: {
        enabled: options.performance?.enabled ?? true,
        thresholds: {
          renderTime: 16, // 60fps
          memoryUsage: 100 * 1024, // 100KB
          layoutShifts: 0,
          cacheHitRate: 0.8,
          ...options.performance?.thresholds
        }
      },
      visual: {
        showOverlay: options.visual?.showOverlay ?? false,
        showGrid: options.visual?.showGrid ?? false,
        showRulers: options.visual?.showRulers ?? false
      }
    }
  };
}

/**
 * Create parameters for mobile-first responsive design
 */
export function mobileFirstParameters(
  config?: ResponsiveConfig
): ResponsiveStoryParameters {
  const mobileBreakpoints: BreakpointConfig[] = [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' }
  ];

  return responsiveParameters({
    config: {
      base: mobileBreakpoints[0],
      breakpoints: mobileBreakpoints.slice(1),
      strategy: {
        origin: 'top-left',
        mode: 'scale',
        tokens: {},
        rounding: 'round',
        lineHeight: 'scale',
        shadow: 'scale',
        border: 'scale',
        accessibility: {
          respectMotionPreference: true,
          maintainFocusVisibility: true,
          preserveSemanticStructure: true
        },
        performance: {
          enableCaching: true,
          batchUpdates: true,
          lazyCalculation: true
        }
      },
      ...config
    },
    breakpoints: mobileBreakpoints
  });
}

/**
 * Create parameters for desktop-first responsive design
 */
export function desktopFirstParameters(
  config?: ResponsiveConfig
): ResponsiveStoryParameters {
  const desktopBreakpoints: BreakpointConfig[] = [
    { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' },
    { name: 'Laptop', width: 1440, height: 900, alias: 'laptop' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' }
  ];

  return responsiveParameters({
    config: {
      base: desktopBreakpoints[0],
      breakpoints: desktopBreakpoints.slice(1),
      strategy: {
        origin: 'top-left',
        mode: 'scale',
        tokens: {},
        rounding: 'round',
        lineHeight: 'scale',
        shadow: 'scale',
        border: 'scale',
        accessibility: {
          respectMotionPreference: true,
          maintainFocusVisibility: true,
          preserveSemanticStructure: true
        },
        performance: {
          enableCaching: true,
          batchUpdates: true,
          lazyCalculation: true
        }
      },
      ...config
    },
    breakpoints: desktopBreakpoints
  });
}

/**
 * Create parameters for performance-focused testing
 */
export function performanceParameters(
  thresholds?: Record<string, number>
): ResponsiveStoryParameters {
  return responsiveParameters({
    performance: {
      enabled: true,
      thresholds: {
        renderTime: 8, // 120fps
        memoryUsage: 50 * 1024, // 50KB
        layoutShifts: 0,
        cacheHitRate: 0.9,
        ...thresholds
      }
    }
  });
}

/**
 * Create parameters for visual debugging
 */
export function debugParameters(): ResponsiveStoryParameters {
  return responsiveParameters({
    visual: {
      showOverlay: true,
      showGrid: true,
      showRulers: true
    },
    performance: {
      enabled: true
    }
  });
}

/**
 * Create parameters for accessibility testing
 */
export function accessibilityParameters(
  config?: ResponsiveConfig
): ResponsiveStoryParameters {
  return responsiveParameters({
    config: {
      strategy: {
        origin: 'top-left',
        mode: 'scale',
        tokens: {},
        rounding: 'round',
        lineHeight: 'scale',
        shadow: 'scale',
        border: 'scale',
        accessibility: {
          respectMotionPreference: true,
          maintainFocusVisibility: true,
          preserveSemanticStructure: true,
          minFontSize: 14,
          minTouchTargetSize: 44,
          maxScaleFactor: 2
        },
        performance: {
          enableCaching: true,
          batchUpdates: true,
          lazyCalculation: true
        }
      },
      ...config
    },
    performance: {
      enabled: true,
      thresholds: {
        renderTime: 16,
        memoryUsage: 100 * 1024,
        layoutShifts: 0
      }
    }
  });
}

/**
 * Merge multiple parameter objects
 */
export function mergeParameters(
  ...parameterObjects: ResponsiveStoryParameters[]
): ResponsiveStoryParameters {
  return parameterObjects.reduce((merged, params) => {
    if (!params.responsiveEasy) return merged;

    return {
      responsiveEasy: {
        ...merged.responsiveEasy,
        ...params.responsiveEasy,
        config: {
          ...merged.responsiveEasy?.config,
          ...params.responsiveEasy.config
        },
        performance: {
          ...merged.responsiveEasy?.performance,
          ...params.responsiveEasy.performance,
          thresholds: {
            ...merged.responsiveEasy?.performance?.thresholds,
            ...params.responsiveEasy.performance?.thresholds
          }
        },
        visual: {
          ...merged.responsiveEasy?.visual,
          ...params.responsiveEasy.visual
        }
      }
    } as ResponsiveStoryParameters;
  }, { responsiveEasy: {} } as ResponsiveStoryParameters);
}
