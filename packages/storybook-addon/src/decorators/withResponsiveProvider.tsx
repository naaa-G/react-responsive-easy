/**
 * Higher-Order Decorator for Responsive Provider
 * 
 * This decorator automatically wraps stories with ResponsiveProvider
 * based on story parameters.
 */

import React from 'react';
import type { DecoratorFunction } from '@storybook/types';
import { ResponsiveProvider } from '@react-responsive-easy/core';
import { DEFAULT_BREAKPOINTS } from '../constants';

export const withResponsiveProvider: DecoratorFunction = (Story, context) => {
  const parameters = context.parameters?.responsiveEasy ?? {};
  
  // Skip if responsive behavior is disabled
  if (parameters.disable) {
    return Story(context);
  }

  // Use story-specific config or create default
  const config = parameters.config ?? {
    base: {
      name: 'Desktop',
      width: 1920,
      height: 1080,
      alias: 'desktop'
    },
    breakpoints: DEFAULT_BREAKPOINTS.map(bp => ({
      name: bp.name,
      width: bp.width,
      height: bp.height,
      alias: bp.alias
    })),
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
    }
  };

  // Determine initial breakpoint
  const initialBreakpoint = parameters.breakpoints?.[0] ?? DEFAULT_BREAKPOINTS[0];

  return (
    <ResponsiveProvider 
      config={config}
      initialBreakpoint={initialBreakpoint}
      debug={parameters.debug ?? false}
    >
      {Story(context) as React.ReactElement}
    </ResponsiveProvider>
  );
};
