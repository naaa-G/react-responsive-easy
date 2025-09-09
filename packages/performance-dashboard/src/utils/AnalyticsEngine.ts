/**
 * Advanced Analytics Engine for Performance Dashboard
 * 
 * Provides comprehensive analytics, reporting, and data visualization
 * capabilities for enterprise-grade performance monitoring.
 */

import type { 
  PerformanceSnapshot, 
  PerformanceTrends,
  PerformanceReport 
} from '../core/PerformanceMonitor';
import type { AIInsight, AIPrediction } from './AIIntegration';
import type { AlertEvent } from './AlertingSystem';

export interface AnalyticsConfig {
  enabled: boolean;
  dataRetention: {
    metrics: number; // days
    reports: number; // days
    insights: number; // days
  };
  aggregation: {
    intervals: number[]; // minutes
    methods: ('avg' | 'max' | 'min' | 'sum' | 'count' | 'percentile')[];
  };
  reporting: {
    autoGenerate: boolean;
    schedule: string; // cron expression
    formats: ('json' | 'csv' | 'pdf' | 'html')[];
  };
  visualization: {
    chartTypes: string[];
    colorSchemes: string[];
    themes: string[];
  };
  export: {
    enabled: boolean;
    formats: string[];
    compression: boolean;
  };
}

export interface AnalyticsData {
  metrics: AggregatedMetrics;
  trends: PerformanceTrends;
  insights: AIInsight[];
  predictions: AIPrediction[];
  alerts: AlertEvent[];
  reports: PerformanceReport[];
  metadata: AnalyticsMetadata;
}

export interface AggregatedMetrics {
  timestamp: number;
  interval: number; // minutes
  layoutShift: MetricAggregation;
  memory: MetricAggregation;
  lcp: MetricAggregation;
  fcp: MetricAggregation;
  responsiveElements: MetricAggregation;
  resources: ResourceAggregation;
  custom: CustomMetricAggregation;
}

export interface MetricAggregation {
  avg: number;
  max: number;
  min: number;
  count: number;
  percentiles: {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
  trend: 'increasing' | 'decreasing' | 'stable';
  variance: number;
  outliers: number[];
}

export interface ResourceAggregation {
  totalRequests: number;
  averageLoadTime: MetricAggregation;
  totalSize: number;
  slowRequests: number;
  errorRate: number;
  cacheHitRate: number;
}

export interface CustomMetricAggregation {
  scalingOperations: MetricAggregation;
  scalingTime: MetricAggregation;
  cacheHitRate: MetricAggregation;
  configComplexity: MetricAggregation;
  breakpointTransitions: MetricAggregation;
}

export interface AnalyticsMetadata {
  dataPoints: number;
  timeRange: {
    start: number;
    end: number;
  };
  quality: {
    completeness: number;
    accuracy: number;
    reliability: number;
  };
  sources: string[];
  version: string;
}

export interface PerformanceBenchmark {
  name: string;
  category: 'core-web-vitals' | 'custom' | 'ai-optimized';
  metrics: {
    layoutShift: number;
    lcp: number;
    fcp: number;
    memory: number;
  };
  score: number;
  percentile: number;
  industry: string;
  timestamp: number;
}

export interface ComparativeAnalysis {
  baseline: PerformanceBenchmark;
  current: PerformanceBenchmark;
  improvement: {
    layoutShift: number;
    lcp: number;
    fcp: number;
    memory: number;
    overall: number;
  };
  recommendations: string[];
  confidence: number;
}

export interface PerformanceCorrelation {
  metric1: string;
  metric2: string;
  correlation: number;
  significance: number;
  description: string;
  actionable: boolean;
}

export interface AnomalyDetection {
  type: 'spike' | 'drop' | 'pattern' | 'outlier';
  metric: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
  timestamp: number;
  duration: number;
  impact: number;
  suggestedActions: string[];
}

export interface PerformanceForecast {
  metric: string;
  currentValue: number;
  predictions: Array<{
    timestamp: number;
    value: number;
    confidence: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: boolean;
  volatility: number;
  accuracy: number;
}

export interface AnalyticsReport {
  id: string;
  title: string;
  type: 'summary' | 'detailed' | 'comparative' | 'forecast' | 'custom';
  generatedAt: number;
  timeRange: {
    start: number;
    end: number;
  };
  data: AnalyticsData;
  insights: AIInsight[];
  recommendations: string[];
  benchmarks: PerformanceBenchmark[];
  correlations: PerformanceCorrelation[];
  anomalies: AnomalyDetection[];
  forecasts: PerformanceForecast[];
  metadata: AnalyticsMetadata;
}

export class AnalyticsEngine {
  private config: AnalyticsConfig;
  private data: Map<string, AnalyticsData> = new Map();
  private reports: Map<string, AnalyticsReport> = new Map();
  private benchmarks: Map<string, PerformanceBenchmark> = new Map();
  private correlations: PerformanceCorrelation[] = [];
  private anomalies: AnomalyDetection[] = [];
  private forecasts: Map<string, PerformanceForecast> = new Map();
  private isInitialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initializeEngine();
  }

