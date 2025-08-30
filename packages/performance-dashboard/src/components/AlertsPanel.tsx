import React, { useState } from 'react';
import { PerformanceAlert } from '../core/PerformanceMonitor';
import { DashboardTheme } from './PerformanceDashboard';

export interface AlertsPanelProps {
  alerts: PerformanceAlert[];
  onAlertClick?: (alert: PerformanceAlert) => void;
  theme: DashboardTheme;
  expanded?: boolean;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onAlertClick,
  theme,
  expanded = false
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity' | 'type'>('timestamp');

  // Filter and sort alerts
  const filteredAlerts = alerts
    .filter(alert => filter === 'all' || alert.severity === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return b.timestamp - a.timestamp;
        case 'severity':
          const severityOrder = { critical: 3, warning: 2, info: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  // Get severity counts
  const severityCounts = alerts.reduce((counts, alert) => {
    counts[alert.severity] = (counts[alert.severity] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'layout-shift': return '📐';
      case 'memory': return '🧠';
      case 'lcp': return '🎨';
      case 'fcp': return '🖼️';
      case 'render': return '⚡';
      case 'cache': return '💾';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) { // Less than 24 hours
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (expanded) {
    return (
      <div className="alerts-panel expanded">
        <div className="alerts-header">
          <h2>Performance Alerts</h2>
          
          <div className="alerts-summary">
            <div className={`alert-count critical ${severityCounts.critical ? 'active' : ''}`}>
              <span className="count">{severityCounts.critical || 0}</span>
              <span className="label">Critical</span>
            </div>
            <div className={`alert-count warning ${severityCounts.warning ? 'active' : ''}`}>
              <span className="count">{severityCounts.warning || 0}</span>
              <span className="label">Warning</span>
            </div>
            <div className={`alert-count info ${severityCounts.info ? 'active' : ''}`}>
              <span className="count">{severityCounts.info || 0}</span>
              <span className="label">Info</span>
            </div>
          </div>
        </div>

        <div className="alerts-controls">
          <div className="filter-controls">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">All Alerts</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="timestamp">Time</option>
              <option value="severity">Severity</option>
              <option value="type">Type</option>
            </select>
          </div>

          <div className="alerts-stats">
            <span>{filteredAlerts.length} of {alerts.length} alerts</span>
          </div>
        </div>

        <div className="alerts-list expanded">
          {filteredAlerts.length === 0 ? (
            <div className="no-alerts">
              <div className="no-alerts-icon">✅</div>
              <h3>No alerts to show</h3>
              <p>
                {filter === 'all' 
                  ? 'All systems are running smoothly!'
                  : `No ${filter} alerts found.`
                }
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => (
              <div
                key={`${alert.timestamp}-${index}`}
                className={`alert-item ${getSeverityColor(alert.severity)} ${onAlertClick ? 'clickable' : ''}`}
                onClick={() => onAlertClick?.(alert)}
              >
                <div className="alert-icon">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="alert-content">
                  <div className="alert-header">
                    <h4 className="alert-title">
                      {alert.type.replace('-', ' ').toUpperCase()} Alert
                    </h4>
                    <span className={`alert-severity ${alert.severity}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="alert-message">{alert.message}</p>
                  
                  <div className="alert-details">
                    <div className="alert-value">
                      <span className="label">Current:</span>
                      <span className="value">{alert.value.toFixed(3)}</span>
                    </div>
                    <div className="alert-threshold">
                      <span className="label">Threshold:</span>
                      <span className="value">{alert.threshold.toFixed(3)}</span>
                    </div>
                    <div className="alert-time">
                      <span className="label">Time:</span>
                      <span className="value">{formatTimestamp(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="alert-actions">
                  <button className="btn btn-sm btn-secondary">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-panel compact">
      <div className="panel-header">
        <h3>Recent Alerts</h3>
        <div className="alert-badge">
          {alerts.length > 0 && (
            <span className={`badge ${severityCounts.critical ? 'danger' : severityCounts.warning ? 'warning' : 'info'}`}>
              {alerts.length}
            </span>
          )}
        </div>
      </div>

      <div className="alerts-list compact">
        {alerts.length === 0 ? (
          <div className="no-alerts compact">
            <span className="no-alerts-icon">✅</span>
            <span>No alerts</span>
          </div>
        ) : (
          alerts.slice(0, 5).map((alert, index) => (
            <div
              key={`${alert.timestamp}-${index}`}
              className={`alert-item compact ${getSeverityColor(alert.severity)} ${onAlertClick ? 'clickable' : ''}`}
              onClick={() => onAlertClick?.(alert)}
            >
              <div className="alert-icon">{getAlertIcon(alert.type)}</div>
              <div className="alert-content">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-time">{formatTimestamp(alert.timestamp)}</div>
              </div>
              <div className={`alert-severity-indicator ${alert.severity}`}></div>
            </div>
          ))
        )}
        
        {alerts.length > 5 && (
          <div className="show-more">
            <button className="btn btn-link">
              View all {alerts.length} alerts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
