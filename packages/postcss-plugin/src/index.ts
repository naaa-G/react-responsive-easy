/**
 * @react-responsive-easy/postcss-plugin
 * 
 * PostCSS plugin for processing CSS with React Responsive Easy transformations.
 * Generates responsive CSS custom properties and media queries.
 */

import type { Plugin, PluginCreator } from 'postcss';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';

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
}

// Mock configuration for now
const mockConfig = {
  base: { name: 'desktop', width: 1920, height: 1080, alias: 'base' },
  breakpoints: [
    { name: 'mobile', width: 390, height: 844, alias: 'mobile' },
    { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'laptop', width: 1366, height: 768, alias: 'laptop' },
    { name: 'desktop', width: 1920, height: 1080, alias: 'base' }
  ],
  strategy: {
    origin: 'width' as const,
    tokens: {
      fontSize: { scale: 0.85, min: 12, max: 22 },
      spacing: { scale: 0.85, step: 2 },
      radius: { scale: 0.9 }
    },
    rounding: { mode: 'nearest' as const, precision: 0.5 }
  }
};

// Scaling function - simplified version
function scaleValue(
  baseValue: number,
  fromBreakpoint: typeof mockConfig.base,
  toBreakpoint: typeof mockConfig.breakpoints[0],
  token?: string
): number {
  const fromSize = fromBreakpoint.width;
  const toSize = toBreakpoint.width;
  const ratio = toSize / fromSize;
  
  let scaledValue = baseValue * ratio;
  
  // Apply token-specific rules
  if (token && mockConfig.strategy.tokens[token as keyof typeof mockConfig.strategy.tokens]) {
    const tokenConfig = mockConfig.strategy.tokens[token as keyof typeof mockConfig.strategy.tokens];
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
  
  // Apply rounding
  if (mockConfig.strategy.rounding.precision) {
    const precision = mockConfig.strategy.rounding.precision;
    scaledValue = Math.round(scaledValue / precision) * precision;
  }
  
  return scaledValue;
}

// Main plugin creator
const postcssResponsiveEasy: PluginCreator<PostCSSPluginOptions> = (options = {}) => {
  const {
    configPath = 'rre.config.ts',
    generateCustomProperties = true,
    generateCustomMedia = true,
    customPropertyPrefix = '--rre',
    development = false
  } = options;

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
            const args = node.nodes;
            if (args.length >= 1) {
              const baseValue = parseFloat(args[0].value);
              let token: string | undefined;
              
              // Look for token in additional arguments
              if (args.length >= 2) {
                token = args[1].value.replace(/['"]/g, '');
              }
              
              if (!isNaN(baseValue)) {
                // Generate responsive values for all breakpoints
                const responsiveValues: Record<string, number> = {};
                
                mockConfig.breakpoints.forEach(breakpoint => {
                  const scaledValue = scaleValue(baseValue, mockConfig.base, breakpoint, token);
                  responsiveValues[breakpoint.name] = scaledValue;
                });
                
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
                      // Create a new rule using PostCSS API
                      rootRule = postcss.rule({ selector: ':root' });
                      root.prepend(rootRule);
                    }
                    
                    // Add base value
                    if (rootRule && rootRule.type === 'rule') {
                      rootRule.append(postcss.decl({ prop: propName, value: `${baseValue}px` }));
                      
                      if (development) {
                        rootRule.append(postcss.comment({ text: ` Generated by @react-responsive-easy/postcss-plugin ` }));
                      }
                    }
                    
                    // Add responsive variants with media queries
                    mockConfig.breakpoints.forEach(breakpoint => {
                      if (breakpoint.name !== mockConfig.base.name) {
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
                } else {
                  // Replace with base value
                  (node as any).type = 'word';
                  node.value = `${baseValue}px`;
                }
              }
            }
          }
        });
        
        decl.value = parsed.toString();
      }
    },
    
    // Generate @custom-media rules at the end
    OnceExit(root) {
      if (generateCustomMedia) {
        // Only generate custom media rules if there's content in the CSS
        // or if there are rre() functions that would benefit from them
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
        
        // Generate custom media rules if there's content or rre functions
        if (hasContent || hasRreFunctions) {
          const customMediaRules: string[] = [];
          
          mockConfig.breakpoints.forEach(breakpoint => {
            const mediaName = `--${breakpoint.name}`;
            const mediaQuery = `(max-width: ${breakpoint.width}px)`;
            customMediaRules.push(`@custom-media ${mediaName} ${mediaQuery}`);
          });
          
          if (customMediaRules.length > 0) {
          // Add comment if in development mode
          if (development) {
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
      }
    }
  };
};

postcssResponsiveEasy.postcss = true;

export default postcssResponsiveEasy;
export type { PostCSSPluginOptions };
