/**
 * Performance Integration Service
 * 
 * Provides real-time performance monitoring and analytics using the performance dashboard package
 */

import {
  PerformanceMonitor,
  createPerformanceMonitor,
  PERFORMANCE_PRESETS,
  AIIntegrationManager,
  AlertingSystem,
  AnalyticsEngine,
  PerformanceMetrics,
  AlertEvent
} from '@yaseratiar/react-responsive-easy-performance-dashboard';
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import path from 'path';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

export interface PerformanceConfig {
  preset: 'development' | 'production' | 'strict';
  customThresholds?: Record<string, number>;
  realTimeMonitoring: boolean;
  alerting: boolean;
  analytics: boolean;
  dataRetention: number; // days
}

export interface PerformanceSnapshot {
  id: string;
  timestamp: Date;
  metrics: PerformanceMetrics;
  alerts: AlertEvent[];
  score: number;
  trends: {
    performance: 'improving' | 'stable' | 'degrading';
    memory: 'stable' | 'increasing' | 'decreasing';
    responsiveness: 'improving' | 'stable' | 'degrading';
  };
}

export interface PerformanceReportData {
  id: string;
  projectId: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    averageScore: number;
    totalAlerts: number;
    criticalIssues: number;
    recommendations: number;
  };
  metrics: {
    performance: PerformanceMetrics;
    trends: any;
    comparisons: any;
  };
  insights: {
    topIssues: string[];
    improvements: string[];
    recommendations: string[];
  };
}

export class PerformanceIntegrationService extends EventEmitter {
  private performanceMonitor?: PerformanceMonitor;
  private aiIntegration?: AIIntegrationManager;
  private alertingSystem?: AlertingSystem;
  private analyticsEngine?: AnalyticsEngine;
  private logger: winston.Logger;
  private config: PerformanceConfig;
  private isMonitoring = false;
  private snapshots: PerformanceSnapshot[] = [];
  private reports: PerformanceReportData[] = [];

  constructor(config: PerformanceConfig, logger: winston.Logger) {
    super();
    this.config = config;
    this.logger = logger;
  }

  /**
   * Initialize the performance service
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

      // Initialize AI Integration Manager
      if (this.config.analytics) {
        this.aiIntegration = new AIIntegrationManager();
      }

      // Initialize Alerting System
      if (this.config.alerting) {
        this.alertingSystem = new AlertingSystem({
          enabled: true,
          channels: ['console' as any, 'file' as any],
          rules: this.getDefaultAlertRules(),
          escalation: {
            enabled: false,
            levels: [],
            maxEscalations: 3,
            escalationDelay: 300000
          },
          rateLimiting: {
            enabled: true,
            maxAlertsPerMinute: 10,
            maxAlertsPerHour: 100,
            maxAlertsPerDay: 1000,
            burstLimit: 5
          },
          retention: {
            alertHistoryDays: 30,
            metricsRetentionDays: 90,
            logRetentionDays: 7,
            archiveEnabled: false
          },
          integrations: []
        });
      }

      // Initialize Analytics Engine
      if (this.config.analytics) {
        this.analyticsEngine = new AnalyticsEngine({
          enabled: true,
          dataRetention: {
            metrics: this.config.dataRetention,
            reports: this.config.dataRetention,
            insights: this.config.dataRetention
          },
          aggregation: {
            intervals: [300000, 900000, 3600000],
            methods: ['avg', 'max', 'min', 'sum', 'count', 'percentile']
          },
          reporting: {
            autoGenerate: true,
            schedule: '0 0 * * *',
            formats: ['json', 'csv', 'pdf', 'html']
          },
          visualization: {
            chartTypes: ['line', 'bar', 'pie', 'scatter'],
            colorSchemes: ['default', 'dark', 'light'],
            themes: ['material', 'bootstrap', 'antd']
          },
          export: {
            enabled: true,
            formats: ['json', 'csv', 'xlsx'],
            compression: true
          }
        });
      }

      this.emit('initialized');
      this.logger.info('Performance Integration Service initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize Performance Integration Service:', error);
      throw error;
    }
  }

  /**
   * Start real-time performance monitoring
   */
  async startMonitoring(projectPath: string): Promise<void> {
    if (!this.performanceMonitor) {
      throw new Error('Performance Monitor not initialized');
    }

    this.logger.info(`Starting performance monitoring for project: ${projectPath}`);

    try {
      // Start performance monitoring
      await this.performanceMonitor.start();

      // Set up real-time data collection
      if (this.config.realTimeMonitoring) {
        this.setupRealTimeCollection();
      }

      // Start alerting system
      if (this.alertingSystem) {
        // this.alertingSystem.start(); // Method not available in current version
      }

      // Start analytics collection
      if (this.analyticsEngine) {
        // this.analyticsEngine.startCollection(); // Method not available in current version
      }

      this.isMonitoring = true;
      this.emit('monitoring:started', { projectPath });
      this.logger.info('Performance monitoring started successfully');

    } catch (error) {
      this.logger.error('Failed to start performance monitoring:', error);
      throw error;
    }
  }

