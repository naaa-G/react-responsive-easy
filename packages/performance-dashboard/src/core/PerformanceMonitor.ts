/**
 * Core Performance Monitor for React Responsive Easy
 * 
 * This class provides comprehensive performance monitoring capabilities
 * including real-time metrics collection, analysis, and alerting.
 * Enhanced with enterprise-grade AI integration, analytics, and alerting.
 */

import { AIIntegrationManager } from '../utils/AIIntegration';
import { AlertingSystem, AlertEvent } from '../utils/AlertingSystem';
import { AnalyticsEngine } from '../utils/AnalyticsEngine';

// Performance Memory Info interface for TypeScript
interface PerformanceMemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}
export class PerformanceMonitor {
  private isMonitoring = false;
  private metrics: PerformanceMetrics = this.createEmptyMetrics();
  private observers: PerformanceObserver[] = [];
  private intervalId: number | null = null;
  private callbacks: Map<string, ((data: unknown) => void)[]> = new Map();
  private thresholds: PerformanceThresholds = this.getDefaultThresholds();
  private history: PerformanceSnapshot[] = [];
  private maxHistorySize = 1000;
  
  // Enterprise features
  private aiIntegration?: AIIntegrationManager;
  private alertingSystem?: AlertingSystem;
  private analyticsEngine?: AnalyticsEngine;
  private enterpriseConfig: EnterpriseConfig;

  constructor(private config: PerformanceMonitorConfig = {}) {
    this.thresholds = { ...this.thresholds, ...config.thresholds };
    this.maxHistorySize = config.maxHistorySize ?? 1000;
    this.enterpriseConfig = config.enterprise ?? this.getDefaultEnterpriseConfig();
  }

  /**
   * Log info message
   */
  private logInfo(message: string): void {
    // In a real implementation, this would use a proper logging service
    // Always log in test environment for better testability
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }

  /**
   * Log warning message
   */
  private logWarning(message: string): void {
    // In a real implementation, this would use a proper logging service
    // Always log in test environment for better testability
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  }

