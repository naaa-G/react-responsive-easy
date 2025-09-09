import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import _chalk from 'chalk';

// Analytics Types
export interface AnalyticsConfig {
  enabled: boolean;
  dataRetention: number; // days
  realTimeProcessing: boolean;
  batchProcessing: boolean;
  machineLearning: boolean;
  visualization: boolean;
  export: boolean;
  integrations: AnalyticsIntegration[];
  storage: AnalyticsStorageConfig;
  processing: AnalyticsProcessingConfig;
  security: AnalyticsSecurityConfig;
}

export interface AnalyticsIntegration {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream' | 'cloud';
  config: Record<string, any>;
  enabled: boolean;
  credentials?: Record<string, any>;
}

export interface AnalyticsStorageConfig {
  type: 'local' | 'database' | 'cloud' | 'hybrid';
  database?: {
    host: string;
    port: number;
    name: string;
    credentials: Record<string, any>;
  };
  cloud?: {
    provider: 'aws' | 'azure' | 'gcp';
    bucket: string;
    region: string;
    credentials: Record<string, any>;
  };
  retention: {
    raw: number; // days
    processed: number; // days
    aggregated: number; // days
  };
}

export interface AnalyticsProcessingConfig {
  batchSize: number;
  processingInterval: number; // minutes
  parallelProcessing: boolean;
  maxWorkers: number;
  algorithms: string[];
  models: MLModelConfig[];
}

export interface MLModelConfig {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering' | 'anomaly_detection' | 'forecasting';
  algorithm: string;
  version: string;
  accuracy: number;
  lastTrained: Date;
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface AnalyticsSecurityConfig {
  encryption: boolean;
  accessControl: boolean;
  auditLogging: boolean;
  dataMasking: boolean;
  compliance: string[];
}

// Data Types
export interface AnalyticsData {
  id: string;
  timestamp: Date;
  source: string;
  type: AnalyticsDataType;
  category: string;
  metrics: Record<string, any>;
  metadata: Record<string, any>;
  tags: string[];
  processed: boolean;
}

export type AnalyticsDataType = 
  | 'performance' 
  | 'usage' 
  | 'error' 
  | 'security' 
  | 'business' 
  | 'custom';

export interface AnalyticsInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  impact: 'positive' | 'negative' | 'neutral';
  category: string;
  data: Record<string, any>;
  recommendations: string[];
  actions: AnalyticsAction[];
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'dismissed' | 'resolved';
}

export type InsightType = 
  | 'anomaly' 
  | 'trend' 
  | 'pattern' 
  | 'prediction' 
  | 'optimization' 
  | 'alert' 
  | 'recommendation';

export interface AnalyticsAction {
  id: string;
  type: 'automated' | 'manual' | 'notification';
  title: string;
  description: string;
  parameters: Record<string, any>;
  executed: boolean;
  executedAt?: Date;
  result?: any;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type: ReportType;
  period: {
    start: Date;
    end: Date;
  };
  data: AnalyticsData[];
  insights: AnalyticsInsight[];
  visualizations: AnalyticsVisualization[];
  summary: AnalyticsSummary;
  generatedAt: Date;
  generatedBy: string;
  format: 'json' | 'pdf' | 'excel' | 'html';
}

export type ReportType = 
  | 'performance' 
  | 'usage' 
  | 'cost' 
  | 'security' 
  | 'compliance' 
  | 'custom';

export interface AnalyticsVisualization {
  id: string;
  type: VisualizationType;
  title: string;
  data: any;
  config: Record<string, any>;
  interactive: boolean;
}

export type VisualizationType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'scatter' 
  | 'heatmap' 
  | 'gauge' 
  | 'table' 
  | 'dashboard';

export interface AnalyticsSummary {
  totalDataPoints: number;
  insightsGenerated: number;
  anomaliesDetected: number;
  trendsIdentified: number;
  predictionsMade: number;
  recommendationsProvided: number;
  keyMetrics: Record<string, any>;
  topInsights: AnalyticsInsight[];
}

