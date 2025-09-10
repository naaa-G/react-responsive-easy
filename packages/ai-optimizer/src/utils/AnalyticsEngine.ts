/**
 * Enterprise-grade analytics and monitoring system
 * 
 * Provides comprehensive tracking, reporting, and alerting
 * for AI optimization operations in production environments.
 */

import { ResponsiveConfig } from '@yaseratiar/react-responsive-easy-core';
import { ComponentUsageData, OptimizationSuggestions } from '../types/index.js';
import { MemoryStats } from './MemoryManager.js';
import { PerformanceMetrics } from './PerformanceOptimizer.js';
import { AI_OPTIMIZER_CONSTANTS } from '../constants.js';
import { Logger } from './Logger.js';

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: 'optimization' | 'training' | 'error' | 'performance' | 'memory';
  data: Record<string, unknown>;
  metadata: {
    version: string;
    environment: string;
    userId?: string;
    sessionId?: string;
  };
}

export interface OptimizationAnalytics {
  totalOptimizations: number;
  averageConfidence: number;
  averageOptimizationTime: number;
  successRate: number;
  topComponentTypes: Array<{ type: string; count: number }>;
  performanceImpact: {
    average: number;
    distribution: Array<{ range: string; count: number }>;
  };
  errorBreakdown: Array<{ error: string; count: number }>;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  metrics: {
    memory: MemoryStats;
    performance: PerformanceMetrics;
    uptime: number;
    errorRate: number;
  };
  alerts: Array<{
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: number;
  }>;
}

export interface AlertConfig {
  memoryThreshold: number;
  performanceThreshold: number;
  errorRateThreshold: number;
  enabled: boolean;
}

/**
 * Analytics event tracker
 */
