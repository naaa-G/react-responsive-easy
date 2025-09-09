/**
 * Performance Monitoring and Reporting Utilities for Babel Plugin
 * Enterprise-grade performance monitoring with historical tracking and reporting
 */

import { PerformanceBaseline, PerformanceResult, AdaptivePerformanceTester } from './adaptive-performance';

export interface PerformanceReport {
  timestamp: Date;
  environment: string;
  testSuite: string;
  summary: {
    totalTests: number;
    passed: number;
    warnings: number;
    failures: number;
    averageExecutionTime: number;
    slowestTest: string;
    fastestTest: string;
  };
  results: PerformanceResult[];
  baselines: Record<string, PerformanceBaseline>;
  trends: PerformanceTrend[];
  recommendations: string[];
}

export interface PerformanceTrend {
  testName: string;
  environment: string;
  trend: 'improving' | 'stable' | 'degrading';
  changePercent: number;
  last5Runs: number[];
  averageChange: number;
}

export interface PerformanceAlert {
  type: 'regression' | 'improvement' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  testName: string;
  message: string;
  timestamp: Date;
  recommendations: string[];
}

export class PerformanceMonitor {
  private tester: AdaptivePerformanceTester;
  private historicalReports: PerformanceReport[] = [];
  private alerts: PerformanceAlert[] = [];
  private maxHistoricalReports: number = 100;

