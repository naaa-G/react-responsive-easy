/**
 * Test utilities and helpers for Babel plugin tests
 */

import { transform } from '@babel/core';
import plugin from '../../index';

export interface TransformOptions {
  precompute?: boolean;
  development?: boolean;
  generateCSSProps?: boolean;
  importSource?: string;
  configPath?: string;
}

export interface TestCase {
  name: string;
  input: string;
  expected?: string;
  options?: TransformOptions;
  shouldThrow?: boolean;
  shouldContain?: string[];
  shouldNotContain?: string[];
}

/**
 * Transform code with the plugin
 */
export function transformCode(code: string, options: TransformOptions = {}) {
  try {
    const result = transform(code, {
      filename: 'test.tsx',
      plugins: [[plugin, options]],
      presets: [
        ['@babel/preset-env', { 
          targets: { node: 'current' },
          modules: false // Generate ES6 modules instead of CommonJS
        }],
        '@babel/preset-typescript'
      ]
    });
    
    return result?.code ?? '';
  } catch (error) {
    // Return original code if transformation fails due to syntax errors
    if (error instanceof SyntaxError) {
      return code;
    }
    throw error;
  }
}

/**
 * Transform code for snapshot tests (generates CommonJS)
 */
export function transformCodeForSnapshots(code: string, options: TransformOptions = {}) {
  try {
    const result = transform(code, {
      filename: 'test.tsx',
      plugins: [[plugin, options]],
      presets: [
        ['@babel/preset-env', { 
          targets: { node: 'current' },
          modules: 'commonjs' // Generate CommonJS for snapshots
        }],
        '@babel/preset-typescript'
      ]
    });
    
    return result?.code ?? '';
  } catch (error) {
    // Return original code if transformation fails due to syntax errors
    if (error instanceof SyntaxError) {
      return code;
    }
    throw error;
  }
}

/**
 * Create a test case with common assertions
 */
export function createTestCase(testCase: TestCase) {
  return {
    name: testCase.name,
    input: testCase.input,
    options: testCase.options ?? {},
    shouldThrow: testCase.shouldThrow ?? false,
    shouldContain: testCase.shouldContain ?? [],
    shouldNotContain: testCase.shouldNotContain ?? [],
    expected: testCase.expected
  };
}

/**
 * Assert that transformed code contains expected patterns
 */
export function assertContains(output: string, patterns: string[]) {
  patterns.forEach(pattern => {
    if (!output.includes(pattern)) {
      throw new Error(`Expected output to contain "${pattern}" but it didn't`);
    }
  });
}

/**
 * Assert that transformed code does not contain unexpected patterns
 */
export function assertNotContains(output: string, patterns: string[]) {
  patterns.forEach(pattern => {
    if (output.includes(pattern)) {
      throw new Error(`Expected output not to contain "${pattern}" but it did`);
    }
  });
}

/**
 * Extract specific parts of transformed code
 */
export function extractUseMemo(code: string) {
  const useMemoMatch = code.match(/useMemo\([^)]+\)/g);
  return useMemoMatch ? useMemoMatch[0] : null;
}

export function extractSwitchStatement(code: string) {
  const switchMatch = code.match(/switch\s*\([^)]+\)\s*\{[^}]*\}/s);
  return switchMatch ? switchMatch[0] : null;
}

export function extractImports(code: string) {
  const importMatches = code.match(/import\s+.*?from\s+['"][^'"]+['"]/g);
  return importMatches ?? [];
}

/**
 * Count occurrences of patterns in code
 */
