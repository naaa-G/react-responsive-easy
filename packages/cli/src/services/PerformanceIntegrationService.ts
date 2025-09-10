/**
 * Performance Integration Service
 * 
 * Provides real-time performance monitoring and analytics using independent performance monitoring
 * with optional integration to the performance dashboard package when available.
 */

import {
  PerformanceMonitor,
  createPerformanceMonitor,
  PERFORMANCE_PRESETS,
  type PerformanceConfig,
  type PerformanceMetrics,
  type PerformanceAlert
} from '../core/PerformanceMonitor';
import { 
  PerformanceDashboardIntegrationManager,
  createPerformanceDashboardIntegration,
  isPerformanceDashboardAvailable
} from '../integrations/PerformanceDashboardIntegration';
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import path from 'path';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

export interface PerformanceSnapshot {
  timestamp: number;
  metrics: PerformanceMetrics;
}

export interface PerformanceReportData {
  id: string;
  timestamp: number;
  metrics: PerformanceMetrics;
  alerts: PerformanceAlert[];
  summary: {
    totalAlerts: number;
    criticalAlerts: number;
    averagePerformance: number;
    recommendations: string[];
  };
}

export interface PerformanceIntegrationConfig {
  preset: 'development' | 'production' | 'strict';
  customThresholds?: Partial<PerformanceConfig['thresholds']>;
  realTimeMonitoring?: boolean;
  analytics?: boolean;
  alerting?: boolean;
  reportGeneration?: boolean;
  dataRetention?: number;
}

export interface PerformanceInsights {
  topIssues: string[];
  improvements: string[];
  recommendations: string[];
}

export class PerformanceIntegrationService extends EventEmitter {
  private performanceMonitor?: PerformanceMonitor;
  private performanceDashboardIntegration?: PerformanceDashboardIntegrationManager;
  private logger: winston.Logger;
  private config: PerformanceIntegrationConfig;
  private isMonitoring = false;
  private snapshots: PerformanceSnapshot[] = [];
  private reports: PerformanceReportData[] = [];

  constructor(config: PerformanceIntegrationConfig) {
    super();
    
    this.config = {
      realTimeMonitoring: false,
      analytics: false,
      alerting: false,
      reportGeneration: false,
      dataRetention: 30,
      ...config,
      preset: config.preset || 'production'
    };

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
  }

