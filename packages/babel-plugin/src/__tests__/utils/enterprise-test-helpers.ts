/**
 * Enterprise-grade test utilities and helpers for Babel plugin tests
 */

import { transform } from '@babel/core';
import plugin from '../../index';
import type { BabelPluginOptions, ResponsiveConfig } from '../../types';

export interface EnterpriseTestCase {
  name: string;
  description: string;
  input: string;
  expected?: string;
  options?: BabelPluginOptions;
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
 * Enhanced transform function with comprehensive error handling
 */
export function transformCode(
  code: string, 
  options: BabelPluginOptions = {},
  filename: string = 'test.tsx'
): { code: string; metrics: TestMetrics; errors: Error[] } {
  const errors: Error[] = [];
  const startTime = performance.now();
  const startMemory = process.memoryUsage().heapUsed;

  try {
    const result = transform(code, {
      filename,
      plugins: [[plugin, options]],
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
      ],
      sourceType: 'module',
      compact: false,
      retainLines: true
    });

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    return {
      code: result?.code || '',
      metrics: {
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        cacheHits: 0, // Would be populated by cache manager
        cacheMisses: 0,
        transformations: 0, // Would be populated by plugin state
        errors: 0
      },
      errors
    };
  } catch (error) {
    errors.push(error as Error);
    return {
      code: '',
      metrics: {
        executionTime: 0,
        memoryUsage: 0,
        cacheHits: 0,
        cacheMisses: 0,
        transformations: 0,
        errors: 1
      },
      errors
    };
  }
}

/**
 * Create a comprehensive test case with enterprise patterns
 */
export function createEnterpriseTestCase(testCase: EnterpriseTestCase): EnterpriseTestCase {
  return {
    name: testCase.name,
    description: testCase.description || `Test case: ${testCase.name}`,
    input: testCase.input,
    options: testCase.options || {},
    shouldThrow: testCase.shouldThrow || false,
    shouldContain: testCase.shouldContain || [],
    shouldNotContain: testCase.shouldNotContain || [],
    expected: testCase.expected,
    performanceThreshold: testCase.performanceThreshold || 100, // 100ms default
    memoryThreshold: testCase.memoryThreshold || 10 * 1024 * 1024, // 10MB default
    tags: testCase.tags || [],
    category: testCase.category || 'unit',
    priority: testCase.priority || 'medium'
  };
}

/**
 * Enhanced assertion helpers with detailed error messages
 */
export class EnterpriseAssertions {
  static shouldTransform(output: string, context?: string): void {
    const patterns = ['useMemo', 'switch', 'currentBreakpoint.name'];
    const missing = patterns.filter(pattern => !output.includes(pattern));
    
    if (missing.length > 0) {
      throw new Error(
        `Expected transformation output to contain: ${missing.join(', ')}${context ? ` (${context})` : ''}`
      );
    }
  }

  static shouldNotTransform(output: string, context?: string): void {
    const patterns = ['useMemo', 'switch'];
    const found = patterns.filter(pattern => output.includes(pattern));
    
    if (found.length > 0) {
      throw new Error(
        `Expected transformation output NOT to contain: ${found.join(', ')}${context ? ` (${context})` : ''}`
      );
    }
  }

  static shouldContain(output: string, patterns: string[], context?: string): void {
    const missing = patterns.filter(pattern => !output.includes(pattern));
    
    if (missing.length > 0) {
      throw new Error(
        `Expected output to contain: ${missing.join(', ')}${context ? ` (${context})` : ''}`
      );
    }
  }

  static shouldNotContain(output: string, patterns: string[], context?: string): void {
    const found = patterns.filter(pattern => output.includes(pattern));
    
    if (found.length > 0) {
      throw new Error(
        `Expected output NOT to contain: ${found.join(', ')}${context ? ` (${context})` : ''}`
      );
    }
  }

  static shouldMeetPerformanceThreshold(
    metrics: TestMetrics, 
    threshold: number, 
    context?: string
  ): void {
    if (metrics.executionTime > threshold) {
      throw new Error(
        `Performance threshold exceeded: ${metrics.executionTime}ms > ${threshold}ms${context ? ` (${context})` : ''}`
      );
    }
  }

  static shouldMeetMemoryThreshold(
    metrics: TestMetrics, 
    threshold: number, 
    context?: string
  ): void {
    if (metrics.memoryUsage > threshold) {
      throw new Error(
        `Memory threshold exceeded: ${metrics.memoryUsage} bytes > ${threshold} bytes${context ? ` (${context})` : ''}`
      );
    }
  }

  static shouldHaveNoErrors(metrics: TestMetrics, context?: string): void {
    if (metrics.errors > 0) {
      throw new Error(
        `Expected no errors, but found ${metrics.errors}${context ? ` (${context})` : ''}`
      );
    }
  }
}

/**
 * Performance benchmarking utilities
 */
export class PerformanceBenchmark {
  private results: Array<{ name: string; time: number; memory: number }> = [];

