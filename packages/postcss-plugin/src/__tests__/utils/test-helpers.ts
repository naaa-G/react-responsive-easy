/**
 * Test utilities and helpers for PostCSS plugin tests
 */

import postcss from 'postcss';
import plugin from '../../index';
import type { PostCSSPluginOptions } from '../../index';

// Cross-platform line ending normalization
export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

export interface TransformOptions extends PostCSSPluginOptions {
  filename?: string;
  sourceMap?: boolean;
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
 * Simple CSS processing function for basic tests
 */
export async function processCss(
  css: string, 
  options: TransformOptions = {},
  filename: string = 'test.css'
): Promise<string> {
  const result = await postcss([plugin(options)])
    .process(css, { 
      from: filename,
      to: filename.replace('.css', '.processed.css')
    });
  
  return normalizeLineEndings(result.css);
}

/**
 * Process CSS and return both result and any warnings/errors
 */
export async function processCssWithWarnings(
  css: string, 
  options: TransformOptions = {},
  filename: string = 'test.css'
): Promise<{ css: string; warnings: string[]; errors: string[] }> {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  try {
    const result = await postcss([plugin(options)])
      .process(css, { 
        from: filename,
        to: filename.replace('.css', '.processed.css')
      });
    
    // Collect warnings
    result.warnings().forEach(warning => {
      warnings.push(warning.text);
    });
    
    return {
      css: normalizeLineEndings(result.css),
      warnings,
      errors
    };
  } catch (error) {
    errors.push((error as Error).message);
    return {
      css: '',
      warnings,
      errors
    };
  }
}

/**
 * Generate test CSS with rre() functions
 */
export function generateTestCSS(count: number = 5): string {
  const properties = ['font-size', 'padding', 'margin', 'width', 'height', 'border-radius'];
  const values = [12, 16, 20, 24, 32, 48, 64, 80, 96, 120];
  const tokens = ['fontSize', 'spacing', 'radius', 'shadows'];
  
  let css = '';
  
  for (let i = 0; i < count; i++) {
    const property = properties[i % properties.length];
    const value = values[i % values.length];
    const token = tokens[i % tokens.length];
    
    css += `.test-${i} {\n`;
    css += `  ${property}: rre(${value}, '${token}');\n`;
    css += `}\n\n`;
  }
  
  return css;
}

/**
 * Generate complex CSS with multiple rre() functions
 */
export function generateComplexCSS(): string {
  return `
    .container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(rre(300), 1fr));
      gap: rre(24);
      padding: rre(32);
      margin: rre(16) auto;
      max-width: rre(1200);
      border-radius: rre(12);
      box-shadow: 0 rre(4) rre(8) rgba(0, 0, 0, 0.1);
    }

    .card {
      background: white;
      padding: rre(24);
      border-radius: rre(8);
      box-shadow: 0 rre(2) rre(4) rgba(0, 0, 0, 0.1);
      margin-bottom: rre(16);
    }

    .card h2 {
      font-size: rre(24, 'fontSize');
      margin-bottom: rre(16);
      color: #333;
    }

    .card p {
      font-size: rre(16, 'fontSize');
      line-height: rre(24);
      margin-bottom: rre(12);
    }

    .button {
      display: inline-block;
      padding: rre(12) rre(24);
      font-size: rre(16, 'fontSize');
      border-radius: rre(6);
      background: #007bff;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .button:hover {
      background: #0056b3;
      transform: translateY(rre(-2));
    }

    @media (max-width: 768px) {
      .container {
        padding: rre(16);
        gap: rre(16);
      }
      
      .card {
        padding: rre(16);
      }
    }
  `;
}

/**
 * Generate malformed CSS for error testing
 */
export function generateMalformedCSS(): string {
  return `
    .malformed-1 {
      font-size: rre();
      padding: rre(invalid);
      margin: rre(16, invalid-token);
    }

    .malformed-2 {
      width: rre(100, 'spacing', extra-param);
      height: rre();
    }

    .malformed-3 {
      border-radius: rre(8, 'radius', { invalid: 'config' });
    }
  `;
}

/**
 * Generate large CSS for performance testing
 */
export function generateLargeCSS(ruleCount: number = 1000): string {
  let css = '';
  
  for (let i = 0; i < ruleCount; i++) {
    css += `.rule-${i} {\n`;
    css += `  font-size: rre(${12 + (i % 20)});\n`;
    css += `  padding: rre(${8 + (i % 16)});\n`;
    css += `  margin: rre(${4 + (i % 12)});\n`;
    css += `  border-radius: rre(${2 + (i % 8)});\n`;
    css += `}\n\n`;
  }
  
  return css;
}

/**
 * Count occurrences of a pattern in CSS
 */
export function countOccurrences(css: string, pattern: string | RegExp): number {
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern;
  const matches = css.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Extract custom properties from CSS
 */
export function extractCustomProperties(css: string): string[] {
  const matches = css.match(/--[a-zA-Z-]+:/g) || [];
  return matches.map(match => match.replace(':', ''));
}

/**
 * Extract media queries from CSS
 */
export function extractMediaQueries(css: string): string[] {
  const matches = css.match(/@media[^{]+{[^}]*}/g) || [];
  return matches;
}

/**
 * Extract rre() function calls from CSS
 */
export function extractRreFunctions(css: string): string[] {
  const matches = css.match(/rre\([^)]*\)/g) || [];
  return matches;
}

/**
 * Validate CSS syntax (basic validation)
 */
export function validateCSS(css: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for unmatched braces
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
}

/**
 * Create a test case with default options
 */
export function createTestCase(
  name: string,
  input: string,
  expected?: string,
  options?: TransformOptions
): TestCase {
  return {
    name,
    input,
    expected,
    options,
    shouldContain: expected ? [expected] : undefined
  };
}

/**
 * Run a test case and return results
 */
export async function runTestCase(testCase: TestCase): Promise<{
  passed: boolean;
  output: string;
  errors: string[];
}> {
  try {
    const output = await processCss(testCase.input, testCase.options);
    const errors: string[] = [];
    let passed = true;
    
    // Check shouldContain
    if (testCase.shouldContain) {
      for (const pattern of testCase.shouldContain) {
        if (!output.includes(pattern)) {
          errors.push(`Expected output to contain "${pattern}"`);
          passed = false;
        }
      }
    }
    
    // Check shouldNotContain
    if (testCase.shouldNotContain) {
      for (const pattern of testCase.shouldNotContain) {
        if (output.includes(pattern)) {
          errors.push(`Expected output to not contain "${pattern}"`);
          passed = false;
        }
      }
    }
    
    return { passed, output, errors };
  } catch (error) {
    return {
      passed: false,
      output: '',
      errors: [(error as Error).message]
    };
  }
}

/**
 * Measure execution time of a function
 */
export function measureTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  return {
    result,
    time: end - start
  };
}

/**
 * Measure execution time of an async function
 */
export async function measureTimeAsync<T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  return {
    result,
    time: end - start
  };
}

/**
 * Create a mock configuration for testing
 */
export function createMockConfig(): any {
  return {
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
}

/**
 * Default test options
 */
export const defaultTestOptions: TransformOptions = {
  generateCustomProperties: true,
  generateCustomMedia: true,
  customPropertyPrefix: '--rre',
  development: false
};

/**
 * Development test options
 */
export const developmentTestOptions: TransformOptions = {
  ...defaultTestOptions,
  development: true
};

/**
 * Production test options
 */
export const productionTestOptions: TransformOptions = {
  ...defaultTestOptions,
  development: false
};
