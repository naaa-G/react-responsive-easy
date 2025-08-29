/**
 * @react-responsive-easy/babel-plugin
 * 
 * Babel plugin for build-time optimization of React Responsive Easy code.
 * Transforms responsive hook calls into optimized static values when possible.
 */

import { declare } from '@babel/helper-plugin-utils';
import type { PluginObj, PluginPass } from '@babel/core';
import type * as t from '@babel/types';

// Plugin options interface
interface BabelPluginOptions {
  /** Path to the RRE configuration file */
  configPath?: string;
  /** Enable build-time pre-computation */
  precompute?: boolean;
  /** Enable CSS custom properties generation */
  generateCSSProps?: boolean;
  /** Enable development mode with extra debugging */
  development?: boolean;
  /** Custom import source for RRE hooks */
  importSource?: string;
}

// Mock configuration for now - will be replaced with actual config loading
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

// Scaling function - simplified version of the core scaling engine
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

// Main plugin declaration
export default declare<BabelPluginOptions>((api, options) => {
  api.assertVersion(7);

  const {
    configPath = 'rre.config.ts',
    precompute = true,
    generateCSSProps = false,
    development = false,
    importSource = 'react-responsive-easy'
  } = options;

  return {
    name: '@react-responsive-easy/babel-plugin',
    visitor: {
      // Transform useResponsiveValue calls
      CallExpression(path, state: PluginPass) {
        const { node } = path;
        
        // Check if this is a useResponsiveValue call
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'useResponsiveValue'
        ) {
          // Only transform if we can statically analyze the arguments
          const firstArg = node.arguments[0];
          const secondArg = node.arguments[1];
          
          if (
            firstArg &&
            firstArg.type === 'NumericLiteral' &&
            precompute
          ) {
            const baseValue = firstArg.value;
            let token: string | undefined;
            
            // Extract token from options object
            if (
              secondArg &&
              secondArg.type === 'ObjectExpression'
            ) {
              const tokenProp = secondArg.properties.find(
                prop => 
                  prop.type === 'ObjectProperty' &&
                  prop.key.type === 'Identifier' &&
                  prop.key.name === 'token' &&
                  prop.value.type === 'StringLiteral'
              );
              
              if (tokenProp && tokenProp.type === 'ObjectProperty' && tokenProp.value.type === 'StringLiteral') {
                token = tokenProp.value.value;
              }
            }
            
            // Generate optimized switch statement
            const cases: t.SwitchCase[] = mockConfig.breakpoints.map(breakpoint => {
              const scaledValue = scaleValue(baseValue, mockConfig.base, breakpoint, token);
              
              return api.types.switchCase(
                api.types.stringLiteral(breakpoint.name),
                [api.types.returnStatement(api.types.stringLiteral(`${scaledValue}px`))]
              );
            });
            
            // Add default case
            cases.push(
              api.types.switchCase(
                null, // default case
                [api.types.returnStatement(api.types.stringLiteral(`${baseValue}px`))]
              )
            );
            
            // Create optimized function
            const optimizedFunction = api.types.arrowFunctionExpression(
              [],
              api.types.blockStatement([
                api.types.switchStatement(
                  api.types.memberExpression(
                    api.types.identifier('currentBreakpoint'),
                    api.types.identifier('name')
                  ),
                  cases
                )
              ])
            );
            
            // Wrap in useMemo for React optimization
            const useMemoCall = api.types.callExpression(
              api.types.identifier('useMemo'),
              [
                optimizedFunction,
                api.types.arrayExpression([
                  api.types.memberExpression(
                    api.types.identifier('currentBreakpoint'),
                    api.types.identifier('name')
                  )
                ])
              ]
            );
            
            if (development) {
              // Add comment in development mode
              api.types.addComment(
                useMemoCall,
                'leading',
                ` Optimized by @react-responsive-easy/babel-plugin from useResponsiveValue(${baseValue}${token ? `, { token: '${token}' }` : ''}) `
              );
            }
            
            path.replaceWith(useMemoCall);
          }
        }
        
        // Check if this is a useScaledStyle call
        else if (
          node.type === 'CallExpression' &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'useScaledStyle' &&
          precompute
        ) {
          const firstArg = node.arguments[0];
          
          if (firstArg && firstArg.type === 'ObjectExpression') {
            // Transform each numeric property in the style object
            const transformedProperties = firstArg.properties.map(prop => {
              if (
                prop.type === 'ObjectProperty' &&
                prop.key.type === 'Identifier' &&
                prop.value.type === 'NumericLiteral'
              ) {
                const propertyName = prop.key.name;
                const baseValue = prop.value.value;
                
                // Determine token based on property name
                let token: string | undefined;
                if (propertyName.includes('font') || propertyName.includes('Font')) {
                  token = 'fontSize';
                } else if (propertyName.includes('padding') || propertyName.includes('margin')) {
                  token = 'spacing';
                } else if (propertyName.includes('radius') || propertyName.includes('Radius')) {
                  token = 'radius';
                }
                
                // Generate responsive property object
                const breakpointValues: t.ObjectProperty[] = mockConfig.breakpoints.map(breakpoint => {
                  const scaledValue = scaleValue(baseValue, mockConfig.base, breakpoint, token);
                  return api.types.objectProperty(
                    api.types.stringLiteral(breakpoint.name),
                    api.types.stringLiteral(`${scaledValue}px`)
                  );
                });
                
                return api.types.objectProperty(
                  prop.key,
                  api.types.objectExpression(breakpointValues)
                );
              }
              
              return prop;
            });
            
            // Replace the original object with transformed version
            const transformedObject = api.types.objectExpression(transformedProperties);
            
            if (development) {
              api.types.addComment(
                transformedObject,
                'leading',
                ' Optimized by @react-responsive-easy/babel-plugin - style object pre-computed '
              );
            }
            
            path.get('arguments.0').replaceWith(transformedObject);
          }
        }
      },
      
      // Add necessary imports
      Program: {
        enter(path, state: PluginPass) {
          // Track if we need to add imports
          let needsUseMemo = false;
          let needsCurrentBreakpoint = false;
          
          // Traverse to check what we need
          path.traverse({
            CallExpression(innerPath) {
              const { node } = innerPath;
              if (
                node.type === 'CallExpression' &&
                node.callee.type === 'Identifier' &&
                (node.callee.name === 'useResponsiveValue' || node.callee.name === 'useScaledStyle')
              ) {
                needsUseMemo = true;
                needsCurrentBreakpoint = true;
              }
            }
          });
          
          // Add imports if needed
          if (needsUseMemo) {
            const reactImport = api.types.importDeclaration(
              [api.types.importSpecifier(api.types.identifier('useMemo'), api.types.identifier('useMemo'))],
              api.types.stringLiteral('react')
            );
            path.unshiftContainer('body', reactImport);
          }
          
          if (needsCurrentBreakpoint) {
            const rreImport = api.types.importDeclaration(
              [api.types.importSpecifier(api.types.identifier('useBreakpoint'), api.types.identifier('useBreakpoint'))],
              api.types.stringLiteral(importSource)
            );
            path.unshiftContainer('body', rreImport);
            
            // Add currentBreakpoint variable declaration
            const currentBreakpointDecl = api.types.variableDeclaration('const', [
              api.types.variableDeclarator(
                api.types.identifier('currentBreakpoint'),
                api.types.callExpression(api.types.identifier('useBreakpoint'), [])
              )
            ]);
            
            // Find the first non-import statement and insert before it
            const firstNonImport = path.get('body').find(stmt => 
              !api.types.isImportDeclaration(stmt.node)
            );
            
            if (firstNonImport) {
              firstNonImport.insertBefore(currentBreakpointDecl);
            }
          }
        }
      }
    }
  } as PluginObj;
});

// Export utilities for testing and external use
export { scaleValue };
export type { BabelPluginOptions };
