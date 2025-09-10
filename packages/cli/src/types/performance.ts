/**
 * Performance-related type definitions for CLI
 * 
 * These types are defined locally to avoid circular dependencies
 * with the performance-dashboard package.
 */

export interface PerformanceMetrics {
  lcp?: number;
  fcp?: number;
  layoutShift?: number;
  memoryUsage?: number;
  renderTime?: number;
  cacheHitRate?: number;
  paintTiming?: {
    renderTime?: number;
  };
  memory?: {
    used?: number;
  };
}

export interface AlertEvent {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  description?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMonitorConfig {
  collectionInterval?: number;
  maxHistorySize?: number;
  thresholds?: {
    layoutShift?: number;
    memoryUsage?: number;
    lcp?: number;
    fcp?: number;
    renderTime?: number;
    cacheHitRate?: number;
  };
  enabled?: boolean;
  realTimeMonitoring?: boolean;
  alerting?: boolean;
  analytics?: boolean;
}

export interface PerformancePresets {
  development: PerformanceMonitorConfig;
  production: PerformanceMonitorConfig;
  strict: PerformanceMonitorConfig;
}

export interface AIIntegrationConfig {
  enabled: boolean;
  modelPath?: string;
  optimizationLevel?: 'conservative' | 'balanced' | 'aggressive';
  autoOptimize?: boolean;
  learningEnabled?: boolean;
}

export interface AlertingConfig {
  enabled: boolean;
  channels: string[];
  rules: AlertRule[];
  escalation?: {
    enabled: boolean;
    levels: any[];
    maxEscalations: number;
    escalationDelay: number;
  };
  rateLimiting?: {
    enabled: boolean;
    maxAlertsPerMinute: number;
    maxAlertsPerHour: number;
    maxAlertsPerDay: number;
    burstLimit: number;
  };
  retention?: {
    alertHistoryDays: number;
    metricsRetentionDays: number;
    logRetentionDays: number;
    archiveEnabled: boolean;
  };
  integrations: any[];
}

export interface AlertRule {
  name: string;
  condition: string;
  severity: 'info' | 'warning' | 'critical';
  action: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  dataRetention: {
    metrics: number;
    reports: number;
    insights: number;
  };
  aggregation: {
    intervals: number[];
    methods: string[];
  };
  reporting: {
    autoGenerate: boolean;
    schedule: string;
    formats: string[];
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
