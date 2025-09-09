/**
 * Utilities for generating responsive Storybook args
 */

import type { ResponsiveArgs, BreakpointConfig } from '../types';
import type { ResponsiveConfig } from '@react-responsive-easy/core';
import { DEFAULT_BREAKPOINTS } from '../constants';

// Define proper types for Storybook arg types
interface StorybookArgType {
  name?: string;
  description?: string;
  control?: {
    type?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
  };
  table?: {
    category?: string;
    subcategory?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Generate responsive args for a Storybook story
 */
export function generateResponsiveArgs(
  baseArgs: Record<string, unknown>,
  breakpoints: BreakpointConfig[] = [...DEFAULT_BREAKPOINTS]
): ResponsiveArgs {
  const responsiveValues: Record<string, unknown> = {};

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
        acc[bp.alias] = scaleStyleObject(value as Record<string, unknown>, scale);
        return acc;
      }, {} as Record<string, unknown>);
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
function isStyleObject(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (Object.prototype.hasOwnProperty.call(value, 'width') ||
     Object.prototype.hasOwnProperty.call(value, 'height') ||
     Object.prototype.hasOwnProperty.call(value, 'fontSize') ||
     Object.prototype.hasOwnProperty.call(value, 'padding') ||
     Object.prototype.hasOwnProperty.call(value, 'margin'))
  );
}

/**
 * Scale a style object
 */
function scaleStyleObject(styles: Record<string, unknown>, scale: number): Record<string, unknown> {
  const scaledStyles: Record<string, unknown> = {};

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
  baseArgTypes: Record<string, StorybookArgType>,
  breakpoints: BreakpointConfig[] = [...DEFAULT_BREAKPOINTS]
): Record<string, StorybookArgType> {
  const argTypes: Record<string, StorybookArgType> = {
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
      control: {
        type: 'boolean'
      },
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
          name: `${argType.name ?? key} (${bp.name})`,
          description: `${argType.description ?? ''} for ${bp.name} breakpoint`,
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
function isScalableProperty(key: string, argType: StorybookArgType): boolean {
  const scalableProps = [
    'width', 'height', 'fontSize', 'padding', 'margin', 'borderRadius',
    'top', 'left', 'right', 'bottom', 'size', 'spacing', 'gap'
  ];

  const argTypeObj = argType as { control?: { type?: string } };
  return (
    scalableProps.some(prop => key.toLowerCase().includes(prop)) ||
    argTypeObj.control?.type === 'number' ||
    argTypeObj.control?.type === 'range'
  );
}

/**
 * Create responsive story parameters
 */
export function createResponsiveParameters(
  config?: ResponsiveConfig,
  breakpoints?: BreakpointConfig[]
): Record<string, unknown> {
  return {
    responsiveEasy: {
      config,
      breakpoints: breakpoints ?? DEFAULT_BREAKPOINTS,
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
