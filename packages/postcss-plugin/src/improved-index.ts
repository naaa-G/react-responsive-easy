/**
 * @react-responsive-easy/postcss-plugin
 * 
 * Enterprise-grade PostCSS plugin for processing CSS with React Responsive Easy transformations.
 * Generates responsive CSS custom properties and media queries with comprehensive error handling,
 * performance optimization, and enterprise features.
 */

import type { Plugin, PluginCreator, Root, Rule, Declaration, AtRule } from 'postcss';
import valueParser from 'postcss-value-parser';

// Enhanced plugin options interface
export interface PostCSSPluginOptions {
  /** Path to the RRE configuration file */
  configPath?: string;
  /** Generate CSS custom properties for responsive values */
  generateCustomProperties?: boolean;
  /** Generate @custom-media rules for breakpoints */
  generateCustomMedia?: boolean;
  /** Prefix for generated CSS custom properties */
  customPropertyPrefix?: string;
  /** Enable development mode with extra comments */
  development?: boolean;
  /** Enable performance metrics collection */
  performanceMetrics?: boolean;
  /** Enable CSS validation */
  validateCSS?: boolean;
  /** Enable caching for better performance */
  enableCaching?: boolean;
  /** Maximum cache size */
  cacheSize?: number;
  /** Custom error handler */
  onError?: (error: Error, context: any) => void;
  /** Custom transformation handler */
  onTransform?: (declaration: Declaration, context: any) => void;
}

// Configuration interface
interface ResponsiveConfig {
  base: Viewport;
  breakpoints: Breakpoint[];
  strategy: ScalingStrategy;
}

interface Viewport {
  name: string;
  width: number;
  height: number;
  alias: string;
}

interface Breakpoint {
  name: string;
  width: number;
  height: number;
  alias: string;
}

interface ScalingStrategy {
  origin: 'width' | 'height' | 'area' | 'diagonal';
  tokens: TokenConfig;
  rounding: RoundingConfig;
}

interface TokenConfig {
  [key: string]: {
    scale: number;
    min?: number;
    max?: number;
    step?: number;
  };
}

interface RoundingConfig {
  mode: 'nearest' | 'up' | 'down';
  precision: number;
}

// Performance metrics interface
interface PerformanceMetrics {
  transformations: number;
  customPropertiesGenerated: number;
  mediaQueriesGenerated: number;
  executionTime: number;
  cacheHits: number;
  cacheMisses: number;
}

// Error context interface
interface ErrorContext {
  file?: string;
  line?: number;
  column?: number;
  property?: string;
  value?: string;
}

// Transformation context interface
interface TransformContext {
  declaration: Declaration;
  property: string;
  value: string;
  baseValue: number;
  token?: string;
  breakpoint: Breakpoint;
}

// Default configuration
const defaultConfig: ResponsiveConfig = {
  base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
  breakpoints: [
    { name: 'mobile', width: 390, height: 844, alias: 'mobile' },
    { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'laptop', width: 1366, height: 768, alias: 'laptop' },
    { name: 'desktop', width: 1920, height: 1080, alias: 'base' }
  ],
  strategy: {
    origin: 'width',
    tokens: {
      fontSize: { scale: 0.85, min: 12, max: 72 },
      spacing: { scale: 0.9, step: 4, min: 4, max: 128 },
      radius: { scale: 0.95, min: 2, max: 32 },
      shadows: { scale: 0.8, min: 0, max: 24 }
    },
    rounding: { mode: 'nearest', precision: 0.5 }
  }
};