export class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private maxEvents = AI_OPTIMIZER_CONSTANTS.ANALYTICS.MAX_METRICS;
  private sessionId: string;
  private startTime: number;
  private logger: Logger;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.logger = new Logger('AnalyticsTracker');
  }

  /**
   * Track an optimization event
   */
  trackOptimization(
    config: ResponsiveConfig,
    usageData: ComponentUsageData[],
    result: OptimizationSuggestions,
    duration: number,
    success: boolean
  ): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'optimization',
      data: {
        config: this.sanitizeConfig(config),
        usageDataCount: usageData.length,
        componentTypes: [...new Set(usageData.map(d => d.componentType))],
        result: {
          confidenceScore: result.confidenceScore,
          suggestionsCount: Object.keys(result.suggestedTokens).length,
          hasWarnings: result.accessibilityWarnings.length > 0
        },
        duration,
        success
      },
      metadata: {
        version: '1.0.1',
        environment: process.env.NODE_ENV ?? 'development',
        sessionId: this.sessionId
      }
    };

    this.addEvent(event);
  }

  /**
   * Track a training event
   */
  trackTraining(
    trainingDataCount: number,
    metrics: Record<string, unknown>,
    duration: number,
    success: boolean
  ): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'training',
      data: {
        trainingDataCount,
        metrics,
        duration,
        success
      },
      metadata: {
        version: '1.0.1',
        environment: process.env.NODE_ENV ?? 'development',
        sessionId: this.sessionId
      }
    };

    this.addEvent(event);
  }

  /**
   * Track an error event
   */
  trackError(error: Error, context: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'error',
      data: {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        context
      },
      metadata: {
        version: '1.0.1',
        environment: process.env.NODE_ENV ?? 'development',
        sessionId: this.sessionId
      }
    };

    this.addEvent(event);
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metrics: PerformanceMetrics): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'performance',
      data: metrics as unknown as Record<string, unknown>,
      metadata: {
        version: '1.0.1',
        environment: process.env.NODE_ENV ?? 'development',
        sessionId: this.sessionId
      }
    };

    this.addEvent(event);
  }

  /**
   * Track memory usage
   */
  trackMemory(memoryStats: MemoryStats): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'memory',
      data: memoryStats as unknown as Record<string, unknown>,
      metadata: {
        version: '1.0.1',
        environment: process.env.NODE_ENV ?? 'development',
        sessionId: this.sessionId
      }
    };

    this.addEvent(event);
  }

  /**
   * Get optimization analytics
   */
  getOptimizationAnalytics(): OptimizationAnalytics {
    const optimizationEvents = this.events.filter(e => e.type === 'optimization');
    
    if (optimizationEvents.length === 0) {
      return {
        totalOptimizations: 0,
        averageConfidence: 0,
        averageOptimizationTime: 0,
        successRate: 0,
        topComponentTypes: [],
        performanceImpact: { average: 0, distribution: [] },
        errorBreakdown: []
      };
    }

    const successful = optimizationEvents.filter(e => e.data.success);
    const failed = optimizationEvents.filter(e => !e.data.success);
    
    const averageConfidence = successful.reduce((sum, e) => sum + ((e.data.result as Record<string, unknown>).confidenceScore as number), 0) / successful.length;
    const averageOptimizationTime = optimizationEvents.reduce((sum, e) => sum + (e.data.duration as number), 0) / optimizationEvents.length;
    const successRate = successful.length / optimizationEvents.length;

    // Top component types
    const componentTypeCounts = new Map<string, number>();
    optimizationEvents.forEach(e => {
      (e.data.componentTypes as string[]).forEach((type: string) => {
        componentTypeCounts.set(type, (componentTypeCounts.get(type) ?? 0) + 1);
      });
    });
    const topComponentTypes = Array.from(componentTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Performance impact distribution
    const performanceImpacts = successful.map(e => (e.data.result as Record<string, unknown>).confidenceScore as number);
    const distribution = this.calculateDistribution(performanceImpacts, [
      AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.POOR_THRESHOLD,
      AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.FAIR_THRESHOLD,
      AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.GOOD_THRESHOLD,
      AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD,
      AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.MAX_SCORE
    ]);

    // Error breakdown
    const errorCounts = new Map<string, number>();
    failed.forEach(e => {
      const errorType = (e.data.error as Record<string, unknown>)?.name as string ?? 'Unknown';
      errorCounts.set(errorType, (errorCounts.get(errorType) ?? 0) + 1);
    });
    const errorBreakdown = Array.from(errorCounts.entries())
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalOptimizations: optimizationEvents.length,
      averageConfidence,
      averageOptimizationTime,
      successRate,
      topComponentTypes,
      performanceImpact: {
        average: averageConfidence,
        distribution
      },
      errorBreakdown
    };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 100): AnalyticsEvent[] {
    return this.events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Clear old events
   */
  clearOldEvents(maxAge: number = AI_OPTIMIZER_CONSTANTS.TIME.DAY): void { // 24 hours
    const cutoff = Date.now() - maxAge;
    this.events = this.events.filter(e => e.timestamp > cutoff);
  }

  private addEvent(event: AnalyticsEvent): void {
    this.events.push(event);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  private sanitizeConfig(config: ResponsiveConfig): Record<string, unknown> {
    return {
      breakpointCount: config?.breakpoints?.length ?? 0,
      strategy: {
        origin: config?.strategy?.origin ?? 'unknown',
        mode: config?.strategy?.mode ?? 'unknown'
      },
      tokenCount: Object.keys(config?.strategy?.tokens ?? {}).length
    };
  }

  private calculateDistribution(values: number[], thresholds: number[]): Array<{ range: string; count: number }> {
    const distribution = thresholds.slice(0, -1).map((_, i) => ({
      range: `${thresholds[i]}-${thresholds[i + 1]}`,
      count: 0
    }));

    values.forEach(value => {
      for (let i = 0; i < thresholds.length - 1; i++) {
        if (value >= thresholds[i] && value < thresholds[i + 1]) {
          distribution[i].count++;
          break;
        }
      }
    });

    return distribution;
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(AnalyticsEngine.RADIX_36).substr(2, AnalyticsEngine.RANDOM_LENGTH)}`;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(AnalyticsEngine.RADIX_36).substr(2, AnalyticsEngine.RANDOM_LENGTH)}`;
  }
}