// ML and Prediction Types
export interface MLPrediction {
  id: string;
  modelId: string;
  input: Record<string, any>;
  output: Record<string, any>;
  confidence: number;
  accuracy: number;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface TrendAnalysis {
  id: string;
  metric: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  strength: number; // 0-1
  period: {
    start: Date;
    end: Date;
  };
  dataPoints: number;
  confidence: number;
  forecast?: {
    nextValue: number;
    confidence: number;
    timeframe: string;
  };
}

export interface AnomalyDetection {
  id: string;
  type: 'statistical' | 'machine_learning' | 'rule_based';
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-1
  description: string;
  data: Record<string, any>;
  detectedAt: Date;
  resolvedAt?: Date;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
}

export class AnalyticsService extends EventEmitter {
  private config: AnalyticsConfig;
  private data: Map<string, AnalyticsData> = new Map();
  private insights: Map<string, AnalyticsInsight> = new Map();
  private reports: Map<string, AnalyticsReport> = new Map();
  private predictions: Map<string, MLPrediction> = new Map();
  private trends: Map<string, TrendAnalysis> = new Map();
  private anomalies: Map<string, AnomalyDetection> = new Map();
  private isProcessing: boolean = false;
  private processingInterval?: NodeJS.Timeout;

  constructor(config: AnalyticsConfig) {
    super();
    this.config = config;
    this.initializeService();
  }

  /**
   * Initialize analytics service
   */
  private initializeService(): void {
    if (this.config.enabled) {
      this.startProcessing();
      this.emit('analytics-initialized', { config: this.config });
    }
  }

  /**
   * Start data processing
   */
  private startProcessing(): void {
    if (this.config.realTimeProcessing) {
      this.startRealTimeProcessing();
    }
    
    if (this.config.batchProcessing) {
      this.startBatchProcessing();
    }
  }

  /**
   * Start real-time processing
   */
  private startRealTimeProcessing(): void {
    this.emit('real-time-processing-started');
  }

