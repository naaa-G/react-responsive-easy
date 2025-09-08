/**
 * Adaptive Performance Testing Utilities for Babel Plugin
 * Enterprise-grade performance testing with environment awareness and regression detection
 */

export interface PerformanceBaseline {
  testName: string;
  environment: string;
  averageTime: number;
  minTime: number;
  maxTime: number;
  standardDeviation: number;
  sampleSize: number;
  lastUpdated: Date;
  historicalData: number[];
}

export interface PerformanceConfig {
  // Environment-specific multipliers
  ciMultiplier: number;
  localMultiplier: number;
  productionMultiplier: number;
  
  // Regression detection thresholds
  warningThreshold: number; // e.g., 1.5x baseline
  failureThreshold: number; // e.g., 2.0x baseline
  
  // Minimum sample size for statistical significance
  minSampleSize: number;
  
  // Maximum historical data points to keep
  maxHistoricalPoints: number;
  
  // Environment detection
  environmentDetection: {
    ci: string[];
    local: string[];
    production: string[];
  };
}

export interface PerformanceResult {
  testName: string;
  environment: string;
  executionTime: number;
  baseline?: PerformanceBaseline;
  threshold: number;
  status: 'pass' | 'warning' | 'failure';
  message: string;
  recommendations?: string[];
}

export class AdaptivePerformanceTester {
  private baselines: Map<string, PerformanceBaseline> = new Map();
  private config: PerformanceConfig;
  private results: PerformanceResult[] = [];

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = {
      ciMultiplier: 4.0, // CI is typically 4x slower for Babel transformations
      localMultiplier: 1.0,
      productionMultiplier: 0.8, // Production should be faster
      
      warningThreshold: 1.5, // 50% over baseline = warning
      failureThreshold: 2.0, // 100% over baseline = failure
      
      minSampleSize: 5,
      maxHistoricalPoints: 50,
      
      environmentDetection: {
        ci: ['CI', 'GITHUB_ACTIONS', 'GITLAB_CI', 'CIRCLECI', 'TRAVIS', 'JENKINS_URL', 'TF_BUILD'],
        local: ['NODE_ENV=development', 'USER', 'HOME'],
        production: ['NODE_ENV=production']
      },
      ...config
    };
  }

  /**
   * Detect current environment based on environment variables
   */
  private detectEnvironment(): string {
    const env = process.env;
    
    // Check for CI environments
    for (const ciVar of this.config.environmentDetection.ci) {
      if (env[ciVar]) {
        return 'ci';
      }
    }
    
    // Check for production
    for (const prodVar of this.config.environmentDetection.production) {
      if (env[prodVar]) {
        return 'production';
      }
    }
    
    // Default to local development
    return 'local';
  }

  /**
   * Get environment-specific performance multiplier
   */
  private getEnvironmentMultiplier(environment: string): number {
    switch (environment) {
      case 'ci':
        return this.config.ciMultiplier;
      case 'production':
        return this.config.productionMultiplier;
      case 'local':
      default:
        return this.config.localMultiplier;
    }
  }

  /**
   * Calculate adaptive threshold based on baseline and environment
   */
  private calculateAdaptiveThreshold(
    baseline: PerformanceBaseline | undefined,
    environment: string,
    baseThreshold: number
  ): number {
    const envMultiplier = this.getEnvironmentMultiplier(environment);
    
    if (!baseline || baseline.sampleSize < this.config.minSampleSize) {
      // No baseline or insufficient data - use conservative estimate
      return baseThreshold * envMultiplier * 2; // 2x safety margin
    }
    
    // Use baseline with environment adjustment and safety margin
    const adjustedBaseline = baseline.averageTime * envMultiplier;
    const safetyMargin = Math.max(adjustedBaseline * 0.2, 100); // 20% or 100ms minimum
    
    return adjustedBaseline + safetyMargin;
  }

  /**
   * Update baseline with new performance data
   */
  private updateBaseline(
    testName: string,
    environment: string,
    executionTime: number
  ): PerformanceBaseline {
    const key = `${testName}-${environment}`;
    const existing = this.baselines.get(key);
    
    if (!existing) {
      // Create new baseline
      const baseline: PerformanceBaseline = {
        testName,
        environment,
        averageTime: executionTime,
        minTime: executionTime,
        maxTime: executionTime,
        standardDeviation: 0,
        sampleSize: 1,
        lastUpdated: new Date(),
        historicalData: [executionTime]
      };
      
      this.baselines.set(key, baseline);
      return baseline;
    }
    
    // Update existing baseline
    const newHistoricalData = [...existing.historicalData, executionTime];
    
    // Keep only recent data points
    if (newHistoricalData.length > this.config.maxHistoricalPoints) {
      newHistoricalData.splice(0, newHistoricalData.length - this.config.maxHistoricalPoints);
    }
    
    const averageTime = newHistoricalData.reduce((sum, time) => sum + time, 0) / newHistoricalData.length;
    const minTime = Math.min(...newHistoricalData);
    const maxTime = Math.max(...newHistoricalData);
    
    // Calculate standard deviation
    const variance = newHistoricalData.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / newHistoricalData.length;
    const standardDeviation = Math.sqrt(variance);
    
    const updatedBaseline: PerformanceBaseline = {
      testName,
      environment,
      averageTime,
      minTime,
      maxTime,
      standardDeviation,
      sampleSize: newHistoricalData.length,
      lastUpdated: new Date(),
      historicalData: newHistoricalData
    };
    
    this.baselines.set(key, updatedBaseline);
    return updatedBaseline;
  }

  /**
   * Test performance with adaptive thresholds and regression detection
   */
  testPerformance(
    testName: string,
    executionTime: number,
    baseThreshold: number = 1000
  ): PerformanceResult {
    const environment = this.detectEnvironment();
    const baseline = this.baselines.get(`${testName}-${environment}`);
    const threshold = this.calculateAdaptiveThreshold(baseline, environment, baseThreshold);
    
    // Update baseline with current measurement
    const updatedBaseline = this.updateBaseline(testName, environment, executionTime);
    
    // Determine status and message
    let status: 'pass' | 'warning' | 'failure' = 'pass';
    let message = '';
    let recommendations: string[] = [];
    
    if (executionTime > threshold * this.config.failureThreshold) {
      status = 'failure';
      message = `Severe performance regression: ${executionTime.toFixed(2)}ms > ${(threshold * this.config.failureThreshold).toFixed(2)}ms (${testName})`;
      recommendations = [
        'Investigate recent code changes that might have caused this regression',
        'Check for memory leaks or inefficient algorithms in Babel transformations',
        'Consider optimizing the most time-consuming operations',
        'Review dependencies for performance issues',
        'Check if CI environment has sufficient resources'
      ];
    } else if (executionTime > threshold * this.config.warningThreshold) {
      status = 'warning';
      message = `Performance warning: ${executionTime.toFixed(2)}ms > ${(threshold * this.config.warningThreshold).toFixed(2)}ms (${testName})`;
      recommendations = [
        'Monitor this test for further degradation',
        'Consider if this is acceptable for the current environment',
        'Review recent changes that might affect performance',
        'Check CI environment resource allocation'
      ];
    } else {
      message = `Performance OK: ${executionTime.toFixed(2)}ms < ${threshold.toFixed(2)}ms (${testName})`;
    }
    
    const result: PerformanceResult = {
      testName,
      environment,
      executionTime,
      baseline: updatedBaseline,
      threshold,
      status,
      message,
      recommendations
    };
    
    this.results.push(result);
    return result;
  }

  /**
   * Get performance baseline for a test
   */
  getBaseline(testName: string, environment?: string): PerformanceBaseline | undefined {
    const env = environment || this.detectEnvironment();
    return this.baselines.get(`${testName}-${env}`);
  }

  /**
   * Get all performance results
   */
  getResults(): PerformanceResult[] {
    return [...this.results];
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    totalTests: number;
    passed: number;
    warnings: number;
    failures: number;
    averageExecutionTime: number;
    environment: string;
  } {
    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.status === 'pass').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const failures = this.results.filter(r => r.status === 'failure').length;
    const averageExecutionTime = this.results.reduce((sum, r) => sum + r.executionTime, 0) / totalTests;
    
    return {
      totalTests,
      passed,
      warnings,
      failures,
      averageExecutionTime,
      environment: this.detectEnvironment()
    };
  }

  /**
   * Export baselines for persistence
   */
  exportBaselines(): Record<string, PerformanceBaseline> {
    const exported: Record<string, PerformanceBaseline> = {};
    for (const [key, baseline] of this.baselines) {
      exported[key] = baseline;
    }
    return exported;
  }

  /**
   * Import baselines from previous runs
   */
  importBaselines(baselines: Record<string, PerformanceBaseline>): void {
    for (const [key, baseline] of Object.entries(baselines)) {
      this.baselines.set(key, baseline);
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.baselines.clear();
    this.results = [];
  }
}

