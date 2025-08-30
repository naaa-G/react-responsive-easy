/**
 * Utilities for generating responsive Storybook args
 */

import type { ResponsiveArgs, BreakpointConfig } from '../types';
import { DEFAULT_BREAKPOINTS } from '../constants';

/**
 * Generate responsive args for a Storybook story
 */
export function generateResponsiveArgs(
  baseArgs: Record<string, any>,
  breakpoints: BreakpointConfig[] = [...DEFAULT_BREAKPOINTS]
): ResponsiveArgs {
  const responsiveValues: Record<string, any> = {};

  // Generate responsive values for each arg
  Object.entries(baseArgs).forEach(([key, value]) => {
    if (typeof value === 'number') {
      // Generate scaled numeric values
      responsiveValues[key] = breakpoints.reduce((acc, bp) => {
        const scale = calculateScale(bp, DEFAULT_BREAKPOINTS[2]); // Desktop as base
        acc[bp.alias] = Math.round(value * scale);
        return acc;
      }, {} as Record<string, number>);
    } else if (typeof value === 'string' && value.includes('px')) {
      // Handle pixel values
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        responsiveValues[key] = breakpoints.reduce((acc, bp) => {
          const scale = calculateScale(bp, DEFAULT_BREAKPOINTS[2]);
          acc[bp.alias] = `${Math.round(numericValue * scale)}px`;
          return acc;
        }, {} as Record<string, string>);
      }
    } else if (isStyleObject(value)) {
      // Handle style objects
      responsiveValues[key] = breakpoints.reduce((acc, bp) => {
        const scale = calculateScale(bp, DEFAULT_BREAKPOINTS[2]);
        acc[bp.alias] = scaleStyleObject(value, scale);
        return acc;
      }, {} as Record<string, any>);
    }
  });

  return {
    breakpoint: breakpoints[0],
    responsiveValues,
    scale: 1,
    enabled: true
  };
}

/**
 * Calculate scale factor between breakpoints
 */
function calculateScale(target: BreakpointConfig, base: BreakpointConfig): number {
  // Use the smaller dimension for scaling to ensure content fits
  const targetSize = Math.min(target.width, target.height);
  const baseSize = Math.min(base.width, base.height);
  return targetSize / baseSize;
}

/**
 * Check if a value is a style object
 */
function isStyleObject(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (value.hasOwnProperty('width') ||
     value.hasOwnProperty('height') ||
     value.hasOwnProperty('fontSize') ||
     value.hasOwnProperty('padding') ||
     value.hasOwnProperty('margin'))
  );
}

/**
 * Scale a style object
 */
function scaleStyleObject(styles: Record<string, any>, scale: number): Record<string, any> {
  const scaledStyles: Record<string, any> = {};

  Object.entries(styles).forEach(([property, value]) => {
    if (typeof value === 'number') {
      scaledStyles[property] = Math.round(value * scale);
    } else if (typeof value === 'string' && value.includes('px')) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        scaledStyles[property] = `${Math.round(numericValue * scale)}px`;
      } else {
        scaledStyles[property] = value;
      }
    } else if (property === 'boxShadow' && typeof value === 'string') {
      // Scale box shadow values
      scaledStyles[property] = scaleBoxShadow(value, scale);
    } else {
      scaledStyles[property] = value;
    }
  });

  return scaledStyles;
}

/**
 * Scale box shadow values
 */
function scaleBoxShadow(shadow: string, scale: number): string {
  return shadow.replace(
    /(-?\d+(?:\.\d+)?)px/g,
    (match, value) => `${Math.round(parseFloat(value) * scale)}px`
  );
}

/**
 * Generate argTypes for responsive controls
 */
export function generateResponsiveArgTypes(
  baseArgTypes: Record<string, any>,
  breakpoints: BreakpointConfig[] = [...DEFAULT_BREAKPOINTS]
): Record<string, any> {
  const argTypes: Record<string, any> = {
    ...baseArgTypes,
    breakpoint: {
      name: 'Current Breakpoint',
      description: 'The currently active breakpoint',
      control: {
        type: 'select',
        options: breakpoints.map(bp => bp.name)
      },
      table: {
        category: 'Responsive',
        subcategory: 'Breakpoints'
      }
    },
    scale: {
      name: 'Scale Factor',
      description: 'Manual scale override',
      control: {
        type: 'range',
        min: 0.1,
        max: 3,
        step: 0.1
      },
      table: {
        category: 'Responsive',
        subcategory: 'Scaling'
      }
    },
    enabled: {
      name: 'Responsive Enabled',
      description: 'Enable or disable responsive behavior',
      control: 'boolean',
      table: {
        category: 'Responsive',
        subcategory: 'Controls'
      }
    }
  };

  // Add responsive controls for scalable properties
  Object.entries(baseArgTypes).forEach(([key, argType]) => {
    if (isScalableProperty(key, argType)) {
      breakpoints.forEach(bp => {
        argTypes[`${key}_${bp.alias}`] = {
          ...argType,
          name: `${argType.name || key} (${bp.name})`,
          description: `${argType.description || ''} for ${bp.name} breakpoint`,
          table: {
            ...argType.table,
            category: 'Responsive',
            subcategory: bp.name
          }
        };
      });
    }
  });

  return argTypes;
}

/**
 * Check if a property should have responsive controls
 */
function isScalableProperty(key: string, argType: any): boolean {
  const scalableProps = [
    'width', 'height', 'fontSize', 'padding', 'margin', 'borderRadius',
    'top', 'left', 'right', 'bottom', 'size', 'spacing', 'gap'
  ];

  return (
    scalableProps.some(prop => key.toLowerCase().includes(prop)) ||
    argType.control?.type === 'number' ||
    argType.control?.type === 'range'
  );
}

/**
 * Create responsive story parameters
 */
export function createResponsiveParameters(
  config?: any,
  breakpoints?: BreakpointConfig[]
): any {
  return {
    responsiveEasy: {
      config,
      breakpoints: breakpoints || DEFAULT_BREAKPOINTS,
      performance: {
        enabled: true,
        thresholds: {
          renderTime: 16,
          memoryUsage: 100 * 1024, // 100KB
          layoutShifts: 0
        }
      },
      visual: {
        showOverlay: false,
        showGrid: false,
        showRulers: false
      }
    }
  };
}
