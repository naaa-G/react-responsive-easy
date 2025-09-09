/**
 * Type definitions for React Responsive Easy Storybook Addon
 */

/* eslint-disable no-unused-vars */
import type { ResponsiveConfig } from '@react-responsive-easy/core';

export interface ResponsiveAddonConfig {
  /** Default responsive configuration */
  config?: ResponsiveConfig;
  /** Whether to show performance metrics */
  showPerformance?: boolean;
  /** Whether to show breakpoint overlay */
  showOverlay?: boolean;
  /** Whether to enable automatic responsive args generation */
  autoGenerateArgs?: boolean;
  /** Custom breakpoints for the addon */
  breakpoints?: BreakpointConfig[];
  /** Default breakpoint to start with */
  defaultBreakpoint?: string;
}

export interface ResponsiveStoryParameters {
  /** Responsive configuration for this story */
  responsiveEasy?: {
    /** Story-specific responsive config */
    config?: ResponsiveConfig;
    /** Breakpoints to test */
    breakpoints?: BreakpointConfig[];
    /** Whether to disable responsive behavior */
    disable?: boolean;
    /** Performance monitoring settings */
    performance?: {
      enabled?: boolean;
      thresholds?: Record<string, number>;
    };
    /** Visual settings */
    visual?: {
      showOverlay?: boolean;
      showGrid?: boolean;
      showRulers?: boolean;
    };
  };
}

export interface BreakpointConfig {
  name: string;
  width: number;
  height: number;
  alias: string;
  icon?: string;
  description?: string;
}

export interface ResponsiveArgs {
  /** Current breakpoint */
  breakpoint?: BreakpointConfig;
  /** Responsive values for different breakpoints */
  responsiveValues?: Record<string, unknown>;
  /** Scaling factor */
  scale?: number;
  /** Whether responsive behavior is enabled */
  enabled?: boolean;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface ResponsiveState {
  currentBreakpoint: BreakpointConfig | null;
  availableBreakpoints: BreakpointConfig[];
  isOverlayVisible: boolean;
  isPerformanceVisible: boolean;
  performanceData: PerformanceMetrics | null;
  config: ResponsiveConfig | null;
}

export interface AddonPanelProps {
  active: boolean;
  api: {
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    off: (event: string, callback: (...args: unknown[]) => void) => void;
    emit: (event: string, data?: unknown) => void;
  };
  key: string;
}

export interface ToolbarProps {
  api: {
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    off: (event: string, callback: (...args: unknown[]) => void) => void;
    emit: (event: string, data?: unknown) => void;
  };
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  layoutShifts: number;
  scalingOperations: number;
  cacheHitRate: number;
}

export interface ResponsiveTestCase {
  name: string;
  breakpoint: BreakpointConfig;
  expectedValues: Record<string, unknown>;
  description?: string;
}

export interface ResponsiveDocumentation {
  title: string;
  description: string;
  examples: ResponsiveExample[];
  testCases: ResponsiveTestCase[];
  performance: PerformanceMetrics;
}

export interface ResponsiveExample {
  name: string;
  code: string;
  description: string;
  breakpoint?: BreakpointConfig;
}