  /**
   * Initialize the analytics engine
   */
  private initializeEngine(): void {
    this.loadDefaultBenchmarks();
    this.initializeCorrelations();
    this.isInitialized = true;
    // Analytics Engine initialized
  }

  /**
   * Process performance data for analytics
   */
  processData(
    snapshots: PerformanceSnapshot[],
    insights: AIInsight[] = [],
    predictions: AIPrediction[] = [],
    alerts: AlertEvent[] = []
  ): AnalyticsData {
    if (!this.config.enabled || snapshots.length === 0) {
      return this.getEmptyAnalyticsData();
    }

    try {
      // Aggregate metrics
      const aggregatedMetrics = this.aggregateMetrics(snapshots);
      
      // Analyze trends
      const trends = this.analyzeTrends(snapshots);
      
      // Detect anomalies
      const detectedAnomalies = this.detectAnomalies(snapshots);
      
      // Generate forecasts
      const _generatedForecasts = this.generateForecasts(snapshots);
      
      // Calculate correlations
      const calculatedCorrelations = this.calculateCorrelations(snapshots);

      const analyticsData: AnalyticsData = {
        metrics: aggregatedMetrics,
        trends,
        insights,
        predictions,
        alerts,
        reports: [], // Will be populated by report generation
        metadata: {
          dataPoints: snapshots.length,
          timeRange: {
            start: snapshots[0].timestamp,
            end: snapshots[snapshots.length - 1].timestamp
          },
          quality: this.calculateDataQuality(snapshots),
          sources: ['performance-monitor', 'ai-integration', 'alerting-system'],
          version: '2.0.0'
        }
      };

      // Store data
      const key = this.generateDataKey(analyticsData.metadata.timeRange);
      this.data.set(key, analyticsData);

      // Update correlations and anomalies
      this.correlations = calculatedCorrelations;
      this.anomalies = detectedAnomalies;

      return analyticsData;
    } catch {
      // Analytics processing failed - using fallback data
      return this.getEmptyAnalyticsData();
    }
  }

  /**
   * Generate comprehensive analytics report
   */
  generateReport(
    type: AnalyticsReport['type'] = 'summary',
    timeRange?: { start: number; end: number }
  ): AnalyticsReport {
    const reportId = this.generateReportId();
    const now = Date.now();
    const range = timeRange ?? {
      start: now - (24 * 60 * 60 * 1000), // Last 24 hours
      end: now
    };

    // Get relevant data
    const data = this.getDataForTimeRange(range);
    
    // Generate insights
    const insights = this.generateReportInsights(data);
    
    // Get recommendations
    const recommendations = this.generateRecommendations(data);
    
    // Get benchmarks
    const benchmarks = this.getRelevantBenchmarks(data);
    
    // Get forecasts
    const forecasts = this.getForecastsForTimeRange(range);

    const report: AnalyticsReport = {
      id: reportId,
      title: this.generateReportTitle(type, range),
      type,
      generatedAt: now,
      timeRange: range,
      data,
      insights,
      recommendations,
      benchmarks,
      correlations: this.correlations,
      anomalies: this.anomalies,
      forecasts,
      metadata: data.metadata
    };

    // Store report
    this.reports.set(reportId, report);

    return report;
  }

  /**
   * Perform comparative analysis
   */
  performComparativeAnalysis(
    baseline: PerformanceBenchmark,
    current: PerformanceBenchmark
  ): ComparativeAnalysis {
    const improvement = {
      layoutShift: this.calculateImprovement(baseline.metrics.layoutShift, current.metrics.layoutShift),
      lcp: this.calculateImprovement(baseline.metrics.lcp, current.metrics.lcp, true), // Lower is better
      fcp: this.calculateImprovement(baseline.metrics.fcp, current.metrics.fcp, true), // Lower is better
      memory: this.calculateImprovement(baseline.metrics.memory, current.metrics.memory, true), // Lower is better
      overall: this.calculateOverallImprovement(baseline, current)
    };

    const recommendations = this.generateComparativeRecommendations(improvement);
    const confidence = this.calculateAnalysisConfidence(baseline, current);

    return {
      baseline,
      current,
      improvement,
      recommendations,
      confidence
    };
  }

