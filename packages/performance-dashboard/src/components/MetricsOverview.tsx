import React from 'react';
import { PerformanceMetrics } from '../core/PerformanceMonitor';
import { DashboardTheme } from './PerformanceDashboard';

export interface MetricsOverviewProps {
  metrics: PerformanceMetrics;
  theme: DashboardTheme;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, theme: _theme }) => {
  // Calculate derived metrics
  const overallScore = calculateOverallScore(metrics);
  const memoryUsagePercent = metrics.memory ? (metrics.memory.usage * 100) : 0;
  const avgRenderTime = metrics.responsiveElements.averageRenderTime ?? 0;
  const cacheHitRate = metrics.custom?.cacheHitRate ? (metrics.custom.cacheHitRate * 100) : 0;

  // Get status colors
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const getLayoutShiftColor = (cls: number) => {
    if (cls <= 0.1) return 'success';
    if (cls <= 0.25) return 'warning';
    return 'danger';
  };

  const getMemoryColor = (usage: number) => {
    if (usage <= 60) return 'success';
    if (usage <= 80) return 'warning';
    return 'danger';
  };


  return (
    <div className="metrics-overview">
      {/* Primary Metrics */}
      <div className="primary-metrics">
        <div className="metric-card primary">
          <div className="metric-header">
            <h3>Overall Score</h3>
            <div className={`score-badge ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </div>
          </div>
          <div className="metric-content">
            <div className="score-circle">
              <svg viewBox="0 0 100 100" className="score-ring">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="score-ring-background"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className={`score-ring-progress ${getScoreColor(overallScore)}`}
                  style={{
                    strokeDasharray: `${overallScore * 2.83} 283`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50px 50px'
                  }}
                />
              </svg>
              <div className="score-text">
                <span className="score-number">{overallScore}</span>
                <span className="score-label">Score</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Responsive Elements</h3>
            <div className="metric-icon">🧩</div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{metrics.responsiveElements.count}</div>
            <div className="metric-subtitle">
              Avg render: {avgRenderTime.toFixed(2)}ms
            </div>
            <div className="metric-detail">
              Memory: {(metrics.responsiveElements.memoryUsage / 1024).toFixed(1)}KB
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Layout Shift</h3>
            <div className={`status-indicator ${getLayoutShiftColor(metrics.layoutShift.current)}`}>
              ●
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {metrics.layoutShift.current.toFixed(3)}
            </div>
            <div className="metric-subtitle">
              {metrics.layoutShift.entries.length} shifts detected
            </div>
            <div className="metric-detail">
              Target: ≤ 0.1 (Good)
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Memory Usage</h3>
            <div className={`status-indicator ${getMemoryColor(memoryUsagePercent)}`}>
              ●
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {memoryUsagePercent.toFixed(1)}%
            </div>
            <div className="metric-subtitle">
              {metrics.memory ? `${(metrics.memory.used / 1024 / 1024).toFixed(1)}MB used` : 'N/A'}
            </div>
            <div className="metric-detail">
              {metrics.memory ? `of ${(metrics.memory.limit / 1024 / 1024).toFixed(0)}MB limit` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="secondary-metrics">
        <div className="metric-row">
          <div className="metric-item">
            <div className="metric-label">First Contentful Paint</div>
            <div className="metric-value">
              {metrics.paintTiming.fcp ? `${metrics.paintTiming.fcp.toFixed(0)}ms` : 'N/A'}
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">Largest Contentful Paint</div>
            <div className={`metric-value ${metrics.paintTiming.lcp ? getLayoutShiftColor(metrics.paintTiming.lcp) : ''}`}>
              {metrics.paintTiming.lcp ? `${metrics.paintTiming.lcp.toFixed(0)}ms` : 'N/A'}
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">Cache Hit Rate</div>
            <div className="metric-value">
              {cacheHitRate.toFixed(1)}%
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">Scaling Operations</div>
            <div className="metric-value">
              {metrics.custom?.scalingOperations ?? 0}
            </div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-item">
            <div className="metric-label">Resource Requests</div>
            <div className="metric-value">
              {metrics.resources.recentRequests}
            </div>
            <div className="metric-detail">
              {metrics.resources.slowRequests.length} slow
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">Average Load Time</div>
            <div className="metric-value">
              {metrics.resources.averageLoadTime.toFixed(0)}ms
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">Total Transfer</div>
            <div className="metric-value">
              {(metrics.resources.totalSize / 1024).toFixed(1)}KB
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">Config Complexity</div>
            <div className="metric-value">
              {metrics.custom?.configComplexity?.toFixed(1) ?? '0.0'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Timing */}
      {metrics.navigation && (
        <div className="navigation-timing">
          <h4>Navigation Timing</h4>
          <div className="timing-bar">
            <div className="timing-segment dns" style={{ width: '10%' }}>
              <span>DNS</span>
              <span>{metrics.navigation.dns.toFixed(0)}ms</span>
            </div>
            <div className="timing-segment tcp" style={{ width: '15%' }}>
              <span>TCP</span>
              <span>{metrics.navigation.tcp.toFixed(0)}ms</span>
            </div>
            <div className="timing-segment request" style={{ width: '20%' }}>
              <span>Request</span>
              <span>{metrics.navigation.request.toFixed(0)}ms</span>
            </div>
            <div className="timing-segment response" style={{ width: '25%' }}>
              <span>Response</span>
              <span>{metrics.navigation.response.toFixed(0)}ms</span>
            </div>
            <div className="timing-segment processing" style={{ width: '30%' }}>
              <span>Processing</span>
              <span>{metrics.navigation.processing.toFixed(0)}ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="quick-insights">
        <h4>Quick Insights</h4>
        <div className="insights-grid">
          {generateInsights(metrics).map((insight, index) => (
            <div key={index} className={`insight-card ${insight.type}`}>
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-content">
                <div className="insight-title">{insight.title}</div>
                <div className="insight-description">{insight.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function calculateOverallScore(metrics: PerformanceMetrics): number {
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
  
  // Deduct for slow render times
  if (metrics.responsiveElements.averageRenderTime > 16.67) {
    score -= Math.min(15, (metrics.responsiveElements.averageRenderTime - 16.67) / 2);
  }
  
  return Math.max(0, Math.round(score));
}

function generateInsights(metrics: PerformanceMetrics): Insight[] {
  const insights: Insight[] = [];
  
  if (metrics.layoutShift.current <= 0.1) {
    insights.push({
      type: 'success',
      icon: '✅',
      title: 'Excellent Layout Stability',
      description: 'Layout shift is within the good threshold'
    });
  } else {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Layout Shift Issues',
      description: `CLS of ${metrics.layoutShift.current.toFixed(3)} needs attention`
    });
  }
  
  if (metrics.responsiveElements.count > 50) {
    insights.push({
      type: 'info',
      icon: 'ℹ️',
      title: 'High Element Count',
      description: `${metrics.responsiveElements.count} responsive elements detected`
    });
  }
  
  if (metrics.custom?.cacheHitRate && metrics.custom.cacheHitRate > 0.9) {
    insights.push({
      type: 'success',
      icon: '🎯',
      title: 'Excellent Cache Performance',
      description: `${(metrics.custom.cacheHitRate * 100).toFixed(1)}% hit rate`
    });
  }
  
  if (metrics.resources.slowRequests.length > 0) {
    insights.push({
      type: 'warning',
      icon: '🐌',
      title: 'Slow Resources Detected',
      description: `${metrics.resources.slowRequests.length} requests taking >1s`
    });
  }
  
  return insights;
}

interface Insight {
  type: 'success' | 'warning' | 'info' | 'error';
  icon: string;
  title: string;
  description: string;
}