/**
 * System health monitor
 */
export class SystemHealthMonitor {
  private alerts: Array<{
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: number;
  }> = [];
  private config: AlertConfig;
  private startTime: number;
  private logger: Logger;

  constructor(config: Partial<AlertConfig> = {}) {
    this.config = {
      memoryThreshold: AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MEMORY_200MB, // 200MB
      performanceThreshold: 5000, // 5 seconds
      errorRateThreshold: AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MIN_ALPHA, // 10%
      enabled: true,
      ...config
    };
    this.startTime = Date.now();
    this.logger = new Logger('SystemHealthMonitor');
  }

  /**
   * Check system health
   */
  checkHealth(
    memoryStats: MemoryStats,
    performanceMetrics: PerformanceMetrics,
    errorRate: number
  ): SystemHealth {
    const alerts: Array<{
      level: 'info' | 'warning' | 'error' | 'critical';
      message: string;
      timestamp: number;
    }> = [];

    // Check memory usage
    if (memoryStats.memoryPressure === 'critical') {
      alerts.push({
        level: 'critical',
        message: `Critical memory usage: ${Math.round(memoryStats.usedJSHeapSize / AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MB_TO_BYTES)}MB`,
        timestamp: Date.now()
      });
    } else if (memoryStats.memoryPressure === 'high') {
      alerts.push({
        level: 'warning',
        message: `High memory usage: ${Math.round(memoryStats.usedJSHeapSize / AI_OPTIMIZER_CONSTANTS.ADDITIONAL_CONSTANTS.MB_TO_BYTES)}MB`,
        timestamp: Date.now()
      });
    }

    // Check performance
    if (performanceMetrics.averageOptimizationTime > this.config.performanceThreshold) {
      alerts.push({
        level: 'warning',
        message: `Slow optimization: ${Math.round(performanceMetrics.averageOptimizationTime)}ms average`,
        timestamp: Date.now()
      });
    }

    // Check error rate
    if (errorRate > this.config.errorRateThreshold) {
      alerts.push({
        level: errorRate > AnalyticsEngine.CONFIDENCE_THRESHOLD ? 'critical' : 'error',
        message: `High error rate: ${Math.round(errorRate * 100)}%`,
        timestamp: Date.now()
      });
    }

    // Add new alerts
    this.alerts.push(...alerts);

    // Keep only recent alerts
    const maxAge = AI_OPTIMIZER_CONSTANTS.TIME.HOUR; // 1 hour
    this.alerts = this.alerts.filter(alert => Date.now() - alert.timestamp < maxAge);

    // Determine overall status
    const criticalAlerts = this.alerts.filter(a => a.level === 'critical');
    const errorAlerts = this.alerts.filter(a => a.level === 'error');
    const warningAlerts = this.alerts.filter(a => a.level === 'warning');

    let status: SystemHealth['status'] = 'healthy';
    if (criticalAlerts.length > 0) {
      status = 'critical';
    } else if (errorAlerts.length > 0) {
      status = 'critical';
    } else if (warningAlerts.length > 0) {
      status = 'warning';
    }

    return {
      status,
      metrics: {
        memory: memoryStats,
        performance: performanceMetrics,
        uptime: Date.now() - this.startTime,
        errorRate
      },
      alerts: this.alerts.slice(-AnalyticsEngine.MAX_ALERTS) // Last 20 alerts
    };
  }

  /**
   * Get health trends
   */
  getHealthTrends(): {
    memoryTrend: 'stable' | 'increasing' | 'decreasing';
    performanceTrend: 'stable' | 'improving' | 'degrading';
    errorTrend: 'stable' | 'increasing' | 'decreasing';
  } {
    // This would analyze historical data to determine trends
    // For now, return stable trends
    return {
      memoryTrend: 'stable',
      performanceTrend: 'stable',
      errorTrend: 'stable'
    };
  }
}

