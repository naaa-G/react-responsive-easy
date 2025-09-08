/**
 * Hook transformers for different RRE hooks
 */

import type * as t from '@babel/types';
import type { NodePath } from '@babel/core';
import type { PluginState, SupportedHook, HookTransform, BabelPluginOptions } from './types';
import { ScalingEngine } from './scaling-engine';

export class HookTransformers {
  private scalingEngine: ScalingEngine;

  constructor(scalingEngine: ScalingEngine) {
    this.scalingEngine = scalingEngine;
  }

  /**
   * Get all supported hook transformers
   */
  getTransformers(): Record<SupportedHook, HookTransform> {
    return {
      useResponsiveValue: {
        name: 'useResponsiveValue',
        shouldTransform: (path: NodePath<any>) => this.shouldTransformUseResponsiveValue(path),
        transform: (path: NodePath<any>, state: PluginState) => this.transformUseResponsiveValue(path, state)
      },
      useScaledStyle: {
        name: 'useScaledStyle',
        shouldTransform: (path: NodePath<any>) => this.shouldTransformUseScaledStyle(path),
        transform: (path: NodePath<any>, state: PluginState) => this.transformUseScaledStyle(path, state)
      },
      useResponsiveStyle: {
        name: 'useResponsiveStyle',
        shouldTransform: (path: NodePath<any>) => this.shouldTransformUseResponsiveStyle(path),
        transform: (path: NodePath<any>, state: PluginState) => this.transformUseResponsiveStyle(path, state)
      },
      useBreakpoint: {
        name: 'useBreakpoint',
        shouldTransform: (path: NodePath<any>) => this.shouldTransformUseBreakpoint(path),
        transform: (path: NodePath<any>, state: PluginState) => this.transformUseBreakpoint(path, state)
      },
      useResponsiveLayout: {
        name: 'useResponsiveLayout',
        shouldTransform: (path: NodePath<any>) => this.shouldTransformUseResponsiveLayout(path),
        transform: (path: NodePath<any>, state: PluginState) => this.transformUseResponsiveLayout(path, state)
      }
    };
  }

  /**
   * Check if useResponsiveValue should be transformed
   */
  private shouldTransformUseResponsiveValue(path: NodePath<any>): boolean {
    const { node } = path;
    const shouldTransform = (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'useResponsiveValue' &&
      node.arguments.length > 0 &&
      node.arguments[0].type === 'NumericLiteral'
    );
    
    
    return shouldTransform;
  }

  /**
   * Transform useResponsiveValue call
   */
  private transformUseResponsiveValue(path: NodePath<any>, state: PluginState): void {
    try {
      const { node } = path;
      const { api, opts } = state;
      
      if (!api || !opts) {
        console.warn('Missing api or opts in state');
        return;
      }
      
      const baseValue = node.arguments[0].value;
      let token: string | undefined;

    // Extract token from options
    if (node.arguments[1]?.type === 'ObjectExpression') {
      const tokenProp = node.arguments[1].properties.find(
        (prop: any) =>
          prop.type === 'ObjectProperty' &&
          prop.key.type === 'Identifier' &&
          prop.key.name === 'token' &&
          prop.value.type === 'StringLiteral'
      );
      
      if (tokenProp?.value?.value) {
        token = tokenProp.value.value;
      }
    }

    // Generate optimized switch statement
    const cases = this.generateSwitchCases(baseValue, token, api);
    
    // Create optimized function
    const optimizedFunction = this.createOptimizedFunction(cases, api);
    
    // Wrap in useMemo
    const useMemoCall = this.wrapInUseMemo(optimizedFunction, api);
    
    // Replace the original call with the useMemo call
    path.replaceWith(useMemoCall);

    // Add development comments
    if (opts.development) {
      this.addDevelopmentComment(useMemoCall, 'useResponsiveValue', baseValue, token, api);
    }

    // Mark that transformations occurred
    state.hasTransformations = true;
    } catch (error) {
      console.error('Error in transformUseResponsiveValue:', error);
      console.error('Stack:', (error as Error).stack);
    }
  }

  /**
   * Check if useScaledStyle should be transformed
   */
  private shouldTransformUseScaledStyle(path: NodePath<any>): boolean {
    const { node } = path;
    return (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'useScaledStyle' &&
      node.arguments.length > 0 &&
      node.arguments[0].type === 'ObjectExpression'
    );
  }

