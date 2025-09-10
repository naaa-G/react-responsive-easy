/**
 * @react-responsive-easy/postcss-plugin
 * 
 * PostCSS plugin for processing CSS with React Responsive Easy transformations.
 * Generates responsive CSS custom properties and media queries.
 */

import postcss, { type PluginCreator, type Rule, type Declaration } from 'postcss';
import valueParser, { type Node } from 'postcss-value-parser';

// Plugin options interface
interface PostCSSPluginOptions {
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
  /** Enable CI-optimized mode for better performance in CI environments */
  ciOptimized?: boolean;
}

// Type definitions for better type safety
interface BreakpointConfig {
  name: string;
  width: number;
  height: number;
  alias: string;
}

interface BaseConfig {
  name: string;
  width: number;
  height: number;
  alias: string;
}

interface TokenConfig {
  scale?: number;
  min?: number;
  max?: number;
  step?: number;
}

interface StrategyConfig {
  origin: 'width' | 'height' | 'min' | 'max';
  tokens: {
    fontSize?: TokenConfig;
    spacing?: TokenConfig;
    radius?: TokenConfig;
  };
  rounding: {
    mode: 'nearest' | 'up' | 'down';
    precision: number;
  };
}

interface RREConfig {
  base: BaseConfig;
  breakpoints: BreakpointConfig[];
  strategy: StrategyConfig;
}

interface ResponsiveValues {
  [breakpointName: string]: number;
}

// Mock configuration for now
const mockConfig: RREConfig = {
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
      fontSize: { scale: 0.85, min: 12, max: 22 },
      spacing: { scale: 0.85, step: 2 },
      radius: { scale: 0.9 }
    },
    rounding: { mode: 'nearest', precision: 0.5 }
  }
};

// Scaling function - simplified version
function scaleValue(
  baseValue: number,
  fromBreakpoint: BaseConfig,
  toBreakpoint: BreakpointConfig,
  token?: string
): number {
  const fromSize = fromBreakpoint.width;
  const toSize = toBreakpoint.width;
  const ratio = toSize / fromSize;
  
  let scaledValue = baseValue * ratio;
  
  // Apply token-specific rules
  if (token && token in mockConfig.strategy.tokens) {
    const tokenConfig = mockConfig.strategy.tokens[token as keyof StrategyConfig['tokens']];
    
    // Ensure tokenConfig exists before accessing its properties
    if (tokenConfig) {
      if (tokenConfig.scale) {
        scaledValue = baseValue * tokenConfig.scale * ratio;
      }
      
      // Apply constraints with proper type checking
      if ('min' in tokenConfig && tokenConfig.min && scaledValue < tokenConfig.min) {
        scaledValue = tokenConfig.min;
      }
      if ('max' in tokenConfig && tokenConfig.max && scaledValue > tokenConfig.max) {
        scaledValue = tokenConfig.max;
      }
      if ('step' in tokenConfig && tokenConfig.step) {
        scaledValue = Math.round(scaledValue / tokenConfig.step) * tokenConfig.step;
      }
    }
  }
  
  // Apply rounding
  if (mockConfig.strategy.rounding.precision) {
    const precision = mockConfig.strategy.rounding.precision;
    scaledValue = Math.round(scaledValue / precision) * precision;
  }
  
  return scaledValue;
}

