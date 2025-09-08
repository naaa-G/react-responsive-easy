/**
 * Enterprise-grade test utilities and helpers for PostCSS plugin tests
 */

import postcss from 'postcss';
import plugin from '../../index';
import type { PostCSSPluginOptions } from '../../index';

export interface EnterpriseTestCase {
  name: string;
  description: string;
  input: string;
  expected?: string;
  options?: PostCSSPluginOptions;
  shouldThrow?: boolean;
  shouldContain?: string[];
  shouldNotContain?: string[];
  performanceThreshold?: number;
  memoryThreshold?: number;
  tags?: string[];
  category?: 'unit' | 'integration' | 'performance' | 'security' | 'accessibility';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface TestMetrics {
  executionTime: number;
  memoryUsage: number;
  cacheHits: number;
  cacheMisses: number;
  transformations: number;
  errors: number;
  cssSize: number;
  customPropertiesGenerated: number;
  mediaQueriesGenerated: number;
}

export interface TestSuite {
  name: string;
  description: string;
  testCases: EnterpriseTestCase[];
  setup?: () => void | Promise<void>;
  teardown?: () => void | Promise<void>;
  beforeAll?: () => void | Promise<void>;
  afterAll?: () => void | Promise<void>;
}

/**
 * Enhanced CSS processing function with comprehensive metrics
 */
export function processCssWithMetrics(
  css: string, 
  options: PostCSSPluginOptions = {},
  filename: string = 'test.css'
): { css: string; metrics: TestMetrics; errors: Error[] } {
  const errors: Error[] = [];
  const startTime = performance.now();
  const startMemory = process.memoryUsage().heapUsed;
  let transformations = 0;
  let customPropertiesGenerated = 0;
  let mediaQueriesGenerated = 0;

  try {
    const result = postcss([plugin(options)])
      .process(css, { 
        from: filename,
        to: filename.replace('.css', '.processed.css')
      });

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    // Count transformations and generated CSS
    const outputCss = result.css;
    transformations = (css.match(/rre\(/g) || []).length;
    customPropertiesGenerated = (outputCss.match(/--[a-zA-Z-]+:/g) || []).length;
    mediaQueriesGenerated = (outputCss.match(/@media/g) || []).length;

    return {
      css: outputCss,
      metrics: {
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        cacheHits: 0, // Would be populated by cache manager
        cacheMisses: 0,
        transformations,
        errors: 0,
        cssSize: outputCss.length,
        customPropertiesGenerated,
        mediaQueriesGenerated
      },
      errors
    };
  } catch (error) {
    errors.push(error as Error);
    return {
      css: '',
      metrics: {
        executionTime: 0,
        memoryUsage: 0,
        cacheHits: 0,
        cacheMisses: 0,
        transformations: 0,
        errors: 1,
        cssSize: 0,
        customPropertiesGenerated: 0,
        mediaQueriesGenerated: 0
      },
      errors
    };
  }
}

/**
 * Performance benchmark utility
 */
export class PerformanceBenchmark {
  private results: Map<string, TestMetrics[]> = new Map();

  async measure<T>(
    name: string, 
    fn: () => T | Promise<T>,
    iterations: number = 1
  ): Promise<{ result: T; metrics: TestMetrics }> {
    const metrics: TestMetrics[] = [];
    let result: T;

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      const startMemory = process.memoryUsage().heapUsed;

      result = await fn();

      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;

      metrics.push({
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        cacheHits: 0,
        cacheMisses: 0,
        transformations: 0,
        errors: 0,
        cssSize: 0,
        customPropertiesGenerated: 0,
        mediaQueriesGenerated: 0
      });
    }

    this.results.set(name, metrics);

    // Calculate average metrics
    const avgMetrics: TestMetrics = {
      executionTime: metrics.reduce((sum, m) => sum + m.executionTime, 0) / metrics.length,
      memoryUsage: metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
      cacheHits: 0,
      cacheMisses: 0,
      transformations: 0,
      errors: 0,
      cssSize: 0,
      customPropertiesGenerated: 0,
      mediaQueriesGenerated: 0
    };

    return { result: result!, metrics: avgMetrics };
  }

  getResults(): Map<string, TestMetrics[]> {
    return this.results;
  }

  getAverageMetrics(name: string): TestMetrics | null {
    const metrics = this.results.get(name);
    if (!metrics || metrics.length === 0) return null;

    return {
      executionTime: metrics.reduce((sum, m) => sum + m.executionTime, 0) / metrics.length,
      memoryUsage: metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
      cacheHits: 0,
      cacheMisses: 0,
      transformations: 0,
      errors: 0,
      cssSize: 0,
      customPropertiesGenerated: 0,
      mediaQueriesGenerated: 0
    };
  }
}

/**
 * Memory leak detection utility
 */
export class MemoryLeakDetector {
  private snapshots: Map<string, NodeJS.MemoryUsage> = new Map();