  /**
   * Export analytics data
   */
  exportData(
    format: 'json' | 'csv' | 'pdf' | 'html',
    timeRange?: { start: number; end: number }
  ): Blob {
    if (!this.config.export.enabled) {
      throw new Error('Export is disabled');
    }

    const data = this.getDataForTimeRange(timeRange ?? {
      start: Date.now() - (24 * 60 * 60 * 1000),
      end: Date.now()
    });

    switch (format) {
      case 'json':
        return this.exportAsJSON(data);
      case 'csv':
        return this.exportAsCSV(data);
      case 'pdf':
        return this.exportAsPDF(data);
      case 'html':
        return this.exportAsHTML(data);
      default:
        throw new Error(`Unsupported export format: ${String(format)}`);
    }
  }

  /**
   * Get analytics statistics
   */
  getStatistics(): {
    totalDataPoints: number;
    totalReports: number;
    dataQuality: number;
    anomalyCount: number;
    correlationCount: number;
    forecastAccuracy: number;
  } {
    const totalDataPoints = Array.from(this.data.values())
      .reduce((sum, data) => sum + data.metadata.dataPoints, 0);
    
    const totalReports = this.reports.size;
    
    const dataQuality = Array.from(this.data.values())
      .reduce((sum, data) => sum + data.metadata.quality.completeness, 0) / this.data.size;
    
    const anomalyCount = this.anomalies.length;
    const correlationCount = this.correlations.length;
    
    const forecastAccuracy = Array.from(this.forecasts.values())
      .reduce((sum, forecast) => sum + forecast.accuracy, 0) / this.forecasts.size;

    return {
      totalDataPoints,
      totalReports,
      dataQuality: dataQuality ?? 0,
      anomalyCount,
      correlationCount,
      forecastAccuracy: forecastAccuracy ?? 0
    };
  }

  /**
   * Update analytics configuration
   */
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Dispose of the analytics engine
   */
  dispose(): void {
    this.data.clear();
    this.reports.clear();
    this.benchmarks.clear();
    this.correlations = [];
    this.anomalies = [];
    this.forecasts.clear();
    this.isInitialized = false;
  }

  // Private methods

  private aggregateMetrics(snapshots: PerformanceSnapshot[]): AggregatedMetrics {
    const interval = this.calculateOptimalInterval(snapshots);
    const aggregated: AggregatedMetrics = {
      timestamp: Date.now(),
      interval,
      layoutShift: this.aggregateMetric(snapshots, 'layoutShift.current'),
      memory: this.aggregateMetric(snapshots, 'memory.usage'),
      lcp: this.aggregateMetric(snapshots, 'paintTiming.lcp'),
      fcp: this.aggregateMetric(snapshots, 'paintTiming.fcp'),
      responsiveElements: this.aggregateMetric(snapshots, 'responsiveElements.count'),
      resources: this.aggregateResources(snapshots),
      custom: this.aggregateCustomMetrics(snapshots)
    };

    return aggregated;
  }

  private aggregateMetric(snapshots: PerformanceSnapshot[], path: string): MetricAggregation {
    const values = snapshots
      .map(s => this.getNestedValue(s.metrics as unknown as Record<string, unknown>, path))
      .filter((v): v is number => 
        v !== null && v !== undefined && typeof v === 'number' && !isNaN(v)
      );

    if (values.length === 0) {
      return this.getEmptyMetricAggregation();
    }

    const sorted = [...values].sort((a, b) => a - b);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;

    return {
      avg,
      max,
      min,
      count: values.length,
      percentiles: {
        p50: this.calculatePercentile(sorted, 50),
        p75: this.calculatePercentile(sorted, 75),
        p90: this.calculatePercentile(sorted, 90),
        p95: this.calculatePercentile(sorted, 95),
        p99: this.calculatePercentile(sorted, 99)
      },
      trend: this.calculateTrend(values),
      variance,
      outliers: this.detectOutliers(values, avg, Math.sqrt(variance))
    };
  }

