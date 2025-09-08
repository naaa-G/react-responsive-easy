/**
 * @react-responsive-easy/babel-plugin
 * 
 * Babel plugin for build-time optimization of React Responsive Easy code.
 * Transforms responsive hook calls into optimized static values when possible.
 */

import { declare } from '@babel/helper-plugin-utils';
import type { PluginObj } from '@babel/core';
import { configManager } from './config-manager';
import { cacheManager } from './cache-manager';
import { ScalingEngine } from './scaling-engine';
import { HookTransformers } from './hook-transformers';
import type { BabelPluginOptions, PluginState, ResponsiveConfig, TransformContext, PerformanceMetrics } from './types';

// Default plugin options
const defaultOptions: BabelPluginOptions = {
  precompute: true,
  development: false,
  generateCSSProps: false,
  importSource: 'react-responsive-easy',
  enableCaching: true,
  cacheSize: 1000,
  enableMemoization: true,
  addComments: false,
  validateConfig: false,
  performanceMetrics: false,
  generateSourceMaps: true,
  preserveTypeInfo: true,
  minifyOutput: false
};

// Main plugin declaration
export default declare<BabelPluginOptions>((api, options) => {
  api.assertVersion(7);

  // Merge options with defaults
  const opts = { ...defaultOptions, ...options };
  
  
  // Initialize managers
  const config = configManager.getConfig(opts);
  const scalingEngine = new ScalingEngine(config);
  const hookTransformers = new HookTransformers(scalingEngine);
  
  // Initialize cache if enabled
  if (opts.enableCaching) {
    cacheManager.clear();
    // Set cache size limit to prevent memory issues
    cacheManager.setMaxSize(opts.cacheSize || 1000);
  }

  // Helper function to add required imports
  function addRequiredImports(path: any, state: PluginState, api: any, opts: BabelPluginOptions) {
    // Get the program node
    const program = path.findParent((p: any) => p.isProgram());
    if (!program) return;
    
    // Use stored existing imports
    const existingImports = state.existingImports || new Set<string>();
    
    // Add React imports if needed
    const hasUseMemoImport = existingImports.has('useMemo:react');
    if (!hasUseMemoImport) {
      const reactImport = api.types.importDeclaration(
        [api.types.importSpecifier(api.types.identifier('useMemo'), api.types.identifier('useMemo'))],
        api.types.stringLiteral('react')
      );
      program.node.body.unshift(reactImport);
      existingImports.add('useMemo:react');
    }
    
    // Add RRE imports if needed
    const hasUseBreakpointImport = existingImports.has(`useBreakpoint:${opts.importSource || 'react-responsive-easy'}`);
    if (!hasUseBreakpointImport) {
      const rreImport = api.types.importDeclaration(
        [api.types.importSpecifier(api.types.identifier('useBreakpoint'), api.types.identifier('useBreakpoint'))],
        api.types.stringLiteral(opts.importSource || 'react-responsive-easy')
      );
      program.node.body.unshift(rreImport);
      existingImports.add(`useBreakpoint:${opts.importSource || 'react-responsive-easy'}`);
    }
    
    // Add currentBreakpoint declaration if needed (only once per file)
    const hasCurrentBreakpointDecl = existingImports.has('currentBreakpoint:declared');
    if (!hasCurrentBreakpointDecl) {
      const currentBreakpointDecl = api.types.variableDeclaration('const', [
        api.types.variableDeclarator(
          api.types.identifier('currentBreakpoint'),
          api.types.callExpression(
            api.types.identifier('useBreakpoint'),
            []
          )
        )
      ]);
      program.node.body.unshift(currentBreakpointDecl);
      existingImports.add('currentBreakpoint:declared');
    }
  }

  return {
    name: '@react-responsive-easy/babel-plugin',
    
        pre(state: PluginState) {
          // Initialize state
          state.hasTransformations = false;
          state.cache = new Map();
          state.metrics = {
            transformCount: 0,
            totalTransformTime: 0,
            averageTransformTime: 0,
            cacheHits: 0,
            cacheMisses: 0,
            errors: 0
          };
          
          // Store existing imports for later use
          state.existingImports = new Set<string>();
        },
    visitor: {
      // Capture existing imports before transformations and add new imports after
      Program: {
        enter(path, state: PluginState) {
          // Store existing imports for later use
          state.existingImports = new Set<string>();
          path.traverse({
            ImportDeclaration(importPath) {
              const { node } = importPath;
              if (node.source.type === 'StringLiteral') {
                const source = node.source.value;
                node.specifiers.forEach(spec => {
                  if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
                    state.existingImports!.add(`${spec.imported.name}:${source}`);
                  } else if (spec.type === 'ImportDefaultSpecifier' && spec.local.type === 'Identifier') {
                    state.existingImports!.add(`${spec.local.name}:${source}`);
                  }
                });
              }
            }
          });
        },
        
        exit(path, state: PluginState) {
          // Program exit handler - imports are now handled in CallExpression
        }
      },
      
      // Transform hook calls
      CallExpression(path, state: PluginState) {
        const { node } = path;
        
        // Initialize state if not already done
        if (state.hasTransformations === undefined) {
          state.hasTransformations = false;
        }
        
        
        if (!opts.precompute) return;
        
        // Get all supported transformers
        const transformers = hookTransformers.getTransformers();
        
        // Try to transform each supported hook
        for (const transformer of Object.values(transformers)) {
          if (transformer.shouldTransform(path)) {
            try {
              const startTime = performance.now();
              
              // Check cache first
              if (opts.enableCaching) {
                const inputCode = path.toString();
                const cached = cacheManager.get(inputCode, opts);
                if (cached) {
                  try {
                    const ast = api.template.ast(cached);
                    if (Array.isArray(ast)) {
                      path.replaceWithMultiple(ast);
                    } else {
                      path.replaceWith(ast);
                    }
                    return;
                  } catch (cacheError) {
                    // If cached AST is invalid, continue with transformation
                    console.warn('Invalid cached AST, continuing with transformation:', cacheError);
                  }
                }
              }
              
              // Transform the hook
              transformer.transform(path, { ...state, api, opts } as any);
              
              // Set hasTransformations on the original state object
              state.hasTransformations = true;
              
              // Add imports immediately after transformation
              addRequiredImports(path, state, api, opts);
              
              // Cache the result
              if (opts.enableCaching) {
                try {
                  const outputCode = path.toString();
                  const inputCode = path.toString();
                  cacheManager.set(inputCode, outputCode, opts);
                } catch (cacheError) {
                  // If caching fails, continue without caching
                  console.warn('Failed to cache transformation result:', cacheError);
                }
              }
              
              // Update performance metrics
              if (opts.performanceMetrics) {
                const endTime = performance.now();
                cacheManager.updateMetrics(endTime - startTime);
              }
              
              // Call transform hook
              if (opts.onTransform) {
                opts.onTransform(node, {
                  filename: state.filename || 'unknown',
                  line: node.loc?.start.line || 0,
                  column: node.loc?.start.column || 0,
                  code: path.toString()
                });
              }
              
              break; // Only transform one hook per call
            } catch (error) {
              // Call error hook
              if (opts.onError) {
                opts.onError(error as Error, {
                  filename: state.filename || 'unknown',
                  line: node.loc?.start.line || 0,
                  column: node.loc?.start.column || 0,
                  code: path.toString()
                });
              }
              
              // Update error metrics
              if (opts.performanceMetrics) {
                cacheManager.updateMetrics(0, true);
              }
              
              // Don't throw the error, just log it and continue
              console.warn('Transformation failed, continuing without transformation:', error);
            }
          }
        }
      }
    }
  } as PluginObj;
});

// Export utilities for testing and external use
export { configManager, cacheManager, ScalingEngine, HookTransformers };
export type { BabelPluginOptions, ResponsiveConfig, TransformContext, PerformanceMetrics };

// Export scaleValue function for backward compatibility and testing
export function scaleValue(
  baseValue: number,
  fromBreakpoint: any,
  toBreakpoint: any,
  token?: string
): number {
  const config = configManager.getDefaultConfig();
  const scalingEngine = new ScalingEngine(config);
  return scalingEngine.scaleValue(baseValue, fromBreakpoint, toBreakpoint, token);
}
