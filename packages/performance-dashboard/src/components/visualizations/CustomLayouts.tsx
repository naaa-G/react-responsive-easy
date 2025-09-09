import React, { useState, useCallback, useMemo } from 'react';
import { PerformanceMetrics, PerformanceSnapshot } from '../../core/PerformanceMonitor';
import { DashboardTheme } from '../PerformanceDashboard';
import { InteractiveCharts } from './InteractiveCharts';
import { PerformanceHeatmap } from './PerformanceHeatmap';

export interface CustomLayoutsProps {
  metrics: PerformanceMetrics;
  history: PerformanceSnapshot[];
  theme: DashboardTheme;
  onLayoutChange?: (layout: DashboardLayout) => void;
  onWidgetResize?: (widgetId: string, size: WidgetSize) => void;
  onWidgetMove?: (widgetId: string, position: WidgetPosition) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onWidgetAdd?: (widget: WidgetConfig) => void;
}

export interface WidgetConfig {
  id: string;
  type: 'chart' | 'heatmap' | 'metric' | 'alert' | 'custom';
  title: string;
  size: WidgetSize;
  position: WidgetPosition;
  config: Record<string, unknown>;
  visible: boolean;
  resizable: boolean;
  draggable: boolean;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  widgets: WidgetConfig[];
  gridSize: { columns: number; rows: number };
  theme: DashboardTheme;
}