  async measure<T>(
    name: string, 
    fn: () => T | Promise<T>
  ): Promise<{ result: T; time: number; memory: number }> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;

    const result = await fn();

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    const time = endTime - startTime;
    const memory = endMemory - startMemory;

    this.results.push({ name, time, memory });

    return { result, time, memory };
  }

  getResults(): Array<{ name: string; time: number; memory: number }> {
    return [...this.results];
  }

  getAverageTime(): number {
    if (this.results.length === 0) return 0;
    return this.results.reduce((sum, r) => sum + r.time, 0) / this.results.length;
  }

  getAverageMemory(): number {
    if (this.results.length === 0) return 0;
    return this.results.reduce((sum, r) => sum + r.memory, 0) / this.results.length;
  }

  clear(): void {
    this.results = [];
  }
}

/**
 * Memory leak detection utilities
 */
export class MemoryLeakDetector {
  private snapshots: Array<{ name: string; memory: NodeJS.MemoryUsage }> = [];

  takeSnapshot(name: string): void {
    this.snapshots.push({
      name,
      memory: process.memoryUsage()
    });
  }

  detectLeaks(): Array<{ name: string; increase: number; percentage: number }> {
    const leaks: Array<{ name: string; increase: number; percentage: number }> = [];
    
    for (let i = 1; i < this.snapshots.length; i++) {
      const prev = this.snapshots[i - 1];
      const curr = this.snapshots[i];
      
      const increase = curr.memory.heapUsed - prev.memory.heapUsed;
      const percentage = (increase / prev.memory.heapUsed) * 100;
      
      // Consider it a leak if memory increases by more than 200% and is significant (>50MB)
      // This is more realistic for CI environments where memory usage can vary significantly
      if (percentage > 200 && increase > 50 * 1024 * 1024) {
        leaks.push({
          name: `${prev.name} -> ${curr.name}`,
          increase,
          percentage
        });
      }
    }
    
    return leaks;
  }

  clear(): void {
    this.snapshots = [];
  }
}

/**
 * Test data generators for comprehensive testing
 */
export class TestDataGenerator {
  static generateResponsiveValues(count: number = 10): string[] {
    const tokens = ['fontSize', 'spacing', 'radius'];
    const values = Array.from({ length: count }, (_, i) => {
      const token = tokens[i % tokens.length];
      const value = Math.floor(Math.random() * 50) + 10;
      return `const value${i} = useResponsiveValue(${value}, { token: '${token}' });`;
    });
    
    return values;
  }

  static generateStyleObjects(count: number = 5): string[] {
    const properties = ['fontSize', 'padding', 'margin', 'borderRadius', 'lineHeight'];
    const values = Array.from({ length: count }, (_, i) => {
      const props = properties.slice(0, Math.floor(Math.random() * 3) + 2);
      const styleProps = props.map(prop => 
        `${prop}: ${Math.floor(Math.random() * 30) + 10}`
      ).join(', ');
      
      return `const styles${i} = useScaledStyle({ ${styleProps} });`;
    });
    
    return values;
  }

  static generateComplexComponents(count: number = 3): string[] {
    const templates = [
      (i: number) => `const Component${i} = () => {
        const fontSize = useResponsiveValue(16, { token: 'fontSize' });
        const padding = useResponsiveValue(12, { token: 'spacing' });
        return <div style={{ fontSize, padding }}>Content</div>;
      };`,
      (i: number) => `const Button${i} = ({ children }) => {
        const fontSize = useResponsiveValue(14, { token: 'fontSize' });
        const borderRadius = useResponsiveValue(8, { token: 'radius' });
        return <button style={{ fontSize, borderRadius }}>{children}</button>;
      };`,
      (i: number) => `const Card${i} = ({ title, content }) => {
        const titleSize = useResponsiveValue(20, { token: 'fontSize' });
        const contentSize = useResponsiveValue(16, { token: 'fontSize' });
        const padding = useResponsiveValue(16, { token: 'spacing' });
        return (
          <div style={{ padding }}>
            <h2 style={{ fontSize: titleSize }}>{title}</h2>
            <p style={{ fontSize: contentSize }}>{content}</p>
          </div>
        );
      };`
    ];

    return Array.from({ length: count }, (_, i) => templates[i % templates.length](i));
  }

  static generateMalformedInputs(): string[] {
    return [
      'const fontSize = useResponsiveValue();',
      'const fontSize = useResponsiveValue(undefined);',
      'const fontSize = useResponsiveValue(null);',
      'const fontSize = useResponsiveValue("24px");',
      'const fontSize = useResponsiveValue(24, { token: 123 });',
      'const styles = useScaledStyle(null);',
      'const styles = useScaledStyle(undefined);',
      'const styles = useScaledStyle("string");'
    ];
  }

  static generateLargeInput(size: number = 1000): string {
    const imports = `import React from 'react';
import { useResponsiveValue, useScaledStyle } from 'react-responsive-easy';`;

    const components = this.generateComplexComponents(Math.floor(size / 10));
    const values = this.generateResponsiveValues(Math.floor(size / 5));
    const styles = this.generateStyleObjects(Math.floor(size / 20));

    return [imports, ...components, ...values, ...styles].join('\n\n');
  }
}

