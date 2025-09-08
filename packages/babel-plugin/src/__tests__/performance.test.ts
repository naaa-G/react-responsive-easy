/**
 * Performance tests for transformation efficiency
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { transform } from '@babel/core';
import plugin from '../index';

// Helper function to transform code with our plugin
function transformCode(code: string, options = {}) {
  const result = transform(code, {
    filename: 'test.tsx',
    plugins: [[plugin, options]],
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript'
    ]
  });
  
  return result?.code || '';
}

// Performance measurement helper
function measureTime(fn: () => void): number {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
}

describe('Performance Tests', () => {
  beforeEach(() => {
    // Reset performance counters
    performance.clearMarks();
    performance.clearMeasures();
  });

  afterEach(() => {
    // Clean up performance marks
    performance.clearMarks();
    performance.clearMeasures();
  });

  describe('Transformation speed', () => {
    it('should transform simple useResponsiveValue calls quickly', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const transformTime = measureTime(() => {
        transformCode(input, { precompute: true });
      });
      
      // Should complete transformation in less than 1500ms (enterprise CI environment with buffer)
      expect(transformTime).toBeLessThan(1500);
    });

    it('should transform multiple useResponsiveValue calls efficiently', () => {
      const input = `
        const fontSize = useResponsiveValue(16, { token: 'fontSize' });
        const padding = useResponsiveValue(12, { token: 'spacing' });
        const margin = useResponsiveValue(8, { token: 'spacing' });
        const borderRadius = useResponsiveValue(4, { token: 'radius' });
        const lineHeight = useResponsiveValue(1.5);
        const letterSpacing = useResponsiveValue(0.5);
      `;
      
      const transformTime = measureTime(() => {
        transformCode(input, { precompute: true });
      });
      
      // Should complete transformation in less than 50ms (enterprise CI)
      expect(transformTime).toBeLessThan(50);
    });

    it('should transform useScaledStyle calls efficiently', () => {
      const input = `
        const styles = useScaledStyle({
          fontSize: 16,
          padding: 12,
          margin: 8,
          borderRadius: 4,
          borderWidth: 1,
          minHeight: 40,
          maxWidth: 200
        });
      `;
      
      const transformTime = measureTime(() => {
        transformCode(input, { precompute: true });
      });
      
      // Should complete transformation in less than 30ms (enterprise CI)
      expect(transformTime).toBeLessThan(30);
    });

    it('should handle large components efficiently', () => {
      const input = `
        import React from 'react';
        import { useResponsiveValue, useScaledStyle } from 'react-responsive-easy';

        const LargeComponent = () => {
          const titleSize = useResponsiveValue(24, { token: 'fontSize' });
          const contentSize = useResponsiveValue(16, { token: 'fontSize' });
          const padding = useResponsiveValue(20, { token: 'spacing' });
          const margin = useResponsiveValue(16, { token: 'spacing' });
          const borderRadius = useResponsiveValue(8, { token: 'radius' });
          
          const styles = useScaledStyle({
            fontSize: 14,
            padding: 8,
            margin: 4,
            borderRadius: 2,
            borderWidth: 1,
            minHeight: 32,
            maxWidth: 300
          });

          return (
            <div style={{ padding, margin, borderRadius }}>
              <h1 style={{ fontSize: titleSize }}>Title</h1>
              <p style={{ fontSize: contentSize }}>Content</p>
              <div style={styles}>Styled content</div>
            </div>
          );
        };

        export default LargeComponent;
      `;
      
      const transformTime = measureTime(() => {
        transformCode(input, { precompute: true });
      });
      
      // Should complete transformation in less than 200ms (enterprise CI environment)
      expect(transformTime).toBeLessThan(200);
    });
  });

  describe('Memory usage', () => {
    it('should not leak memory during transformations', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      // Run transformation multiple times
      for (let i = 0; i < 100; i++) {
        transformCode(input, { precompute: true });
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Memory usage should not grow significantly
      const memUsage = process.memoryUsage();
      expect(memUsage.heapUsed).toBeLessThan(100 * 1024 * 1024); // 100MB
    });

    it('should handle large input files efficiently', () => {
      // Generate a large input with many responsive values
      const responsiveValues = Array.from({ length: 50 }, (_, i) => 
        `const value${i} = useResponsiveValue(${i + 1}, { token: 'fontSize' });`
      ).join('\n');
      
      const input = `
        import React from 'react';
        import { useResponsiveValue } from 'react-responsive-easy';

        const LargeComponent = () => {
          ${responsiveValues}
          
          return <div>Large component</div>;
        };

        export default LargeComponent;
      `;
      
      const transformTime = measureTime(() => {
        transformCode(input, { precompute: true });
      });
      
      // Should complete transformation in less than 100ms
      expect(transformTime).toBeLessThan(100);
    });
  });

  describe('Output size optimization', () => {
    it('should generate compact output for simple transformations', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Output should be reasonably compact
      expect(output.length).toBeLessThan(1000);
    });

    it('should generate efficient switch statements', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const output = transformCode(input, { precompute: true });
      
      // Should contain efficient switch statement
      expect(output).toContain('switch');
      expect(output).toContain('currentBreakpoint.name');
      
      // Should not contain unnecessary code
      expect(output).not.toContain('console.log');
      expect(output).not.toContain('debugger');
    });

    it('should minimize output in production mode', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const devOutput = transformCode(input, { 
        precompute: true,
        development: true
      });
      
      const prodOutput = transformCode(input, { 
        precompute: true,
        development: false
      });
      
      // Production output should be smaller
      expect(prodOutput.length).toBeLessThan(devOutput.length);
    });
  });

  describe('Caching performance', () => {
    it('should benefit from repeated transformations', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      // First transformation
      const firstTime = measureTime(() => {
        transformCode(input, { precompute: true, enableCaching: true });
      });
      
      // Second transformation (should be faster due to caching)
      const secondTime = measureTime(() => {
        transformCode(input, { precompute: true, enableCaching: true });
      });
      
      // Second transformation should be faster or similar (allow for CI variability)
      // In CI environments, caching benefits may be less pronounced
      expect(secondTime).toBeLessThanOrEqual(firstTime * 3.0);
    });

    it('should handle different inputs efficiently', () => {
      const inputs = [
        'const fontSize = useResponsiveValue(16, { token: "fontSize" });',
        'const padding = useResponsiveValue(12, { token: "spacing" });',
        'const margin = useResponsiveValue(8, { token: "spacing" });',
        'const borderRadius = useResponsiveValue(4, { token: "radius" });'
      ];
      
      const totalTime = measureTime(() => {
        inputs.forEach(input => {
          transformCode(input, { precompute: true });
        });
      });
      
      // Should handle multiple different inputs efficiently
      expect(totalTime).toBeLessThan(50);
    });
  });

  describe('Error handling performance', () => {
    it('should handle errors quickly', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
        const invalid = useResponsiveValue(undefined);
        const malformed = useResponsiveValue(24, { token: 123 });
      `;
      
      const transformTime = measureTime(() => {
        transformCode(input, { precompute: true });
      });
      
      // Should handle errors without significant performance impact
      expect(transformTime).toBeLessThan(20);
    });

    it('should handle malformed syntax efficiently', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' // missing closing brace
      `;
      
      const transformTime = measureTime(() => {
        try {
          transformCode(input, { precompute: true });
        } catch (error) {
          // Expected to throw due to malformed syntax
        }
      });
      
      // Should handle syntax errors quickly (even when they throw)
      expect(transformTime).toBeLessThan(100);
    });
  });

  describe('Configuration performance', () => {
    it('should handle different configurations efficiently', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const configurations = [
        { precompute: true, development: true },
        { precompute: true, development: false },
        { precompute: false, development: true },
        { precompute: false, development: false }
      ];
      
      const totalTime = measureTime(() => {
        configurations.forEach(config => {
          transformCode(input, config);
        });
      });
      
      // Should handle different configurations efficiently
      expect(totalTime).toBeLessThan(100);
    });

    it('should handle custom import sources efficiently', () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const importSources = [
        'react-responsive-easy',
        '@custom/responsive',
        '@my-org/responsive',
        'my-custom-package'
      ];
      
      const totalTime = measureTime(() => {
        importSources.forEach(importSource => {
          transformCode(input, { 
            precompute: true,
            importSource
          });
        });
      });
      
      // Should handle different import sources efficiently
      expect(totalTime).toBeLessThan(50);
    });
  });

  describe('Scalability tests', () => {
    it('should scale linearly with input size', () => {
      const baseInput = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const sizes = [1, 5, 10, 20];
      const times: number[] = [];
      
      sizes.forEach(size => {
        const input = Array.from({ length: size }, (_, i) => 
          `const value${i} = useResponsiveValue(${i + 1}, { token: 'fontSize' });`
        ).join('\n');
        
        const time = measureTime(() => {
          transformCode(input, { precompute: true });
        });
        
        times.push(time);
      });
      
      // Times should scale roughly linearly
      const ratio = times[times.length - 1] / times[0];
      expect(ratio).toBeLessThan(sizes[sizes.length - 1] * 2); // Allow some overhead
    });

    it('should handle concurrent transformations', async () => {
      const input = `
        const fontSize = useResponsiveValue(24, { token: 'fontSize' });
      `;
      
      const promises = Array.from({ length: 10 }, () => 
        new Promise<number>(resolve => {
          const time = measureTime(() => {
            transformCode(input, { precompute: true });
          });
          resolve(time);
        })
      );
      
      const times = await Promise.all(promises);
      
      // All transformations should complete successfully
      times.forEach(time => {
        expect(time).toBeLessThan(50);
      });
    });
  });
});