  /**
   * Initialize the performance integration service
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Performance Integration Service...');

      // Initialize Performance Monitor
      const preset = PERFORMANCE_PRESETS[this.config.preset];
      this.performanceMonitor = createPerformanceMonitor({
        ...preset,
        ...this.config.customThresholds,
        collectionInterval: this.config.realTimeMonitoring ? 1000 : 5000
      });

      // Initialize Optional Performance Dashboard Integration
      if (isPerformanceDashboardAvailable()) {
        this.logger.info('Initializing Performance Dashboard Integration...');
        this.performanceDashboardIntegration = createPerformanceDashboardIntegration();
        const initialized = await this.performanceDashboardIntegration.initialize();
        
        if (initialized) {
          this.logger.info('Performance Dashboard Integration initialized successfully');
          const features = this.performanceDashboardIntegration.getAdvancedFeatures();
          this.logger.info(`Available advanced features: ${features.join(', ')}`);
        } else {
          this.logger.warn('Performance Dashboard Integration not available');
        }
      }

      this.logger.info('Performance Integration Service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Performance Integration Service:', error);
      throw error;
    }
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (!this.performanceMonitor) {
      throw new Error('Performance Integration Service not initialized');
    }

    if (this.isMonitoring) {
      this.logger.warn('Performance monitoring is already running');
      return;
    }

    this.performanceMonitor.start();
    this.isMonitoring = true;
    this.logger.info('Performance monitoring started');

    // Set up event listeners
    this.performanceMonitor.on('metrics', (data: unknown) => {
      this.handleMetricsUpdate(data as PerformanceMetrics);
    });

    this.performanceMonitor.on('alerts', (data: unknown) => {
      this.handleAlerts(data as PerformanceAlert[]);
    });
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.performanceMonitor || !this.isMonitoring) {
      return;
    }

    this.performanceMonitor.stop();
    this.isMonitoring = false;
    this.logger.info('Performance monitoring stopped');
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics | null {
    return this.performanceMonitor?.getMetrics() || null;
  }

  /**
   * Get performance history
   */
  getHistory(): PerformanceSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return this.performanceMonitor?.getActiveAlerts() || [];
  }

  /**
   * Generate performance report
   */
  async generateReport(options: {
    severity?: 'info' | 'warning' | 'critical';
    limit?: number;
    includeAdvanced?: boolean;
  } = {}): Promise<PerformanceReportData> {
    if (!this.performanceMonitor) {
      throw new Error('Performance Integration Service not initialized');
    }

    const metrics = this.performanceMonitor.getMetrics();
    const alerts = this.performanceMonitor.getActiveAlerts();
    
    let filteredAlerts = alerts;
    
    if (options.severity) {
      filteredAlerts = alerts.filter((a: PerformanceAlert) => a.severity === options.severity);
    }
    
    if (options.limit) {
      filteredAlerts = filteredAlerts.slice(0, options.limit);
    }

    const insights = await this.generateInsights(this.snapshots, options);

    const report: PerformanceReportData = {
      id: uuidv4(),
      timestamp: Date.now(),
      metrics,
      alerts: filteredAlerts,
      summary: {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        averagePerformance: this.calculateAveragePerformance(),
        recommendations: insights.recommendations
      }
    };

    this.reports.push(report);
    this.emit('reportGenerated', report);

    return report;
  }

  /**
   * Export performance data
   */
  async exportData(format: 'json' | 'csv' = 'json', filePath?: string): Promise<string> {
    const data = {
      snapshots: this.snapshots,
      reports: this.reports,
      metrics: this.getMetrics(),
      alerts: this.getActiveAlerts(),
      generatedAt: new Date().toISOString()
    };

    const exportPath = filePath || path.join(process.cwd(), `performance-data-${Date.now()}.${format}`);

    if (format === 'json') {
      await fs.writeJson(exportPath, data, { spaces: 2 });
    } else if (format === 'csv') {
      const csvData = this.convertToCSV(data);
      await fs.writeFile(exportPath, csvData);
    }

    this.logger.info(`Performance data exported to: ${exportPath}`);
    return exportPath;
  }

  /**
   * Handle metrics update
   */
  private handleMetricsUpdate(metrics: PerformanceMetrics): void {
    const snapshot: PerformanceSnapshot = {
      timestamp: Date.now(),
      metrics
    };

    this.snapshots.push(snapshot);

    // Maintain data retention
    if (this.config.dataRetention) {
      const cutoffTime = Date.now() - (this.config.dataRetention * 24 * 60 * 60 * 1000);
      this.snapshots = this.snapshots.filter(s => s.timestamp > cutoffTime);
    }

    this.emit('metricsUpdate', snapshot);
  }

  /**
   * Handle performance alerts
   */
  private handleAlerts(alerts: PerformanceAlert[]): void {
    alerts.forEach(alert => {
      this.logger.warn(`Performance Alert: ${alert.message}`, {
        type: alert.type,
        severity: alert.severity,
        value: alert.value,
        threshold: alert.threshold
      });
    });

    this.emit('alerts', alerts);
  }

  /**
   * Generate performance insights
   */
  private async generateInsights(
    snapshots: PerformanceSnapshot[],
    _options: any
  ): Promise<PerformanceInsights> {
    const insights: PerformanceInsights = {
      topIssues: [],
      improvements: [],
      recommendations: []
    };

    if (snapshots.length === 0) {
      return insights;
    }

    // Analyze performance trends
    const recentSnapshots = snapshots.slice(-10);
    const avgLCP = this.calculateAverage(recentSnapshots, 'lcp');
    const avgFCP = this.calculateAverage(recentSnapshots, 'fcp');
    const avgLayoutShift = this.calculateAverage(recentSnapshots, 'layoutShift');

    // Generate insights based on metrics
    if (avgLCP && avgLCP > 2500) {
      insights.topIssues.push('Large Contentful Paint is too slow');
      insights.recommendations.push('Optimize images and reduce render-blocking resources');
    }

    if (avgFCP && avgFCP > 1800) {
      insights.topIssues.push('First Contentful Paint is too slow');
      insights.recommendations.push('Optimize critical rendering path');
    }

    if (avgLayoutShift && avgLayoutShift > 0.1) {
      insights.topIssues.push('Cumulative Layout Shift is too high');
      insights.recommendations.push('Add size attributes to images and avoid dynamic content insertion');
    }

    // Add advanced insights if dashboard integration is available
    if (this.performanceDashboardIntegration?.isAvailable) {
      try {
        const advancedMetrics = await this.performanceDashboardIntegration.getAdvancedMetrics();
        if (advancedMetrics?.aiInsights) {
          insights.recommendations.push('AI-powered optimization suggestions available');
        }
      } catch (error) {
        this.logger.warn('Failed to get advanced insights:', error);
      }
    }

    return insights;
  }

  /**
   * Calculate average performance score
   */
  private calculateAveragePerformance(): number {
    if (this.snapshots.length === 0) return 0;

    const recentSnapshots = this.snapshots.slice(-10);
    let totalScore = 0;
    let validMetrics = 0;

    recentSnapshots.forEach(snapshot => {
      const metrics = snapshot.metrics;
      let score = 100;

      // Deduct points for poor performance
      if (metrics.lcp && metrics.lcp > 2500) score -= 20;
      if (metrics.fcp && metrics.fcp > 1800) score -= 15;
      if (metrics.layoutShift && metrics.layoutShift > 0.1) score -= 25;
      if (metrics.memoryUsage && metrics.memoryUsage > 0.8) score -= 10;

      totalScore += Math.max(0, score);
      validMetrics++;
    });

    return validMetrics > 0 ? totalScore / validMetrics : 0;
  }

  /**
   * Calculate average for a specific metric
   */
  private calculateAverage(snapshots: PerformanceSnapshot[], metric: keyof PerformanceMetrics): number | null {
    const values = snapshots
      .map(s => s.metrics[metric])
      .filter(v => v !== undefined && v !== null) as number[];

    if (values.length === 0) return null;

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any): string {
    const headers = ['timestamp', 'lcp', 'fcp', 'layoutShift', 'memoryUsage', 'renderTime', 'cacheHitRate'];
    const rows = [headers.join(',')];

    data.snapshots.forEach((snapshot: PerformanceSnapshot) => {
      const row = headers.map(header => {
        if (header === 'timestamp') {
          return new Date(snapshot.timestamp).toISOString();
        }
        return snapshot.metrics[header as keyof PerformanceMetrics] || '';
      });
      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  /**
   * Get performance dashboard URL (if available)
   */
  getDashboardUrl(): string | null {
    return this.performanceDashboardIntegration?.getDashboardUrl() || null;
  }

  /**
   * Check if advanced features are available
   */
  hasAdvancedFeatures(): boolean {
    return this.performanceDashboardIntegration?.isAvailable || false;
  }

  /**
   * Get available advanced features
   */
  getAdvancedFeatures(): string[] {
    return this.performanceDashboardIntegration?.getAdvancedFeatures() || [];
  }
}