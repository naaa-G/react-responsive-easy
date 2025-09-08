/**
 * Type definitions for the Babel plugin
 */

import type { PluginPass, NodePath, types as BabelTypes } from '@babel/core';

export interface BabelPluginOptions {
  /** Path to the RRE configuration file */
  configPath?: string;
  /** Inline configuration object */
  configInline?: ResponsiveConfig;
  /** Enable build-time pre-computation */
  precompute?: boolean;
  /** Enable CSS custom properties generation */
  generateCSSProps?: boolean;
  /** Enable development mode with extra debugging */
  development?: boolean;
  /** Custom import source for RRE hooks */
  importSource?: string;
  /** Enable caching for better performance */
  enableCaching?: boolean;
  /** Maximum cache size */
  cacheSize?: number;
  /** Enable memoization optimization */
  enableMemoization?: boolean;
  /** Add helpful comments in development */
  addComments?: boolean;
  /** Validate configuration at build time */
  validateConfig?: boolean;
  /** Collect performance metrics */
  performanceMetrics?: boolean;
  /** Generate source maps */
  generateSourceMaps?: boolean;
  /** Preserve TypeScript type information */
  preserveTypeInfo?: boolean;
  /** Minify transformed code */
  minifyOutput?: boolean;
  /** Custom transformation hooks */
  onTransform?: (node: any, context: TransformContext) => void;
  /** Error handling hook */
  onError?: (error: Error, context: TransformContext) => void;
}

export interface ResponsiveConfig {
  base: Viewport;
  breakpoints: Breakpoint[];
  strategy: ScalingStrategy;
}

export interface Viewport {
  name: string;
  width: number;
  height: number;
  alias: string;
}

export interface Breakpoint {
  name: string;
  width: number;
  height: number;
  alias: string;
}

export interface ScalingStrategy {
  origin: 'width' | 'height' | 'min' | 'max' | 'diagonal' | 'area';
  tokens: TokenConfig;
  rounding: RoundingConfig;
  fallback?: string;
}

export interface TokenConfig {
  [key: string]: {
    scale?: number | ((value: number, ratio: number) => number);
    min?: number;
    max?: number;
    step?: number;
    round?: boolean;
    unit?: string;
  };
}

export interface RoundingConfig {
  mode: 'nearest' | 'floor' | 'ceil';
  precision: number;
}

export interface TransformContext {
  filename: string;
  line: number;
  column: number;
  code: string;
  transformTime?: number;
}

export interface CacheEntry {
  input: string;
  output: string;
  timestamp: number;
  options: BabelPluginOptions;
}

export interface PerformanceMetrics {
  transformCount: number;
  totalTransformTime: number;
  averageTransformTime: number;
  cacheHits: number;
  cacheMisses: number;
  errors: number;
}

export interface PluginState {
  config?: ResponsiveConfig;
  cache?: Map<string, CacheEntry>;
  metrics?: PerformanceMetrics;
  hasTransformations?: boolean;
  filename?: string;
  api?: any; // Babel API object with types property
  opts?: BabelPluginOptions;
  file?: any;
  cwd?: string;
  existingImports?: Set<string>;
  [key: string]: any;
}

export type SupportedHook = 
  | 'useResponsiveValue'
  | 'useScaledStyle'
  | 'useResponsiveStyle'
  | 'useBreakpoint'
  | 'useResponsiveLayout';

export interface HookTransform {
  name: SupportedHook;
  transform: (path: NodePath<any>, state: PluginState) => void;
  shouldTransform: (path: NodePath<any>) => boolean;
}

export interface CSSProperty {
  name: string;
  value: string;
  breakpoint: string;
  token?: string;
}

export interface CSSCustomProperties {
  [breakpoint: string]: {
    [property: string]: string;
  };
}
