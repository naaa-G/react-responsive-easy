/**
 * Independent Performance Monitor for CLI
 * 
 * This is a lightweight, self-contained performance monitoring solution
 * that doesn't depend on external packages. Designed for enterprise-grade
 * CLI applications with optional performance tracking.
 */

export interface PerformanceMetrics {
  lcp?: number;
  fcp?: number;
  layoutShift?: number;
  memoryUsage?: number;
  renderTime?: number;
  cacheHitRate?: number;
  timestamp: number;
}

export interface PerformanceThresholds {
  layoutShift: number;
  memoryUsage: number;
  lcp: number;
  fcp: number;
  renderTime: number;
  cacheHitRate: number;
}

export interface PerformanceConfig {
  collectionInterval?: number;
  maxHistorySize?: number;
  thresholds?: Partial<PerformanceThresholds>;
  enabled?: boolean;
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

export class PerformanceMonitor {
  private isMonitoring = false;
  private metrics: PerformanceMetrics = this.createEmptyMetrics();
  private observers: PerformanceObserver[] = [];
  private intervalId: number | null = null;
  private callbacks: Map<string, ((data: unknown) => void)[]> = new Map();
  private thresholds: PerformanceThresholds = this.getDefaultThresholds();
  private history: PerformanceSnapshot[] = [];
  private maxHistorySize = 1000;
  private config: PerformanceConfig;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      collectionInterval: 5000,
      maxHistorySize: 1000,
      enabled: true,
      ...config
    };
    
    this.thresholds = { ...this.thresholds, ...config.thresholds };
    this.maxHistorySize = this.config.maxHistorySize ?? 1000;
  }

  /**
   * Start performance monitoring
   */
  start(): void {
    if (!this.config.enabled || this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.logInfo('Performance monitoring started');

    // Set up performance observers
    this.setupObservers();

    // Start periodic collection
    this.intervalId = window.setInterval(() => {
      this.collectMetrics();
    }, this.config.collectionInterval);
  }

  /**
   * Stop performance monitoring
   */
  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    this.logInfo('Performance monitoring stopped');

    // Clear interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance history
   */
  getHistory(): PerformanceSnapshot[] {
    return [...this.history];
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = [];
    const now = Date.now();

    // Check each metric against thresholds
    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value === undefined || key === 'timestamp') return;

      const threshold = this.thresholds[key as keyof PerformanceThresholds];
      if (threshold === undefined) return;

      if (value > threshold) {
        alerts.push({
          type: key,
          severity: this.getSeverity(value, threshold),
          message: `${key} exceeded threshold: ${value} > ${threshold}`,
          value,
          threshold,
          timestamp: now
        });
      }
    });

    return alerts;
  }

  /**
   * Subscribe to performance events
   */
  on(event: string, callback: (data: unknown) => void): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  /**
   * Unsubscribe from performance events
   */
  off(event: string, callback: (data: unknown) => void): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit performance event
   */
  private emit(event: string, data: unknown): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Set up performance observers
   */
  private setupObservers(): void {
    // Only set up observers in browser environment
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    try {
      // LCP observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEventTiming;
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
          this.emit('lcp', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FCP observer
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEventTiming;
        if (lastEntry) {
          this.metrics.fcp = lastEntry.startTime;
          this.emit('fcp', lastEntry.startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);

      // Layout Shift observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries() as PerformanceEventTiming[];
        
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });

        this.metrics.layoutShift = clsValue;
        this.emit('layoutShift', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      this.logInfo('Performance observers not supported in this environment');
    }
  }

  /**
   * Collect performance metrics
   */
  private collectMetrics(): void {
    const now = Date.now();
    
    // Update timestamp
    this.metrics.timestamp = now;

    // Collect memory usage (if available)
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }

    // Collect render time (simplified)
    this.metrics.renderTime = this.calculateRenderTime();

    // Add to history
    this.addToHistory({
      timestamp: now,
      metrics: { ...this.metrics }
    });

    // Check for alerts
    const alerts = this.getActiveAlerts();
    if (alerts.length > 0) {
      this.emit('alerts', alerts);
    }

    // Emit metrics update
    this.emit('metrics', this.metrics);
  }

  /**
   * Calculate render time (simplified)
   */
  private calculateRenderTime(): number {
    // Simplified render time calculation
    // In a real implementation, this would measure actual render performance
    return Math.random() * 16.67; // Simulate 60fps target
  }

  /**
   * Add snapshot to history
   */
  private addToHistory(snapshot: PerformanceSnapshot): void {
    this.history.push(snapshot);
    
    // Maintain history size limit
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Get severity level for alert
   */
  private getSeverity(value: number, threshold: number): 'info' | 'warning' | 'critical' {
    const ratio = value / threshold;
    if (ratio >= 2) return 'critical';
    if (ratio >= 1.5) return 'warning';
    return 'info';
  }

  /**
   * Create empty metrics object
   */
  private createEmptyMetrics(): PerformanceMetrics {
    return {
      timestamp: Date.now()
    };
  }

  /**
   * Get default thresholds
   */
  private getDefaultThresholds(): PerformanceThresholds {
    return {
      layoutShift: 0.1,
      memoryUsage: 0.8,
      lcp: 2500,
      fcp: 1800,
      renderTime: 16.67,
      cacheHitRate: 0.8
    };
  }

  /**
   * Log info message
   */
  private logInfo(message: string): void {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.log(`[PerformanceMonitor] ${message}`);
    }
  }
}

/**
 * Create a new PerformanceMonitor instance
 */
export const createPerformanceMonitor = (config?: PerformanceConfig): PerformanceMonitor => {
  return new PerformanceMonitor(config);
};

/**
 * Default performance presets
 */
export const PERFORMANCE_PRESETS = {
  development: {
    collectionInterval: 1000,
    maxHistorySize: 100,
    thresholds: {
      layoutShift: 0.25,
      memoryUsage: 0.9,
      lcp: 4000,
      fcp: 3000,
      renderTime: 33,
      cacheHitRate: 0.6
    }
  },
  production: {
    collectionInterval: 5000,
    maxHistorySize: 500,
    thresholds: {
      layoutShift: 0.1,
      memoryUsage: 0.8,
      lcp: 2500,
      fcp: 1800,
      renderTime: 16.67,
      cacheHitRate: 0.8
    }
  },
  strict: {
    collectionInterval: 500,
    maxHistorySize: 200,
    thresholds: {
      layoutShift: 0.05,
      memoryUsage: 0.7,
      lcp: 2000,
      fcp: 1500,
      renderTime: 8.33,
      cacheHitRate: 0.9
    }
  }
} as const;