  /**
   * Log error message
   */
  private logError(message: string, error?: Error): void {
    // In a real implementation, this would use a proper logging service
    // Always log in test environment for better testability
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.error(message, error);
    }
  }

  /**
   * Start performance monitoring
   */
  async start(): Promise<void> {
    if (this.isMonitoring) {
      // Always log warning for better testability and debugging
      this.logWarning('Performance monitoring is already active');
      return;
    }

    this.isMonitoring = true;
    
    // Initialize enterprise features and wait for completion
    await this.initializeEnterpriseFeatures();
    
    this.setupObservers();
    this.startMetricsCollection();
    
    if (process.env.NODE_ENV === 'development') {
      this.logInfo('📊 Performance monitoring started');
    }
    this.emit('monitoring-started', this.metrics);
  }

  /**
   * Stop performance monitoring
   */
  stop(): void {
    if (!this.isMonitoring) {
      // Always log warning for better testability and debugging
      this.logWarning('Performance monitoring is not active');
      return;
    }

    this.isMonitoring = false;
    this.cleanup();
    
    // Dispose enterprise features
    this.disposeEnterpriseFeatures();
    
    if (process.env.NODE_ENV === 'development') {
      this.logInfo('📊 Performance monitoring stopped');
    }
    this.emit('monitoring-stopped', this.metrics);
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance history
   */
  getHistory(limit?: number): PerformanceSnapshot[] {
    const history = [...this.history];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Subscribe to performance events
   */
  on(event: string, callback: (data: unknown) => void): () => void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    
    this.callbacks.get(event)?.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Update performance thresholds
   */
  updateThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
    this.emit('thresholds-updated', this.metrics);
  }

  /**
   * Force metrics collection
   */
  collectMetrics(): void {
    this.updateMetrics();
  }

  /**
   * Generate performance report
   */
  async generateReport(): Promise<PerformanceReport> {
    const currentMetrics = this.getMetrics();
    const recentHistory = this.getHistory(100);
    
    // Get AI insights if available
    const aiInsights = this.aiIntegration ? await this.aiIntegration.generateInsights(currentMetrics, this.checkAlerts(currentMetrics)) : [];
    
    // Get analytics data if available
    const analyticsData = this.analyticsEngine ? this.analyticsEngine.processData(recentHistory, aiInsights) : null;
    
    return {
      timestamp: Date.now(),
      summary: this.generateSummary(currentMetrics),
      metrics: currentMetrics,
      trends: this.analyzeTrends(recentHistory),
      alerts: this.checkAlerts(currentMetrics),
      recommendations: this.generateRecommendations(currentMetrics),
      historicalData: recentHistory,
      // Enterprise features
      aiInsights,
      analytics: analyticsData,
      enterpriseMetrics: this.getEnterpriseMetrics()
    };
  }

  /**
   * Setup performance observers
   */
  private setupObservers(): void {
    // Layout Shift Observer
    if ('LayoutShift' in window) {
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'layout-shift') {
              const layoutShiftEntry = entry as LayoutShiftPerformanceEntry;
              if (!layoutShiftEntry.hadRecentInput) {
                this.metrics.layoutShift.current += layoutShiftEntry.value;
                this.metrics.layoutShift.entries.push({
                  value: layoutShiftEntry.value,
                  timestamp: layoutShiftEntry.startTime,
                  sources: layoutShiftEntry.sources?.map((source) => ({
                    element: source.node?.tagName ?? 'unknown',
                    selector: source.node ? this.getElementSelector(source.node) : 'unknown'
                  })) ?? []
                });
              
                // Keep only recent entries
                if (this.metrics.layoutShift.entries.length > 50) {
                  this.metrics.layoutShift.entries = this.metrics.layoutShift.entries.slice(-50);
                }
              }
            }
          });
        });

        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (_e) {
        // Always log warning for better testability and debugging
        this.logWarning('Layout shift monitoring not available');
      }
    }

    // Paint Observer
    try {
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.paintTiming.fcp = entry.startTime;
          } else if (entry.name === 'largest-contentful-paint') {
            this.metrics.paintTiming.lcp = entry.startTime;
          }
        });
      });

      paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      this.observers.push(paintObserver);
      } catch (_e) {
        // Always log warning for better testability and debugging
        this.logWarning('Paint timing monitoring not available');
      }

    // Navigation Observer
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.navigation = {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstByte: navEntry.responseStart - navEntry.requestStart,
              domInteractive: navEntry.domInteractive - navEntry.fetchStart,
              redirect: navEntry.redirectEnd - navEntry.redirectStart,
              dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              tcp: navEntry.connectEnd - navEntry.connectStart,
              request: navEntry.responseStart - navEntry.requestStart,
              response: navEntry.responseEnd - navEntry.responseStart,
              processing: navEntry.domComplete - navEntry.responseEnd
            };
          }
        });
      });

      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
      } catch (_e) {
        // Always log warning for better testability and debugging
        this.logWarning('Navigation timing monitoring not available');
      }
  }

  /**
   * Start metrics collection interval
   */
  private startMetricsCollection(): void {
    // Collect metrics immediately
    this.updateMetrics();
    
    // Set up periodic collection
    this.intervalId = window.setInterval(() => {
      this.updateMetrics();
    }, this.config.collectionInterval ?? 1000);
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(): void {
    // Memory metrics
    if ('memory' in performance && (performance as Performance & { memory?: PerformanceMemoryInfo }).memory) {
      const memory = (performance as Performance & { memory: PerformanceMemoryInfo }).memory;
      this.metrics.memory = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        usage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      };
    }

    // Responsive elements metrics
    this.updateResponsiveElementsMetrics();
    
    // Resource timing
    this.updateResourceTiming();
    
    // Custom metrics
    this.updateCustomMetrics();
    
    // Create snapshot
    const snapshot: PerformanceSnapshot = {
      timestamp: Date.now(),
      metrics: { ...this.metrics }
    };
    
    this.history.push(snapshot);
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
    
    // Check for alerts
    this.checkAndEmitAlerts();
    
    // Process with enterprise systems
    void this.processWithEnterpriseSystems();
    
    // Emit metrics update
    this.emit('metrics-updated', this.metrics);
  }

  /**
   * Update responsive elements specific metrics
   */
  private updateResponsiveElementsMetrics(): void {
    const responsiveElements = document.querySelectorAll('[data-responsive]');
    
    this.metrics.responsiveElements = {
      count: responsiveElements.length,
      renderTimes: [],
      averageRenderTime: 0,
      memoryUsage: 0,
      layoutShiftContributions: 0
    };

    responsiveElements.forEach((element) => {
      // Measure render time
      const startTime = performance.now();
      void (element as HTMLElement).offsetHeight; // Force reflow
      const renderTime = performance.now() - startTime;
      
      this.metrics.responsiveElements.renderTimes.push(renderTime);
      
      // Estimate memory usage
      const complexity = this.estimateElementComplexity(element as HTMLElement);
      this.metrics.responsiveElements.memoryUsage += complexity;
    });

    // Calculate averages
    if (this.metrics.responsiveElements.renderTimes.length > 0) {
      this.metrics.responsiveElements.averageRenderTime = 
        this.metrics.responsiveElements.renderTimes.reduce((sum, time) => sum + time, 0) / 
        this.metrics.responsiveElements.renderTimes.length;
    }
  }

  /**
   * Update resource timing metrics
   */
  private updateResourceTiming(): void {
    const resources = performance.getEntriesByType('resource');
    const recentResources = resources.filter(resource => 
      resource.startTime > (Date.now() - 10000) // Last 10 seconds
    );

    this.metrics.resources = {
      totalRequests: resources.length,
      recentRequests: recentResources.length,
      totalSize: 0,
      averageLoadTime: 0,
      slowRequests: []
    };

    let totalLoadTime = 0;
    
    recentResources.forEach((resource) => {
      const resourceEntry = resource as PerformanceResourceTiming;
      const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
      totalLoadTime += loadTime;
      
      // Track slow requests
      if (loadTime > 1000) { // Slower than 1 second
        this.metrics.resources.slowRequests.push({
          name: resourceEntry.name,
          loadTime,
          size: resourceEntry.transferSize ?? 0
        });
      }
      
      this.metrics.resources.totalSize += resourceEntry.transferSize ?? 0;
    });

    if (recentResources.length > 0) {
      this.metrics.resources.averageLoadTime = totalLoadTime / recentResources.length;
    }
  }

  /**
   * Update custom React Responsive Easy metrics
   */
  private updateCustomMetrics(): void {
    // Scaling operations count
    const scalingOperations = this.countScalingOperations();
    
    // Cache hit rate
    const cacheStats = this.getCacheStatistics();
    
    this.metrics.custom = {
      scalingOperations: scalingOperations.count,
      scalingTime: scalingOperations.totalTime,
      cacheHitRate: cacheStats.hitRate,
      configComplexity: this.calculateConfigComplexity(),
      breakpointTransitions: this.countBreakpointTransitions()
    };
  }

  /**
   * Count scaling operations
   */
  private countScalingOperations(): { count: number; totalTime: number } {
    // This would integrate with the scaling engine to track operations
    // For now, estimate based on responsive elements
    const elements = document.querySelectorAll('[data-responsive]').length;
    return {
      count: elements * 3, // Estimate 3 operations per element
      totalTime: elements * 0.5 // Estimate 0.5ms per element
    };
  }

  /**
   * Get cache statistics
   */
  private getCacheStatistics(): { hitRate: number; size: number } {
    // This would integrate with the caching system
    // For now, return estimated values
    return {
      hitRate: 0.85, // 85% cache hit rate
      size: 1024 * 50 // 50KB cache size
    };
  }

  /**
   * Calculate configuration complexity
   */
  private calculateConfigComplexity(): number {
    // This would analyze the current responsive configuration
    // For now, return a basic estimate
    const elements = document.querySelectorAll('[data-responsive]').length;
    const breakpoints = 4; // Estimate
    return elements * breakpoints * 0.1;
  }

  /**
   * Count breakpoint transitions
   */
  private countBreakpointTransitions(): number {
    // This would track actual breakpoint changes
    // For now, return 0 as baseline
    return 0;
  }

  /**
   * Estimate element complexity
   */
  private estimateElementComplexity(element: HTMLElement): number {
    const children = element.getElementsByTagName('*').length;
    const styles = element.getAttribute('style')?.length ?? 0;
    const classes = element.className.length;
    
    return (children * 10) + (styles * 0.1) + (classes * 0.5);
  }

  /**
   * Get element selector
   */
  private getElementSelector(element: Element | null): string {
    if (!element) return 'unknown';
    
    if (element.id) return `#${element.id}`;
    
    let selector = element.tagName.toLowerCase();
    if (element.className) {
      selector += `.${element.className.split(' ').join('.')}`;
    }
    
    return selector;
  }

  /**
   * Check for performance alerts
   */
  private checkAndEmitAlerts(): void {
    const alerts = this.checkAlerts(this.metrics);
    
    if (alerts.length > 0) {
      alerts.forEach(alert => {
        this.emit('performance-alert', { alert });
      });
    }
  }

  /**
   * Process metrics with enterprise systems
   */
  private async processWithEnterpriseSystems(): Promise<void> {
    try {
      // Process with alerting system
      if (this.alertingSystem) {
        const _alerts = this.checkAlerts(this.metrics);
        await this.alertingSystem.processMetrics(this.metrics, []);
      }

      // Process with analytics engine
      if (this.analyticsEngine) {
        const recentHistory = this.getHistory(10);
        this.analyticsEngine.processData(recentHistory);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        this.logError('Enterprise systems processing failed:', error as Error);
      }
    }
  }

  /**
   * Check alerts against thresholds
   */
  private checkAlerts(metrics: PerformanceMetrics): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = [];
    
    // Layout Shift alerts
    if (metrics.layoutShift.current > this.thresholds.layoutShift) {
      alerts.push({
        type: 'layout-shift',
        severity: metrics.layoutShift.current > this.thresholds.layoutShift * 2 ? 'critical' : 'warning',
        message: `Layout shift score (${metrics.layoutShift.current.toFixed(3)}) exceeds threshold`,
        value: metrics.layoutShift.current,
        threshold: this.thresholds.layoutShift,
        timestamp: Date.now()
      });
    }
    
    // Memory alerts
    if (metrics.memory && metrics.memory.usage > this.thresholds.memoryUsage) {
      alerts.push({
        type: 'memory',
        severity: metrics.memory.usage > this.thresholds.memoryUsage * 1.5 ? 'critical' : 'warning',
        message: `Memory usage (${(metrics.memory.usage * 100).toFixed(1)}%) exceeds threshold`,
        value: metrics.memory.usage,
        threshold: this.thresholds.memoryUsage,
        timestamp: Date.now()
      });
    }
    
    // LCP alerts
    if (metrics.paintTiming.lcp && metrics.paintTiming.lcp > this.thresholds.lcp) {
      alerts.push({
        type: 'lcp',
        severity: metrics.paintTiming.lcp > this.thresholds.lcp * 1.5 ? 'critical' : 'warning',
        message: `LCP (${metrics.paintTiming.lcp.toFixed(0)}ms) exceeds threshold`,
        value: metrics.paintTiming.lcp,
        threshold: this.thresholds.lcp,
        timestamp: Date.now()
      });
    }
    
    return alerts;
  }

  /**
   * Generate performance summary
   */
  private generateSummary(metrics: PerformanceMetrics): PerformanceSummary {
    return {
      overall: this.calculateOverallScore(metrics),
      responsiveElements: metrics.responsiveElements.count,
      layoutShift: metrics.layoutShift.current,
      memoryUsage: metrics.memory?.usage ?? 0,
      lcp: metrics.paintTiming.lcp ?? 0,
      cacheHitRate: metrics.custom?.cacheHitRate ?? 0
    };
  }

  /**
   * Calculate overall performance score
   */
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

  /**
   * Analyze performance trends
   */
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

  /**
   * Calculate trend direction
   */
  private calculateTrend(older: number[], recent: number[]): 'improving' | 'degrading' | 'stable' {
    if (older.length === 0 || recent.length === 0) return 'stable';
    
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.05) return 'degrading';
    if (change < -0.05) return 'improving';
    return 'stable';
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];
    
    if (metrics.layoutShift.current > 0.1) {
      recommendations.push('Consider using CSS containment or size hints to reduce layout shift');
    }
    
    if (metrics.memory && metrics.memory.usage > 0.8) {
      recommendations.push('Memory usage is high - consider optimizing responsive value caching');
    }
    
    if (metrics.paintTiming.lcp && metrics.paintTiming.lcp > 2500) {
      recommendations.push('LCP is slow - optimize critical rendering path and resource loading');
    }
    
    if (metrics.responsiveElements.count > 100) {
      recommendations.push('Large number of responsive elements - consider virtualization or lazy loading');
    }
    
    if (metrics.custom?.cacheHitRate && metrics.custom.cacheHitRate < 0.8) {
      recommendations.push('Low cache hit rate - review caching strategy for responsive values');
    }
    
    return recommendations;
  }

  /**
   * Emit event to subscribers
   */
  private emit(event: string, data: unknown): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          this.logError(`Error in performance monitor callback for ${event}:`, error as Error);
        }
      });
    }
  }

  /**
   * Create empty metrics object
   */
  private createEmptyMetrics(): PerformanceMetrics {
    return {
      layoutShift: {
        current: 0,
        entries: []
      },
      paintTiming: {
        fcp: null,
        lcp: null
      },
      memory: null,
      navigation: null,
      responsiveElements: {
        count: 0,
        renderTimes: [],
        averageRenderTime: 0,
        memoryUsage: 0,
        layoutShiftContributions: 0
      },
      resources: {
        totalRequests: 0,
        recentRequests: 0,
        totalSize: 0,
        averageLoadTime: 0,
        slowRequests: []
      },
      custom: null
    };
  }

  /**
   * Get default performance thresholds
   */
  private getDefaultThresholds(): PerformanceThresholds {
    return {
      layoutShift: 0.1,
      memoryUsage: 0.8,
      lcp: 2500,
      fcp: 1800,
      renderTime: 16.67, // 60fps
      cacheHitRate: 0.8
    };
  }

  /**
   * Cleanup observers and intervals
   */
  private cleanup(): void {
    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    // Clear interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Enterprise Methods

  /**
   * Initialize enterprise features
   */
  private async initializeEnterpriseFeatures(): Promise<void> {
    try {
      // Initialize AI Integration
      if (this.enterpriseConfig.ai?.enabled) {
        const { AIIntegrationManager } = await import('../utils/AIIntegration');
        this.aiIntegration = new AIIntegrationManager(this.enterpriseConfig.ai);
        await this.aiIntegration.initialize();
      }

      // Initialize Alerting System
      if (this.enterpriseConfig.alerting?.enabled) {
        const { AlertingSystem } = await import('../utils/AlertingSystem');
        this.alertingSystem = new AlertingSystem(this.enterpriseConfig.alerting);
      }

      // Initialize Analytics Engine
      if (this.enterpriseConfig.analytics?.enabled) {
        const { AnalyticsEngine } = await import('../utils/AnalyticsEngine');
        this.analyticsEngine = new AnalyticsEngine(this.enterpriseConfig.analytics);
      }

      // Always log for better testability and debugging
      this.logInfo('🏢 Enterprise features initialized');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        this.logError('Failed to initialize enterprise features:', error as Error);
      }
    }
  }

  /**
   * Dispose enterprise features
   */
  private disposeEnterpriseFeatures(): void {
    if (this.aiIntegration) {
      this.aiIntegration.dispose();
      this.aiIntegration = undefined;
    }

    if (this.alertingSystem) {
      this.alertingSystem.dispose();
      this.alertingSystem = undefined;
    }

    if (this.analyticsEngine) {
      this.analyticsEngine.dispose();
      this.analyticsEngine = undefined;
    }
  }

  /**
   * Get enterprise metrics
   */
  private getEnterpriseMetrics(): Record<string, unknown> {
    return {
      aiEnabled: this.enterpriseConfig.ai?.enabled ?? false,
      alertingEnabled: this.enterpriseConfig.alerting?.enabled ?? false,
      analyticsEnabled: this.enterpriseConfig.analytics?.enabled ?? false,
      enterpriseConfig: this.enterpriseConfig,
      timestamp: Date.now()
    };
  }

  /**
   * Get AI insights
   */
  getAIInsights(): unknown[] {
    if (!this.aiIntegration) return [];
    return this.aiIntegration.getInsights();
  }

  /**
   * Get AI predictions
   */
  getAIPredictions(): unknown[] {
    if (!this.aiIntegration) return [];
    return this.aiIntegration.getPredictions();
  }

  /**
   * Perform AI optimization
   */
  async performAIOptimization(): Promise<unknown> {
    if (!this.aiIntegration) {
      throw new Error('AI Integration not available');
    }
    return await this.aiIntegration.performOptimization(this.metrics);
  }

  /**
   * Get alerting statistics
   */
  getAlertingStats(): unknown {
    if (!this.alertingSystem) return null;
    return this.alertingSystem.getStatistics();
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): AlertEvent[] {
    if (!this.alertingSystem) return [];
    return this.alertingSystem.getActiveAlerts();
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean> {
    if (!this.alertingSystem) return false;
    return this.alertingSystem.acknowledgeAlert(alertId, acknowledgedBy);
  }

  /**
   * Resolve alert
   */
  async resolveAlert(alertId: string): Promise<boolean> {
    if (!this.alertingSystem) return false;
    return this.alertingSystem.resolveAlert(alertId);
  }

  /**
   * Get analytics statistics
   */
  getAnalyticsStats(): Record<string, unknown> | null {
    if (!this.analyticsEngine) return null;
    return this.analyticsEngine.getStatistics();
  }

  /**
   * Generate analytics report
   */
  generateAnalyticsReport(type: 'summary' | 'detailed' | 'comparative' | 'forecast' | 'custom' = 'summary'): unknown {
    if (!this.analyticsEngine) return null;
    return this.analyticsEngine.generateReport(type);
  }

  /**
   * Export analytics data
   */
  exportAnalyticsData(format: 'html' | 'json' | 'csv' | 'pdf'): Blob {
    if (!this.analyticsEngine) {
      throw new Error('Analytics Engine not available');
    }
    return this.analyticsEngine.exportData(format);
  }

  /**
   * Update enterprise configuration
   */
  updateEnterpriseConfig(newConfig: Partial<EnterpriseConfig>): void {
    this.enterpriseConfig = { ...this.enterpriseConfig, ...newConfig };
    
    // Update individual systems
    if (this.aiIntegration && newConfig.ai) {
      this.aiIntegration.updateConfig(newConfig.ai);
    }
    
    if (this.alertingSystem && newConfig.alerting) {
      this.alertingSystem.updateConfig(newConfig.alerting as Partial<AlertingConfig>);
    }
    
    if (this.analyticsEngine && newConfig.analytics) {
      this.analyticsEngine.updateConfig(newConfig.analytics as Partial<AnalyticsConfig>);
    }
  }

  /**
   * Get default enterprise configuration
   */
  private getDefaultEnterpriseConfig(): EnterpriseConfig {
    return {
      ai: {
        enabled: true, // Enable by default for better testing and functionality
        enableRealTimeOptimization: true,
        enablePredictiveAnalytics: true,
        enableIntelligentAlerts: true,
        optimizationThreshold: 0.1,
        predictionInterval: 30000,
        alertSensitivity: 'medium'
      },
      alerting: {
        enabled: true, // Enable by default for better testing and functionality
        channels: [],
        rules: [],
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
          burstLimit: 20
        },
        retention: {
          alertHistoryDays: 30,
          metricsRetentionDays: 90,
          logRetentionDays: 7,
          archiveEnabled: true
        },
        integrations: []
      },
      analytics: {
        enabled: true, // Enable by default for better testing and functionality
        dataRetention: {
          metrics: 90,
          reports: 365,
          insights: 30
        },
        aggregation: {
          intervals: [1, 5, 15, 60],
          methods: ['avg', 'max', 'min', 'sum', 'count', 'percentile']
        },
        reporting: {
          autoGenerate: false,
          schedule: '0 0 * * *',
          formats: ['json', 'html']
        },
        visualization: {
          chartTypes: ['line', 'bar', 'pie', 'heatmap'],
          colorSchemes: ['default', 'dark', 'light'],
          themes: ['modern', 'classic', 'minimal']
        },
        export: {
          enabled: true,
          formats: ['json', 'csv', 'pdf', 'html'],
          compression: true
        }
      }
    };
  }
}