/**
 * Main analytics engine
 */
export class AnalyticsEngine {
  // Constants for magic numbers
  public static readonly RADIX_36 = 36;
  public static readonly RANDOM_LENGTH = 9;
  public static readonly CONFIDENCE_THRESHOLD = 0.2;
  public static readonly PERFORMANCE_THRESHOLD = 50;
  public static readonly MAX_ALERTS = 20;
  public static readonly RECENT_EVENTS_LIMIT = 50;
  public static readonly METRICS_DIVISOR = 10;

  private tracker: AnalyticsTracker;
  private healthMonitor: SystemHealthMonitor;
  private reportCallbacks: Array<(_report: Record<string, unknown>) => void> = [];
  private logger: Logger;

  constructor() {
    this.tracker = new AnalyticsTracker();
    this.healthMonitor = new SystemHealthMonitor();
    this.logger = new Logger('AnalyticsEngine');
  }

  /**
   * Track optimization
   */
  trackOptimization(
    config: ResponsiveConfig,
    usageData: ComponentUsageData[],
    result: OptimizationSuggestions,
    duration: number,
    success: boolean
  ): void {
    this.tracker.trackOptimization(config, usageData, result, duration, success);
  }

  /**
   * Track training
   */
  trackTraining(
    trainingDataCount: number,
    metrics: Record<string, unknown>,
    duration: number,
    success: boolean
  ): void {
    this.tracker.trackTraining(trainingDataCount, metrics, duration, success);
  }

  /**
   * Track error
   */
  trackError(error: Error, context: Record<string, unknown>): void {
    this.tracker.trackError(error, context);
  }

  /**
   * Generate comprehensive report
   */
  generateReport(): {
    optimization: OptimizationAnalytics;
    systemHealth: SystemHealth;
    recentEvents: AnalyticsEvent[];
    summary: {
      totalOperations: number;
      successRate: number;
      averagePerformance: number;
      systemStatus: string;
    };
  } {
    const optimization = this.tracker.getOptimizationAnalytics();
    const recentEvents = this.tracker.getRecentEvents(AnalyticsEngine.RECENT_EVENTS_LIMIT);
    
    // Calculate system health
    const memoryStats = { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0, tensorCount: 0, memoryPressure: 'low' as const };
    const performanceMetrics = { cacheHitRate: 0, averageOptimizationTime: 0, memoryEfficiency: 0, throughput: 0, errorRate: 0 };
    const systemHealth = this.healthMonitor.checkHealth(memoryStats, performanceMetrics, optimization.successRate);

    const summary = {
      totalOperations: optimization.totalOptimizations,
      successRate: optimization.successRate,
      averagePerformance: optimization.averageOptimizationTime,
      systemStatus: systemHealth.status
    };

    const report = {
      optimization,
      systemHealth,
      recentEvents,
      summary
    };

    // Notify callbacks
    this.reportCallbacks.forEach(callback => callback(report));

    return report;
  }

  /**
   * Register report callback
   */
  onReport(callback: (_report: Record<string, unknown>) => void): void {
    this.reportCallbacks.push(callback);
  }

  /**
   * Export analytics data
   */
  exportData(): string {
    return JSON.stringify({
      optimization: this.tracker.getOptimizationAnalytics(),
      recentEvents: this.tracker.getRecentEvents(AI_OPTIMIZER_CONSTANTS.ANALYTICS.MAX_METRICS / AnalyticsEngine.METRICS_DIVISOR),
      timestamp: Date.now()
    }, null, 2);
  }

  /**
   * Clear analytics data
   */
  clear(): void {
    this.tracker = new AnalyticsTracker();
    this.healthMonitor = new SystemHealthMonitor();
  }
}
