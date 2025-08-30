/**
 * React Responsive Easy Performance Dashboard
 * 
 * A comprehensive performance monitoring solution for React Responsive Easy applications.
 * Provides real-time metrics, alerts, recommendations, and detailed analytics.
 */

// Core exports
export { PerformanceMonitor } from './core/PerformanceMonitor';
export type {
  PerformanceMonitorConfig,
  PerformanceMetrics,
  PerformanceAlert,
  PerformanceReport,
  PerformanceSnapshot,
  PerformanceSummary,
  PerformanceTrends,
  PerformanceThresholds,
  LayoutShiftEntry,
  LayoutShiftSource,
  SlowRequest
} from './core/PerformanceMonitor';

// Component exports
export { PerformanceDashboard } from './components/PerformanceDashboard';
export { MetricsOverview } from './components/MetricsOverview';
export { RealTimeCharts } from './components/RealTimeCharts';
export { AlertsPanel } from './components/AlertsPanel';
export { RecommendationsPanel } from './components/RecommendationsPanel';
export { HistoricalView } from './components/HistoricalView';
export { ResponsiveElementsView } from './components/ResponsiveElementsView';

// Component prop types
export type {
  PerformanceDashboardProps,
  DashboardConfig,
  DashboardTheme,
  DashboardView
} from './components/PerformanceDashboard';

export type { MetricsOverviewProps } from './components/MetricsOverview';
export type { RealTimeChartsProps } from './components/RealTimeCharts';
export type { AlertsPanelProps } from './components/AlertsPanel';
export type { RecommendationsPanelProps } from './components/RecommendationsPanel';
export type { HistoricalViewProps } from './components/HistoricalView';
export type { ResponsiveElementsViewProps } from './components/ResponsiveElementsView';

// Utility functions
export const createPerformanceMonitor = (config?: any) => {
  const { PerformanceMonitor } = require('./core/PerformanceMonitor');
  return new PerformanceMonitor(config);
};

// Default configuration presets
export const PERFORMANCE_PRESETS = {
  development: {
    collectionInterval: 1000,
    maxHistorySize: 100,
    thresholds: {
      layoutShift: 0.25,
      memoryUsage: 0.9,
      lcp: 4000,
      fcp: 3000,
      renderTime: 33, // 30fps for development
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
      renderTime: 16.67, // 60fps for production
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
      renderTime: 8.33, // 120fps for strict mode
      cacheHitRate: 0.9
    }
  }
} as const;

// Version info
export const VERSION = '0.0.1';
export const BUILD_DATE = new Date().toISOString();

// Feature flags (for future extensibility)
export const FEATURES = {
  realTimeCharts: true,
  alertSystem: true,
  recommendations: true,
  historicalAnalysis: true,
  exportData: true,
  customThresholds: true,
  aiInsights: false, // Future feature
  predictiveAnalytics: false // Future feature
} as const;