  /**
   * Start batch processing
   */
  private startBatchProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processBatchData().catch(() => {});
    }, this.config.processing.processingInterval * 60 * 1000);
  }

  /**
   * Process batch data
   */
  private async processBatchData(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    try {
      const unprocessedData = Array.from(this.data.values())
        .filter(d => !d.processed);
      
      if (unprocessedData.length > 0) {
        await this.processData(unprocessedData);
        this.emit('batch-processing-completed', { 
          processed: unprocessedData.length 
        });
      }
    } catch (error) {
      this.emit('batch-processing-error', { error });
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Add analytics data
   */
  async addData(data: Omit<AnalyticsData, 'id' | 'timestamp' | 'processed'>): Promise<AnalyticsData> {
    const analyticsData: AnalyticsData = {
      id: uuidv4(),
      timestamp: new Date(),
      processed: false,
      ...data
    };

    this.data.set(analyticsData.id, analyticsData);
    this.emit('data-added', analyticsData);

    // Process in real-time if enabled
    if (this.config.realTimeProcessing) {
      await this.processData([analyticsData]);
    }

    return analyticsData;
  }

  /**
   * Process analytics data
   */
  private async processData(data: AnalyticsData[]): Promise<void> {
    const processingPromises = data.map(async (item) => {
      try {
        // Generate insights
        const insights = await this.generateInsights(item);
        insights.forEach(insight => {
          this.insights.set(insight.id, insight);
          this.emit('insight-generated', insight);
        });

        // Detect anomalies
        const anomalies = await this.detectAnomalies(item);
        anomalies.forEach(anomaly => {
          this.anomalies.set(anomaly.id, anomaly);
          this.emit('anomaly-detected', anomaly);
        });

        // Analyze trends
        const trends = await this.analyzeTrends(item);
        trends.forEach(trend => {
          this.trends.set(trend.id, trend);
          this.emit('trend-analyzed', trend);
        });

        // Make predictions if ML is enabled
        if (this.config.machineLearning) {
          const predictions = await this.makePredictions(item);
          predictions.forEach(prediction => {
            this.predictions.set(prediction.id, prediction);
            this.emit('prediction-made', prediction);
          });
        }

        // Mark as processed
        item.processed = true;
        this.data.set(item.id, item);

      } catch (error) {
        this.emit('data-processing-error', { data: item, error });
      }
    });
    
    await Promise.all(processingPromises);
  }

  /**
   * Generate insights from data
   */
  private async generateInsights(data: AnalyticsData): Promise<AnalyticsInsight[]> {
    const insights: AnalyticsInsight[] = [];

    // Performance insights
    if (data.type === 'performance') {
      const metrics = data.metrics;
      
      // High CPU usage insight
      if (metrics.cpu && metrics.cpu > 80) {
        insights.push({
          id: uuidv4(),
          type: 'alert',
          title: 'High CPU Usage Detected',
          description: `CPU usage is at ${metrics.cpu}%, which is above the recommended threshold.`,
          severity: metrics.cpu > 95 ? 'critical' : 'high',
          confidence: 0.9,
          impact: 'negative',
          category: 'performance',
          data: { cpu: metrics.cpu, threshold: 80 },
          recommendations: [
            'Consider scaling up your infrastructure',
            'Optimize application code for better performance',
            'Review resource allocation'
          ],
          actions: [{
            id: uuidv4(),
            type: 'notification',
            title: 'Send Alert',
            description: 'Notify team about high CPU usage',
            parameters: { channels: ['email', 'slack'] },
            executed: false
          }],
          createdAt: new Date(),
          status: 'active'
        });
      }

      // Memory leak detection
      if (metrics.memory && metrics.memory > 90) {
        insights.push({
          id: uuidv4(),
          type: 'anomaly',
          title: 'Potential Memory Leak',
          description: `Memory usage is at ${metrics.memory}%, indicating a potential memory leak.`,
          severity: 'high',
          confidence: 0.8,
          impact: 'negative',
          category: 'performance',
          data: { memory: metrics.memory, threshold: 90 },
          recommendations: [
            'Review memory allocation in application code',
            'Check for memory leaks in dependencies',
            'Consider implementing memory monitoring'
          ],
          actions: [{
            id: uuidv4(),
            type: 'automated',
            title: 'Restart Service',
            description: 'Automatically restart the service to free memory',
            parameters: { service: 'app' },
            executed: false
          }],
          createdAt: new Date(),
          status: 'active'
        });
      }
    }

    // Usage insights
    if (data.type === 'usage') {
      const metrics = data.metrics;
      
      // Usage spike detection
      if (metrics.requests && metrics.requests > 1000) {
        insights.push({
          id: uuidv4(),
          type: 'trend',
          title: 'Usage Spike Detected',
          description: `Request volume increased to ${metrics.requests} requests, indicating high user activity.`,
          severity: 'medium',
          confidence: 0.85,
          impact: 'positive',
          category: 'usage',
          data: { requests: metrics.requests, threshold: 1000 },
          recommendations: [
            'Monitor system performance during peak usage',
            'Consider auto-scaling to handle increased load',
            'Review caching strategies'
          ],
          actions: [{
            id: uuidv4(),
            type: 'notification',
            title: 'Notify Operations',
            description: 'Alert operations team about usage spike',
            parameters: { team: 'operations' },
            executed: false
          }],
          createdAt: new Date(),
          status: 'active'
        });
      }
    }

    return insights;
  }

  /**
   * Detect anomalies in data
   */
  private async detectAnomalies(data: AnalyticsData): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];

    // Statistical anomaly detection
    const metrics = data.metrics;
    
    // Check for extreme values
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'number') {
        // Simple statistical anomaly detection
        const mean = this.calculateMean(key);
        const stdDev = this.calculateStandardDeviation(key);
        const zScore = Math.abs((value - mean) / stdDev);
        
        if (zScore > 3) { // 3-sigma rule
          anomalies.push({
            id: uuidv4(),
            type: 'statistical',
            severity: zScore > 4 ? 'critical' : 'high',
            score: Math.min(zScore / 5, 1), // Normalize to 0-1
            description: `Statistical anomaly detected in ${key}: ${value} (z-score: ${zScore.toFixed(2)})`,
            data: { metric: key, value, mean, stdDev, zScore },
            detectedAt: new Date(),
            status: 'active'
          });
        }
      }
    });

    return anomalies;
  }

  /**
   * Analyze trends in data
   */
  private async analyzeTrends(data: AnalyticsData): Promise<TrendAnalysis[]> {
    const trends: TrendAnalysis[] = [];

    // Simple trend analysis
    const metrics = data.metrics;
    
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'number') {
        const historicalData = this.getHistoricalData(key, 7); // Last 7 days
        if (historicalData.length > 1) {
          const trend = this.calculateTrend(historicalData);
          
          const trendAnalysis: {
            id: string;
            metric: string;
            direction: "stable" | "increasing" | "decreasing" | "volatile";
            strength: number;
            period: { start: Date; end: Date };
            dataPoints: number;
            confidence: number;
            forecast?: { nextValue: number; confidence: number; timeframe: string };
          } = {
            id: uuidv4(),
            metric: key,
            direction: trend.direction,
            strength: trend.strength,
            period: {
              start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              end: new Date()
            },
            dataPoints: historicalData.length,
            confidence: trend.confidence,
          };
          
          if (trend.forecast !== undefined) {
            trendAnalysis.forecast = trend.forecast;
          }
          
          trends.push(trendAnalysis);
        }
      }
    });

    return trends;
  }

  /**
   * Make ML predictions
   */
  private async makePredictions(data: AnalyticsData): Promise<MLPrediction[]> {
    const predictions: MLPrediction[] = [];

    if (!this.config.machineLearning) return predictions;

    // Simple linear regression prediction
    const metrics = data.metrics;
    
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'number') {
        const historicalData = this.getHistoricalData(key, 30); // Last 30 days
        if (historicalData.length > 5) {
          const prediction = this.linearRegressionPrediction(historicalData);
          
          predictions.push({
            id: uuidv4(),
            modelId: 'linear-regression',
            input: { metric: key, historicalData },
            output: { predictedValue: prediction.value, confidence: prediction.confidence },
            confidence: prediction.confidence,
            accuracy: 0.85, // Mock accuracy
            timestamp: new Date(),
            metadata: { algorithm: 'linear-regression', dataPoints: historicalData.length }
          });
        }
      }
    });

    return predictions;
  }

  /**
   * Generate analytics report
   */
  async generateReport(config: {
    name: string;
    type: ReportType;
    period: { start: Date; end: Date };
    format: 'json' | 'pdf' | 'excel' | 'html';
    includeInsights?: boolean;
    includeVisualizations?: boolean;
  }): Promise<AnalyticsReport> {
    const reportId = uuidv4();
    
    // Get data for the period
    const periodData = Array.from(this.data.values())
      .filter(d => d.timestamp >= config.period.start && d.timestamp <= config.period.end);
    
    // Get insights for the period
    const periodInsights = Array.from(this.insights.values())
      .filter(i => i.createdAt >= config.period.start && i.createdAt <= config.period.end);
    
    // Generate visualizations
    const visualizations: AnalyticsVisualization[] = [];
    if (config.includeVisualizations) {
      visualizations.push(...this.generateVisualizations(periodData));
    }
    
    // Generate summary
    const summary: AnalyticsSummary = {
      totalDataPoints: periodData.length,
      insightsGenerated: periodInsights.length,
      anomaliesDetected: Array.from(this.anomalies.values()).length,
      trendsIdentified: Array.from(this.trends.values()).length,
      predictionsMade: Array.from(this.predictions.values()).length,
      recommendationsProvided: periodInsights.reduce((sum, i) => sum + i.recommendations.length, 0),
      keyMetrics: this.calculateKeyMetrics(periodData),
      topInsights: periodInsights
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10)
    };

    const report: AnalyticsReport = {
      id: reportId,
      name: config.name,
      type: config.type,
      period: config.period,
      data: periodData,
      insights: config.includeInsights ? periodInsights : [],
      visualizations,
      summary,
      generatedAt: new Date(),
      generatedBy: 'system',
      format: config.format
    };

    this.reports.set(reportId, report);
    this.emit('report-generated', report);

    return report;
  }

  /**
   * Generate visualizations
   */
  private generateVisualizations(data: AnalyticsData[]): AnalyticsVisualization[] {
    const visualizations: AnalyticsVisualization[] = [];

    // Time series visualization
    const timeSeriesData = data
      .filter(d => d.type === 'performance')
      .map(d => ({
        timestamp: d.timestamp,
        cpu: d.metrics.cpu ?? 0,
        memory: d.metrics.memory ?? 0,
        requests: d.metrics.requests ?? 0
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (timeSeriesData.length > 0) {
      visualizations.push({
        id: uuidv4(),
        type: 'line',
        title: 'Performance Metrics Over Time',
        data: timeSeriesData,
        config: {
          xAxis: 'timestamp',
          yAxis: ['cpu', 'memory', 'requests'],
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1']
        },
        interactive: true
      });
    }

    // Usage distribution
    const usageData = data
      .filter(d => d.type === 'usage')
      .reduce((acc, d) => {
        const category = d.category ?? 'other';
        acc[category] = (acc[category] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    if (Object.keys(usageData).length > 0) {
      visualizations.push({
        id: uuidv4(),
        type: 'pie',
        title: 'Usage Distribution by Category',
        data: Object.entries(usageData).map(([category, count]) => ({
          category,
          count
        })),
        config: {
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
        },
        interactive: true
      });
    }

    return visualizations;
  }

  /**
   * Calculate key metrics
   */
  private calculateKeyMetrics(data: AnalyticsData[]): Record<string, any> {
    const metrics: Record<string, any> = {};

    // Performance metrics
    const performanceData = data.filter(d => d.type === 'performance');
    if (performanceData.length > 0) {
      const cpuValues = performanceData.map(d => d.metrics.cpu ?? 0).filter(v => v > 0);
      const memoryValues = performanceData.map(d => d.metrics.memory ?? 0).filter(v => v > 0);
      
      if (cpuValues.length > 0) {
        metrics.avgCpu = cpuValues.reduce((sum, v) => sum + v, 0) / cpuValues.length;
        metrics.maxCpu = Math.max(...cpuValues);
      }
      
      if (memoryValues.length > 0) {
        metrics.avgMemory = memoryValues.reduce((sum, v) => sum + v, 0) / memoryValues.length;
        metrics.maxMemory = Math.max(...memoryValues);
      }
    }

    // Usage metrics
    const usageData = data.filter(d => d.type === 'usage');
    if (usageData.length > 0) {
      const requestValues = usageData.map(d => d.metrics.requests ?? 0);
      metrics.totalRequests = requestValues.reduce((sum, v) => sum + v, 0);
      metrics.avgRequests = metrics.totalRequests / usageData.length;
    }

    return metrics;
  }

  /**
   * Helper methods for statistical calculations
   */
  private calculateMean(metric: string): number {
    const values = this.getHistoricalData(metric, 30)
      .map(d => d.metrics[metric] ?? 0)
      .filter(v => typeof v === 'number');
    
    return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  }

  private calculateStandardDeviation(metric: string): number {
    const values = this.getHistoricalData(metric, 30)
      .map(d => d.metrics[metric] ?? 0)
      .filter(v => typeof v === 'number');
    
    if (values.length === 0) return 0;
    
    const mean = this.calculateMean(metric);
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private getHistoricalData(metric: string, days: number): AnalyticsData[] {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return Array.from(this.data.values())
      .filter(d => d.timestamp >= cutoff && d.metrics[metric] !== undefined);
  }

  private calculateTrend(data: AnalyticsData[]): {
    direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    strength: number;
    confidence: number;
    forecast?: { nextValue: number; confidence: number; timeframe: string };
  } {
    if (data.length < 2) {
      return { direction: 'stable', strength: 0, confidence: 0 };
    }

    const values = data.map(d => {
      const metricValues = Object.values(d.metrics).filter(v => typeof v === 'number');
      return metricValues.length > 0 ? metricValues[0] : 0;
    });

    // Simple linear trend calculation
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((sum: number, v) => sum + (v ?? 0), 0);
    const sumY = y.reduce((sum: number, v) => sum + (v ?? 0), 0);
    const sumXY = x.reduce((sum: number, v, i) => sum + (v ?? 0) * (y[i] ?? 0), 0);
    const sumXX = x.reduce((sum: number, v) => sum + (v ?? 0) * (v ?? 0), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared for confidence
    const yMean = sumY / n;
    const ssRes = y.reduce((sum: number, v, i) => sum + Math.pow((v ?? 0) - (slope * (x[i] ?? 0) + intercept), 2), 0);
    const ssTot = y.reduce((sum: number, v) => sum + Math.pow((v ?? 0) - yMean, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    let direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    if (Math.abs(slope) < 0.1) {
      direction = 'stable';
    } else if (slope > 0) {
      direction = 'increasing';
    } else {
      direction = 'decreasing';
    }

    const strength = Math.min(Math.abs(slope) * 10, 1);
    const confidence = Math.max(0, Math.min(1, rSquared));

    // Simple forecast
    const nextValue = slope * n + intercept;
    const forecast = {
      nextValue: Math.max(0, nextValue),
      confidence: confidence * 0.8, // Reduce confidence for forecasting
      timeframe: '1 day'
    };

    return { direction, strength, confidence, forecast };
  }

  private linearRegressionPrediction(data: AnalyticsData[]): {
    value: number;
    confidence: number;
  } {
    const values = data.map(d => {
      const metricValues = Object.values(d.metrics).filter(v => typeof v === 'number');
      return metricValues.length > 0 ? metricValues[0] : 0;
    });

    if (values.length < 2) {
      return { value: 0, confidence: 0 };
    }

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((sum: number, v) => sum + (v ?? 0), 0);
    const sumY = y.reduce((sum: number, v) => sum + (v ?? 0), 0);
    const sumXY = x.reduce((sum: number, v, i) => sum + (v ?? 0) * (y[i] ?? 0), 0);
    const sumXX = x.reduce((sum: number, v) => sum + (v ?? 0) * (v ?? 0), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictedValue = slope * n + intercept;
    const confidence = 0.8; // Mock confidence

    return { value: Math.max(0, predictedValue), confidence };
  }

  /**
   * Get analytics data
   */
  getData(filters?: {
    type?: AnalyticsDataType;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AnalyticsData[] {
    let data = Array.from(this.data.values());

    if (filters) {
      if (filters.type) {
        data = data.filter(d => d.type === filters.type);
      }
      if (filters.category) {
        data = data.filter(d => d.category === filters.category);
      }
      if (filters.startDate) {
        data = data.filter(d => d.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        data = data.filter(d => d.timestamp <= filters.endDate!);
      }
      if (filters.limit) {
        data = data.slice(0, filters.limit);
      }
    }

    return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get insights
   */
  getInsights(filters?: {
    type?: InsightType;
    severity?: string;
    status?: string;
    limit?: number;
  }): AnalyticsInsight[] {
    let insights = Array.from(this.insights.values());

    if (filters) {
      if (filters.type) {
        insights = insights.filter(i => i.type === filters.type);
      }
      if (filters.severity) {
        insights = insights.filter(i => i.severity === filters.severity);
      }
      if (filters.status) {
        insights = insights.filter(i => i.status === filters.status);
      }
      if (filters.limit) {
        insights = insights.slice(0, filters.limit);
      }
    }

    return insights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get reports
   */
  getReports(limit?: number): AnalyticsReport[] {
    const reports = Array.from(this.reports.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
    
    return limit ? reports.slice(0, limit) : reports;
  }

  /**
   * Get predictions
   */
  getPredictions(limit?: number): MLPrediction[] {
    const predictions = Array.from(this.predictions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? predictions.slice(0, limit) : predictions;
  }

  /**
   * Get trends
   */
  getTrends(limit?: number): TrendAnalysis[] {
    const trends = Array.from(this.trends.values())
      .sort((a, b) => b.period.end.getTime() - a.period.end.getTime());
    
    return limit ? trends.slice(0, limit) : trends;
  }

  /**
   * Get anomalies
   */
  getAnomalies(filters?: {
    severity?: string;
    status?: string;
    limit?: number;
  }): AnomalyDetection[] {
    let anomalies = Array.from(this.anomalies.values());

    if (filters) {
      if (filters.severity) {
        anomalies = anomalies.filter(a => a.severity === filters.severity);
      }
      if (filters.status) {
        anomalies = anomalies.filter(a => a.status === filters.status);
      }
      if (filters.limit) {
        anomalies = anomalies.slice(0, filters.limit);
      }
    }

    return anomalies.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  /**
   * Update insight status
   */
  async updateInsightStatus(insightId: string, status: 'active' | 'dismissed' | 'resolved'): Promise<void> {
    const insight = this.insights.get(insightId);
    if (insight) {
      insight.status = status;
      this.insights.set(insightId, insight);
      this.emit('insight-status-updated', { insightId, status });
    }
  }

  /**
   * Execute insight action
   */
  async executeInsightAction(insightId: string, actionId: string): Promise<void> {
    const insight = this.insights.get(insightId);
    if (insight) {
      const action = insight.actions.find(a => a.id === actionId);
      if (action && !action.executed) {
        action.executed = true;
        action.executedAt = new Date();
        action.result = { success: true, message: 'Action executed successfully' };
        
        this.insights.set(insightId, insight);
        this.emit('insight-action-executed', { insightId, actionId, result: action.result });
      }
    }
  }

  /**
   * Stop analytics service
   */
  stop(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    this.emit('analytics-stopped');
  }

  /**
   * Get service status
   */
  getStatus(): {
    enabled: boolean;
    processing: boolean;
    dataCount: number;
    insightsCount: number;
    reportsCount: number;
    predictionsCount: number;
    trendsCount: number;
    anomaliesCount: number;
  } {
    return {
      enabled: this.config.enabled,
      processing: this.isProcessing,
      dataCount: this.data.size,
      insightsCount: this.insights.size,
      reportsCount: this.reports.size,
      predictionsCount: this.predictions.size,
      trendsCount: this.trends.size,
      anomaliesCount: this.anomalies.size
    };
  }
}
