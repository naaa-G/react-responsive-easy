/**
 * Utilities for creating responsive Storybook stories
 */

import React from 'react';
import type { StoryObj } from '@storybook/react';
import { generateResponsiveArgs, generateResponsiveArgTypes, createResponsiveParameters } from './generateArgs';
import { DEFAULT_BREAKPOINTS } from '../constants';
import type { BreakpointConfig } from '../types';
import type { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';

/**
 * Create a responsive story with automatic args and controls
 */
// Define the StorybookArgType interface locally for this file
interface StorybookArgType {
  name?: string;
  description?: string;
  control?: {
    type?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
  };
  table?: {
    category?: string;
    subcategory?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export function createResponsiveStory<T = Record<string, unknown>>(
  component: React.ComponentType<T>,
  options: {
    args?: Partial<T>;
    argTypes?: Record<string, StorybookArgType>;
    config?: ResponsiveConfig;
    breakpoints?: BreakpointConfig[];
    title?: string;
    description?: string;
  } = {}
): StoryObj<T> {
  const {
    args = {},
    argTypes = {},
    config,
    breakpoints = DEFAULT_BREAKPOINTS,
    title,
    description
  } = options;

  // Generate responsive args and argTypes
  const responsiveArgs = generateResponsiveArgs(args as Record<string, unknown>, [...breakpoints]);
  const responsiveArgTypes = generateResponsiveArgTypes(argTypes, [...breakpoints]);

  return {
    args: {
      ...args,
      ...responsiveArgs
    } as T,
    argTypes: responsiveArgTypes,
    parameters: {
      ...createResponsiveParameters(config, [...breakpoints]),
      docs: {
        description: {
          story: description ?? `
This story demonstrates responsive behavior across different breakpoints.
Use the Responsive panel to switch between breakpoints and monitor performance.
          `.trim()
        }
      }
    },
    name: title,
    render: (args: T) => React.createElement(component, args)
  } as unknown as StoryObj<T>;
}

/**
 * Create multiple stories for each breakpoint
 */
export function createBreakpointStories<T = Record<string, unknown>>(
  component: React.ComponentType<T>,
  baseStory: StoryObj<T>,
  breakpoints: BreakpointConfig[] = [...DEFAULT_BREAKPOINTS]
): Record<string, StoryObj<T>> {
  const stories: Record<string, StoryObj<T>> = {};

  breakpoints.forEach(breakpoint => {
    const storyName = `${breakpoint.name}${breakpoint.width}x${breakpoint.height}`;
    
    stories[storyName] = {
      ...baseStory,
      name: `${breakpoint.name} (${breakpoint.width}×${breakpoint.height})`,
      parameters: {
        ...baseStory.parameters,
        viewport: {
          defaultViewport: 'responsive',
          viewports: {
            responsive: {
              name: breakpoint.name,
              styles: {
                width: `${breakpoint.width}px`,
                height: `${breakpoint.height}px`
              }
            }
          }
        },
        responsiveEasy: {
          ...baseStory.parameters?.responsiveEasy,
          breakpoints: [breakpoint],
          defaultBreakpoint: breakpoint.alias
        }
      }
    };
  });

  return stories;
}

/**
 * Create a comparison story showing all breakpoints
 */
export function createComparisonStory<T = Record<string, unknown>>(
  component: React.ComponentType<T>,
  baseStory: StoryObj<T>,
  breakpoints: BreakpointConfig[] = [...DEFAULT_BREAKPOINTS]
): StoryObj<T> {
  return {
    ...baseStory,
    name: 'All Breakpoints Comparison',
    render: (args: T) => {
      return React.createElement(
        'div',
        {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            padding: '20px'
          }
        },
        breakpoints.map(breakpoint =>
          React.createElement(
            'div',
            {
              key: breakpoint.alias,
              style: {
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden'
              }
            },
            React.createElement(
              'div',
              {
                style: {
                  background: '#f5f5f5',
                  padding: '8px 12px',
                  borderBottom: '1px solid #ddd',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }
              },
              breakpoint.name,
              React.createElement(
                'div',
                {
                  style: { fontSize: '10px', opacity: 0.7 }
                },
                `${breakpoint.width}×${breakpoint.height}`
              )
            ),
            React.createElement(
              'div',
              {
                style: {
                  padding: '12px',
                  transform: `scale(${Math.min(200 / breakpoint.width, 150 / breakpoint.height)})`,
                  transformOrigin: 'top left',
                  width: `${breakpoint.width}px`,
                  height: `${breakpoint.height}px`,
                  overflow: 'hidden'
                }
              },
              React.createElement(component, args)
            )
          )
        )
      );
    },
    parameters: {
      ...baseStory.parameters,
      layout: 'fullscreen',
      docs: {
        description: {
          story: 'This story shows how the component appears across all configured breakpoints simultaneously.'
        }
      }
    }
  };
}

/**
 * Create a performance testing story
 */
export function createPerformanceStory<T = Record<string, unknown>>(
  component: React.ComponentType<T>,
  baseStory: StoryObj<T>,
  options: {
    iterations?: number;
    breakpoints?: BreakpointConfig[];
  } = {}
): StoryObj<T> {
  const { iterations = 100, breakpoints = [...DEFAULT_BREAKPOINTS] } = options;

  return {
    ...baseStory,
    name: 'Performance Test',
    render: (args: T) => {
      const [isRunning, setIsRunning] = React.useState(false);
      const [results, setResults] = React.useState<Array<{
        breakpoint: string;
        time: number;
        avgTime: number;
      }>>([]);

      const runPerformanceTest = async () => {
        setIsRunning(true);
        setResults([]);

        const results = await Promise.all(
          breakpoints.map(async (breakpoint) => {
            const start = performance.now();
            
            // Simulate breakpoint changes
            const promises = Array.from({ length: iterations }, () => 
              new Promise(resolve => requestAnimationFrame(resolve))
            );
            await Promise.all(promises);
            
            const end = performance.now();
            return {
              breakpoint: breakpoint.name,
              time: end - start,
              avgTime: (end - start) / iterations
            };
          })
        );

        setResults(results);
        setIsRunning(false);
      };

      return React.createElement(
        'div',
        { style: { padding: '20px' } },
        React.createElement(
          'div',
          { style: { marginBottom: '20px' } },
          React.createElement(
            'button',
            {
              onClick: runPerformanceTest,
              disabled: isRunning,
              style: {
                padding: '8px 16px',
                backgroundColor: isRunning ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isRunning ? 'not-allowed' : 'pointer'
              }
            },
            isRunning ? 'Running...' : `Run Performance Test (${iterations} iterations)`
          )
        ),
        results.length > 0 && React.createElement(
          'div',
          { style: { marginBottom: '20px' } },
          React.createElement('h3', null, 'Performance Results'),
          React.createElement(
            'table',
            { style: { width: '100%', borderCollapse: 'collapse' } },
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                { style: { backgroundColor: '#f5f5f5' } },
                React.createElement('th', { style: { padding: '8px', textAlign: 'left', border: '1px solid #ddd' } }, 'Breakpoint'),
                React.createElement('th', { style: { padding: '8px', textAlign: 'left', border: '1px solid #ddd' } }, 'Total Time'),
                React.createElement('th', { style: { padding: '8px', textAlign: 'left', border: '1px solid #ddd' } }, 'Avg Time')
              )
            ),
            React.createElement(
              'tbody',
              null,
              results.map(result =>
                React.createElement(
                  'tr',
                  { key: result.breakpoint },
                  React.createElement('td', { style: { padding: '8px', border: '1px solid #ddd' } }, result.breakpoint),
                  React.createElement('td', { style: { padding: '8px', border: '1px solid #ddd' } }, `${result.time.toFixed(2)}ms`),
                  React.createElement('td', { style: { padding: '8px', border: '1px solid #ddd' } }, `${result.avgTime.toFixed(2)}ms`)
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { style: { border: '1px solid #ddd', padding: '20px', borderRadius: '8px' } },
          React.createElement(component, args)
        )
      );
    },
    parameters: {
      ...baseStory.parameters,
      responsiveEasy: {
        ...baseStory.parameters?.responsiveEasy,
        performance: {
          enabled: true,
          thresholds: {
            renderTime: 5,
            memoryUsage: 50 * 1024,
            layoutShifts: 0
          }
        }
      },
      docs: {
        description: {
          story: 'This story provides performance testing capabilities for responsive components.'
        }
      }
    }
  };
}