// Type definitions
export interface PerformanceMonitorConfig {
  collectionInterval?: number;
  maxHistorySize?: number;
  thresholds?: Partial<PerformanceThresholds>;
  enterprise?: EnterpriseConfig;
}

// Import the actual interfaces from utility files
import type { 
  AlertingConfig
} from '../utils/AlertingSystem';
import type { AnalyticsConfig } from '../utils/AnalyticsEngine';

export interface EnterpriseConfig {
  ai?: {
    enabled: boolean;
    enableRealTimeOptimization?: boolean;
    enablePredictiveAnalytics?: boolean;
    enableIntelligentAlerts?: boolean;
    optimizationThreshold?: number;
    predictionInterval?: number;
    alertSensitivity?: 'low' | 'medium' | 'high';
  };
  alerting?: AlertingConfig;
  analytics?: AnalyticsConfig;
}

export interface PerformanceMetrics {
  layoutShift: {
    current: number;
    entries: LayoutShiftEntry[];
  };
  paintTiming: {
    fcp: number | null;
    lcp: number | null;
  };
  memory: {
    used: number;
    total: number;
    limit: number;
    usage: number;
  } | null;
  navigation: {
    domContentLoaded: number;
    loadComplete: number;
    firstByte: number;
    domInteractive: number;
    redirect: number;
    dns: number;
    tcp: number;
    request: number;
    response: number;
    processing: number;
  } | null;
  responsiveElements: {
    count: number;
    renderTimes: number[];
    averageRenderTime: number;
    memoryUsage: number;
    layoutShiftContributions: number;
  };
  resources: {
    totalRequests: number;
    recentRequests: number;
    totalSize: number;
    averageLoadTime: number;
    slowRequests: SlowRequest[];
  };
  custom: {
    scalingOperations: number;
    scalingTime: number;
    cacheHitRate: number;
    configComplexity: number;
    breakpointTransitions: number;
  } | null;
}

