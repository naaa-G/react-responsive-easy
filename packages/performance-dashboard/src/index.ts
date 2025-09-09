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
  SlowRequest,
  EnterpriseConfig
} from './core/PerformanceMonitor';

// Import for utility function
import type { PerformanceMonitorConfig } from './core/PerformanceMonitor';

// Component exports
export { PerformanceDashboard } from './components/PerformanceDashboard';
export { MetricsOverview } from './components/MetricsOverview';
export { RealTimeCharts } from './components/RealTimeCharts';
export { AlertsPanel } from './components/AlertsPanel';
export { RecommendationsPanel } from './components/RecommendationsPanel';
export { HistoricalView } from './components/HistoricalView';
export { ResponsiveElementsView } from './components/ResponsiveElementsView';

// Advanced Visualizations
export { 
  InteractiveCharts, 
  PerformanceHeatmap, 
  CustomLayouts, 
  VisualizationManager 
} from './components/visualizations';

// Optimization Components
export { 
  Skeleton,
  ChartSkeleton,
  MetricsSkeleton,
  HeatmapSkeleton,
  DashboardSkeleton,
  TableSkeleton,
  LoadingSpinner,
  LoadingOverlay
} from './components/common/LoadingSkeleton';

export { useDataCache } from './hooks/useDataCache';
export { 
  useErrorBoundary,
  withErrorBoundary,
  DefaultErrorFallback
} from './hooks/useErrorBoundary';

// High-priority enterprise features
export { 
  useVirtualScrolling, 
  useDynamicItemHeights, 
  useWindowing 
} from './hooks/useVirtualScrolling';
export { 
  useRealTimeCollaboration, 
  useCollaborativeCursors, 
  useCollaborativeSelections 
} from './hooks/useRealTimeCollaboration';
export { 
  useAdvancedML, 
  useRealTimeMLAnalysis 
} from './hooks/useAdvancedML';
export { PluginManager } from './plugins/PluginManager';
export { 
  usePluginManager, 
  usePlugin, 
  usePluginRegistry, 
  usePluginDevelopment 
} from './hooks/usePluginManager';
export { 
  VirtualScrollingList, 
  useVirtualScrollingList 
} from './components/visualizations/VirtualScrollingList';

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

// Visualization prop types
export type {
  InteractiveChartsProps,
  PerformanceHeatmapProps,
  CustomLayoutsProps,
  VisualizationManagerProps,
  VisualizationType,
  ExportFormat,
  VisualizationConfig,
  HeatmapCellData,
  WidgetConfig,
  WidgetSize,
  WidgetPosition,
  DashboardLayout
} from './components/visualizations';

// High-priority enterprise feature types
export type {
  VirtualScrollingOptions,
  VirtualScrollingState,
  VirtualScrollingActions,
  VirtualScrollingRef
} from './hooks/useVirtualScrolling';

export type {
  CollaborationUser,
  CollaborationEvent,
  CollaborationConfig,
  CollaborationState,
  CollaborationActions
} from './hooks/useRealTimeCollaboration';

export type {
  MLModel,
  AnomalyDetectionResult,
  PredictionResult,
  PatternRecognitionResult,
  MLConfig,
  MLState,
  MLActions
} from './hooks/useAdvancedML';

export type {
  PluginManifest,
  PluginConfig,
  PluginContext,
  PluginStorage,
  PluginUI,
  PluginData,
  PluginLogger,
  MenuItem,
  ToolbarButton,
  PluginInstance,
  PluginManagerState,
  PluginRegistry,
  PluginManagerActions
} from './plugins/PluginManager';

export type {
  VirtualScrollingListProps
} from './components/visualizations/VirtualScrollingList';

// Enterprise utility exports
export { AIIntegrationManager } from './utils/AIIntegration';
export type {
  AIIntegrationConfig,
  AIInsight,
  AIAction,
  AIPrediction,
  AIOptimizationResult,
  AIPerformanceAnalysis
} from './utils/AIIntegration';

export { AlertingSystem } from './utils/AlertingSystem';
export type {
  AlertingConfig,
  AlertChannel,
  AlertRule,
  AlertCondition,
  AlertAction,
  AlertFilter,
  EscalationPolicy,
  EscalationLevel,
  RateLimitingConfig,
  RetentionConfig,
  IntegrationConfig,
  AlertEvent,
  AlertStatistics,
  NotificationTemplate
} from './utils/AlertingSystem';

export { AnalyticsEngine } from './utils/AnalyticsEngine';
export type {
  AnalyticsConfig,
  AnalyticsData,
  AggregatedMetrics,
  MetricAggregation,
  ResourceAggregation,
  CustomMetricAggregation,
  AnalyticsMetadata,
  PerformanceBenchmark,
  ComparativeAnalysis,
  PerformanceCorrelation,
  AnomalyDetection,
  PerformanceForecast,
  AnalyticsReport
} from './utils/AnalyticsEngine';

// Utility functions
export const createPerformanceMonitor = (config?: PerformanceMonitorConfig) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PerformanceMonitor } = require('./core/PerformanceMonitor') as { PerformanceMonitor: new (config?: PerformanceMonitorConfig) => import('./core/PerformanceMonitor').PerformanceMonitor };
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

// Feature flags (for enterprise extensibility)
export const FEATURES = {
  realTimeCharts: true,
  alertSystem: true,
  recommendations: true,
  historicalAnalysis: true,
  exportData: true,
  customThresholds: true,
  aiInsights: true, // Enterprise feature
  predictiveAnalytics: true, // Enterprise feature
  intelligentAlerting: true, // Enterprise feature
  advancedAnalytics: true, // Enterprise feature
  performanceOptimization: true, // Enterprise feature
  comparativeAnalysis: true, // Enterprise feature
  forecasting: true, // Enterprise feature
  multiChannelNotifications: true, // Enterprise feature
  escalationPolicies: true, // Enterprise feature
  dataExport: true, // Enterprise feature
  customDashboards: true, // Enterprise feature
  roleBasedAccess: true, // Enterprise feature
  auditTrails: true, // Enterprise feature
  interactiveCharts: true, // Advanced visualization feature
  performanceHeatmaps: true, // Advanced visualization feature
  customLayouts: true, // Advanced visualization feature
  visualizationManager: true, // Advanced visualization feature
  fullscreenMode: true, // Advanced visualization feature
  realTimeInteractions: true, // Advanced visualization feature
  virtualScrolling: true, // High-priority enterprise feature
  realTimeCollaboration: true, // High-priority enterprise feature
  advancedML: true, // High-priority enterprise feature
  pluginArchitecture: true, // High-priority enterprise feature
  dynamicItemHeights: true, // High-priority enterprise feature
  collaborativeCursors: true, // High-priority enterprise feature
  patternRecognition: true, // High-priority enterprise feature
  pluginSandboxing: true, // High-priority enterprise feature
  realTimeDataSync: true // High-priority enterprise feature
} as const;
