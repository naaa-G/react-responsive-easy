/**
 * AI Integration Utilities for Performance Dashboard
 * 
 * This module provides enterprise-grade AI integration capabilities,
 * connecting the Performance Dashboard with the AI Optimizer for
 * intelligent insights, predictions, and automated optimizations.
 */

// import type { AIOptimizer } from '@yaseratiar/react-responsive-easy-ai-optimizer';
import type { 
  PerformanceMetrics, 
  PerformanceAlert, 
  PerformanceSnapshot,
  PerformanceTrends 
} from '../core/PerformanceMonitor';

export interface AIIntegrationConfig {
  aiOptimizer?: unknown; // AIOptimizer
  enableRealTimeOptimization?: boolean;
  enablePredictiveAnalytics?: boolean;
  enableIntelligentAlerts?: boolean;
  optimizationThreshold?: number;
  predictionInterval?: number;
  alertSensitivity?: 'low' | 'medium' | 'high';
}

export interface AIInsight {
  type: 'optimization' | 'prediction' | 'anomaly' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  confidence: number;
  impact: {
    performance: number;
    userExperience: number;
    cost: number;
  };
  actionable: boolean;
  actions?: AIAction[];
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export interface AIAction {
  id: string;
  type: 'optimize' | 'alert' | 'configure' | 'analyze';
  title: string;
  description: string;
  parameters?: Record<string, unknown>;
  estimatedImpact: number;
  risk: 'low' | 'medium' | 'high';
  automated: boolean;
}

export interface AIPrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: number; // milliseconds
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
  recommendations: string[];
}

export interface AIOptimizationResult {
  success: boolean;
  improvements: {
    performance: number;
    userExperience: number;
    cost: number;
  };
  changes: Array<{
    component: string;
    change: string;
    impact: number;
  }>;
  rollbackAvailable: boolean;
  timestamp: number;
}

export interface AIPerformanceAnalysis {
  overallScore: number;
  bottlenecks: Array<{
    component: string;
    impact: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  opportunities: Array<{
    area: string;
    potential: number;
    effort: 'low' | 'medium' | 'high';
    description: string;
  }>;
  trends: PerformanceTrends;
  predictions: AIPrediction[];
  recommendations: AIInsight[];
}

export class AIIntegrationManager {
  private aiOptimizer?: unknown; // AIOptimizer
  private config: AIIntegrationConfig;
  private insights: AIInsight[] = [];
  private predictions: AIPrediction[] = [];
  private optimizationHistory: AIOptimizationResult[] = [];
  private isAnalyzing = false;
  private analysisInterval?: number;

  constructor(config: AIIntegrationConfig = {}) {
    this.config = {
      enableRealTimeOptimization: true,
      enablePredictiveAnalytics: true,
      enableIntelligentAlerts: true,
      optimizationThreshold: 0.1,
      predictionInterval: 30000, // 30 seconds
      alertSensitivity: 'medium',
      ...config
    };
    
    this.aiOptimizer = config.aiOptimizer;
  }

  /**
   * Initialize AI integration
   */
  async initialize(): Promise<void> {
    if (!this.aiOptimizer) {
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console\n        // eslint-disable-next-line no-console\n        console.warn('AI Optimizer not provided - AI features will be limited');
      }
      return;
    }