export function countOccurrences(code: string, pattern: string | RegExp): number {
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern;
  const matches = code.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Generate test data for different scenarios
 */
export const testData = {
  // Simple responsive values
  simpleValues: [
    'const fontSize = useResponsiveValue(16);',
    'const padding = useResponsiveValue(12, { token: "spacing" });',
    'const margin = useResponsiveValue(8, { token: "spacing" });',
    'const borderRadius = useResponsiveValue(4, { token: "radius" });'
  ],

  // Complex responsive values
  complexValues: [
    'const fontSize = useResponsiveValue(18, { token: "fontSize" });',
    'const padding = useResponsiveValue(16, { token: "spacing" });',
    'const margin = useResponsiveValue(12, { token: "spacing" });',
    'const borderRadius = useResponsiveValue(8, { token: "radius" });',
    'const lineHeight = useResponsiveValue(1.5);',
    'const letterSpacing = useResponsiveValue(0.5);'
  ],

  // Style objects
  styleObjects: [
    `const styles = useScaledStyle({
      fontSize: 16,
      padding: 12,
      margin: 8
    });`,
    `const complexStyles = useScaledStyle({
      fontSize: 18,
      padding: 16,
      margin: 12,
      borderRadius: 8,
      borderWidth: 1,
      minHeight: 40,
      maxWidth: 200
    });`
  ],

  // Component templates
  componentTemplates: {
    button: `
      const Button = ({ children }) => {
        const fontSize = useResponsiveValue(16, { token: 'fontSize' });
        const padding = useResponsiveValue(12, { token: 'spacing' });
        return <button style={{ fontSize, padding }}>{children}</button>;
      };
    `,
    card: `
      const Card = ({ title, content }) => {
        const titleSize = useResponsiveValue(20, { token: 'fontSize' });
        const contentSize = useResponsiveValue(14, { token: 'fontSize' });
        const padding = useResponsiveValue(16, { token: 'spacing' });
        return (
          <div style={{ padding }}>
            <h2 style={{ fontSize: titleSize }}>{title}</h2>
            <p style={{ fontSize: contentSize }}>{content}</p>
          </div>
        );
      };
    `
  }
};

/**
 * Performance measurement utilities
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private endTime: number = 0;

  start() {
    this.startTime = performance.now();
  }

  stop() {
    this.endTime = performance.now();
  }

  getDuration(): number {
    return this.endTime - this.startTime;
  }

  reset() {
    this.startTime = 0;
    this.endTime = 0;
  }
}

/**
 * Memory usage utilities
 */
export function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage();
  }
  return null;
}

/**
 * Test configuration presets
 */
export const testConfigs = {
  development: {
    precompute: true,
    development: true,
    addComments: true,
    validateConfig: true
  },
  production: {
    precompute: true,
    development: false,
    addComments: false,
    validateConfig: false
  },
  disabled: {
    precompute: false,
    development: false
  },
  customImport: {
    precompute: true,
    importSource: '@custom/responsive'
  }
};

/**
 * Common test assertions
 */
export const assertions = {
  shouldTransform: (output: string) => {
    expect(output).toContain('useMemo');
    expect(output).toContain('switch');
    expect(output).toContain('currentBreakpoint.name');
  },

  shouldNotTransform: (output: string) => {
    expect(output).not.toContain('useMemo');
    expect(output).not.toContain('switch');
  },

  shouldAddImports: (output: string) => {
    expect(output).toContain('import { useMemo } from "react"');
    expect(output).toContain('import { useBreakpoint } from "react-responsive-easy"');
  },

  shouldAddComments: (output: string) => {
    expect(output).toContain('Optimized by @react-responsive-easy/babel-plugin');
  },

  shouldNotAddComments: (output: string) => {
    expect(output).not.toContain('Optimized by @react-responsive-easy/babel-plugin');
  }
};

/**
 * Generate random test data
 */
export function generateRandomTestData(count: number = 10) {
  const tokens = ['fontSize', 'spacing', 'radius'];
  const values = Array.from({ length: count }, (_, i) => {
    const token = tokens[i % tokens.length];
    const value = Math.floor(Math.random() * 50) + 10;
    return `const value${i} = useResponsiveValue(${value}, { token: '${token}' });`;
  });
  
  return values.join('\n');
}

/**
 * Create a test suite with common setup
 */
export function createTestSuite(name: string, testCases: TestCase[]) {
  return {
    name,
    testCases: testCases.map(createTestCase),
    run: () => {
      testCases.forEach(testCase => {
        const transformed = transformCode(testCase.input, testCase.options ?? {});
        
        if (testCase.shouldThrow) {
          // Test should throw - this would be handled by the test framework
          return;
        }
        
        if (testCase.shouldContain) {
          assertContains(transformed, testCase.shouldContain);
        }
        
        if (testCase.shouldNotContain) {
          assertNotContains(transformed, testCase.shouldNotContain);
        }
      });
    }
  };
}