  takeSnapshot(name: string): void {
    this.snapshots.set(name, process.memoryUsage());
  }

  detectLeaks(): { name: string; leak: number }[] {
    const leaks: { name: string; leak: number }[] = [];
    const snapshots = Array.from(this.snapshots.entries());

    for (let i = 1; i < snapshots.length; i++) {
      const [name, current] = snapshots[i];
      const [, previous] = snapshots[i - 1];
      
      const leak = current.heapUsed - previous.heapUsed;
      if (leak > 10 * 1024 * 1024) { // 10MB threshold - more realistic for PostCSS processing
        leaks.push({ name, leak });
      }
    }

    return leaks;
  }

  getMemoryGrowth(): number {
    const snapshots = Array.from(this.snapshots.values());
    if (snapshots.length < 2) return 0;
    
    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];
    
    return last.heapUsed - first.heapUsed;
  }
}

/**
 * Test data generator for comprehensive testing
 */
export class TestDataGenerator {
  static generateResponsiveCSS(count: number): string {
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

  static generateComplexCSS(): string {
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

  static generateMalformedCSS(): string {
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

  static generateLargeCSS(): string {
    let css = '';
    
    // Generate 1000 CSS rules with rre() functions
    for (let i = 0; i < 1000; i++) {
      css += `.rule-${i} {\n`;
      css += `  font-size: rre(${12 + (i % 20)});\n`;
      css += `  padding: rre(${8 + (i % 16)});\n`;
      css += `  margin: rre(${4 + (i % 12)});\n`;
      css += `  border-radius: rre(${2 + (i % 8)});\n`;
      css += `}\n\n`;
    }
    
    return css;
  }
}

/**
 * Enterprise assertions for comprehensive testing
 */
export class EnterpriseAssertions {
  static shouldTransform(css: string, expectedPatterns: string[]): void {
    expectedPatterns.forEach(pattern => {
      if (!css.includes(pattern)) {
        throw new Error(`Expected CSS to contain "${pattern}" but it didn't`);
      }
    });
  }

  static shouldNotTransform(css: string, unexpectedPatterns: string[]): void {
    unexpectedPatterns.forEach(pattern => {
      if (css.includes(pattern)) {
        throw new Error(`Expected CSS to not contain "${pattern}" but it did`);
      }
    });
  }

  static shouldMeetPerformanceThreshold(metrics: TestMetrics, threshold: number): void {
    if (metrics.executionTime > threshold) {
      throw new Error(`Performance threshold exceeded: ${metrics.executionTime}ms > ${threshold}ms`);
    }
  }

  static shouldMeetMemoryThreshold(metrics: TestMetrics, threshold: number): void {
    if (metrics.memoryUsage > threshold) {
      throw new Error(`Memory threshold exceeded: ${metrics.memoryUsage} bytes > ${threshold} bytes`);
    }
  }

  static shouldGenerateCorrectCustomProperties(css: string, expectedCount: number): void {
    const customPropertyMatches = css.match(/--[a-zA-Z-]+:/g) || [];
    if (customPropertyMatches.length !== expectedCount) {
      throw new Error(`Expected ${expectedCount} custom properties, got ${customPropertyMatches.length}`);
    }
  }

  static shouldGenerateCorrectMediaQueries(css: string, expectedCount: number): void {
    const mediaQueryMatches = css.match(/@media/g) || [];
    if (mediaQueryMatches.length !== expectedCount) {
      throw new Error(`Expected ${expectedCount} media queries, got ${mediaQueryMatches.length}`);
    }
  }

  static shouldHaveValidCSS(css: string): void {
    // Basic CSS validation - check for common syntax errors
    const lines = css.split('\n');
    let braceCount = 0;
    let parenCount = 0;

    for (const line of lines) {
      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
      }
    }

    if (braceCount !== 0) {
      throw new Error(`Unmatched braces in CSS: ${braceCount}`);
    }

    if (parenCount !== 0) {
      throw new Error(`Unmatched parentheses in CSS: ${parenCount}`);
    }
  }
}

/**
 * Test result aggregator for comprehensive reporting
 */
export class TestResultAggregator {
  private results: Map<string, { passed: number; failed: number; metrics: TestMetrics[] }> = new Map();

  recordResult(testName: string, passed: boolean, metrics: TestMetrics): void {
    if (!this.results.has(testName)) {
      this.results.set(testName, { passed: 0, failed: 0, metrics: [] });
    }

    const result = this.results.get(testName)!;
    if (passed) {
      result.passed++;
    } else {
      result.failed++;
    }
    result.metrics.push(metrics);
  }

  getResults(): Map<string, { passed: number; failed: number; metrics: TestMetrics[] }> {
    return this.results;
  }

  getSummary(): {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    averageExecutionTime: number;
    averageMemoryUsage: number;
  } {
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalExecutionTime = 0;
    let totalMemoryUsage = 0;
    let totalMetrics = 0;

    for (const [, result] of this.results) {
      totalTests += result.passed + result.failed;
      totalPassed += result.passed;
      totalFailed += result.failed;
      
      for (const metrics of result.metrics) {
        totalExecutionTime += metrics.executionTime;
        totalMemoryUsage += metrics.memoryUsage;
        totalMetrics++;
      }
    }

    return {
      totalTests,
      totalPassed,
      totalFailed,
      averageExecutionTime: totalMetrics > 0 ? totalExecutionTime / totalMetrics : 0,
      averageMemoryUsage: totalMetrics > 0 ? totalMemoryUsage / totalMetrics : 0
    };
  }
}

/**
 * CSS validation utility
 */
export class CSSValidator {
  static validateSyntax(css: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for basic syntax issues
    const lines = css.split('\n');
    let braceCount = 0;
    let parenCount = 0;
    let inComment = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      
      // Handle comments
      if (line.includes('/*')) inComment = true;
      if (line.includes('*/')) inComment = false;
      if (inComment) continue;
      
      // Count braces and parentheses
      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
      }
      
      // Check for common issues
      if (line.includes(';;')) {
        errors.push(`Line ${lineNum}: Double semicolon detected`);
      }
      
      if (line.includes('{') && !line.includes('}') && braceCount > 0) {
        // Check if this is a valid opening brace
        const beforeBrace = line.substring(0, line.indexOf('{')).trim();
        // Allow :root, :hover, etc. (pseudo-selectors), @media, @keyframes, etc. (at-rules), and regular selectors
        const isValidSelector = beforeBrace.includes(':') || 
                               beforeBrace.includes('@') || 
                               beforeBrace.includes('.') || 
                               beforeBrace.includes('#') || 
                               beforeBrace.match(/^[a-zA-Z-]+$/) ||
                               beforeBrace.includes(' ') ||
                               beforeBrace === '';
        if (!isValidSelector) {
          errors.push(`Line ${lineNum}: Invalid opening brace - "${beforeBrace}"`);
        }
      }
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
  
  static validateCustomProperties(css: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const customPropertyPattern = /--[a-zA-Z-]+:/g;
    const matches = css.match(customPropertyPattern) || [];
    
    for (const match of matches) {
      const propName = match.replace(':', '');
      
      // Check for valid custom property naming
      if (!/^--[a-z][a-z0-9-]*$/.test(propName)) {
        errors.push(`Invalid custom property name: ${propName}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Helper function to run enterprise test cases
 */
export async function runEnterpriseTestCase(testCase: EnterpriseTestCase): Promise<{
  passed: boolean;
  metrics: TestMetrics;
  errors: Error[];
  output: string;
}> {
  const { css, metrics, errors } = processCssWithMetrics(testCase.input, testCase.options);
  
  let passed = true;
  const testErrors: Error[] = [...errors];
  
  try {
    // Check shouldContain
    if (testCase.shouldContain) {
      EnterpriseAssertions.shouldTransform(css, testCase.shouldContain);
    }
    
    // Check shouldNotContain
    if (testCase.shouldNotContain) {
      EnterpriseAssertions.shouldNotTransform(css, testCase.shouldNotContain);
    }
    
    // Check performance threshold
    if (testCase.performanceThreshold) {
      EnterpriseAssertions.shouldMeetPerformanceThreshold(metrics, testCase.performanceThreshold);
    }
    
    // Check memory threshold
    if (testCase.memoryThreshold) {
      EnterpriseAssertions.shouldMeetMemoryThreshold(metrics, testCase.memoryThreshold);
    }
    
    // Validate CSS syntax
    const validation = CSSValidator.validateSyntax(css);
    if (!validation.valid) {
      testErrors.push(new Error(`CSS validation failed: ${validation.errors.join(', ')}`));
      passed = false;
    }
    
  } catch (error) {
    testErrors.push(error as Error);
    passed = false;
  }
  
  return {
    passed,
    metrics,
    errors: testErrors,
    output: css
  };
}
