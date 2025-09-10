/**
 * Optional Performance Dashboard Integration
 * 
 * This module provides optional integration with the performance-dashboard package
 * when it's available. It gracefully degrades when the package is not installed.
 */

import { PerformanceMonitor, PerformanceConfig, PERFORMANCE_PRESETS } from '../core/PerformanceMonitor';

export interface PerformanceDashboardIntegration {
  isAvailable: boolean;
  initialize(): Promise<boolean>;
  getAdvancedFeatures(): string[];
  getDashboardUrl(): string | null;
}

export interface AdvancedPerformanceMetrics {
  aiInsights?: unknown[];
  analytics?: unknown;
  enterpriseMetrics?: unknown;
  realTimeCharts?: boolean;
  alertSystem?: boolean;
  recommendations?: boolean;
}

/**
 * Optional Performance Dashboard Integration Manager
 */
export class PerformanceDashboardIntegrationManager implements PerformanceDashboardIntegration {
  private isInitialized = false;
  private dashboardModule: any = null;
  private performanceMonitor: PerformanceMonitor | null = null;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  public readonly isAvailable: boolean;

  /**
   * Check if performance-dashboard package is available
   */
  private checkAvailability(): boolean {
    try {
      // Try to require the package
      require.resolve('@yaseratiar/react-responsive-easy-performance-dashboard');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize the integration
   */
  async initialize(): Promise<boolean> {
    if (!this.isAvailable || this.isInitialized) {
      return this.isAvailable;
    }

    try {
      // Dynamic import of the performance-dashboard package
      this.dashboardModule = await import('@yaseratiar/react-responsive-easy-performance-dashboard' as any);
      
      // Initialize the performance monitor
      if (this.dashboardModule.createPerformanceMonitor) {
        this.performanceMonitor = this.dashboardModule.createPerformanceMonitor();
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('Performance Dashboard integration not available:', error);
      return false;
    }
  }

  /**
   * Get available advanced features
   */
  getAdvancedFeatures(): string[] {
    if (!this.isAvailable || !this.isInitialized) {
      return [];
    }

    const features = [
      'Real-time Performance Monitoring',
      'AI-Powered Insights',
      'Advanced Analytics',
      'Custom Dashboards',
      'Alert Management',
      'Performance Recommendations'
    ];

    // Add enterprise features if available
    if (this.dashboardModule.AIIntegrationManager) {
      features.push('AI Integration');
    }
    if (this.dashboardModule.AlertingSystem) {
      features.push('Advanced Alerting');
    }
    if (this.dashboardModule.AnalyticsEngine) {
      features.push('Analytics Engine');
    }

    return features;
  }

  /**
   * Get dashboard URL (if available)
   */
  getDashboardUrl(): string | null {
    if (!this.isAvailable || !this.isInitialized) {
      return null;
    }

    // In a real implementation, this would return the actual dashboard URL
    return 'http://localhost:3000/dashboard';
  }

  /**
   * Get advanced performance metrics
   */
  async getAdvancedMetrics(): Promise<AdvancedPerformanceMetrics | null> {
    if (!this.isAvailable || !this.isInitialized || !this.performanceMonitor) {
      return null;
    }

    try {
      const basicMetrics = this.performanceMonitor.getMetrics();
      
      const advancedMetrics: AdvancedPerformanceMetrics = {
        realTimeCharts: true,
        alertSystem: true,
        recommendations: true
      };

      // Add AI insights if available
      if (this.dashboardModule.AIIntegrationManager) {
        try {
          const aiManager = new this.dashboardModule.AIIntegrationManager();
          advancedMetrics.aiInsights = await aiManager.analyze(basicMetrics);
        } catch (error) {
          console.warn('AI insights not available:', error);
        }
      }

      // Add analytics if available
      if (this.dashboardModule.AnalyticsEngine) {
        try {
          const analytics = new this.dashboardModule.AnalyticsEngine();
          advancedMetrics.analytics = await analytics.generateReport(basicMetrics);
        } catch (error) {
          console.warn('Analytics not available:', error);
        }
      }

      return advancedMetrics;
    } catch (error) {
      console.warn('Failed to get advanced metrics:', error);
      return null;
    }
  }

  /**
   * Get performance dashboard component (if available)
   */
  getDashboardComponent(): any {
    if (!this.isAvailable || !this.isInitialized) {
      return null;
    }

    return this.dashboardModule.PerformanceDashboard || null;
  }

  /**
   * Check if a specific feature is available
   */
  hasFeature(feature: string): boolean {
    if (!this.isAvailable || !this.isInitialized) {
      return false;
    }

    const featureMap: Record<string, string> = {
      'ai-integration': 'AIIntegrationManager',
      'alerting': 'AlertingSystem',
      'analytics': 'AnalyticsEngine',
      'dashboard': 'PerformanceDashboard',
      'real-time-charts': 'RealTimeCharts'
    };

    const moduleName = featureMap[feature];
    return moduleName ? !!this.dashboardModule[moduleName] : false;
  }
}

/**
 * Create a new Performance Dashboard Integration Manager
 */
export const createPerformanceDashboardIntegration = (): PerformanceDashboardIntegrationManager => {
  return new PerformanceDashboardIntegrationManager();
};

/**
 * Check if performance dashboard is available
 */
export const isPerformanceDashboardAvailable = (): boolean => {
  try {
    require.resolve('@yaseratiar/react-responsive-easy-performance-dashboard');
    return true;
  } catch {
    return false;
  }
};