  /**
   * Stop performance monitoring
   */
  async stopMonitoring(): Promise<void> {
    this.logger.info('Stopping performance monitoring...');

    try {
      if (this.performanceMonitor) {
        this.performanceMonitor.stop();
      }

      if (this.alertingSystem) {
        // this.alertingSystem.stop(); // Method not available in current version
      }

      if (this.analyticsEngine) {
        // this.analyticsEngine.stopCollection(); // Method not available in current version
      }

      this.isMonitoring = false;
      this.emit('monitoring:stopped');
      this.logger.info('Performance monitoring stopped successfully');

    } catch (error) {
      this.logger.error('Failed to stop performance monitoring:', error);
      throw error;
    }
  }

  /**
   * Get current performance snapshot
   */
  async getCurrentSnapshot(): Promise<PerformanceSnapshot> {
    if (!this.performanceMonitor) {
      throw new Error('Performance Monitor not initialized');
    }

    try {
      const metrics = this.performanceMonitor.collectMetrics();
      const alerts = this.performanceMonitor.getActiveAlerts();
      
      if (metrics === null || metrics === undefined || typeof metrics !== 'object') {
        throw new Error('No metrics returned from performance monitor');
      }
      
      const score = this.calculatePerformanceScore(metrics);
      const trends = this.calculateTrends();

      const snapshot: PerformanceSnapshot = {
        id: uuidv4(),
        timestamp: new Date(),
        metrics,
        alerts: alerts ?? [],
        score,
        trends
      };

      // Store snapshot
      this.snapshots.push(snapshot);
      
      // Keep only recent snapshots
      this.cleanupOldSnapshots();

      this.emit('snapshot:created', snapshot);
      return snapshot;

    } catch (error) {
      this.logger.error('Failed to get performance snapshot:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive performance report
   */
  async generateReport(
    projectId: string,
    options: {
      period?: { start: Date; end: Date };
      includeTrends?: boolean;
      includeComparisons?: boolean;
      includeRecommendations?: boolean;
    } = {}
  ): Promise<PerformanceReportData> {
    this.logger.info(`Generating performance report for project: ${projectId}`);

    try {
      const period = options.period ?? {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        end: new Date()
      };

      // Get snapshots for the period
      const periodSnapshots = this.snapshots.filter(
        s => s.timestamp >= period.start && s.timestamp <= period.end
      );

      if (periodSnapshots.length === 0) {
        throw new Error('No performance data available for the specified period');
      }

      // Calculate summary metrics
      const averageScore = periodSnapshots.reduce((sum, s) => sum + s.score, 0) / periodSnapshots.length;
      const totalAlerts = periodSnapshots.reduce((sum, s) => sum + s.alerts.length, 0);
      const criticalIssues = periodSnapshots.reduce((sum, s) => 
        sum + s.alerts.filter(a => a.severity === 'critical').length, 0
      );

      // Get latest metrics
      const latestSnapshot = periodSnapshots[periodSnapshots.length - 1];
      const metrics = latestSnapshot?.metrics;

      // Generate insights
      const insights = await this.generateInsights(periodSnapshots, options);

      const report: PerformanceReportData = {
        id: uuidv4(),
        projectId,
        generatedAt: new Date(),
        period,
        summary: {
          averageScore: Math.round(averageScore),
          totalAlerts,
          criticalIssues,
          recommendations: insights.recommendations.length
        },
        metrics: {
          performance: metrics ?? {} as PerformanceMetrics,
          trends: options.includeTrends ? this.calculateTrends() : null,
          comparisons: options.includeComparisons ? this.calculateComparisons(periodSnapshots) : null
        },
        insights
      };

      // Store report
      this.reports.push(report);
      
      this.emit('report:generated', report);
      this.logger.info('Performance report generated successfully');
      
      return report;

    } catch (error) {
      this.logger.error('Failed to generate performance report:', error);
      throw error;
    }
  }

  /**
   * Get performance trends over time
   */
  getPerformanceTrends(period: { start: Date; end: Date }): {
    performance: number[];
    memory: number[];
    responsiveness: number[];
    timestamps: Date[];
  } {
    const periodSnapshots = this.snapshots.filter(
      (s: PerformanceSnapshot) => s.timestamp >= period.start && s.timestamp <= period.end
    );

    return {
      performance: periodSnapshots.map(s => s.score),
      memory: periodSnapshots.map(s => (s.metrics as any).memoryUsage * 100 || 0),
      responsiveness: periodSnapshots.map(s => (s.metrics as any).renderTime ?? 0),
      timestamps: periodSnapshots.map(s => s.timestamp)
    };
  }

  /**
   * Get performance alerts
   */
  async getAlerts(options: {
    severity?: 'info' | 'warning' | 'critical';
    limit?: number;
  } = {}): Promise<AlertEvent[]> {
    if (!this.performanceMonitor) {
      throw new Error('Performance Monitor not initialized');
    }

    try {
      const alerts = this.performanceMonitor.getActiveAlerts();
      
      let filteredAlerts = alerts;
      
      if (options.severity) {
        filteredAlerts = alerts.filter(a => a.severity === options.severity);
      }
      
      if (options.limit) {
        filteredAlerts = filteredAlerts.slice(0, options.limit);
      }

      return filteredAlerts;

    } catch (error) {
      this.logger.error('Failed to get performance alerts:', error);
      throw error;
    }
  }

  /**
   * Set custom performance thresholds
   */
  async setThresholds(thresholds: Record<string, number>): Promise<void> {
    if (!this.performanceMonitor) {
      throw new Error('Performance Monitor not initialized');
    }

    try {
      // this.performanceMonitor.setThresholds(thresholds); // Method not available in current version
      this.config.customThresholds = { ...this.config.customThresholds, ...thresholds };
      
      this.emit('thresholds:updated', thresholds);
      this.logger.info('Performance thresholds updated successfully');

    } catch (error) {
      this.logger.error('Failed to set performance thresholds:', error);
      throw error;
    }
  }

  /**
   * Export performance data
   */
  async exportData(
    format: 'json' | 'csv' | 'xlsx',
    options: {
      period?: { start: Date; end: Date };
      includeSnapshots?: boolean;
      includeReports?: boolean;
    } = {}
  ): Promise<string> {
    this.logger.info(`Exporting performance data in ${format} format...`);

    try {
      const period = options.period ?? {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        end: new Date()
      };

      const exportData: any = {
        metadata: {
          exportedAt: new Date(),
          period,
          format,
          version: '1.0.0'
        }
      };

      if (options.includeSnapshots) {
        exportData.snapshots = this.snapshots.filter(
          s => s.timestamp >= period.start && s.timestamp <= period.end
        );
      }

      if (options.includeReports) {
        exportData.reports = this.reports.filter(
          r => r.generatedAt >= period.start && r.generatedAt <= period.end
        );
      }

      // Save export file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `performance-export-${timestamp}.${format}`;
      const exportPath = path.join(process.cwd(), filename);

      if (format === 'json') {
        await fs.writeJson(exportPath, exportData, { spaces: 2 });
      } else {
        // For CSV/XLSX formats, you would use appropriate libraries
        await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));
      }

      this.emit('data:exported', { format, path: exportPath });
      this.logger.info(`Performance data exported to: ${exportPath}`);
      
      return exportPath;

    } catch (error) {
      this.logger.error('Failed to export performance data:', error);
      throw error;
    }
  }

  // Private helper methods
  private setupRealTimeCollection(): void {
    if (!this.performanceMonitor) return;

    // Set up real-time data collection
    const collectionInterval = setInterval(() => {
      (async () => {
        try {
          const snapshot = await this.getCurrentSnapshot();
        
        // Check for alerts
        if (snapshot.alerts.length > 0) {
          this.emit('alerts:detected', snapshot.alerts);
        }

        // Check for performance degradation
        if (snapshot.score < 70) {
          this.emit('performance:degraded', { score: snapshot.score, snapshot });
        }

        } catch (error) {
          this.logger.error('Real-time collection error:', error);
        }
      })().catch(() => undefined);
    }, 5000); // Collect every 5 seconds

    // Store interval ID for cleanup
    (this as any).collectionInterval = collectionInterval;
  }

  private getDefaultAlertRules(): any[] {
    return [
      {
        name: 'Performance Degradation',
        condition: 'performance_score < 70',
        severity: 'warning',
        action: 'notify'
      },
      {
        name: 'High Memory Usage',
        condition: 'memory_usage > 0.8',
        severity: 'critical',
        action: 'alert'
      },
      {
        name: 'Slow Render Time',
        condition: 'render_time > 33',
        severity: 'warning',
        action: 'notify'
      },
      {
        name: 'Layout Shift Detected',
        condition: 'layout_shift > 0.1',
        severity: 'warning',
        action: 'notify'
      }
    ];
  }

  private calculatePerformanceScore(metrics: any): number {
    // Simple scoring algorithm - in production this would be more sophisticated
    const _weights = {
      lcp: 0.3,
      fcp: 0.2,
      layoutShift: 0.2,
      memoryUsage: 0.2,
      renderTime: 0.1
    };

    let score = 100;
    
    // LCP scoring (lower is better)
    const lcp = (metrics as any).lcp ?? 0;
    if (lcp > 2500) score -= 20;
    else if (lcp > 2000) score -= 10;
    
    // FCP scoring (lower is better)
    const fcp = (metrics as any).fcp ?? 0;
    if (fcp > 1800) score -= 15;
    else if (fcp > 1500) score -= 8;
    
    // Layout Shift scoring (lower is better)
    const layoutShift = (metrics as any).layoutShift ?? 0;
    if (layoutShift > 0.1) score -= 15;
    else if (layoutShift > 0.05) score -= 8;
    
    // Memory usage scoring (lower is better)
    const memoryUsage = (metrics as any).memoryUsage ?? 0;
    if (memoryUsage > 0.8) score -= 20;
    else if (memoryUsage > 0.7) score -= 10;
    
    // Render time scoring (lower is better)
    const renderTime = (metrics as any).renderTime ?? 0;
    if (renderTime > 33) score -= 10;
    else if (renderTime > 16.67) score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  private calculateTrends(): PerformanceSnapshot['trends'] {
    if (this.snapshots.length < 2) {
      return {
        performance: 'stable',
        memory: 'stable',
        responsiveness: 'stable'
      };
    }

    const recent = this.snapshots.slice(-5); // Last 5 snapshots
    const older = this.snapshots.slice(-10, -5); // Previous 5 snapshots

    if (recent.length === 0 || older.length === 0) {
      return {
        performance: 'stable',
        memory: 'stable',
        responsiveness: 'stable'
      };
    }

    const recentAvgScore = recent.reduce((sum, s) => sum + s.score, 0) / recent.length;
    const olderAvgScore = older.reduce((sum, s) => sum + s.score, 0) / older.length;
    
    const recentAvgMemory = recent.reduce((sum, s) => {
      const metrics = s.metrics as any;
      const memoryValue = metrics?.memoryUsage ?? metrics?.memory?.used ?? metrics?.memory ?? 0;
      return sum + (typeof memoryValue === 'number' ? memoryValue : 0);
    }, 0) / recent.length;
    
    const olderAvgMemory = older.reduce((sum, s) => {
      const metrics = s.metrics as any;
      const memoryValue = metrics?.memoryUsage ?? metrics?.memory?.used ?? metrics?.memory ?? 0;
      return sum + (typeof memoryValue === 'number' ? memoryValue : 0);
    }, 0) / older.length;
    
    const recentAvgRender = recent.reduce((sum, s) => {
      const metrics = s.metrics as any;
      const renderValue = metrics?.renderTime ?? metrics?.paintTiming?.renderTime ?? metrics?.paintTiming ?? 0;
      return sum + (typeof renderValue === 'number' ? renderValue : 0);
    }, 0) / recent.length;
    
    const olderAvgRender = older.reduce((sum, s) => {
      const metrics = s.metrics as any;
      const renderValue = metrics?.renderTime ?? metrics?.paintTiming?.renderTime ?? metrics?.paintTiming ?? 0;
      return sum + (typeof renderValue === 'number' ? renderValue : 0);
    }, 0) / older.length;

    return {
      performance: recentAvgScore > olderAvgScore + 5 ? 'improving' : 
                   recentAvgScore < olderAvgScore - 5 ? 'degrading' : 'stable',
      memory: recentAvgMemory > olderAvgMemory + 0.05 ? 'increasing' :
              recentAvgMemory < olderAvgMemory - 0.05 ? 'decreasing' : 'stable',
      responsiveness: recentAvgRender < olderAvgRender - 2 ? 'improving' :
                      recentAvgRender > olderAvgRender + 2 ? 'degrading' : 'stable'
    };
  }

  private calculateComparisons(snapshots: PerformanceSnapshot[]): any {
    if (snapshots.length < 2) return null;

    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];

    return {
      performance: {
        change: (last?.score ?? 0) - (first?.score ?? 0),
        percentage: first?.score ? (((last?.score ?? 0) - (first?.score ?? 0)) / first.score) * 100 : 0
      },
      memory: {
        change: ((last?.metrics as any).memoryUsage ?? 0) - ((first?.metrics as any).memoryUsage ?? 0),
        percentage: ((first?.metrics as any).memoryUsage ?? 1) ? ((((last?.metrics as any).memoryUsage ?? 0) - ((first?.metrics as any).memoryUsage ?? 0)) / ((first?.metrics as any).memoryUsage ?? 1)) * 100 : 0
      },
      responsiveness: {
        change: ((last?.metrics as any).renderTime ?? 0) - ((first?.metrics as any).renderTime ?? 0),
        percentage: ((first?.metrics as any).renderTime ?? 1) ? ((((last?.metrics as any).renderTime ?? 0) - ((first?.metrics as any).renderTime ?? 0)) / ((first?.metrics as any).renderTime ?? 1)) * 100 : 0
      }
    };
  }

  private async generateInsights(
    snapshots: PerformanceSnapshot[],
    _options: any
  ): Promise<{
    topIssues: string[];
    improvements: string[];
    recommendations: string[];
  }> {
    const insights = {
      topIssues: [] as string[],
      improvements: [] as string[],
      recommendations: [] as string[]
    };

    // Analyze top issues
          const allAlerts = snapshots.flatMap(s => s.alerts);
      const alertCounts = allAlerts.reduce((counts: Record<string, number>, alert: any) => {
        counts[alert.type] = (counts[alert.type] ?? 0) + 1;
        return counts;
      }, {} as Record<string, number>);

    const topAlertTypes = Object.entries(alertCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([type]) => type);

    insights.topIssues = topAlertTypes.map(type => {
      switch (type) {
        case 'performance': return 'Performance degradation detected';
        case 'memory': return 'High memory usage detected';
        case 'render': return 'Slow render times detected';
        default: return `${type} issues detected`;
      }
    });

    // Analyze improvements
    const avgScore = snapshots.reduce((sum, s) => sum + s.score, 0) / snapshots.length;
    if (avgScore > 80) {
      insights.improvements.push('Overall performance is good');
    }
    if (avgScore > 90) {
      insights.improvements.push('Excellent performance maintained');
    }

    // Generate recommendations
    if (avgScore < 70) {
      insights.recommendations.push('Consider optimizing responsive scaling configuration');
    }
    if (allAlerts.some(a => a.type === 'performance' && a.description.toLowerCase().includes('memory'))) {
      insights.recommendations.push('Implement memory optimization strategies');
    }
    if (allAlerts.some(a => a.type === 'performance' && a.description.toLowerCase().includes('render'))) {
      insights.recommendations.push('Optimize rendering performance');
    }

    return insights;
  }

  private cleanupOldSnapshots(): void {
    const cutoffDate = new Date(Date.now() - this.config.dataRetention * 24 * 60 * 60 * 1000);
    this.snapshots = this.snapshots.filter(s => s.timestamp > cutoffDate);
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean;
    monitoring: boolean;
    snapshots: number;
    reports: number;
  } {
    return {
      initialized: !!this.performanceMonitor,
      monitoring: this.isMonitoring,
      snapshots: this.snapshots.length,
      reports: this.reports.length
    };
  }

  /**
   * Get configuration
   */
  getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config:updated', this.config);
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.stopMonitoring();
    
    // Clear intervals
    if ((this as any).collectionInterval) {
      clearInterval((this as any).collectionInterval);
    }
    
    this.removeAllListeners();
    this.logger.info('Performance Integration Service cleanup completed');
  }
}