    try {
      // Test AI Optimizer connection
      await (this.aiOptimizer as { getEnterpriseMetrics: () => Promise<unknown> }).getEnterpriseMetrics();
      
      if (this.config.enablePredictiveAnalytics) {
        this.startPredictiveAnalytics();
      }
      
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console
        // eslint-disable-next-line no-console
        console.log('🤖 AI Integration initialized successfully');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console
        // eslint-disable-next-line no-console
        console.error('Failed to initialize AI integration:', error);
      }
    }
  }

  /**
   * Analyze performance metrics with AI
   */
  async analyzePerformance(metrics: PerformanceMetrics, history: PerformanceSnapshot[]): Promise<AIPerformanceAnalysis> {
    if (this.isAnalyzing) {
      return this.getCachedAnalysis();
    }

    this.isAnalyzing = true;

    try {
      const analysis: AIPerformanceAnalysis = {
        overallScore: this.calculateOverallScore(metrics),
        bottlenecks: await this.identifyBottlenecks(metrics, history),
        opportunities: await this.identifyOpportunities(metrics, history),
        trends: this.analyzeTrends(history),
        predictions: await this.generatePredictions(metrics, history),
        recommendations: await this.generateRecommendations(metrics, history)
      };

      return analysis;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console
        // eslint-disable-next-line no-console
        console.error('AI analysis failed:', error);
      }
      return this.getFallbackAnalysis(metrics);
    } finally {
      this.isAnalyzing = false;
    }
  }

  /**
   * Generate AI insights from performance data
   */
  async generateInsights(metrics: PerformanceMetrics, alerts: PerformanceAlert[]): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    try {
      // Performance optimization insights
      if (this.config.enableRealTimeOptimization && this.aiOptimizer) {
        const optimizationInsights = await this.generateOptimizationInsights(metrics);
        insights.push(...optimizationInsights);
      }

      // Predictive insights
      if (this.config.enablePredictiveAnalytics) {
        const predictiveInsights = await this.generatePredictiveInsights(metrics);
        insights.push(...predictiveInsights);
      }

      // Intelligent alert insights
      if (this.config.enableIntelligentAlerts) {
        const alertInsights = await this.generateAlertInsights(alerts, metrics);
        insights.push(...alertInsights);
      }

      // Store insights
      this.insights = insights;
      
      return insights;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console
        // eslint-disable-next-line no-console
        console.error('Failed to generate AI insights:', error);
      }
      return [];
    }
  }

  /**
   * Perform AI-driven optimization
   */
  async performOptimization(metrics: PerformanceMetrics): Promise<AIOptimizationResult> {
    if (!this.aiOptimizer) {
      throw new Error('AI Optimizer not available');
    }

    try {
      // Check if optimization is needed
      const optimizationScore = this.calculateOptimizationScore(metrics);
      if (optimizationScore < (this.config.optimizationThreshold ?? 0.1)) {
        return {
          success: false,
          improvements: { performance: 0, userExperience: 0, cost: 0 },
          changes: [],
          rollbackAvailable: false,
          timestamp: Date.now()
        };
      }

      // Generate optimization suggestions
      const suggestions = await (this.aiOptimizer as { optimizeScaling: (config: unknown, data: unknown[]) => Promise<unknown> }).optimizeScaling(
        this.extractConfiguration(metrics),
        this.extractUsageData(metrics)
      );

      // Apply optimizations
      const result = await this.applyOptimizations(suggestions, metrics);

      // Store optimization history
      this.optimizationHistory.push(result);

      return result;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console
        // eslint-disable-next-line no-console
        console.error('AI optimization failed:', error);
      }
      return {
        success: false,
        improvements: { performance: 0, userExperience: 0, cost: 0 },
        changes: [],
        rollbackAvailable: false,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Get AI insights
   */
  getInsights(): AIInsight[] {
    return [...this.insights];
  }

  /**
   * Get AI predictions
   */
  getPredictions(): AIPrediction[] {
    return [...this.predictions];
  }

  /**
   * Get optimization history
   */
  getOptimizationHistory(): AIOptimizationResult[] {
    return [...this.optimizationHistory];
  }

  /**
   * Update AI configuration
   */
  updateConfig(newConfig: Partial<AIIntegrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.predictionInterval && this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.startPredictiveAnalytics();
    }
  }

  /**
   * Dispose of AI integration
   */
  dispose(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
    
    this.insights = [];
    this.predictions = [];
    this.optimizationHistory = [];
    this.isAnalyzing = false;
  }

  // Private methods

  private startPredictiveAnalytics(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }

    this.analysisInterval = window.setInterval(() => {
      try {
        // Generate periodic predictions
        void this.updatePredictions();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // Use proper logging instead of console
          // eslint-disable-next-line no-console
          console.error('Predictive analytics error:', error);
        }
      }
    }, this.config.predictionInterval);
  }

  private updatePredictions(): Promise<void> {
    // This would integrate with the AI Optimizer to generate predictions
    // For now, we'll create mock predictions based on current metrics
    const mockPredictions: AIPrediction[] = [
      {
        metric: 'layoutShift',
        currentValue: 0.05,
        predictedValue: 0.08,
        confidence: 0.85,
        timeframe: 300000, // 5 minutes
        trend: 'increasing',
        factors: ['increased user interaction', 'new content loading'],
        recommendations: ['Optimize image loading', 'Implement layout stability']
      }
    ];

    this.predictions = mockPredictions;
    return Promise.resolve();
  }

  private calculateOverallScore(metrics: PerformanceMetrics): number {
    let score = 100;

    // Deduct for layout shift
    if (metrics.layoutShift.current > 0.1) {
      score -= Math.min(30, metrics.layoutShift.current * 100);
    }

    // Deduct for memory usage
    if (metrics.memory && metrics.memory.usage > 0.8) {
      score -= Math.min(20, (metrics.memory.usage - 0.8) * 100);
    }

    // Deduct for slow LCP
    if (metrics.paintTiming.lcp && metrics.paintTiming.lcp > 2500) {
      score -= Math.min(25, (metrics.paintTiming.lcp - 2500) / 100);
    }

    return Math.max(0, Math.round(score));
  }

  private identifyBottlenecks(metrics: PerformanceMetrics, _history: PerformanceSnapshot[]): Promise<Array<{
    component: string;
    impact: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>> {
    const bottlenecks = [];

    // Layout shift bottleneck
    if (metrics.layoutShift.current > 0.1) {
      bottlenecks.push({
        component: 'Layout System',
        impact: metrics.layoutShift.current * 100,
        severity: (metrics.layoutShift.current > 0.25 ? 'high' : 'medium') as 'low' | 'medium' | 'high',
        description: 'Layout shift is causing visual instability'
      });
    }

    // Memory bottleneck
    if (metrics.memory && metrics.memory.usage > 0.8) {
      bottlenecks.push({
        component: 'Memory Management',
        impact: (metrics.memory.usage - 0.8) * 100,
        severity: (metrics.memory.usage > 0.9 ? 'high' : 'medium') as 'low' | 'medium' | 'high',
        description: 'High memory usage may cause performance degradation'
      });
    }

    // Responsive elements bottleneck
    if (metrics.responsiveElements.count > 100) {
      bottlenecks.push({
        component: 'Responsive Elements',
        impact: Math.min(50, (metrics.responsiveElements.count - 100) * 0.5),
        severity: (metrics.responsiveElements.count > 200 ? 'high' : 'medium') as 'low' | 'medium' | 'high',
        description: 'Large number of responsive elements may impact performance'
      });
    }

    return Promise.resolve(bottlenecks);
  }

  private identifyOpportunities(metrics: PerformanceMetrics, _history: PerformanceSnapshot[]): Promise<Array<{
    area: string;
    potential: number;
    effort: 'low' | 'medium' | 'high';
    description: string;
  }>> {
    const opportunities = [];

    // Cache optimization opportunity
    if (metrics.custom?.cacheHitRate && metrics.custom.cacheHitRate < 0.8) {
      opportunities.push({
        area: 'Caching Strategy',
        potential: (0.8 - metrics.custom.cacheHitRate) * 100,
        effort: 'low' as 'low' | 'medium' | 'high',
        description: 'Improve cache hit rate for better performance'
      });
    }

    // Resource optimization opportunity
    if (metrics.resources.averageLoadTime > 1000) {
      opportunities.push({
        area: 'Resource Loading',
        potential: Math.min(50, (metrics.resources.averageLoadTime - 1000) / 100),
        effort: 'medium' as 'low' | 'medium' | 'high',
        description: 'Optimize resource loading times'
      });
    }

    return Promise.resolve(opportunities);
  }

  private analyzeTrends(history: PerformanceSnapshot[]): PerformanceTrends {
    if (history.length < 2) {
      return {
        layoutShift: 'stable',
        memory: 'stable',
        lcp: 'stable',
        responsiveElements: 'stable'
      };
    }

    const recent = history.slice(-10);
    const older = history.slice(-20, -10);

    return {
      layoutShift: this.calculateTrend(
        older.map(s => s.metrics.layoutShift.current),
        recent.map(s => s.metrics.layoutShift.current)
      ),
      memory: this.calculateTrend(
        older.map(s => s.metrics.memory?.usage ?? 0),
        recent.map(s => s.metrics.memory?.usage ?? 0)
      ),
      lcp: this.calculateTrend(
        older.map(s => s.metrics.paintTiming.lcp ?? 0),
        recent.map(s => s.metrics.paintTiming.lcp ?? 0)
      ),
      responsiveElements: this.calculateTrend(
        older.map(s => s.metrics.responsiveElements.count),
        recent.map(s => s.metrics.responsiveElements.count)
      )
    };
  }

  private calculateTrend(older: number[], recent: number[]): 'improving' | 'degrading' | 'stable' {
    if (older.length === 0 || recent.length === 0) return 'stable';
    
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.05) return 'degrading';
    if (change < -0.05) return 'improving';
    return 'stable';
  }

  private generatePredictions(metrics: PerformanceMetrics, _history: PerformanceSnapshot[]): Promise<AIPrediction[]> {
    // This would use the AI Optimizer for actual predictions
    // For now, return mock predictions
    return Promise.resolve([
      {
        metric: 'layoutShift',
        currentValue: metrics.layoutShift.current,
        predictedValue: metrics.layoutShift.current * 1.2,
        confidence: 0.8,
        timeframe: 300000,
        trend: 'increasing',
        factors: ['user interaction patterns', 'content changes'],
        recommendations: ['Implement layout stability', 'Optimize image loading']
      }
    ]);
  }

  private generateRecommendations(metrics: PerformanceMetrics, _history: PerformanceSnapshot[]): Promise<AIInsight[]> {
    const recommendations: AIInsight[] = [];

    if (metrics.layoutShift.current > 0.1) {
      recommendations.push({
        type: 'recommendation',
        severity: 'warning',
        title: 'Optimize Layout Stability',
        description: 'High layout shift detected. Consider implementing CSS containment or size hints.',
        confidence: 0.9,
        impact: { performance: 0.2, userExperience: 0.3, cost: 0.1 },
        actionable: true,
        actions: [{
          id: 'layout-optimization',
          type: 'optimize',
          title: 'Apply Layout Optimizations',
          description: 'Implement CSS containment and size hints',
          estimatedImpact: 0.25,
          risk: 'low',
          automated: true
        }],
        timestamp: Date.now()
      });
    }

    return Promise.resolve(recommendations);
  }

  private async generateOptimizationInsights(metrics: PerformanceMetrics): Promise<AIInsight[]> {
    if (!this.aiOptimizer) return Promise.resolve([]);

    try {
      const suggestions = await (this.aiOptimizer as { optimizeScaling: (config: unknown, data: unknown[]) => Promise<unknown> }).optimizeScaling(
        this.extractConfiguration(metrics),
        this.extractUsageData(metrics)
      );

      return Promise.resolve([{
        type: 'optimization',
        severity: (suggestions as { confidenceScore: number }).confidenceScore > 0.8 ? 'info' : 'warning',
        title: 'AI Optimization Available',
        description: `AI suggests ${(suggestions as { suggestedTokens?: unknown }).suggestedTokens ? 'token optimizations' : 'performance improvements'}`,
        confidence: (suggestions as { confidenceScore: number }).confidenceScore,
        impact: {
          performance: ((suggestions as { estimatedImprovements?: { performance?: { renderTime?: number } } }).estimatedImprovements?.performance?.renderTime) ?? 0,
          userExperience: ((suggestions as { estimatedImprovements?: { userExperience?: { interactionRate?: number } } }).estimatedImprovements?.userExperience?.interactionRate) ?? 0,
          cost: 0.1
        },
        actionable: true,
        actions: [{
          id: 'ai-optimization',
          type: 'optimize',
          title: 'Apply AI Optimizations',
          description: 'Apply AI-suggested performance optimizations',
          estimatedImpact: (suggestions as { confidenceScore: number }).confidenceScore,
          risk: 'low',
          automated: true
        }],
        timestamp: Date.now()
      }]);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // Use proper logging instead of console
        // eslint-disable-next-line no-console
        console.error('Failed to generate optimization insights:', error);
      }
      return Promise.resolve([]);
    }
  }

  private generatePredictiveInsights(metrics: PerformanceMetrics): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Predict memory issues
    if (metrics.memory && metrics.memory.usage > 0.7) {
      insights.push({
        type: 'prediction',
        severity: 'warning',
        title: 'Memory Usage Trend',
        description: 'Memory usage is trending upward and may cause performance issues',
        confidence: 0.75,
        impact: { performance: 0.3, userExperience: 0.2, cost: 0.1 },
        actionable: true,
        timestamp: Date.now()
      });
    }

    return Promise.resolve(insights);
  }

  private generateAlertInsights(alerts: PerformanceAlert[], _metrics: PerformanceMetrics): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    alerts.forEach(alert => {
      insights.push({
        type: 'anomaly',
        severity: alert.severity,
        title: `AI Analysis: ${alert.type}`,
        description: `AI detected ${alert.type} issue with confidence ${alert.value > alert.threshold ? 'high' : 'medium'}`,
        confidence: 0.8,
        impact: {
          performance: alert.type === 'memory' ? 0.3 : 0.2,
          userExperience: alert.type === 'layout-shift' ? 0.4 : 0.2,
          cost: 0.1
        },
        actionable: true,
        timestamp: Date.now()
      });
    });

    return Promise.resolve(insights);
  }

  private calculateOptimizationScore(metrics: PerformanceMetrics): number {
    let score = 0;

    // Layout shift optimization potential
    if (metrics.layoutShift.current > 0.05) {
      score += metrics.layoutShift.current * 2;
    }

    // Memory optimization potential
    if (metrics.memory && metrics.memory.usage > 0.7) {
      score += (metrics.memory.usage - 0.7) * 2;
    }

    // Responsive elements optimization potential
    if (metrics.responsiveElements.count > 50) {
      score += Math.min(0.3, (metrics.responsiveElements.count - 50) * 0.01);
    }

    return Math.min(1, score);
  }

  private extractConfiguration(_metrics: PerformanceMetrics): unknown {
    // Extract configuration from metrics for AI Optimizer
    return {
      breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 },
      base: { width: 100, height: 100 },
      strategy: 'responsive'
    };
  }

  private extractUsageData(metrics: PerformanceMetrics): unknown[] {
    // Extract usage data from metrics for AI Optimizer
    return [{
      componentType: 'responsive-element',
      responsiveValues: {
        width: metrics.responsiveElements.count * 10,
        height: metrics.responsiveElements.count * 5
      },
      context: {
        position: 'center',
        importance: 'high'
      }
    }];
  }

  private applyOptimizations(_suggestions: unknown, _metrics: PerformanceMetrics): Promise<AIOptimizationResult> {
    // This would apply the actual optimizations
    // For now, return a mock result
    return Promise.resolve({
      success: true,
      improvements: {
        performance: 0.15,
        userExperience: 0.2,
        cost: 0.05
      },
      changes: [{
        component: 'responsive-elements',
        change: 'Optimized token calculations',
        impact: 0.15
      }],
      rollbackAvailable: true,
      timestamp: Date.now()
    });
  }

  private getCachedAnalysis(): AIPerformanceAnalysis {
    return {
      overallScore: 85,
      bottlenecks: [],
      opportunities: [],
      trends: {
        layoutShift: 'stable',
        memory: 'stable',
        lcp: 'stable',
        responsiveElements: 'stable'
      },
      predictions: [],
      recommendations: []
    };
  }

  private getFallbackAnalysis(metrics: PerformanceMetrics): AIPerformanceAnalysis {
    return {
      overallScore: this.calculateOverallScore(metrics),
      bottlenecks: [],
      opportunities: [],
      trends: {
        layoutShift: 'stable',
        memory: 'stable',
        lcp: 'stable',
        responsiveElements: 'stable'
      },
      predictions: [],
      recommendations: []
    };
  }
}
