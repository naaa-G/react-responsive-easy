/**
 * Performance Metrics Component
 * 
 * This component displays performance metrics for responsive components.
 */

import React from 'react';
import type { PerformanceMetrics as IPerformanceMetrics } from '../types';

interface PerformanceMetricsProps {
  data: IPerformanceMetrics | null;
  isVisible: boolean;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data, isVisible }) => {
  if (!isVisible) {
    return (
      <div className="performance-disabled">
        <p>Performance monitoring is disabled for this story.</p>
        <p>Enable it in the story parameters or addon settings.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="performance-loading">
        <div className="loading-spinner"></div>
        <p>Collecting performance metrics...</p>
      </div>
    );
  }

  const getMetricStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'poor';
  };

  const renderTimeStatus = getMetricStatus(data.renderTime, { good: 16, warning: 33 });
  const memoryStatus = getMetricStatus(data.memoryUsage / 1024, { good: 50, warning: 100 });
  const cacheStatus = getMetricStatus(100 - (data.cacheHitRate * 100), { good: 10, warning: 30 });

  return (
    <div className="performance-metrics">
      {/* Performance Overview */}
      <div className="metrics-overview">
        <div className={`metric-card ${renderTimeStatus}`}>
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{data.renderTime.toFixed(1)}ms</div>
            <div className="metric-label">Render Time</div>
          </div>
          <div className="metric-status">{renderTimeStatus}</div>
        </div>

        <div className={`metric-card ${memoryStatus}`}>
          <div className="metric-icon">🧠</div>
          <div className="metric-content">
            <div className="metric-value">{(data.memoryUsage / 1024).toFixed(1)}KB</div>
            <div className="metric-label">Memory Usage</div>
          </div>
          <div className="metric-status">{memoryStatus}</div>
        </div>

        <div className={`metric-card ${data.layoutShifts > 0 ? 'warning' : 'good'}`}>
          <div className="metric-icon">📐</div>
          <div className="metric-content">
            <div className="metric-value">{data.layoutShifts}</div>
            <div className="metric-label">Layout Shifts</div>
          </div>
          <div className="metric-status">{data.layoutShifts > 0 ? 'warning' : 'good'}</div>
        </div>

        <div className={`metric-card ${cacheStatus}`}>
          <div className="metric-icon">💾</div>
          <div className="metric-content">
            <div className="metric-value">{(data.cacheHitRate * 100).toFixed(1)}%</div>
            <div className="metric-label">Cache Hit Rate</div>
          </div>
          <div className="metric-status">{cacheStatus}</div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="detailed-metrics">
        <h4>Detailed Performance</h4>
        
        <div className="metric-row">
          <span className="metric-name">Scaling Operations:</span>
          <span className="metric-detail">{data.scalingOperations}</span>
        </div>
        
        <div className="metric-row">
          <span className="metric-name">Average Operation Time:</span>
          <span className="metric-detail">
            {data.scalingOperations > 0 ? (data.renderTime / data.scalingOperations).toFixed(2) : 0}ms
          </span>
        </div>
        
        <div className="metric-row">
          <span className="metric-name">Memory per Operation:</span>
          <span className="metric-detail">
            {data.scalingOperations > 0 ? (data.memoryUsage / data.scalingOperations / 1024).toFixed(2) : 0}KB
          </span>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="performance-tips">
        <h4>💡 Performance Tips</h4>
        <div className="tips-list">
          {data.renderTime > 16 && (
            <div className="tip warning">
              <strong>Slow Rendering:</strong> Consider memoizing expensive calculations or using React.memo
            </div>
          )}
          
          {data.memoryUsage > 100 * 1024 && (
            <div className="tip warning">
              <strong>High Memory Usage:</strong> Check for memory leaks or excessive object creation
            </div>
          )}
          
          {data.layoutShifts > 0 && (
            <div className="tip warning">
              <strong>Layout Shifts Detected:</strong> Use CSS containment or reserve space for dynamic content
            </div>
          )}
          
          {data.cacheHitRate < 0.8 && (
            <div className="tip info">
              <strong>Low Cache Hit Rate:</strong> Consider optimizing caching strategy for better performance
            </div>
          )}
          
          {data.renderTime <= 16 && data.memoryUsage <= 50 * 1024 && data.layoutShifts === 0 && (
            <div className="tip good">
              <strong>Great Performance!</strong> Your component is performing well across all metrics
            </div>
          )}
        </div>
      </div>

      <style>{`
        .performance-metrics {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .performance-disabled,
        .performance-loading {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #e0e0e0;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .metrics-overview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          position: relative;
        }

        .metric-card.good {
          border-left: 4px solid #28a745;
        }

        .metric-card.warning {
          border-left: 4px solid #ffc107;
        }

        .metric-card.poor {
          border-left: 4px solid #dc3545;
        }

        .metric-icon {
          font-size: 16px;
          width: 24px;
          text-align: center;
        }

        .metric-content {
          flex: 1;
        }

        .metric-value {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          line-height: 1;
        }

        .metric-label {
          font-size: 10px;
          color: #666;
          margin-top: 2px;
        }

        .metric-status {
          position: absolute;
          top: 4px;
          right: 4px;
          font-size: 8px;
          padding: 2px 4px;
          border-radius: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .metric-card.good .metric-status {
          background: #d4edda;
          color: #155724;
        }

        .metric-card.warning .metric-status {
          background: #fff3cd;
          color: #856404;
        }

        .metric-card.poor .metric-status {
          background: #f8d7da;
          color: #721c24;
        }

        .detailed-metrics {
          border-top: 1px solid #e0e0e0;
          padding-top: 16px;
        }

        .detailed-metrics h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 11px;
        }

        .metric-name {
          color: #666;
        }

        .metric-detail {
          font-weight: 500;
          color: #333;
        }

        .performance-tips {
          border-top: 1px solid #e0e0e0;
          padding-top: 16px;
        }

        .performance-tips h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tip {
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 11px;
          line-height: 1.4;
        }

        .tip.good {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .tip.info {
          background: #d1ecf1;
          border: 1px solid #bee5eb;
          color: #0c5460;
        }

        .tip.warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
        }

        .tip strong {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