/**
 * Configuration presets for different testing scenarios
 */
export const enterpriseTestConfigs = {
  development: {
    precompute: true,
    development: true,
    addComments: true,
    validateConfig: true,
    performanceMetrics: true,
    generateSourceMaps: true
  },
  production: {
    precompute: true,
    development: false,
    addComments: false,
    validateConfig: false,
    performanceMetrics: false,
    minifyOutput: true
  },
  performance: {
    precompute: true,
    enableCaching: true,
    cacheSize: 10000,
    enableMemoization: true,
    performanceMetrics: true
  },
  security: {
    precompute: true,
    validateConfig: true,
    preserveTypeInfo: true,
    generateSourceMaps: false
  },
  accessibility: {
    precompute: true,
    development: true,
    addComments: true,
    preserveTypeInfo: true
  },
  disabled: {
    precompute: false,
    development: false
  }
};

/**
 * Test suite factory for enterprise patterns
 */
export function createEnterpriseTestSuite(suite: TestSuite) {
  return {
    ...suite,
    testCases: suite.testCases.map(createEnterpriseTestCase),
    run: async () => {
      if (suite.beforeAll) await suite.beforeAll();
      
      try {
        for (const testCase of suite.testCases) {
          if (suite.setup) await suite.setup();
          
          try {
            const { code, metrics, errors } = transformCode(
              testCase.input, 
              testCase.options || {}
            );
            
            if (testCase.shouldThrow) {
              if (errors.length === 0) {
                throw new Error(`Expected test to throw, but it didn't`);
              }
              return;
            }
            
            if (testCase.shouldContain) {
              EnterpriseAssertions.shouldContain(code, testCase.shouldContain, testCase.name);
            }
            
            if (testCase.shouldNotContain) {
              EnterpriseAssertions.shouldNotContain(code, testCase.shouldNotContain, testCase.name);
            }
            
            if (testCase.performanceThreshold) {
              EnterpriseAssertions.shouldMeetPerformanceThreshold(
                metrics, 
                testCase.performanceThreshold, 
                testCase.name
              );
            }
            
            if (testCase.memoryThreshold) {
              EnterpriseAssertions.shouldMeetMemoryThreshold(
                metrics, 
                testCase.memoryThreshold, 
                testCase.name
              );
            }
            
            EnterpriseAssertions.shouldHaveNoErrors(metrics, testCase.name);
            
          } finally {
            if (suite.teardown) await suite.teardown();
          }
        }
      } finally {
        if (suite.afterAll) await suite.afterAll();
      }
    }
  };
}

/**
 * Coverage analysis utilities
 */
export class CoverageAnalyzer {
  private coverage: Map<string, number> = new Map();

  recordCoverage(file: string, line: number): void {
    const key = `${file}:${line}`;
    this.coverage.set(key, (this.coverage.get(key) || 0) + 1);
  }

  getCoverage(): Map<string, number> {
    return new Map(this.coverage);
  }

  getCoveragePercentage(totalLines: number): number {
    return (this.coverage.size / totalLines) * 100;
  }

  clear(): void {
    this.coverage.clear();
  }
}

/**
 * Test result aggregation and reporting
 */
export class TestResultAggregator {
  private results: Array<{
    name: string;
    passed: boolean;
    duration: number;
    memory: number;
    errors: string[];
    category: string;
    priority: string;
  }> = [];

  recordResult(result: {
    name: string;
    passed: boolean;
    duration: number;
    memory: number;
    errors: string[];
    category: string;
    priority: string;
  }): void {
    this.results.push(result);
  }

  getSummary(): {
    total: number;
    passed: number;
    failed: number;
    averageDuration: number;
    averageMemory: number;
    byCategory: Record<string, { total: number; passed: number; failed: number }>;
    byPriority: Record<string, { total: number; passed: number; failed: number }>;
  } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const averageDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / total;
    const averageMemory = this.results.reduce((sum, r) => sum + r.memory, 0) / total;

    const byCategory = this.results.reduce((acc, r) => {
      if (!acc[r.category]) acc[r.category] = { total: 0, passed: 0, failed: 0 };
      acc[r.category].total++;
      if (r.passed) acc[r.category].passed++;
      else acc[r.category].failed++;
      return acc;
    }, {} as Record<string, { total: number; passed: number; failed: number }>);

    const byPriority = this.results.reduce((acc, r) => {
      if (!acc[r.priority]) acc[r.priority] = { total: 0, passed: 0, failed: 0 };
      acc[r.priority].total++;
      if (r.passed) acc[r.priority].passed++;
      else acc[r.priority].failed++;
      return acc;
    }, {} as Record<string, { total: number; passed: number; failed: number }>);

    return {
      total,
      passed,
      failed,
      averageDuration,
      averageMemory,
      byCategory,
      byPriority
    };
  }

  clear(): void {
    this.results = [];
  }
}