// Helper function to process RRE function calls
function processRreFunction(
  node: Node,
  decl: Declaration,
  config: RREConfig,
  options: Required<Pick<PostCSSPluginOptions, 'generateCustomProperties' | 'customPropertyPrefix' | 'development'>>
): void {
  // Type guard to ensure we have a function node with nodes property
  if (node.type !== 'function' || !('nodes' in node)) {
    return;
  }
  
  const args = node.nodes;
  if (!args || args.length < 1) return;

  const baseValue = parseFloat(args[0].value);
  let token: string | undefined;
  
  // Look for token in additional arguments
  if (args.length >= 2) {
    token = args[1].value.replace(/['"]/g, '');
  }
  
  if (isNaN(baseValue)) return;

  // Generate responsive values for all breakpoints
  const responsiveValues: ResponsiveValues = {};
  
  config.breakpoints.forEach(breakpoint => {
    const scaledValue = scaleValue(baseValue, config.base, breakpoint, token);
    responsiveValues[breakpoint.name] = scaledValue;
  });
  
  if (options.generateCustomProperties) {
    // Replace with CSS custom property
    const propName = `${options.customPropertyPrefix}-${decl.prop.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    (node as Node & { type: string }).type = 'word';
    node.value = `var(${propName})`;
    
    // Add custom properties at root level
    addCustomProperties(decl, propName, baseValue, responsiveValues, config, options);
  } else {
    // Replace with base value
    (node as Node & { type: string }).type = 'word';
    node.value = `${baseValue}px`;
  }
}

// Helper function to add custom properties
function addCustomProperties(
  decl: Declaration,
  propName: string,
  baseValue: number,
  responsiveValues: ResponsiveValues,
  config: RREConfig,
  options: Required<Pick<PostCSSPluginOptions, 'development'>>
): void {
  const root = decl.root();
  if (!root) return;

  // Find or create :root rule
  const rootRule = findOrCreateRootRule(root);
  
  if (rootRule) {
    // Add base value
    rootRule.append(postcss.decl({ prop: propName, value: `${baseValue}px` }));
    
    if (options.development) {
      rootRule.append(postcss.comment({ text: ` Generated by @react-responsive-easy/postcss-plugin ` }));
    }
    
    // Add responsive variants with media queries
    addResponsiveMediaQueries(root, propName, responsiveValues, config);
  }
}

// Helper function to find or create :root rule
function findOrCreateRootRule(root: postcss.Root): Rule | null {
  let rootRule = root.first;
  
  while (rootRule) {
    if (rootRule.type === 'rule' && (rootRule as Rule).selector === ':root') {
      return rootRule as Rule;
    }
    // Safely access the next property with proper type checking
    if ('next' in rootRule && typeof rootRule.next === 'function') {
      rootRule = rootRule.next();
    } else {
      rootRule = undefined;
    }
  }
  
  // Create a new rule using PostCSS API
  const newRootRule = postcss.rule({ selector: ':root' });
  root.prepend(newRootRule);
  return newRootRule;
}

// Helper function to add responsive media queries
function addResponsiveMediaQueries(
  root: postcss.Root,
  propName: string,
  responsiveValues: ResponsiveValues,
  config: RREConfig
): void {
  config.breakpoints.forEach(breakpoint => {
    if (breakpoint.name !== config.base.name) {
      const mediaQuery = `(max-width: ${breakpoint.width}px)`;
      const mediaRule = postcss.atRule({ name: 'media', params: mediaQuery });
      const innerRootRule = postcss.rule({ selector: ':root' });
      
      innerRootRule.append(postcss.decl({ 
        prop: propName, 
        value: `${responsiveValues[breakpoint.name]}px` 
      }));
      
      mediaRule.append(innerRootRule);
      root.append(mediaRule);
    }
  });
}

// Helper function to generate custom media rules
function generateCustomMediaRules(
  root: postcss.Root,
  config: RREConfig,
  options: Required<Pick<PostCSSPluginOptions, 'development'>>
): void {
  const customMediaRules: string[] = [];
  
  config.breakpoints.forEach(breakpoint => {
    const mediaName = `--${breakpoint.name}`;
    const mediaQuery = `(max-width: ${breakpoint.width}px)`;
    customMediaRules.push(`@custom-media ${mediaName} ${mediaQuery}`);
  });
  
  if (customMediaRules.length > 0) {
    // Add comment if in development mode
    if (options.development) {
      const comment = postcss.comment({ 
        text: ' Custom media queries generated by @react-responsive-easy/postcss-plugin ' 
      });
      root.prepend(comment);
    }
    
    // Add custom media rules
    customMediaRules.forEach(rule => {
      const atRule = postcss.atRule({ 
        name: 'custom-media', 
        params: rule.replace('@custom-media ', '') 
      });
      root.prepend(atRule);
    });
  }
}

// Helper function to check if CSS has content
function hasCssContent(root: postcss.Root): { hasContent: boolean; hasRreFunctions: boolean } {
  let hasContent = false;
  let hasRreFunctions = false;
  
  root.walkDecls(decl => {
    hasContent = true;
    if (decl.value.includes('rre(')) {
      hasRreFunctions = true;
      return false; // Stop walking
    }
  });
  
  // Also check for rules and at-rules
  if (!hasContent) {
    root.walkRules(() => {
      hasContent = true;
      return false;
    });
  }
  
  if (!hasContent) {
    root.walkAtRules(() => {
      hasContent = true;
      return false;
    });
  }
  
  return { hasContent, hasRreFunctions };
}

// Main plugin creator
const postcssResponsiveEasy: PluginCreator<PostCSSPluginOptions> = (options = {}) => {
  const {
    generateCustomProperties = true,
    generateCustomMedia = true,
    customPropertyPrefix = '--rre',
    development = false
  } = options;

  const pluginOptions = {
    generateCustomProperties,
    customPropertyPrefix,
    development
  };

  return {
    postcssPlugin: '@react-responsive-easy/postcss-plugin',
    
    // Process CSS custom properties
    Declaration(decl) {
      // Look for RRE function calls in CSS values
      const rreValuePattern = /rre\(([^)]+)\)/g;
      
      if (rreValuePattern.test(decl.value)) {
        const parsed = valueParser(decl.value);
        
        parsed.walk((node) => {
          if (node.type === 'function' && node.value === 'rre') {
            processRreFunction(node, decl, mockConfig, pluginOptions);
          }
        });
        
        decl.value = parsed.toString();
      }
    },
    
    // Generate @custom-media rules at the end
    OnceExit(root) {
      if (generateCustomMedia) {
        const { hasContent, hasRreFunctions } = hasCssContent(root);
        
        // Generate custom media rules if there's content or rre functions
        if (hasContent || hasRreFunctions) {
          generateCustomMediaRules(root, mockConfig, { development });
        }
      }
    }
  };
};

postcssResponsiveEasy.postcss = true;

export default postcssResponsiveEasy;
export type { PostCSSPluginOptions };