export const CustomLayouts = ({
  metrics,
  history,
  theme,
  onLayoutChange,
  onWidgetResize,
  onWidgetMove,
  onWidgetRemove,
  onWidgetAdd
}: CustomLayoutsProps) => {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [_resizingWidget, _setResizingWidget] = useState<string | null>(null);

  // Predefined layouts
  const predefinedLayouts = useMemo(() => [
    {
      id: 'overview',
      name: 'Overview Dashboard',
      description: 'High-level performance overview with key metrics',
      widgets: [
        {
          id: 'metrics-overview',
          type: 'metric' as const,
          title: 'Key Metrics',
          size: { width: 4, height: 2 },
          position: { x: 0, y: 0 },
          config: { metrics: ['layoutShift', 'lcp', 'fcp', 'memoryUsage'] },
          visible: true,
          resizable: true,
          draggable: true
        },
        {
          id: 'performance-chart',
          type: 'chart' as const,
          title: 'Performance Trends',
          size: { width: 8, height: 4 },
          position: { x: 4, y: 0 },
          config: { 
            chartType: 'line',
            metrics: ['layoutShift', 'lcp', 'fcp'],
            timeRange: '24h'
          },
          visible: true,
          resizable: true,
          draggable: true
        },
        {
          id: 'alerts-panel',
          type: 'alert' as const,
          title: 'Active Alerts',
          size: { width: 4, height: 2 },
          position: { x: 0, y: 2 },
          config: { maxAlerts: 5, showHistory: false },
          visible: true,
          resizable: true,
          draggable: true
        },
        {
          id: 'heatmap-view',
          type: 'heatmap' as const,
          title: 'Performance Heatmap',
          size: { width: 8, height: 3 },
          position: { x: 4, y: 4 },
          config: { 
            metric: 'layoutShift',
            granularity: 'hour',
            timeRange: '7d'
          },
          visible: true,
          resizable: true,
          draggable: true
        }
      ],
      gridSize: { columns: 12, rows: 8 },
      theme
    },
    {
      id: 'detailed',
      name: 'Detailed Analysis',
      description: 'Comprehensive performance analysis with multiple charts',
      widgets: [
        {
          id: 'core-web-vitals',
          type: 'chart' as const,
          title: 'Core Web Vitals',
          size: { width: 6, height: 4 },
          position: { x: 0, y: 0 },
          config: { 
            chartType: 'area',
            metrics: ['layoutShift', 'lcp', 'fcp'],
            timeRange: '24h',
            showThresholds: true
          },
          visible: true,
          resizable: true,
          draggable: true
        },
        {
          id: 'memory-analysis',
          type: 'chart' as const,
          title: 'Memory Usage',
          size: { width: 6, height: 4 },
          position: { x: 6, y: 0 },
          config: { 
            chartType: 'line',
            metrics: ['memoryUsage'],
            timeRange: '24h',
            showPredictions: true
          },
          visible: true,
          resizable: true,
          draggable: true
        },
        {
          id: 'render-performance',
          type: 'chart' as const,
          title: 'Render Performance',
          size: { width: 6, height: 4 },
          position: { x: 0, y: 4 },
          config: { 
            chartType: 'bar',
            metrics: ['renderTime'],
            timeRange: '24h',
            showAnomalies: true
          },
          visible: true,
          resizable: true,
          draggable: true
        },
        {
          id: 'cache-performance',
          type: 'chart' as const,
          title: 'Cache Performance',
          size: { width: 6, height: 4 },
          position: { x: 6, y: 4 },
          config: { 
            chartType: 'line',
            metrics: ['cacheHitRate'],
            timeRange: '24h'
          },
          visible: true,
          resizable: true,
          draggable: true
        },
        {
          id: 'performance-heatmap',
          type: 'heatmap' as const,
          title: 'Performance Heatmap',
          size: { width: 12, height: 4 },
          position: { x: 0, y: 8 },
          config: { 
            metric: 'layoutShift',
            granularity: 'hour',
            timeRange: '7d',
            showTooltip: true
          },
          visible: true,
          resizable: true,
          draggable: true
        }
      ],
      gridSize: { columns: 12, rows: 12 },
      theme
    },
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'High-level dashboard for executives and stakeholders',
      widgets: [
        {
          id: 'kpi-metrics',
          type: 'metric' as const,
          title: 'Key Performance Indicators',
          size: { width: 12, height: 2 },
          position: { x: 0, y: 0 },
          config: { 
            metrics: ['layoutShift', 'lcp', 'fcp', 'memoryUsage', 'renderTime', 'cacheHitRate'],
            layout: 'horizontal',
            showTrends: true
          },
          visible: true,
          resizable: false,
          draggable: false
        },
        {
          id: 'performance-summary',
          type: 'chart' as const,
          title: 'Performance Summary',
          size: { width: 8, height: 6 },
          position: { x: 0, y: 2 },
          config: { 
            chartType: 'composed',
            metrics: ['layoutShift', 'lcp', 'fcp'],
            timeRange: '7d',
            showThresholds: true,
            showPredictions: true
          },
          visible: true,
          resizable: true,
          draggable: true
        },
        {
          id: 'status-overview',
          type: 'alert' as const,
          title: 'System Status',
          size: { width: 4, height: 6 },
          position: { x: 8, y: 2 },
          config: { 
            maxAlerts: 10,
            showHistory: true,
            showSeverity: true
          },
          visible: true,
          resizable: true,
          draggable: true
        }
      ],
      gridSize: { columns: 12, rows: 8 },
      theme
    }
  ], [theme]);

  // Available widget types
  const widgetTypes = useMemo(() => [
    { type: 'chart', label: 'Chart', icon: '📊' },
    { type: 'heatmap', label: 'Heatmap', icon: '🔥' },
    { type: 'metric', label: 'Metric', icon: '📈' },
    { type: 'alert', label: 'Alert', icon: '🚨' },
    { type: 'custom', label: 'Custom', icon: '⚙️' }
  ], []);

  // Handle layout selection
  const handleLayoutSelect = useCallback((layout: DashboardLayout) => {
    setCurrentLayout(layout);
    if (onLayoutChange) {
      onLayoutChange(layout);
    }
  }, [onLayoutChange]);

  // Handle widget drag start
  const handleWidgetDragStart = useCallback((widgetId: string, event: React.DragEvent) => {
    setDraggedWidget(widgetId);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Handle widget drag over
  const handleWidgetDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle widget drop
  const handleWidgetDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    if (!draggedWidget || !currentLayout) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / (rect.width / currentLayout.gridSize.columns));
    const y = Math.floor((event.clientY - rect.top) / (rect.height / currentLayout.gridSize.rows));

    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(widget =>
        widget.id === draggedWidget
          ? { ...widget, position: { x, y } }
          : widget
      )
    };

    setCurrentLayout(updatedLayout);
    setDraggedWidget(null);
    
    if (onWidgetMove) {
      onWidgetMove(draggedWidget, { x, y });
    }
  }, [draggedWidget, currentLayout, onWidgetMove]);

  // Handle widget resize
  const _handleWidgetResize = useCallback((widgetId: string, newSize: WidgetSize) => {
    if (!currentLayout) return;

    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, size: newSize }
          : widget
      )
    };

    setCurrentLayout(updatedLayout);
    
    if (onWidgetResize) {
      onWidgetResize(widgetId, newSize);
    }
  }, [currentLayout, onWidgetResize]);

  // Handle widget remove
  const handleWidgetRemove = useCallback((widgetId: string) => {
    if (!currentLayout) return;

    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(widget => widget.id !== widgetId)
    };

    setCurrentLayout(updatedLayout);
    
    if (onWidgetRemove) {
      onWidgetRemove(widgetId);
    }
  }, [currentLayout, onWidgetRemove]);

  // Render widget based on type
  const renderWidget = useCallback((widget: WidgetConfig) => {
    const widgetStyle = {
      gridColumn: `${widget.position.x + 1} / span ${widget.size.width}`,
      gridRow: `${widget.position.y + 1} / span ${widget.size.height}`,
      position: 'relative' as const
    };

    const widgetContent = (() => {
      switch (widget.type) {
        case 'chart':
          return (
            <InteractiveCharts
              metrics={metrics}
              history={history}
              theme={theme}
              timeRange={(widget.config.timeRange as '1h' | '6h' | '24h' | '7d' | '30d') || '24h'}
              showPredictions={(widget.config.showPredictions as boolean) || false}
              showAnomalies={(widget.config.showAnomalies as boolean) || false}
              showThresholds={(widget.config.showThresholds as boolean) || true}
            />
          );
        
        case 'heatmap':
          return (
            <PerformanceHeatmap
              metrics={metrics}
              history={history}
              theme={theme}
              timeRange={(widget.config.timeRange as '1h' | '6h' | '24h' | '7d' | '30d') || '24h'}
              granularity={(widget.config.granularity as 'minute' | 'hour' | 'day') || 'hour'}
              onCellClick={() => {}}
              onCellHover={() => {}}
              showTooltip={(widget.config.showTooltip as boolean) || true}
              showLegend={(widget.config.showLegend as boolean) || true}
            />
          );
        
        case 'metric':
          return (
            <div className="metric-widget">
              <div className="metric-grid">
                {(widget.config.metrics as string[]).map((metric: string) => {
                  const metricValue = metrics[metric as keyof PerformanceMetrics] as Record<string, unknown>;
                  const value = (metricValue?.current as number) ?? 
                               (metricValue?.usage as number) ?? 
                               (metricValue?.averageRenderTime as number) ?? 
                               (metricValue?.cacheHitRate as number) ?? 
                               0;
                  return (
                    <div key={metric} className="metric-item">
                      <div className="metric-label">{metric}</div>
                      <div className="metric-value">
                        {value?.toFixed ? value.toFixed(2) : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        
        case 'alert':
          return (
            <div className="alert-widget">
              <div className="alert-list">
                {/* Mock alerts for demonstration */}
                <div className="alert-item warning">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-message">High memory usage detected</span>
                </div>
                <div className="alert-item info">
                  <span className="alert-icon">ℹ️</span>
                  <span className="alert-message">Performance optimization available</span>
                </div>
              </div>
            </div>
          );
        
        case 'custom':
          return (
            <div className="custom-widget">
              <div className="custom-content">
                <h4>Custom Widget</h4>
                <p>Configure your custom content here</p>
              </div>
            </div>
          );
        
        default:
          return <div>Unknown widget type</div>;
      }
    })();

    return (
      <div
        key={widget.id}
        className={`dashboard-widget ${widget.type} ${isEditMode ? 'edit-mode' : ''} ${selectedWidget === widget.id ? 'selected' : ''}`}
        style={widgetStyle}
        draggable={isEditMode && widget.draggable}
        onDragStart={(e) => handleWidgetDragStart(widget.id, e)}
        onClick={() => setSelectedWidget(widget.id)}
      >
        <div className="widget-header">
          <h3 className="widget-title">{widget.title}</h3>
          {isEditMode && (
            <div className="widget-controls">
              <button
                className="widget-control-btn"
                onClick={() => handleWidgetRemove(widget.id)}
                title="Remove widget"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        <div className="widget-content">
          {widgetContent}
        </div>
        {isEditMode && widget.resizable && (
          <div className="widget-resize-handle" />
        )}
      </div>
    );
  }, [metrics, history, theme, isEditMode, selectedWidget, handleWidgetDragStart, handleWidgetRemove]);

  return (
    <div className="custom-layouts">
      {/* Layout Selector */}
      <div className="layout-selector">
        <h3>Dashboard Layouts</h3>
        <div className="layout-options">
          {predefinedLayouts.map(layout => (
            <div
              key={layout.id}
              className={`layout-option ${currentLayout?.id === layout.id ? 'active' : ''}`}
              onClick={() => handleLayoutSelect(layout)}
            >
              <h4>{layout.name}</h4>
              <p>{layout.description}</p>
              <div className="layout-preview">
                <div className="preview-grid" style={{
                  gridTemplateColumns: `repeat(${layout.gridSize.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${layout.gridSize.rows}, 1fr)`
                }}>
                  {layout.widgets.map(widget => (
                    <div
                      key={widget.id}
                      className="preview-widget"
                      style={{
                        gridColumn: `${widget.position.x + 1} / span ${widget.size.width}`,
                        gridRow: `${widget.position.y + 1} / span ${widget.size.height}`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Controls */}
      <div className="dashboard-controls">
        <div className="control-group">
          <button
            className={`btn ${isEditMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? 'Exit Edit Mode' : 'Edit Layout'}
          </button>
          
          {isEditMode && (
            <div className="widget-toolbar">
              <h4>Add Widget</h4>
              <div className="widget-types">
                {widgetTypes.map(type => (
                  <button
                    key={type.type}
                    className="widget-type-btn"
                    onClick={() => {
                      // Handle widget addition
                      const newWidget: WidgetConfig = {
                        id: `widget-${Date.now()}`,
                        type: type.type as 'chart' | 'heatmap' | 'metric' | 'alert' | 'custom',
                        title: `New ${type.label}`,
                        size: { width: 4, height: 3 },
                        position: { x: 0, y: 0 },
                        config: {},
                        visible: true,
                        resizable: true,
                        draggable: true
                      };
                      
                      if (onWidgetAdd) {
                        onWidgetAdd(newWidget);
                      }
                    }}
                  >
                    <span className="widget-icon">{type.icon}</span>
                    <span className="widget-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Grid */}
      {currentLayout && (
        <div className="dashboard-grid-container">
          <div
            className="dashboard-grid"
            style={{
              gridTemplateColumns: `repeat(${currentLayout.gridSize.columns}, 1fr)`,
              gridTemplateRows: `repeat(${currentLayout.gridSize.rows}, 1fr)`,
              gap: '1rem'
            }}
            onDragOver={handleWidgetDragOver}
            onDrop={handleWidgetDrop}
          >
            {currentLayout.widgets
              .filter(widget => widget.visible)
              .map(renderWidget)}
          </div>
        </div>
      )}

      {/* Layout Information */}
      {currentLayout && (
        <div className="layout-info">
          <h4>Layout Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{currentLayout.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Description:</span>
              <span className="info-value">{currentLayout.description}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Grid Size:</span>
              <span className="info-value">
                {currentLayout.gridSize.columns} × {currentLayout.gridSize.rows}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Widgets:</span>
              <span className="info-value">{currentLayout.widgets.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomLayouts;