  private aggregateResources(snapshots: PerformanceSnapshot[]): ResourceAggregation {
    const totalRequests = snapshots.reduce((sum, s) => sum + s.metrics.resources.totalRequests, 0);
    const totalSize = snapshots.reduce((sum, s) => sum + s.metrics.resources.totalSize, 0);
    const slowRequests = snapshots.reduce((sum, s) => sum + s.metrics.resources.slowRequests.length, 0);
    
    const _loadTimes = snapshots
      .map(s => s.metrics.resources.averageLoadTime)
      .filter(t => t > 0);
    
    const averageLoadTime = this.aggregateMetric(
      snapshots.map(s => ({ 
        timestamp: s.timestamp, 
        metrics: { 
          layoutShift: { current: 0, entries: [] },
          paintTiming: { fcp: null, lcp: null },
          memory: null,
          navigation: null,
          responsiveElements: { count: 0, renderTimes: [], averageRenderTime: 0, memoryUsage: 0, layoutShiftContributions: 0 },
          resources: { totalRequests: 0, recentRequests: 0, totalSize: 0, averageLoadTime: s.metrics.resources.averageLoadTime, slowRequests: [] },
          custom: null,
          value: s.metrics.resources.averageLoadTime 
        } 
      })),
      'value'
    );

    const errorRate = totalRequests > 0 ? slowRequests / totalRequests : 0;
    const cacheHitRate = snapshots.reduce((sum, s) => {
      return sum + (s.metrics.custom?.cacheHitRate ?? 0);
    }, 0) / snapshots.length;

    return {
      totalRequests,
      averageLoadTime,
      totalSize,
      slowRequests,
      errorRate,
      cacheHitRate
    };
  }

  private aggregateCustomMetrics(snapshots: PerformanceSnapshot[]): CustomMetricAggregation {
    return {
      scalingOperations: this.aggregateMetric(snapshots, 'custom.scalingOperations'),
      scalingTime: this.aggregateMetric(snapshots, 'custom.scalingTime'),
      cacheHitRate: this.aggregateMetric(snapshots, 'custom.cacheHitRate'),
      configComplexity: this.aggregateMetric(snapshots, 'custom.configComplexity'),
      breakpointTransitions: this.aggregateMetric(snapshots, 'custom.breakpointTransitions')
    };
  }

  private analyzeTrends(snapshots: PerformanceSnapshot[]): PerformanceTrends {
    if (snapshots.length < 2) {
      return {
        layoutShift: 'stable',
        memory: 'stable',
        lcp: 'stable',
        responsiveElements: 'stable'
      };
    }

    const recent = snapshots.slice(-Math.min(10, snapshots.length));
    const older = snapshots.slice(-Math.min(20, snapshots.length), -Math.min(10, snapshots.length));

    return {
      layoutShift: this.calculateTrendDirection(
        older.map(s => s.metrics.layoutShift.current),
        recent.map(s => s.metrics.layoutShift.current)
      ),
      memory: this.calculateTrendDirection(
        older.map(s => s.metrics.memory?.usage ?? 0),
        recent.map(s => s.metrics.memory?.usage ?? 0)
      ),
      lcp: this.calculateTrendDirection(
        older.map(s => s.metrics.paintTiming.lcp ?? 0),
        recent.map(s => s.metrics.paintTiming.lcp ?? 0)
      ),
      responsiveElements: this.calculateTrendDirection(
        older.map(s => s.metrics.responsiveElements.count),
        recent.map(s => s.metrics.responsiveElements.count)
      )
    };
  }

  private detectAnomalies(snapshots: PerformanceSnapshot[]): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];

    // Detect spikes in layout shift
    const layoutShiftValues = snapshots.map(s => s.metrics.layoutShift.current);
    const layoutShiftAnomalies = this.detectSpikes(layoutShiftValues, 'layoutShift');
    anomalies.push(...layoutShiftAnomalies);

    // Detect memory usage anomalies
    const memoryValues = snapshots.map(s => s.metrics.memory?.usage ?? 0);
    const memoryAnomalies = this.detectSpikes(memoryValues, 'memory');
    anomalies.push(...memoryAnomalies);

    // Detect LCP anomalies
    const lcpValues = snapshots.map(s => s.metrics.paintTiming.lcp ?? 0);
    const lcpAnomalies = this.detectSpikes(lcpValues, 'lcp');
    anomalies.push(...lcpAnomalies);

