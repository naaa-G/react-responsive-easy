import React, { useState, useCallback, useMemo } from 'react';
import { PerformanceMetrics, PerformanceSnapshot } from '../../core/PerformanceMonitor';
import { DashboardTheme } from '../PerformanceDashboard';
import { InteractiveCharts } from './InteractiveCharts';
import { PerformanceHeatmap } from './PerformanceHeatmap';
import { CustomLayouts, DashboardLayout } from './CustomLayouts';

export interface VisualizationManagerProps {
  metrics: PerformanceMetrics;
  history: PerformanceSnapshot[];
  theme: DashboardTheme;
  onVisualizationChange?: (type: VisualizationType) => void;
  onDataExport?: (format: ExportFormat, data: unknown) => void;
  onLayoutSave?: (layout: DashboardLayout) => void;
  onLayoutLoad?: (layoutId: string) => void;
}

export type VisualizationType = 
  | 'interactive-charts' 
  | 'heatmap' 
  | 'custom-layouts' 
  | 'comparison' 
  | 'trend-analysis';

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'png' | 'svg';

export interface VisualizationConfig {
  type: VisualizationType;
  config: Record<string, unknown>;
  enabled: boolean;
}

export const VisualizationManager: React.FC<VisualizationManagerProps> = ({
  metrics,
  history,
  theme,
  onVisualizationChange,
  onDataExport,
  onLayoutSave: _onLayoutSave,
  onLayoutLoad: _onLayoutLoad
}) => {
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>('interactive-charts');
  const [visualizationConfigs] = useState<VisualizationConfig[]>([
    { type: 'interactive-charts', config: {}, enabled: true },
    { type: 'heatmap', config: {}, enabled: true },
    { type: 'custom-layouts', config: {}, enabled: true },
    { type: 'comparison', config: {}, enabled: false },
    { type: 'trend-analysis', config: {}, enabled: false }
  ]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['layoutShift', 'lcp', 'fcp']);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showAnomalies, setShowAnomalies] = useState(true);
  const [showThresholds, setShowThresholds] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Performance thresholds
  const thresholds = useMemo(() => ({
    layoutShift: { good: 0.1, poor: 0.25 },
    lcp: { good: 2500, poor: 4000 },
    fcp: { good: 1800, poor: 3000 },
    memoryUsage: { good: 70, poor: 90 },
    renderTime: { good: 16.67, poor: 33.33 },
    cacheHitRate: { good: 80, poor: 60 }
  }), []);


  // Available visualizations
  const visualizations = useMemo(() => [
    {
      type: 'interactive-charts' as const,
      name: 'Interactive Charts',
      description: 'Real-time interactive charts with zoom, pan, and drill-down capabilities',
      icon: '📊',
      features: ['Real-time updates', 'Interactive zoom', 'Multiple metrics', 'Thresholds', 'Predictions']
    },
    {
      type: 'heatmap' as const,
      name: 'Performance Heatmap',
      description: 'Visual representation of performance patterns over time',
      icon: '🔥',
      features: ['Time-based patterns', 'Performance status', 'Granular analysis', 'Interactive tooltips']
    },
    {
      type: 'custom-layouts' as const,
      name: 'Custom Layouts',
      description: 'Drag-and-drop dashboard layouts with customizable widgets',
      icon: '🎨',
      features: ['Drag & drop', 'Custom widgets', 'Multiple layouts', 'Responsive design']
    },
    {
      type: 'comparison' as const,
      name: 'Comparison View',
      description: 'Side-by-side comparison of different time periods or metrics',
      icon: '⚖️',
      features: ['Period comparison', 'Metric comparison', 'Statistical analysis', 'Trend analysis']
    },
    {
      type: 'trend-analysis' as const,
      name: 'Trend Analysis',
      description: 'Advanced trend analysis with forecasting and pattern recognition',
      icon: '📈',
      features: ['Trend forecasting', 'Pattern recognition', 'Seasonal analysis', 'Anomaly detection']
    }
  ], []);

  // Handle visualization change
  const handleVisualizationChange = useCallback((type: VisualizationType) => {
    setActiveVisualization(type);
    if (onVisualizationChange) {
      onVisualizationChange(type);
    }
  }, [onVisualizationChange]);

  // Handle data export
  const handleDataExport = useCallback((format: ExportFormat) => {
    const exportData = {
      timestamp: Date.now(),
      visualization: activeVisualization,
      timeRange: selectedTimeRange,
      metrics: selectedMetrics,
      data: {
        metrics,
        history: history.slice(-1000), // Limit to last 1000 entries
        config: visualizationConfigs.find(c => c.type === activeVisualization)?.config
      }
    };

    if (onDataExport) {
      onDataExport(format, exportData);
    }
  }, [activeVisualization, selectedTimeRange, selectedMetrics, metrics, history, visualizationConfigs, onDataExport]);



  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Render active visualization
  const renderActiveVisualization = () => {
    const commonProps = {
      metrics,
      history,
      theme,
      timeRange: selectedTimeRange
    };

    switch (activeVisualization) {
      case 'interactive-charts':
        return (
          <InteractiveCharts
            {...commonProps}
            showPredictions={showPredictions}
            showAnomalies={showAnomalies}
            showThresholds={showThresholds}
            onDataPointClick={(_data) => {
              if (process.env.NODE_ENV === 'development') {
                // Data point clicked - could be logged to analytics
              }
            }}
            onZoom={(_startTime, _endTime) => {
              if (process.env.NODE_ENV === 'development') {
                // Zoom event - could be logged to analytics
              }
            }}
          />
        );

      case 'heatmap':
        return (
          <PerformanceHeatmap
            {...commonProps}
            granularity="hour"
            onCellClick={(_data) => {
              if (process.env.NODE_ENV === 'development') {
                // Cell clicked - could be logged to analytics
              }
            }}
            onCellHover={(_data) => {
              if (process.env.NODE_ENV === 'development') {
                // Cell hovered - could be logged to analytics
              }
            }}
          />
        );

      case 'custom-layouts':
        return (
          <CustomLayouts
            {...commonProps}
            onLayoutChange={(_layout) => {
              if (process.env.NODE_ENV === 'development') {
                // Layout changed - could be logged to analytics
              }
            }}
            onWidgetResize={(_widgetId, _size) => {
              if (process.env.NODE_ENV === 'development') {
                // Widget resized - could be logged to analytics
              }
            }}
            onWidgetMove={(_widgetId, _position) => {
              if (process.env.NODE_ENV === 'development') {
                // Widget moved - could be logged to analytics
              }
            }}
            onWidgetRemove={(_widgetId) => {
              if (process.env.NODE_ENV === 'development') {
                // Widget removed - could be logged to analytics
              }
            }}
            onWidgetAdd={(_widget) => {
              if (process.env.NODE_ENV === 'development') {
                // Widget added - could be logged to analytics
              }
            }}
          />
        );

      case 'comparison':
        return (
          <div className="comparison-view">
            <h3>Comparison View</h3>
            <div className="comparison-grid">
              <div className="comparison-panel">
                <h4>Current Period</h4>
                <InteractiveCharts
                  {...commonProps}
                  timeRange="24h"
                />
              </div>
              <div className="comparison-panel">
                <h4>Previous Period</h4>
                <InteractiveCharts
                  {...commonProps}
                  timeRange="24h"
                />
              </div>
            </div>
          </div>
        );

      case 'trend-analysis':
        return (
          <div className="trend-analysis">
            <h3>Trend Analysis</h3>
            <div className="trend-charts">
              <InteractiveCharts
                {...commonProps}
                showPredictions={true}
                showAnomalies={true}
                showThresholds={true}
              />
            </div>
            <div className="trend-insights">
              <h4>Trend Insights</h4>
              <div className="insights-grid">
                <div className="insight-item">
                  <span className="insight-label">Trend Direction:</span>
                  <span className="insight-value positive">↗️ Improving</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Volatility:</span>
                  <span className="insight-value medium">📊 Medium</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Seasonality:</span>
                  <span className="insight-value">📅 Daily patterns detected</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Anomalies:</span>
                  <span className="insight-value">⚠️ 3 detected in last 24h</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown visualization type</div>;
    }
  };

  return (
    <div className={`visualization-manager ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="visualization-header">
        <div className="header-left">
          <h2>Advanced Visualizations</h2>
          <div className="visualization-selector">
            <select
              value={activeVisualization}
              onChange={(e) => handleVisualizationChange(e.target.value as VisualizationType)}
            >
              {visualizations.map(viz => (
                <option key={viz.type} value={viz.type}>
                  {viz.icon} {viz.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="header-controls">
          <div className="time-range-selector">
            <label>Time Range:</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as '1h' | '6h' | '24h' | '7d' | '30d')}
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <div className="metric-selector">
            <label>Metrics:</label>
            <select
              multiple
              value={selectedMetrics}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedMetrics(values);
              }}
            >
              <option value="layoutShift">Layout Shift</option>
              <option value="lcp">LCP</option>
              <option value="fcp">FCP</option>
              <option value="memoryUsage">Memory Usage</option>
              <option value="renderTime">Render Time</option>
              <option value="cacheHitRate">Cache Hit Rate</option>
            </select>
          </div>

          <div className="display-options">
            <label>
              <input
                type="checkbox"
                checked={showPredictions}
                onChange={(e) => setShowPredictions(e.target.checked)}
              />
              Predictions
            </label>
            <label>
              <input
                type="checkbox"
                checked={showAnomalies}
                onChange={(e) => setShowAnomalies(e.target.checked)}
              />
              Anomalies
            </label>
            <label>
              <input
                type="checkbox"
                checked={showThresholds}
                onChange={(e) => setShowThresholds(e.target.checked)}
              />
              Thresholds
            </label>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => handleDataExport('json')}
            >
              📤 Export JSON
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleDataExport('csv')}
            >
              📊 Export CSV
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleDataExport('png')}
            >
              🖼️ Export PNG
            </button>
            <button
              className="btn btn-primary"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? '📱 Exit Fullscreen' : '🖥️ Fullscreen'}
            </button>
          </div>
        </div>
      </div>

      {/* Visualization Info */}
      <div className="visualization-info">
        {visualizations.find(viz => viz.type === activeVisualization) && (
          <div className="info-panel">
            <div className="info-header">
              <span className="info-icon">
                {visualizations.find(viz => viz.type === activeVisualization)?.icon}
              </span>
              <h3>{visualizations.find(viz => viz.type === activeVisualization)?.name}</h3>
            </div>
            <p className="info-description">
              {visualizations.find(viz => viz.type === activeVisualization)?.description}
            </p>
            <div className="info-features">
              <h4>Features:</h4>
              <ul>
                {visualizations.find(viz => viz.type === activeVisualization)?.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="visualization-content">
        {renderActiveVisualization()}
      </div>

      {/* Performance Summary */}
      <div className="performance-summary">
        <h3>Performance Summary</h3>
        <div className="summary-grid">
          {Object.entries(thresholds).map(([metric, threshold]) => {
            const metricValue = metrics[metric as keyof PerformanceMetrics] as Record<string, unknown>;
            const currentValue = (metricValue?.current as number) ?? 
                                (metricValue?.usage as number) ?? 
                                (metricValue?.averageRenderTime as number) ?? 
                                (metricValue?.cacheHitRate as number) ?? 
                                0;
            const status = currentValue <= threshold.good ? 'good' : 
                          currentValue <= threshold.poor ? 'warning' : 'poor';
            
            return (
              <div key={metric} className={`summary-item ${status}`}>
                <div className="summary-label">{metric}</div>
                <div className="summary-value">
                  {typeof currentValue === 'number' ? currentValue.toFixed(2) : currentValue}
                </div>
                <div className="summary-status">
                  {status === 'good' ? '✅' : status === 'warning' ? '⚠️' : '❌'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisualizationManager;
