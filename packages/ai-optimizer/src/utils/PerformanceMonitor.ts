import { EventEmitter } from 'events';
import { AI_OPTIMIZER_CONSTANTS, type ModelPerformanceMetrics as BaseModelPerformanceMetrics } from '../constants.js';
import { Logger } from './Logger.js';

export type ModelPerformanceMetrics = BaseModelPerformanceMetrics;

export interface PerformanceAlert {
  type: 'performance_degradation' | 'memory_usage' | 'prediction_time' | 'accuracy_drop';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  metrics: ModelPerformanceMetrics;
  threshold: number;
  currentValue: number;
}

export interface PerformanceThresholds {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mse: number;
  predictionTime: number;
  memoryUsage: number;
}

export interface PerformanceReport {
  modelName: string;
  metrics: ModelPerformanceMetrics;
  alerts: PerformanceAlert[];
  trends: {
    accuracy: 'improving' | 'degrading' | 'stable';
    performance: 'improving' | 'degrading' | 'stable';
    memory: 'increasing' | 'decreasing' | 'stable';
  };
  recommendations: string[];
  timestamp: number;
}

/**
 * Monitors model performance and generates alerts
 */
export class PerformanceMonitor extends EventEmitter {
  private logger: Logger;
  private thresholds: PerformanceThresholds;
  private performanceHistory: Map<string, ModelPerformanceMetrics[]> = new Map();
  private alerts: PerformanceAlert[] = [];
  private isMonitoring = false;

  constructor(thresholds?: Partial<PerformanceThresholds>) {
    super();
    this.logger = new Logger('PerformanceMonitor');
    
    this.thresholds = {
      accuracy: AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD,
      precision: AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD,
      recall: AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD,
      f1Score: AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.EXCELLENT_THRESHOLD,
      mse: AI_OPTIMIZER_CONSTANTS.PERFORMANCE_THRESHOLDS.WARNING_THRESHOLD,
      predictionTime: 1000, // 1 second
      memoryUsage: 0.8, // 80%
      ...thresholds
    };
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    this.logger.info('Starting performance monitoring');
    this.isMonitoring = true;
    this.emit('monitoringStarted');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.logger.info('Stopping performance monitoring');
    this.isMonitoring = false;
    this.emit('monitoringStopped');
  }

  /**
   * Record performance metrics for a model
   */
  recordMetrics(modelName: string, metrics: ModelPerformanceMetrics): void {
    if (!this.isMonitoring) {
      return;
    }

    // Store metrics in history
    if (!this.performanceHistory.has(modelName)) {
      this.performanceHistory.set(modelName, []);
    }
    
    const history = this.performanceHistory.get(modelName)!;
    history.push({ ...metrics, lastUpdated: Date.now() });
    
    // Keep only recent history (last 100 entries)
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }

    // Check for performance issues
    this.checkPerformanceIssues(modelName, metrics);

