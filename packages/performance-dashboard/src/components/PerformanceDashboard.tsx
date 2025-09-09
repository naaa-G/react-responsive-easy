// @ts-nocheck - React type conflicts with Recharts components
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PerformanceMonitor, PerformanceMetrics, PerformanceAlert, PerformanceReport } from '../core/PerformanceMonitor';
import { MetricsOverview } from './MetricsOverview';
import { RealTimeCharts } from './RealTimeCharts';
import { AlertsPanel } from './AlertsPanel';
import { RecommendationsPanel } from './RecommendationsPanel';
import { HistoricalView } from './HistoricalView';
import { ResponsiveElementsView } from './ResponsiveElementsView';
import { VisualizationManager } from './visualizations/VisualizationManager';

/**
 * Main Performance Dashboard Component
 * 
 * This component provides a comprehensive real-time performance monitoring
 * interface for React Responsive Easy applications.
 */
export interface PerformanceDashboardProps {
  /** Performance monitor instance */
  monitor?: PerformanceMonitor;
  /** Dashboard configuration */
  config?: DashboardConfig;
  /** Custom theme */
  theme?: DashboardTheme;
  /** Event handlers */
  onAlertClick?: (alert: PerformanceAlert) => void;
  onExportData?: () => void;
  onSettingsChange?: (settings: any) => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  monitor: externalMonitor,
  config = {},
  theme = 'light',
  onAlertClick,
  onExportData,
  onSettingsChange
}) => {
  // State
  const [monitor] = useState(() => externalMonitor || new PerformanceMonitor());
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedView, setSelectedView] = useState<DashboardView>('overview');
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(1000);

  // Configuration
  const dashboardConfig = useMemo(() => ({
    showAlerts: true,
    showRecommendations: true,
    showHistorical: true,
    autoStart: true,
    refreshInterval: 1000,
    ...config
  }), [config]);

  // Start/stop monitoring
  const toggleMonitoring = useCallback(() => {
    if (isMonitoring) {
      monitor.stop();
      setIsMonitoring(false);
    } else {
      monitor.start();
      setIsMonitoring(true);
    }
  }, [monitor, isMonitoring]);

  // Generate report
  const generateReport = useCallback(async () => {
    const newReport = await monitor.generateReport();
    setReport(newReport);
  }, [monitor]);

  // Export data
  const handleExportData = useCallback(() => {
    if (onExportData) {
      onExportData();
    } else {
      const data = {
        timestamp: Date.now(),
        metrics,
        alerts,
        report,
        history: monitor.getHistory()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [metrics, alerts, report, monitor, onExportData]);

  // Setup event listeners
  useEffect(() => {
    const unsubscribeMetrics = monitor.on('metrics-updated', (newMetrics: PerformanceMetrics) => {
      setMetrics(newMetrics);
    });

    const unsubscribeAlerts = monitor.on('performance-alert', (data: any) => {
      const alert = data.alert;
      if (alert) {
        setAlerts(prev => [...prev.slice(-19), alert]); // Keep last 20 alerts
      }
    });

    const unsubscribeStart = monitor.on('monitoring-started', () => {
      setIsMonitoring(true);
    });

    const unsubscribeStop = monitor.on('monitoring-stopped', () => {
      setIsMonitoring(false);
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeAlerts();
      unsubscribeStart();
      unsubscribeStop();
    };
  }, [monitor]);

  // Auto-start monitoring
  useEffect(() => {
    if (dashboardConfig.autoStart && !isMonitoring) {
      monitor.start();
    }
  }, [monitor, dashboardConfig.autoStart, isMonitoring]);

  // Auto-refresh report
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (isMonitoring) {
        generateReport();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isMonitoring, generateReport]);

  // Render view content
  const renderViewContent = () => {
    if (!metrics) {
      return (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading performance data...</p>
        </div>
      );
    }

    switch (selectedView) {
      case 'overview':
        return (
          <>
            <MetricsOverview 
              metrics={metrics} 
              theme={theme}
            />
            <div className="dashboard-grid">
              <RealTimeCharts 
                metrics={metrics}
                history={monitor.getHistory(50)}
                theme={theme}
              />
              {dashboardConfig.showAlerts && (
                <AlertsPanel 
                  alerts={alerts}
                  onAlertClick={onAlertClick}
                  theme={theme}
                />
              )}
            </div>
          </>
        );

      case 'charts':
        return (
          <RealTimeCharts 
            metrics={metrics}
            history={monitor.getHistory(100)}
            theme={theme}
            expanded={true}
          />
        );

      case 'elements':
        return (
          <ResponsiveElementsView 
            metrics={metrics}
            theme={theme}
          />
        );

      case 'historical':
        return (
          <HistoricalView 
            history={monitor.getHistory()}
            theme={theme}
          />
        );

      case 'alerts':
        return (
          <AlertsPanel 
            alerts={alerts}
            onAlertClick={onAlertClick}
            theme={theme}
            expanded={true}
          />
        );

      case 'recommendations':
        return (
          <RecommendationsPanel 
            report={report}
            theme={theme}
          />
        );

      case 'visualizations':
        return (
          <VisualizationManager
            metrics={metrics}
            history={monitor.getHistory()}
            theme={theme}
            onVisualizationChange={(type) => {
              console.log('Visualization changed:', type);
            }}
            onDataExport={(format, data) => {
              console.log('Data export:', format, data);
            }}
            onLayoutSave={(layout) => {
              console.log('Layout saved:', layout);
            }}
            onLayoutLoad={(layoutId) => {
              console.log('Layout loaded:', layoutId);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`performance-dashboard theme-${theme}`}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Performance Dashboard</h1>
          <div className="status-indicator">
            <div className={`status-dot ${isMonitoring ? 'active' : 'inactive'}`}></div>
            <span>{isMonitoring ? 'Monitoring' : 'Stopped'}</span>
          </div>
        </div>
        
        <div className="header-controls">
          <button 
            className={`btn ${isMonitoring ? 'btn-danger' : 'btn-primary'}`}
            onClick={toggleMonitoring}
          >
            {isMonitoring ? '⏸️ Stop' : '▶️ Start'} Monitoring
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={generateReport}
            disabled={!isMonitoring}
          >
            📊 Generate Report
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={handleExportData}
            disabled={!metrics}
          >
            📤 Export Data
          </button>
          
          <div className="refresh-controls">
            <label>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh
            </label>
            
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              disabled={!autoRefresh}
            >
              <option value={500}>0.5s</option>
              <option value={1000}>1s</option>
              <option value={2000}>2s</option>
              <option value={5000}>5s</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="dashboard-nav">
        <button
          className={`nav-button ${selectedView === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedView('overview')}
        >
          📊 Overview
        </button>
        
        <button
          className={`nav-button ${selectedView === 'charts' ? 'active' : ''}`}
          onClick={() => setSelectedView('charts')}
        >
          📈 Charts
        </button>
        
        <button
          className={`nav-button ${selectedView === 'elements' ? 'active' : ''}`}
          onClick={() => setSelectedView('elements')}
        >
          🧩 Elements
        </button>
        
        <button
          className={`nav-button ${selectedView === 'historical' ? 'active' : ''}`}
          onClick={() => setSelectedView('historical')}
        >
          📜 History
        </button>
        
        <button
          className={`nav-button ${selectedView === 'alerts' ? 'active' : ''}`}
          onClick={() => setSelectedView('alerts')}
        >
          🚨 Alerts {alerts.length > 0 && <span className="alert-count">{alerts.length}</span>}
        </button>
        
        <button
          className={`nav-button ${selectedView === 'recommendations' ? 'active' : ''}`}
          onClick={() => setSelectedView('recommendations')}
        >
          💡 Recommendations
        </button>
        
        <button
          className={`nav-button ${selectedView === 'visualizations' ? 'active' : ''}`}
          onClick={() => setSelectedView('visualizations')}
        >
          🎨 Visualizations
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {renderViewContent()}
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <div className="footer-left">
          <span className="footer-text">
            React Responsive Easy Performance Dashboard v0.0.1
          </span>
        </div>
        
        <div className="footer-right">
          {metrics && (
            <span className="footer-text">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Type definitions
export interface DashboardConfig {
  showAlerts?: boolean;
  showRecommendations?: boolean;
  showHistorical?: boolean;
  autoStart?: boolean;
  refreshInterval?: number;
}

export type DashboardTheme = 'light' | 'dark' | 'auto';

export type DashboardView = 
  | 'overview' 
  | 'charts' 
  | 'elements' 
  | 'historical' 
  | 'alerts' 
  | 'recommendations'
  | 'visualizations';

export default PerformanceDashboard;