    return anomalies;
  }

  private generateForecasts(snapshots: PerformanceSnapshot[]): PerformanceForecast[] {
    const forecasts: PerformanceForecast[] = [];

    // Generate forecast for layout shift
    const layoutShiftForecast = this.generateMetricForecast(
      snapshots.map(s => ({ timestamp: s.timestamp, value: s.metrics.layoutShift.current })),
      'layoutShift'
    );
    forecasts.push(layoutShiftForecast);

    // Generate forecast for memory usage
    const memoryForecast = this.generateMetricForecast(
      snapshots.map(s => ({ timestamp: s.timestamp, value: s.metrics.memory?.usage ?? 0 })),
      'memory'
    );
    forecasts.push(memoryForecast);

    return forecasts;
  }

  private calculateCorrelations(snapshots: PerformanceSnapshot[]): PerformanceCorrelation[] {
    const correlations: PerformanceCorrelation[] = [];

    // Calculate correlation between layout shift and memory usage
    const layoutShiftValues = snapshots.map(s => s.metrics.layoutShift.current);
    const memoryValues = snapshots.map(s => s.metrics.memory?.usage ?? 0);
    
    if (layoutShiftValues.length > 1 && memoryValues.length > 1) {
      const correlation = this.calculateCorrelation(layoutShiftValues, memoryValues);
      correlations.push({
        metric1: 'layoutShift',
        metric2: 'memory',
        correlation,
        significance: this.calculateSignificance(correlation, layoutShiftValues.length),
        description: 'Correlation between layout shift and memory usage',
        actionable: Math.abs(correlation) > 0.5
      });
    }

    return correlations;
  }

  private calculateDataQuality(snapshots: PerformanceSnapshot[]): AnalyticsMetadata['quality'] {
    if (snapshots.length === 0) {
      return { completeness: 0, accuracy: 0, reliability: 0 };
    }

    // Calculate completeness (percentage of non-null values)
    const totalFields = snapshots.length * 10; // Approximate number of fields
    const nonNullFields = snapshots.reduce((count, snapshot) => {
      let fieldCount = 0;
      if (snapshot.metrics.layoutShift.current !== null) fieldCount++;
      if (snapshot.metrics.memory?.usage !== null) fieldCount++;
      if (snapshot.metrics.paintTiming.lcp !== null) fieldCount++;
      if (snapshot.metrics.paintTiming.fcp !== null) fieldCount++;
      if (snapshot.metrics.responsiveElements.count !== null) fieldCount++;
      if (snapshot.metrics.resources.totalRequests !== null) fieldCount++;
      if (snapshot.metrics.resources.averageLoadTime !== null) fieldCount++;
      if (snapshot.metrics.custom?.scalingOperations !== null) fieldCount++;
      if (snapshot.metrics.custom?.cacheHitRate !== null) fieldCount++;
      if (snapshot.metrics.custom?.configComplexity !== null) fieldCount++;
      return count + fieldCount;
    }, 0);

    const completeness = nonNullFields / totalFields;

    // Calculate accuracy (based on data consistency)
    const accuracy = this.calculateDataAccuracy(snapshots);

    // Calculate reliability (based on data stability)
    const reliability = this.calculateDataReliability(snapshots);

    return { completeness, accuracy, reliability };
  }

  private calculateDataAccuracy(snapshots: PerformanceSnapshot[]): number {
    // Simple accuracy calculation based on data consistency
    const layoutShiftValues = snapshots.map(s => s.metrics.layoutShift.current);
    const memoryValues = snapshots.map(s => s.metrics.memory?.usage ?? 0);
    
    const layoutShiftConsistency = this.calculateConsistency(layoutShiftValues);
    const memoryConsistency = this.calculateConsistency(memoryValues);
    
    return (layoutShiftConsistency + memoryConsistency) / 2;
  }

  private calculateDataReliability(snapshots: PerformanceSnapshot[]): number {
    // Calculate reliability based on data stability and outliers
    const layoutShiftValues = snapshots.map(s => s.metrics.layoutShift.current);
    const outliers = this.detectOutliers(layoutShiftValues, 
      layoutShiftValues.reduce((sum, val) => sum + val, 0) / layoutShiftValues.length,
      Math.sqrt(layoutShiftValues.reduce((sum, val) => {
        const avg = layoutShiftValues.reduce((s, v) => s + v, 0) / layoutShiftValues.length;
        return sum + Math.pow(val - avg, 2);
      }, 0) / layoutShiftValues.length)
    );
    
    const outlierRatio = outliers.length / layoutShiftValues.length;
    return Math.max(0, 1 - outlierRatio);
  }

  private calculateConsistency(values: number[]): number {
    if (values.length < 2) return 1;
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const coefficientOfVariation = Math.sqrt(variance) / avg;
    
    return Math.max(0, 1 - coefficientOfVariation);
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj as unknown);
  }

  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    if (upper >= sortedValues.length) return sortedValues[sortedValues.length - 1];
    if (lower === upper) return sortedValues[lower];
    
    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.05) return 'increasing';
    if (change < -0.05) return 'decreasing';
    return 'stable';
  }

  private calculateTrendDirection(older: number[], recent: number[]): 'improving' | 'degrading' | 'stable' {
    if (older.length === 0 || recent.length === 0) return 'stable';
    
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.05) return 'degrading';
    if (change < -0.05) return 'improving';
    return 'stable';
  }

  private detectOutliers(values: number[], mean: number, stdDev: number): number[] {
    const threshold = 2 * stdDev; // 2 standard deviations
    return values.filter(val => Math.abs(val - mean) > threshold);
  }

  private detectSpikes(values: number[], metric: string): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    for (let i = 1; i < values.length - 1; i++) {
      const current = values[i];
      const previous = values[i - 1];
      const next = values[i + 1];
      
      // Detect spike (value significantly higher than neighbors)
      if (current > previous * 1.5 && current > next * 1.5 && current > mean + 2 * stdDev) {
        anomalies.push({
          type: 'spike',
          metric,
          severity: current > mean + 3 * stdDev ? 'high' : 'medium',
          confidence: 0.8,
          description: `Spike detected in ${metric}`,
          timestamp: Date.now() - (values.length - i) * 60000, // Approximate timestamp
          duration: 60000, // 1 minute
          impact: (current - mean) / mean,
          suggestedActions: ['Investigate root cause', 'Check for recent changes', 'Monitor closely']
        });
      }
    }
    
    return anomalies;
  }

  private generateMetricForecast(data: Array<{ timestamp: number; value: number }>, metric: string): PerformanceForecast {
    if (data.length < 3) {
      return {
        metric,
        currentValue: data[data.length - 1]?.value ?? 0,
        predictions: [],
        trend: 'stable',
        seasonality: false,
        volatility: 0,
        accuracy: 0
      };
    }

    const values = data.map(d => d.value);
    const currentValue = values[values.length - 1];
    const trend = this.calculateTrend(values);
    
    // Simple linear regression for prediction
    const predictions = this.generateLinearPredictions(values, 5); // Predict next 5 points
    
    const volatility = this.calculateVolatility(values);
    const seasonality = this.detectSeasonality(values);
    const accuracy = this.calculateForecastAccuracy(values);

    return {
      metric,
      currentValue,
      predictions,
      trend,
      seasonality,
      volatility,
      accuracy
    };
  }

  private generateLinearPredictions(values: number[], count: number): Array<{ timestamp: number; value: number; confidence: number }> {
    const predictions = [];
    const n = values.length;
    
    // Simple linear regression
    const sumX = n * (n - 1) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = n * (n - 1) * (2 * n - 1) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    for (let i = 0; i < count; i++) {
      const futureIndex = n + i;
      const predictedValue = slope * futureIndex + intercept;
      const confidence = Math.max(0, 1 - (i * 0.1)); // Decreasing confidence over time
      
      predictions.push({
        timestamp: Date.now() + (i + 1) * 60000, // 1 minute intervals
        value: Math.max(0, predictedValue), // Ensure non-negative
        confidence
      });
    }
    
    return predictions;
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const returns = [];
    for (let i = 1; i < values.length; i++) {
      returns.push((values[i] - values[i - 1]) / values[i - 1]);
    }
    
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  private detectSeasonality(values: number[]): boolean {
    // Simple seasonality detection based on periodic patterns
    if (values.length < 12) return false;
    
    // Check for patterns every 4-6 data points (assuming 1-minute intervals)
    for (let period = 4; period <= 6; period++) {
      let correlation = 0;
      for (let i = period; i < values.length; i++) {
        correlation += Math.abs(values[i] - values[i - period]);
      }
      correlation /= (values.length - period);
      
      if (correlation < 0.1) { // Low correlation suggests seasonality
        return true;
      }
    }
    
    return false;
  }

  private calculateForecastAccuracy(values: number[]): number {
    // Simple accuracy calculation based on data stability
    if (values.length < 3) return 0;
    
    const recent = values.slice(-3);
    const older = values.slice(-6, -3);
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const change = Math.abs(recentAvg - olderAvg) / olderAvg;
    return Math.max(0, 1 - change);
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateSignificance(correlation: number, sampleSize: number): number {
    // Simple significance calculation
    const t = correlation * Math.sqrt((sampleSize - 2) / (1 - correlation * correlation));
    return Math.min(1, Math.max(0, 1 - Math.exp(-Math.abs(t) / 2)));
  }

  private calculateOptimalInterval(snapshots: PerformanceSnapshot[]): number {
    if (snapshots.length < 2) return 1;
    
    const timeSpan = snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp;
    const optimalInterval = Math.max(1, Math.round(timeSpan / (snapshots.length * 60 * 1000))); // minutes
    
    return Math.min(optimalInterval, 60); // Cap at 1 hour
  }

  private getEmptyMetricAggregation(): MetricAggregation {
    return {
      avg: 0,
      max: 0,
      min: 0,
      count: 0,
      percentiles: { p50: 0, p75: 0, p90: 0, p95: 0, p99: 0 },
      trend: 'stable',
      variance: 0,
      outliers: []
    };
  }

  private getEmptyAnalyticsData(): AnalyticsData {
    return {
      metrics: {
        timestamp: Date.now(),
        interval: 1,
        layoutShift: this.getEmptyMetricAggregation(),
        memory: this.getEmptyMetricAggregation(),
        lcp: this.getEmptyMetricAggregation(),
        fcp: this.getEmptyMetricAggregation(),
        responsiveElements: this.getEmptyMetricAggregation(),
        resources: {
          totalRequests: 0,
          averageLoadTime: this.getEmptyMetricAggregation(),
          totalSize: 0,
          slowRequests: 0,
          errorRate: 0,
          cacheHitRate: 0
        },
        custom: {
          scalingOperations: this.getEmptyMetricAggregation(),
          scalingTime: this.getEmptyMetricAggregation(),
          cacheHitRate: this.getEmptyMetricAggregation(),
          configComplexity: this.getEmptyMetricAggregation(),
          breakpointTransitions: this.getEmptyMetricAggregation()
        }
      },
      trends: {
        layoutShift: 'stable',
        memory: 'stable',
        lcp: 'stable',
        responsiveElements: 'stable'
      },
      insights: [],
      predictions: [],
      alerts: [],
      reports: [],
      metadata: {
        dataPoints: 0,
        timeRange: { start: Date.now(), end: Date.now() },
        quality: { completeness: 0, accuracy: 0, reliability: 0 },
        sources: [],
        version: '2.0.0'
      }
    };
  }

  private generateDataKey(timeRange: { start: number; end: number }): string {
    return `${timeRange.start}_${timeRange.end}`;
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportTitle(type: AnalyticsReport['type'], timeRange: { start: number; end: number }): string {
    const startDate = new Date(timeRange.start).toLocaleDateString();
    const endDate = new Date(timeRange.end).toLocaleDateString();
    
    switch (type) {
      case 'summary': return `Performance Summary Report (${startDate} - ${endDate})`;
      case 'detailed': return `Detailed Performance Analysis (${startDate} - ${endDate})`;
      case 'comparative': return `Comparative Performance Analysis (${startDate} - ${endDate})`;
      case 'forecast': return `Performance Forecast Report (${startDate} - ${endDate})`;
      case 'custom': return `Custom Performance Report (${startDate} - ${endDate})`;
      default: return `Performance Report (${startDate} - ${endDate})`;
    }
  }

  private getDataForTimeRange(timeRange: { start: number; end: number }): AnalyticsData {
    const key = this.generateDataKey(timeRange);
    return this.data.get(key) ?? this.getEmptyAnalyticsData();
  }

  private generateReportInsights(data: AnalyticsData): AIInsight[] {
    // Generate insights based on analytics data
    const insights: AIInsight[] = [];
    
    if (data.metrics.layoutShift.avg > 0.1) {
      insights.push({
        type: 'recommendation',
        severity: 'warning',
        title: 'High Layout Shift Detected',
        description: `Average layout shift of ${data.metrics.layoutShift.avg.toFixed(3)} exceeds recommended threshold`,
        confidence: 0.9,
        impact: { performance: 0.3, userExperience: 0.4, cost: 0.1 },
        actionable: true,
        timestamp: Date.now()
      });
    }
    
    return insights;
  }

  private generateRecommendations(data: AnalyticsData): string[] {
    const recommendations: string[] = [];
    
    if (data.metrics.layoutShift.avg > 0.1) {
      recommendations.push('Implement CSS containment to reduce layout shift');
    }
    
    if (data.metrics.memory.avg > 0.8) {
      recommendations.push('Optimize memory usage and implement garbage collection strategies');
    }
    
    if (data.metrics.lcp.avg > 2500) {
      recommendations.push('Optimize critical rendering path and resource loading');
    }
    
    return recommendations;
  }

  private getRelevantBenchmarks(_data: AnalyticsData): PerformanceBenchmark[] {
    return Array.from(this.benchmarks.values()).slice(0, 3);
  }

  private getForecastsForTimeRange(_timeRange: { start: number; end: number }): PerformanceForecast[] {
    return Array.from(this.forecasts.values());
  }

  private calculateImprovement(baseline: number, current: number, lowerIsBetter = false): number {
    if (baseline === 0) return 0;
    
    const change = (current - baseline) / baseline;
    return lowerIsBetter ? -change : change;
  }

  private calculateOverallImprovement(baseline: PerformanceBenchmark, current: PerformanceBenchmark): number {
    const improvements = [
      this.calculateImprovement(baseline.metrics.layoutShift, current.metrics.layoutShift),
      this.calculateImprovement(baseline.metrics.lcp, current.metrics.lcp, true),
      this.calculateImprovement(baseline.metrics.fcp, current.metrics.fcp, true),
      this.calculateImprovement(baseline.metrics.memory, current.metrics.memory, true)
    ];
    
    return improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
  }

  private generateComparativeRecommendations(improvement: Record<string, number>): string[] {
    const recommendations: string[] = [];
    
    if (improvement.layoutShift > 0.1) {
      recommendations.push('Layout shift has improved significantly');
    } else if (improvement.layoutShift < -0.1) {
      recommendations.push('Layout shift has degraded - investigate recent changes');
    }
    
    if (improvement.lcp > 0.1) {
      recommendations.push('LCP has improved - good job on performance optimization');
    } else if (improvement.lcp < -0.1) {
      recommendations.push('LCP has degraded - optimize critical rendering path');
    }
    
    return recommendations;
  }

  private calculateAnalysisConfidence(baseline: PerformanceBenchmark, current: PerformanceBenchmark): number {
    // Simple confidence calculation based on data quality and consistency
    const timeDiff = Math.abs(current.timestamp - baseline.timestamp);
    const maxTimeDiff = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    const timeConfidence = Math.max(0, 1 - (timeDiff / maxTimeDiff));
    const dataConfidence = 0.8; // Assume good data quality
    
    return (timeConfidence + dataConfidence) / 2;
  }

  private loadDefaultBenchmarks(): void {
    const defaultBenchmarks: PerformanceBenchmark[] = [
      {
        name: 'Industry Average',
        category: 'core-web-vitals',
        metrics: {
          layoutShift: 0.1,
          lcp: 2500,
          fcp: 1800,
          memory: 0.7
        },
        score: 75,
        percentile: 50,
        industry: 'general',
        timestamp: Date.now()
      },
      {
        name: 'High Performance',
        category: 'core-web-vitals',
        metrics: {
          layoutShift: 0.05,
          lcp: 1500,
          fcp: 1000,
          memory: 0.5
        },
        score: 95,
        percentile: 90,
        industry: 'general',
        timestamp: Date.now()
      }
    ];

    defaultBenchmarks.forEach(benchmark => {
      this.benchmarks.set(benchmark.name, benchmark);
    });
  }

  private initializeCorrelations(): void {
    // Initialize with empty correlations array
    this.correlations = [];
  }

  // Export methods (mock implementations)
  private exportAsJSON(data: AnalyticsData): Blob {
    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  private exportAsCSV(data: AnalyticsData): Blob {
    // Simple CSV export
    const csv = 'metric,value\n' +
      `layoutShift,${data.metrics.layoutShift.avg}\n` +
      `memory,${data.metrics.memory.avg}\n` +
      `lcp,${data.metrics.lcp.avg}\n`;
    return new Blob([csv], { type: 'text/csv' });
  }

  private exportAsPDF(data: AnalyticsData): Blob {
    // Mock PDF export
    const pdfContent = `Performance Report\n\nLayout Shift: ${data.metrics.layoutShift.avg}\nMemory: ${data.metrics.memory.avg}`;
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  private exportAsHTML(data: AnalyticsData): Blob {
    const html = `
      <html>
        <head><title>Performance Report</title></head>
        <body>
          <h1>Performance Report</h1>
          <p>Layout Shift: ${data.metrics.layoutShift.avg}</p>
          <p>Memory: ${data.metrics.memory.avg}</p>
        </body>
      </html>
    `;
    return new Blob([html], { type: 'text/html' });
  }
}
