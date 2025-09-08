/**
 * Tests for hook transformers functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HookTransformers } from '../hook-transformers';
import { ScalingEngine } from '../scaling-engine';
import type { ResponsiveConfig, BabelPluginOptions, PluginState } from '../types';

// Mock Babel API
const mockBabelAPI = {
  types: {
    arrowFunctionExpression: vi.fn((params, body) => ({ type: 'ArrowFunctionExpression', params, body })),
    blockStatement: vi.fn((body) => ({ type: 'BlockStatement', body })),
    switchStatement: vi.fn((discriminant, cases) => ({ type: 'SwitchStatement', discriminant, cases })),
    switchCase: vi.fn((test, consequent) => ({ type: 'SwitchCase', test, consequent })),
    returnStatement: vi.fn((argument) => ({ type: 'ReturnStatement', argument })),
    stringLiteral: vi.fn((value) => ({ type: 'StringLiteral', value })),
    memberExpression: vi.fn((object, property) => ({ type: 'MemberExpression', object, property })),
    identifier: vi.fn((name) => ({ type: 'Identifier', name })),
    callExpression: vi.fn((callee, args) => ({ type: 'CallExpression', callee, args })),
    arrayExpression: vi.fn((elements) => ({ type: 'ArrayExpression', elements })),
    objectExpression: vi.fn((properties) => ({ type: 'ObjectExpression', properties })),
    objectProperty: vi.fn((key, value) => ({ type: 'ObjectProperty', key, value })),
    addComment: vi.fn((node, type, comment) => {
      if (!node.leadingComments) node.leadingComments = [];
      node.leadingComments.push({ type, value: comment });
    })
  }
};

describe('HookTransformers', () => {
  let hookTransformers: HookTransformers;
  let mockScalingEngine: ScalingEngine;
  let mockConfig: ResponsiveConfig;
  let mockOptions: BabelPluginOptions;
  let mockState: PluginState;

  beforeEach(() => {
    mockConfig = {
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
          fontSize: { scale: 0.85, min: 12, max: 72, unit: 'px' },
          spacing: { scale: 0.9, step: 4, min: 4, max: 128, unit: 'px' },
          radius: { scale: 0.95, min: 2, max: 32, unit: 'px' }
        },
        rounding: { mode: 'nearest', precision: 0.5 }
      }
    };

    mockScalingEngine = new ScalingEngine(mockConfig);
    hookTransformers = new HookTransformers(mockScalingEngine);

    mockOptions = {
      precompute: true,
      development: false,
      generateCSSProps: false,
      importSource: 'react-responsive-easy'
    };

    mockState = {
      filename: 'test.tsx',
      hasTransformations: false
    } as PluginState;
  });

  describe('getTransformers', () => {
    it('should return all supported transformers', () => {
      const transformers = hookTransformers.getTransformers();

      expect(transformers).toHaveProperty('useResponsiveValue');
      expect(transformers).toHaveProperty('useScaledStyle');
      expect(transformers).toHaveProperty('useResponsiveStyle');
      expect(transformers).toHaveProperty('useBreakpoint');
      expect(transformers).toHaveProperty('useResponsiveLayout');
    });

    it('should return transformers with correct structure', () => {
      const transformers = hookTransformers.getTransformers();

      Object.values(transformers).forEach(transformer => {
        expect(transformer).toHaveProperty('name');
        expect(transformer).toHaveProperty('shouldTransform');
        expect(transformer).toHaveProperty('transform');
        expect(typeof transformer.shouldTransform).toBe('function');
        expect(typeof transformer.transform).toBe('function');
      });
    });
  });

  describe('useResponsiveValue transformer', () => {
    let transformer: any;
    
    beforeEach(() => {
      transformer = hookTransformers.getTransformers().useResponsiveValue;
    });

    describe('shouldTransform', () => {
      it('should transform valid useResponsiveValue calls', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveValue' },
            arguments: [{ type: 'NumericLiteral', value: 24 }]
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(true);
      });

      it('should not transform non-call expressions', () => {
        const mockPath = {
          node: {
            type: 'Identifier',
            name: 'useResponsiveValue'
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(false);
      });

      it('should not transform calls with wrong function name', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useOtherHook' },
            arguments: [{ type: 'NumericLiteral', value: 24 }]
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(false);
      });

      it('should not transform calls without arguments', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveValue' },
            arguments: []
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(false);
      });

      it('should not transform calls with non-numeric first argument', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveValue' },
            arguments: [{ type: 'StringLiteral', value: '24px' }]
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(false);
      });
    });

    describe('transform', () => {
      it('should transform simple numeric literal', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveValue' },
            arguments: [{ type: 'NumericLiteral', value: 24 }]
          },
          replaceWith: vi.fn()
        };

        const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
        transformer.transform(mockPath, state);

        expect(mockPath.replaceWith).toHaveBeenCalled();
        expect(state.hasTransformations).toBe(true);
      });

      it('should transform with token configuration', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveValue' },
            arguments: [
              { type: 'NumericLiteral', value: 18 },
              {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'ObjectProperty',
                    key: { type: 'Identifier', name: 'token' },
                    value: { type: 'StringLiteral', value: 'fontSize' }
                  }
                ]
              }
            ]
          },
          replaceWith: vi.fn()
        };

        const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
        transformer.transform(mockPath, state);

        expect(mockPath.replaceWith).toHaveBeenCalled();
        expect(state.hasTransformations).toBe(true);
      });

      it('should add development comments when enabled', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveValue' },
            arguments: [{ type: 'NumericLiteral', value: 24 }]
          },
          replaceWith: vi.fn()
        };

        const state = { 
          ...mockState, 
          api: mockBabelAPI, 
          opts: { ...mockOptions, development: true } 
        };
        
        transformer.transform(mockPath, state);

        expect(mockBabelAPI.types.addComment).toHaveBeenCalled();
      });
    });
  });

  describe('useScaledStyle transformer', () => {
    let transformer: any;
    
    beforeEach(() => {
      transformer = hookTransformers.getTransformers().useScaledStyle;
    });

    describe('shouldTransform', () => {
      it('should transform valid useScaledStyle calls', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useScaledStyle' },
            arguments: [{ type: 'ObjectExpression', properties: [] }]
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(true);
      });

      it('should not transform calls with non-object argument', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useScaledStyle' },
            arguments: [{ type: 'StringLiteral', value: 'styles' }]
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(false);
      });
    });

    describe('transform', () => {
      it('should transform style object with numeric properties', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useScaledStyle' },
            arguments: [{
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'ObjectProperty',
                  key: { type: 'Identifier', name: 'fontSize' },
                  value: { type: 'NumericLiteral', value: 18 }
                },
                {
                  type: 'ObjectProperty',
                  key: { type: 'Identifier', name: 'padding' },
                  value: { type: 'NumericLiteral', value: 16 }
                }
              ]
            }]
          },
          get: vi.fn().mockReturnValue({
            replaceWith: vi.fn()
          })
        };

        const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
        transformer.transform(mockPath, state);

        expect(mockPath.get).toHaveBeenCalledWith('arguments.0');
        expect(state.hasTransformations).toBe(true);
      });

      it('should preserve non-numeric properties', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useScaledStyle' },
            arguments: [{
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'ObjectProperty',
                  key: { type: 'Identifier', name: 'fontSize' },
                  value: { type: 'NumericLiteral', value: 18 }
                },
                {
                  type: 'ObjectProperty',
                  key: { type: 'Identifier', name: 'color' },
                  value: { type: 'StringLiteral', value: 'red' }
                }
              ]
            }]
          },
          get: vi.fn().mockReturnValue({
            replaceWith: vi.fn()
          })
        };

        const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
        transformer.transform(mockPath, state);

        expect(mockPath.get).toHaveBeenCalledWith('arguments.0');
        expect(state.hasTransformations).toBe(true);
      });
    });
  });

  describe('useResponsiveStyle transformer', () => {
    let transformer: any;
    
    beforeEach(() => {
      transformer = hookTransformers.getTransformers().useResponsiveStyle;
    });

    describe('shouldTransform', () => {
      it('should transform valid useResponsiveStyle calls', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveStyle' },
            arguments: [{ type: 'ObjectExpression', properties: [] }]
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(true);
      });
    });

    describe('transform', () => {
      it('should mark as transformed', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveStyle' },
            arguments: []
          }
        };

        const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
        transformer.transform(mockPath, state);

        expect(state.hasTransformations).toBe(true);
      });
    });
  });

  describe('useBreakpoint transformer', () => {
    let transformer: any;
    
    beforeEach(() => {
      transformer = hookTransformers.getTransformers().useBreakpoint;
    });

    describe('shouldTransform', () => {
      it('should transform valid useBreakpoint calls', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useBreakpoint' },
            arguments: []
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(true);
      });
    });

    describe('transform', () => {
      it('should mark as transformed', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useBreakpoint' },
            arguments: []
          }
        };

        const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
        transformer.transform(mockPath, state);

        expect(state.hasTransformations).toBe(true);
      });
    });
  });

  describe('useResponsiveLayout transformer', () => {
    let transformer: any;
    
    beforeEach(() => {
      transformer = hookTransformers.getTransformers().useResponsiveLayout;
    });

    describe('shouldTransform', () => {
      it('should transform valid useResponsiveLayout calls', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveLayout' },
            arguments: []
          }
        };

        const result = transformer.shouldTransform(mockPath);
        expect(result).toBe(true);
      });
    });

    describe('transform', () => {
      it('should mark as transformed', () => {
        const mockPath = {
          node: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useResponsiveLayout' },
            arguments: []
          }
        };

        const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
        transformer.transform(mockPath, state);

        expect(state.hasTransformations).toBe(true);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle malformed AST nodes gracefully', () => {
      const transformer = hookTransformers.getTransformers().useResponsiveValue;
      
      const mockPath = {
        node: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'useResponsiveValue' },
          arguments: [null] // Malformed argument
        },
        replaceWith: vi.fn()
      };

      const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
      
      expect(() => {
        transformer.transform(mockPath, state);
      }).not.toThrow();
    });

    it('should handle missing API gracefully', () => {
      const transformer = hookTransformers.getTransformers().useResponsiveValue;
      
      const mockPath = {
        node: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'useResponsiveValue' },
          arguments: [{ type: 'NumericLiteral', value: 24 }]
        },
        replaceWith: vi.fn()
      };

      const state = { ...mockState, api: null, opts: mockOptions };
      
      expect(() => {
        transformer.transform(mockPath, state);
      }).not.toThrow();
    });
  });

  describe('Performance tests', () => {
    it('should transform hooks efficiently', () => {
      const transformer = hookTransformers.getTransformers().useResponsiveValue;
      
      const mockPath = {
        node: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'useResponsiveValue' },
          arguments: [{ type: 'NumericLiteral', value: 24 }]
        },
        replaceWith: vi.fn()
      };

      const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };

      const startTime = performance.now();
      
      // Perform 100 transformations
      for (let i = 0; i < 100; i++) {
        transformer.transform(mockPath, state);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete 100 transformations in less than 50ms
      expect(totalTime).toBeLessThan(50);
    });

    it('should check shouldTransform efficiently', () => {
      const transformer = hookTransformers.getTransformers().useResponsiveValue;
      
      const mockPath = {
        node: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'useResponsiveValue' },
          arguments: [{ type: 'NumericLiteral', value: 24 }]
        }
      };

      const startTime = performance.now();
      
      // Perform 1000 checks
      for (let i = 0; i < 1000; i++) {
        transformer.shouldTransform(mockPath);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should complete 1000 checks in less than 20ms
      expect(totalTime).toBeLessThan(20);
    });
  });

  describe('Integration with scaling engine', () => {
    it('should use scaling engine for value calculations', () => {
      const transformer = hookTransformers.getTransformers().useResponsiveValue;
      
      // Mock scaling engine methods
      const scaleValueSpy = vi.spyOn(mockScalingEngine, 'scaleValue');
      const getConfigSpy = vi.spyOn(mockScalingEngine, 'getConfig');

      const mockPath = {
        node: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'useResponsiveValue' },
          arguments: [{ type: 'NumericLiteral', value: 24 }]
        },
        replaceWith: vi.fn()
      };

      const state = { ...mockState, api: mockBabelAPI, opts: mockOptions };
      transformer.transform(mockPath, state);

      expect(getConfigSpy).toHaveBeenCalled();
      expect(scaleValueSpy).toHaveBeenCalled();
    });
  });
});