/**
 * Global adaptive performance tester instance
 */
export const adaptivePerformanceTester = new AdaptivePerformanceTester();

/**
 * Convenience function for testing performance
 */
export function testAdaptivePerformance(
  testName: string,
  executionTime: number,
  baseThreshold: number = 1000
): PerformanceResult {
  return adaptivePerformanceTester.testPerformance(testName, executionTime, baseThreshold);
}

/**
 * Environment-aware performance assertion
 */
export function adaptivePerformanceAssert(
  actualTime: number,
  baseline: number,
  testName: string,
  baseThreshold: number = 1000
): void {
  const result = testAdaptivePerformance(testName, actualTime, baseThreshold);
  
  // Log the result
  console.log(`[${result.status.toUpperCase()}] ${result.message}`);
  
  if (result.recommendations && result.recommendations.length > 0) {
    console.log('Recommendations:');
    result.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
  
  // Only throw error for failures, not warnings
  if (result.status === 'failure') {
    throw new Error(result.message);
  }
}

/**
 * Get environment-specific performance configuration
 */
export function getEnvironmentConfig(): {
  environment: string;
  multiplier: number;
  isCI: boolean;
  isProduction: boolean;
  isLocal: boolean;
} {
  const tester = new AdaptivePerformanceTester();
  const environment = tester['detectEnvironment']();
  const multiplier = tester['getEnvironmentMultiplier'](environment);
  
  return {
    environment,
    multiplier,
    isCI: environment === 'ci',
    isProduction: environment === 'production',
    isLocal: environment === 'local'
  };
}