  constructor(tester?: AdaptivePerformanceTester) {
    this.tester = tester ?? new AdaptivePerformanceTester();
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport(testSuite: string = 'default'): PerformanceReport {
    const summary = this.tester.getSummary();
    const results = this.tester.getResults();
    const baselines = this.tester.exportBaselines();
    
    // Find slowest and fastest tests
    const sortedResults = results.sort((a, b) => b.executionTime - a.executionTime);
    const slowestTest = sortedResults[0]?.testName ?? 'N/A';
    const fastestTest = sortedResults[sortedResults.length - 1]?.testName ?? 'N/A';
    
    // Calculate trends
    const trends = this.calculateTrends(baselines);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(results, trends);
    
    const report: PerformanceReport = {
      timestamp: new Date(),
      environment: summary.environment,
      testSuite,
      summary: {
        ...summary,
        slowestTest,
        fastestTest
      },
      results,
      baselines,
      trends,
      recommendations
    };
    
    // Store historical report
    this.historicalReports.push(report);
    if (this.historicalReports.length > this.maxHistoricalReports) {
      this.historicalReports.shift();
    }
    
    return report;
  }

  /**
   * Calculate performance trends from historical data
   */
  private calculateTrends(baselines: Record<string, PerformanceBaseline>): PerformanceTrend[] {
    const trends: PerformanceTrend[] = [];
    
    for (const [key, baseline] of Object.entries(baselines)) {
      if (baseline.historicalData.length < 3) {
        continue; // Need at least 3 data points for trend analysis
      }
      
      const recent = baseline.historicalData.slice(-5); // Last 5 runs
      const older = baseline.historicalData.slice(-10, -5); // Previous 5 runs
      
      if (older.length === 0) {
        continue;
      }
      
      const recentAvg = recent.reduce((sum, time) => sum + time, 0) / recent.length;
      const olderAvg = older.reduce((sum, time) => sum + time, 0) / older.length;
      
      const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
      const averageChange = changePercent;
      
      let trend: 'improving' | 'stable' | 'degrading';
      if (changePercent < -5) {
        trend = 'improving';
      } else if (changePercent > 5) {
        trend = 'degrading';
      } else {
        trend = 'stable';
      }
      
      trends.push({
        testName: baseline.testName,
        environment: baseline.environment,
        trend,
        changePercent,
        last5Runs: recent,
        averageChange
      });
    }
    
    return trends;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    results: PerformanceResult[],
    trends: PerformanceTrend[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Check for failures
    const failures = results.filter(r => r.status === 'failure');
    if (failures.length > 0) {
      recommendations.push(`Address ${failures.length} performance failure(s) immediately`);
    }
    
    // Check for warnings
    const warnings = results.filter(r => r.status === 'warning');
    if (warnings.length > 0) {
      recommendations.push(`Monitor ${warnings.length} performance warning(s) for potential regressions`);
    }
    
    // Check for degrading trends
    const degradingTrends = trends.filter(t => t.trend === 'degrading');
    if (degradingTrends.length > 0) {
      recommendations.push(`Investigate ${degradingTrends.length} test(s) showing performance degradation`);
    }
    
    // Check for slowest tests
    const sortedResults = results.sort((a, b) => b.executionTime - a.executionTime);
    const slowest = sortedResults[0];
    if (slowest && slowest.executionTime > 5000) { // 5 seconds
      recommendations.push(`Consider optimizing "${slowest.testName}" - currently taking ${slowest.executionTime.toFixed(2)}ms`);
    }
    
    // Environment-specific recommendations
    const summary = this.tester.getSummary();
    if (summary.environment === 'ci' && summary.averageExecutionTime > 3000) {
      recommendations.push('Consider optimizing CI environment performance or using more powerful runners');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance looks good! Continue monitoring for regressions.');
    }
    
    return recommendations;
  }

  /**
   * Check for performance anomalies and generate alerts
   */
  checkAnomalies(): PerformanceAlert[] {
    const newAlerts: PerformanceAlert[] = [];
    const results = this.tester.getResults();
    
    for (const result of results) {
      // Check for severe regressions
      if (result.status === 'failure') {
        newAlerts.push({
          type: 'regression',
          severity: 'critical',
          testName: result.testName,
          message: result.message,
          timestamp: new Date(),
          recommendations: result.recommendations ?? []
        });
      }
      
      // Check for warnings
      if (result.status === 'warning') {
        newAlerts.push({
          type: 'regression',
          severity: 'medium',
          testName: result.testName,
          message: result.message,
          timestamp: new Date(),
          recommendations: result.recommendations ?? []
        });
      }
      
      // Check for statistical anomalies
      if (result.baseline && result.baseline.sampleSize >= 10) {
        const zScore = Math.abs((result.executionTime - result.baseline.averageTime) / result.baseline.standardDeviation);
        if (zScore > 3) { // 3-sigma rule
          newAlerts.push({
            type: 'anomaly',
            severity: 'high',
            testName: result.testName,
            message: `Statistical anomaly detected: execution time ${result.executionTime.toFixed(2)}ms is ${zScore.toFixed(2)} standard deviations from mean`,
            timestamp: new Date(),
            recommendations: [
              'Investigate this unusual performance measurement',
              'Check for system resource issues',
              'Verify test data consistency'
            ]
          });
        }
      }
    }
    
    this.alerts.push(...newAlerts);
    return newAlerts;
  }

  /**
   * Export performance data in various formats
   */
  exportData(format: 'json' | 'csv' | 'junit' = 'json'): string {
    const report = this.generateReport();
    
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      
      case 'csv':
        return this.exportToCSV(report);
      
      case 'junit':
        return this.exportToJUnit(report);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(report: PerformanceReport): string {
    const headers = [
      'Test Name',
      'Environment',
      'Execution Time (ms)',
      'Status',
      'Threshold (ms)',
      'Baseline Average (ms)',
      'Timestamp'
    ];
    
    const rows = report.results.map(result => [
      result.testName,
      result.environment,
      result.executionTime.toFixed(2),
      result.status,
      result.threshold.toFixed(2),
      result.baseline?.averageTime.toFixed(2) ?? 'N/A',
      report.timestamp.toISOString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Export to JUnit XML format
   */
  private exportToJUnit(report: PerformanceReport): string {
    const totalTests = report.summary.totalTests;
    const failures = report.summary.failures;
    const warnings = report.summary.warnings;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<testsuite name="Babel Plugin Performance Tests" tests="${totalTests}" failures="${failures}" warnings="${warnings}" time="${report.summary.averageExecutionTime.toFixed(3)}">\n`;
    
    for (const result of report.results) {
      const status = result.status === 'failure' ? 'failure' : 'success';
      xml += `  <testcase name="${result.testName}" classname="PerformanceTest" time="${result.executionTime.toFixed(3)}">\n`;
      
      if (result.status === 'failure') {
        xml += `    <failure message="${result.message}">${result.message}</failure>\n`;
      } else if (result.status === 'warning') {
        xml += `    <warning message="${result.message}">${result.message}</warning>\n`;
      }
      
      xml += `  </testcase>\n`;
    }
    
    xml += `</testsuite>`;
    return xml;
  }

  /**
   * Get historical performance data
   */
  getHistoricalData(days: number = 30): PerformanceReport[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return this.historicalReports.filter(report => report.timestamp >= cutoff);
  }

  /**
   * Get performance alerts
   */
  getAlerts(severity?: 'low' | 'medium' | 'high' | 'critical'): PerformanceAlert[] {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return [...this.alerts];
  }

  /**
   * Clear historical data
   */
  clearHistory(): void {
    this.historicalReports = [];
    this.alerts = [];
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Convenience function to generate performance report
 */
export function generatePerformanceReport(testSuite?: string): PerformanceReport {
  return performanceMonitor.generateReport(testSuite);
}

/**
 * Convenience function to check for anomalies
 */
export function checkPerformanceAnomalies(): PerformanceAlert[] {
  return performanceMonitor.checkAnomalies();
}