  /**
   * Transform useScaledStyle call
   */
  private transformUseScaledStyle(path: NodePath<any>, state: PluginState): void {
    try {
      const { node } = path;
      const { api, opts } = state;
      
      if (!api || !opts) {
        console.warn('Missing api or opts in state');
        return;
      }
      
      const styleObject = node.arguments[0];

    // Transform each numeric property
    const transformedProperties = styleObject.properties.map((prop: any) => {
      if (
        prop.type === 'ObjectProperty' &&
        prop.key.type === 'Identifier' &&
        prop.value.type === 'NumericLiteral'
      ) {
        return this.transformStyleProperty(prop, api);
      }
      return prop;
    });

    // Create transformed object
    const transformedObject = api.types.objectExpression(transformedProperties);

    // Add development comments
    if (opts.development) {
      this.addDevelopmentComment(transformedObject, 'useScaledStyle', undefined, 'style object pre-computed', api);
    }

      (path.get('arguments.0') as any).replaceWith(transformedObject);
      state.hasTransformations = true;
    } catch (error) {
      console.error('Error in transformUseScaledStyle:', error);
      console.error('Stack:', (error as Error).stack);
    }
  }

  /**
   * Check if useResponsiveStyle should be transformed
   */
  private shouldTransformUseResponsiveStyle(path: NodePath<any>): boolean {
    const { node } = path;
    return (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'useResponsiveStyle' &&
      node.arguments.length > 0
    );
  }

  /**
   * Transform useResponsiveStyle call
   */
  private transformUseResponsiveStyle(path: NodePath<any>, state: PluginState): void {
    // Similar to useScaledStyle but with different logic
    // This would be implemented based on the actual useResponsiveStyle hook
    state.hasTransformations = true;
  }

  /**
   * Check if useBreakpoint should be transformed
   */
  private shouldTransformUseBreakpoint(path: NodePath<any>): boolean {
    const { node } = path;
    return (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'useBreakpoint'
    );
  }

  /**
   * Transform useBreakpoint call
   */
  private transformUseBreakpoint(path: NodePath<any>, state: PluginState): void {
    // Transform useBreakpoint to return current breakpoint
    // This would be implemented based on the actual useBreakpoint hook
    state.hasTransformations = true;
  }

  /**
   * Check if useResponsiveLayout should be transformed
   */
  private shouldTransformUseResponsiveLayout(path: NodePath<any>): boolean {
    const { node } = path;
    return (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'useResponsiveLayout'
    );
  }

  /**
   * Transform useResponsiveLayout call
   */
  private transformUseResponsiveLayout(path: NodePath<any>, state: PluginState): void {
    // Transform useResponsiveLayout to return layout information
    // This would be implemented based on the actual useResponsiveLayout hook
    state.hasTransformations = true;
  }

  /**
   * Generate switch cases for breakpoints
   */
  private generateSwitchCases(baseValue: number, token: string | undefined, api: any): t.SwitchCase[] {
    const config = this.scalingEngine.getConfig();
    const cases: t.SwitchCase[] = [];

    for (const breakpoint of config.breakpoints) {
      const scaledValue = this.scalingEngine.scaleValue(
        baseValue,
        config.base,
        breakpoint,
        token
      );
      
      const unit = token && config.strategy.tokens[token]?.unit || 'px';
      
      cases.push(
        api.types.switchCase(
          api.types.stringLiteral(breakpoint.name),
          [api.types.returnStatement(api.types.stringLiteral(`${scaledValue}${unit}`))]
        )
      );
    }

    // Add default case
    cases.push(
      api.types.switchCase(
        null,
        [api.types.returnStatement(api.types.stringLiteral(`${baseValue}px`))]
      )
    );

    return cases;
  }

  /**
   * Create optimized function
   */
  private createOptimizedFunction(cases: t.SwitchCase[], api: any): t.ArrowFunctionExpression {
    return api.types.arrowFunctionExpression(
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
  }

  /**
   * Wrap function in useMemo
   */
  private wrapInUseMemo(optimizedFunction: t.ArrowFunctionExpression, api: any): t.CallExpression {
    return api.types.callExpression(
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
  }

  /**
   * Transform style property
   */
  private transformStyleProperty(prop: any, api: any): t.ObjectProperty {
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
    const config = this.scalingEngine.getConfig();
    const breakpointValues = config.breakpoints.map(breakpoint => {
      const scaledValue = this.scalingEngine.scaleValue(
        baseValue,
        config.base,
        breakpoint,
        token
      );
      
      const unit = token && config.strategy.tokens[token]?.unit || 'px';
      
      return api.types.objectProperty(
        api.types.stringLiteral(breakpoint.name),
        api.types.stringLiteral(`${scaledValue}${unit}`)
      );
    });

    return api.types.objectProperty(
      prop.key,
      api.types.objectExpression(breakpointValues)
    );
  }

  /**
   * Add development comment
   */
  private addDevelopmentComment(
    node: any,
    hookName: string,
    baseValue?: number,
    token?: string,
    api?: any
  ): void {
    if (!api) return;

    let comment: string;
    if (typeof token === 'string' && token.includes('pre-computed')) {
      comment = ` Optimized by @react-responsive-easy/babel-plugin - ${token} `;
    } else {
      comment = ` Optimized by @react-responsive-easy/babel-plugin from ${hookName}(${baseValue || ''}${token ? `, { token: '${token}' }` : ''}) `;
    }
    api.types.addComment(node, 'leading', comment);
  }
}