export interface LayoutShiftEntry {
  value: number;
  timestamp: number;
  sources: LayoutShiftSource[];
  hadRecentInput?: boolean;
}

export interface LayoutShiftPerformanceEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources?: Array<{
    node?: Element;
    previousRect: DOMRectReadOnly;
    currentRect: DOMRectReadOnly;
  }>;
}

export interface LayoutShiftSource {
  element: string;
  selector: string;
}

export interface SlowRequest {
  name: string;
  loadTime: number;
  size: number;
}

export interface PerformanceThresholds {
  layoutShift: number;
  memoryUsage: number;
  lcp: number;
  fcp: number;
  renderTime: number;
  cacheHitRate: number;
}

export interface PerformanceSnapshot {
  timestamp: number;
  metrics: PerformanceMetrics;
}

export interface PerformanceAlert {
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  value: number;
  threshold: number;
  timestamp: number;
}

export interface PerformanceReport {
  timestamp: number;
  summary: PerformanceSummary;
  metrics: PerformanceMetrics;
  trends: PerformanceTrends;
  alerts: PerformanceAlert[];
  recommendations: string[];
  historicalData: PerformanceSnapshot[];
  // Enterprise features
  aiInsights?: unknown[];
  analytics?: unknown;
  enterpriseMetrics?: unknown;
}

export interface PerformanceSummary {
  overall: number;
  responsiveElements: number;
  layoutShift: number;
  memoryUsage: number;
  lcp: number;
  cacheHitRate: number;
}

export interface PerformanceTrends {
  layoutShift: 'improving' | 'degrading' | 'stable';
  memory: 'improving' | 'degrading' | 'stable';
  lcp: 'improving' | 'degrading' | 'stable';
  responsiveElements: 'improving' | 'degrading' | 'stable';
}