    this.emit('metricsRecorded', { modelName, metrics });
  }

  /**
   * Check for performance issues and generate alerts
   */
  private checkPerformanceIssues(modelName: string, metrics: ModelPerformanceMetrics): void {
    const alerts: PerformanceAlert[] = [];

    // Check accuracy
    if (metrics.accuracy < this.thresholds.accuracy) {
      alerts.push({
        type: 'accuracy_drop',
        severity: this.getSeverity(metrics.accuracy, this.thresholds.accuracy),
        message: `Accuracy dropped below threshold: ${(metrics.accuracy * 100).toFixed(1)}% < ${(this.thresholds.accuracy * 100).toFixed(1)}%`,
        timestamp: Date.now(),
        metrics,
        threshold: this.thresholds.accuracy,
        currentValue: metrics.accuracy
      });
    }

    // Check prediction time
    if (metrics.predictionTime > this.thresholds.predictionTime) {
      alerts.push({
        type: 'prediction_time',
        severity: this.getSeverity(metrics.predictionTime, this.thresholds.predictionTime, true),
        message: `Prediction time exceeded threshold: ${metrics.predictionTime}ms > ${this.thresholds.predictionTime}ms`,
        timestamp: Date.now(),
        metrics,
        threshold: this.thresholds.predictionTime,
        currentValue: metrics.predictionTime
      });
    }

    // Check for performance degradation trend
    const trendAlert = this.checkPerformanceTrend(modelName, metrics);
    if (trendAlert) {
      alerts.push(trendAlert);
    }

    // Add alerts to history
    this.alerts.push(...alerts);
    
    // Emit alerts
    alerts.forEach(alert => {
      this.emit('performanceAlert', { modelName, alert });
    });
  }

  /**
   * Check for performance degradation trends
   */
  private checkPerformanceTrend(modelName: string, currentMetrics: ModelPerformanceMetrics): PerformanceAlert | null {
    const history = this.performanceHistory.get(modelName);
    if (!history || history.length < 3) {
      return null;
    }

    const RECENT_METRICS_COUNT = 3;
    const recentMetrics = history.slice(-RECENT_METRICS_COUNT);
    const trend = this.calculateTrend(recentMetrics, 'accuracy');
    
    const DEGRADATION_THRESHOLD = -0.1; // 10% decrease
    if (trend < DEGRADATION_THRESHOLD) {
      return {
        type: 'performance_degradation',
        severity: 'medium',
        message: `Performance degradation detected: accuracy decreased by ${(Math.abs(trend) * 100).toFixed(1)}% over recent measurements`,
        timestamp: Date.now(),
        metrics: currentMetrics,
        threshold: 0.1,
        currentValue: Math.abs(trend)
      };
    }

    return null;
  }

  /**
   * Calculate performance trend
   */
  private calculateTrend(metrics: ModelPerformanceMetrics[], metric: keyof ModelPerformanceMetrics): number {
    if (metrics.length < 2) return 0;
    
    const values = metrics.map(m => m[metric] as number);
    const first = values[0];
    const last = values[values.length - 1];
    
    return first === 0 ? 0 : (last - first) / first;
  }

  /**
   * Get alert severity based on threshold comparison
   */
  private getSeverity(current: number, threshold: number, higherIsWorse = false): 'low' | 'medium' | 'high' | 'critical' {
    const ratio = higherIsWorse ? current / threshold : threshold / current;
    
    const CRITICAL_THRESHOLD = 2;
    const HIGH_THRESHOLD = 1.5;
    const MEDIUM_THRESHOLD = 1.2;
    
    if (ratio > CRITICAL_THRESHOLD) return 'critical';
    if (ratio > HIGH_THRESHOLD) return 'high';
    if (ratio > MEDIUM_THRESHOLD) return 'medium';
    return 'low';
  }

  /**
   * Generate performance report for a model
   */
  generateReport(modelName: string): PerformanceReport | null {
    const history = this.performanceHistory.get(modelName);
    if (!history || history.length === 0) {
      return null;
    }

    const latestMetrics = history[history.length - 1];
    const modelAlerts = this.alerts.filter(alert => 
      alert.metrics === latestMetrics || 
      (Date.now() - alert.timestamp) < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    const trends = this.calculateTrends(history);
    const recommendations = this.generateRecommendations(latestMetrics, trends, modelAlerts);

    return {
      modelName,
      metrics: latestMetrics,
      alerts: modelAlerts,
      trends,
      recommendations,
      timestamp: Date.now()
    };
  }

  /**
   * Calculate performance trends
   */
  private calculateTrends(history: ModelPerformanceMetrics[]): {
    accuracy: 'improving' | 'degrading' | 'stable';
    performance: 'improving' | 'degrading' | 'stable';
    memory: 'increasing' | 'decreasing' | 'stable';
  } {
    if (history.length < 2) {
      return {
        accuracy: 'stable',
        performance: 'stable',
        memory: 'stable'
      };
    }

    const accuracyTrend = this.calculateTrend(history, 'accuracy');
    const performanceTrend = this.calculateTrend(history, 'f1Score');
    const memoryTrend = this.calculateTrend(history, 'predictionTime');

    return {
      accuracy: this.getTrendDirection(accuracyTrend),
      performance: this.getTrendDirection(performanceTrend),
      memory: this.getTrendDirection(memoryTrend, true) as 'increasing' | 'decreasing' | 'stable' // Higher is worse for memory
    };
  }

  /**
   * Get trend direction
   */
  private getTrendDirection(trend: number, higherIsWorse = false): 'improving' | 'degrading' | 'stable' {
    const threshold = 0.05; // 5% change threshold
    
    if (higherIsWorse) {
      if (trend > threshold) return 'degrading';
      if (trend < -threshold) return 'improving';
    } else {
      if (trend > threshold) return 'improving';
      if (trend < -threshold) return 'degrading';
    }
    
    return 'stable';
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    metrics: ModelPerformanceMetrics,
    trends: {
      accuracy: 'improving' | 'degrading' | 'stable';
      performance: 'improving' | 'degrading' | 'stable';
      memory: 'increasing' | 'decreasing' | 'stable';
    },
    alerts: PerformanceAlert[]
  ): string[] {
    const recommendations: string[] = [];

    // Accuracy recommendations
    if (metrics.accuracy < this.thresholds.accuracy) {
      recommendations.push('Consider retraining the model with more diverse data');
      recommendations.push('Review feature engineering and data preprocessing steps');
    }

    // Performance trend recommendations
    if (trends.accuracy === 'degrading') {
      recommendations.push('Monitor data drift and consider model retraining');
      recommendations.push('Check for changes in input data distribution');
    }

    // Memory recommendations
    if (trends.memory === 'increasing') {
      recommendations.push('Consider model optimization or pruning');
      recommendations.push('Monitor memory usage and implement cleanup strategies');
    }

    // Alert-based recommendations
    const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push('Immediate attention required: Critical performance issues detected');
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Model performance is within acceptable ranges');
      recommendations.push('Continue monitoring for any changes');
    }

    return recommendations;
  }

  /**
   * Get performance thresholds
   */
  getThresholds(): PerformanceThresholds {
    return { ...this.thresholds };
  }

  /**
   * Update performance thresholds
   */
  updateThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Get performance history for a model
   */
  getPerformanceHistory(modelName: string): ModelPerformanceMetrics[] {
    return this.performanceHistory.get(modelName) ?? [];
  }

  /**
   * Get all alerts
   */
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * Clear old alerts
   */
  clearOldAlerts(olderThanHours = 24): void {
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime);
  }

  /**
   * Get monitoring status
   */
  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  /**
   * Get performance statistics
   */
  getStatistics(): {
    totalModels: number;
    totalAlerts: number;
    criticalAlerts: number;
    averageAccuracy: number;
    monitoringActive: boolean;
  } {
    const totalModels = this.performanceHistory.size;
    const totalAlerts = this.alerts.length;
    const criticalAlerts = this.alerts.filter(alert => alert.severity === 'critical').length;
    
    // Calculate average accuracy across all models
    let totalAccuracy = 0;
    let modelCount = 0;
    
    for (const history of this.performanceHistory.values()) {
      if (history.length > 0) {
        const latest = history[history.length - 1];
        totalAccuracy += latest.accuracy;
        modelCount++;
      }
    }
    
    const averageAccuracy = modelCount > 0 ? totalAccuracy / modelCount : 0;

    return {
      totalModels,
      totalAlerts,
      criticalAlerts,
      averageAccuracy,
      monitoringActive: this.isMonitoring
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Map<string, unknown> {
    const metrics = new Map<string, unknown>();
    
    for (const [modelName, history] of this.performanceHistory.entries()) {
      if (history.length > 0) {
        const latest = history[history.length - 1];
        metrics.set(modelName, {
          accuracy: latest.accuracy,
          precision: latest.precision,
          recall: latest.recall,
          f1Score: latest.f1Score,
          auc: latest.auc,
          predictionTime: latest.predictionTime,
          memoryUsage: (latest as ModelPerformanceMetrics & { memoryUsage?: number }).memoryUsage ?? 0,
          timestamp: (latest as ModelPerformanceMetrics & { timestamp?: number }).timestamp ?? Date.now()
        });
      }
    }
    
    return metrics;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.stopMonitoring();
    this.performanceHistory.clear();
    this.alerts = [];
  }
}