// Cache for performance optimization
class TransformationCache {
  private cache = new Map<string, any>();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Enhanced scaling function with better error handling
function scaleValue(
  baseValue: number,
  fromBreakpoint: Viewport,
  toBreakpoint: Breakpoint,
  token?: string,
  config: ResponsiveConfig = defaultConfig
): number {
  try {
    const fromSize = fromBreakpoint.width;
    const toSize = toBreakpoint.width;
    const ratio = toSize / fromSize;
    
    let scaledValue = baseValue * ratio;
    
    // Apply token-specific rules
    if (token && config.strategy.tokens[token]) {
      const tokenConfig = config.strategy.tokens[token];
      if (tokenConfig.scale) {
        scaledValue = baseValue * tokenConfig.scale * ratio;
      }
      
      // Apply constraints
      if (tokenConfig.min !== undefined && scaledValue < tokenConfig.min) {
        scaledValue = tokenConfig.min;
      }
      if (tokenConfig.max !== undefined && scaledValue > tokenConfig.max) {
        scaledValue = tokenConfig.max;
      }
      if (tokenConfig.step !== undefined) {
        scaledValue = Math.round(scaledValue / tokenConfig.step) * tokenConfig.step;
      }
    }
    
    // Apply rounding
    const precision = config.strategy.rounding.precision;
    if (precision > 0) {
      scaledValue = Math.round(scaledValue / precision) * precision;
    }
    
    return scaledValue;
  } catch (error) {
    console.warn('Error scaling value:', error);
    return baseValue;
  }
}

// Enhanced value parser with better error handling
function parseRreFunction(value: string): { baseValue: number; token?: string } | null {
  try {
    const parsed = valueParser(value);
    let result: { baseValue: number; token?: string } | null = null;
    
    parsed.walk((node) => {
      if (node.type === 'function' && node.value === 'rre') {
        const args = node.nodes;
        if (args.length >= 1) {
          const baseValue = parseFloat(args[0].value);
          if (!isNaN(baseValue)) {
            let token: string | undefined;
            if (args.length >= 2) {
              token = args[1].value.replace(/['"]/g, '');
            }
            result = { baseValue, token };
          }
        }
      }
    });
    
    return result;
  } catch (error) {
    console.warn('Error parsing rre function:', error);
    return null;
  }
}

// Enhanced CSS validation
function validateCSS(css: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    // Basic syntax validation
    let braceCount = 0;
    let parenCount = 0;
    
    for (const char of css) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
    }
    
    if (braceCount !== 0) {
      errors.push(`Unmatched braces: ${braceCount}`);
    }
    
    if (parenCount !== 0) {
      errors.push(`Unmatched parentheses: ${parenCount}`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    errors.push(`Validation error: ${error}`);
    return { valid: false, errors };
  }
}

// Enhanced error handling
function handleError(error: Error, context: ErrorContext, onError?: (error: Error, context: any) => void): void {
  const errorMessage = `PostCSS Plugin Error: ${error.message}`;
  const errorWithContext = new Error(errorMessage);
  
  if (onError) {
    onError(errorWithContext, context);
  } else {
    console.error(errorMessage, context);
  }
}

// Enhanced transformation handler
function handleTransform(
  declaration: Declaration,
  context: TransformContext,
  onTransform?: (declaration: Declaration, context: any) => void
): void {
  if (onTransform) {
    onTransform(declaration, context);
  }
}

// Main plugin creator with enhanced features
const postcssResponsiveEasy: PluginCreator<PostCSSPluginOptions> = (options = {}) => {
  const {
    configPath = 'rre.config.ts',
    generateCustomProperties = true,
    generateCustomMedia = true,
    customPropertyPrefix = '--rre',
    development = false,
    performanceMetrics = false,
    validateCSS: enableValidation = false,
    enableCaching = true,
    cacheSize = 1000,
    onError,
    onTransform
  } = options;

  // Initialize cache
  const cache = enableCaching ? new TransformationCache(cacheSize) : null;
  
  // Performance metrics
  const metrics: PerformanceMetrics = {
    transformations: 0,
    customPropertiesGenerated: 0,
    mediaQueriesGenerated: 0,
    executionTime: 0,
    cacheHits: 0,
    cacheMisses: 0
  };

  const startTime = performance.now();

  return {
    postcssPlugin: '@react-responsive-easy/postcss-plugin',
    
    // Process CSS declarations
    Declaration(decl) {
      try {
        // Look for RRE function calls in CSS values
        const rreValuePattern = /rre\(([^)]*)\)/g;
        
        if (rreValuePattern.test(decl.value)) {
          const parsed = valueParser(decl.value);
          let hasTransformations = false;
          
          parsed.walk((node) => {
            if (node.type === 'function' && node.value === 'rre') {
              const args = node.nodes;
              if (args.length >= 1) {
                const baseValue = parseFloat(args[0].value);
                let token: string | undefined;
                
                // Look for token in additional arguments
                if (args.length >= 2) {
                  token = args[1].value.replace(/['"]/g, '');
                }
                
                if (!isNaN(baseValue)) {
                  // Check cache first
                  const cacheKey = `${baseValue}-${token || 'default'}-${decl.prop}`;
                  let responsiveValues: Record<string, number> | undefined;
                  
                  if (cache) {
                    responsiveValues = cache.get(cacheKey);
                    if (responsiveValues) {
                      metrics.cacheHits++;
                    } else {
                      metrics.cacheMisses++;
                    }
                  }
                  
                  // Generate responsive values if not cached
                  if (!responsiveValues) {
                    responsiveValues = {};
                    defaultConfig.breakpoints.forEach(breakpoint => {
                      const scaledValue = scaleValue(baseValue, defaultConfig.base, breakpoint, token);
                      responsiveValues![breakpoint.name] = scaledValue;
                    });
                    
                    if (cache) {
                      cache.set(cacheKey, responsiveValues);
                    }
                  }
                  
                  if (generateCustomProperties) {
                    // Replace with CSS custom property
                    const propName = `${customPropertyPrefix}-${decl.prop.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                    (node as any).type = 'word';
                    node.value = `var(${propName})`;
                    
                    // Add custom properties at root level
                    const root = decl.root();
                    if (root) {
                      // Find or create :root rule
                      let rootRule = root.first;
                      if (!rootRule || rootRule.type !== 'rule' || (rootRule as any).selector !== ':root') {
                        rootRule = (root as any).rule({ selector: ':root' });
                        root.prepend(rootRule);
                      }
                      
                      // Add base value
                      if (rootRule && rootRule.type === 'rule') {
                        (rootRule as any).append({
                          prop: propName,
                          value: `${baseValue}px`
                        });
                        
                        if (development) {
                          (rootRule as any).append({
                            prop: `${propName}-comment`,
                            value: `/* Generated by @react-responsive-easy/postcss-plugin */`
                          });
                        }
                      }
                      
                      // Add responsive variants with media queries
                      defaultConfig.breakpoints.forEach(breakpoint => {
                        if (breakpoint.name !== defaultConfig.base.name) {
                          const mediaQuery = `(max-width: ${breakpoint.width}px)`;
                          const mediaRule = (root as any).rule({ selector: `@media ${mediaQuery}` });
                          const innerRootRule = (mediaRule as any).rule({ selector: ':root' });
                          
                          (innerRootRule as any).append({
                            prop: propName,
                            value: `${responsiveValues![breakpoint.name]}px`
                          });
                          
                          root.append(mediaRule);
                        }
                      });
                    }
                    
                    metrics.customPropertiesGenerated++;
                  } else {
                    // Replace with base value
                    (node as any).type = 'word';
                    node.value = `${baseValue}px`;
                  }
                  
                  hasTransformations = true;
                  metrics.transformations++;
                  
                  // Call transformation handler
                  handleTransform(decl, {
                    declaration: decl,
                    property: decl.prop,
                    value: decl.value,
                    baseValue,
                    token,
                    breakpoint: defaultConfig.base
                  }, onTransform);
                }
              }
            }
          });
          
          if (hasTransformations) {
            decl.value = parsed.toString();
          }
        }
      } catch (error) {
        handleError(error as Error, {
          file: decl.source?.input.from,
          line: decl.source?.start?.line,
          column: decl.source?.start?.column,
          property: decl.prop,
          value: decl.value
        }, onError);
      }
    },
    
    // Generate @custom-media rules at the end
    OnceExit(root) {
      try {
        if (generateCustomMedia) {
          // Add custom media queries at the top
          const customMediaRules: string[] = [];
          
          defaultConfig.breakpoints.forEach(breakpoint => {
            const mediaName = `--${breakpoint.name}`;
            const mediaQuery = `(max-width: ${breakpoint.width}px)`;
            customMediaRules.push(`@custom-media ${mediaName} ${mediaQuery};`);
          });
          
          if (customMediaRules.length > 0) {
            // Add comment if in development mode
            if (development) {
              root.prepend({
                type: 'comment',
                text: ' Custom media queries generated by @react-responsive-easy/postcss-plugin '
              });
            }
            
            // Add custom media rules
            customMediaRules.forEach(rule => {
              root.prepend({
                type: 'atrule',
                name: 'custom-media',
                params: rule.replace('@custom-media ', '')
              });
            });
            
            metrics.mediaQueriesGenerated = customMediaRules.length;
          }
        }
        
        // Validate CSS if enabled
        if (enableValidation) {
          const validation = validateCSS(root.toString());
          if (!validation.valid) {
            handleError(new Error(`CSS validation failed: ${validation.errors.join(', ')}`), {
              file: root.source?.input.from
            }, onError);
          }
        }
        
        // Collect performance metrics
        if (performanceMetrics) {
          metrics.executionTime = performance.now() - startTime;
          
          if (development) {
            console.log('PostCSS Plugin Performance Metrics:', {
              transformations: metrics.transformations,
              customPropertiesGenerated: metrics.customPropertiesGenerated,
              mediaQueriesGenerated: metrics.mediaQueriesGenerated,
              executionTime: `${metrics.executionTime.toFixed(2)}ms`,
              cacheHits: metrics.cacheHits,
              cacheMisses: metrics.cacheMisses,
              cacheSize: cache?.size() || 0
            });
          }
        }
      } catch (error) {
        handleError(error as Error, {
          file: root.source?.input.from
        }, onError);
      }
    }
  };
};

postcssResponsiveEasy.postcss = true;

export default postcssResponsiveEasy;
export type { ResponsiveConfig, Viewport, Breakpoint, ScalingStrategy, TokenConfig, RoundingConfig, PerformanceMetrics, ErrorContext, TransformContext };
