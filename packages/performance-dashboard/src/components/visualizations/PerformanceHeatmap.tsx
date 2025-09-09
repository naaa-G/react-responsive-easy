import React, { useMemo, useState, useCallback } from 'react';
import { PerformanceMetrics, PerformanceSnapshot } from '../../core/PerformanceMonitor';
import { DashboardTheme } from '../PerformanceDashboard';

export interface PerformanceHeatmapProps {
  metrics: PerformanceMetrics;
  history: PerformanceSnapshot[];
  theme: DashboardTheme;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  granularity?: 'minute' | 'hour' | 'day';
  onCellClick?: (data: HeatmapCellData) => void;
  onCellHover?: (data: HeatmapCellData | null) => void;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export interface HeatmapCellData {
  x: number;
  y: number;
  value: number;
  timestamp: number;
  metric: string;
  status: 'good' | 'warning' | 'poor';
  details: {
    avgValue: number;
    maxValue: number;
    minValue: number;
    sampleCount: number;
  };
}

export const PerformanceHeatmap: React.FC<PerformanceHeatmapProps> = ({
  metrics: _metrics,
  history,
  theme,
  timeRange = '24h',
  granularity = 'hour',
  onCellClick,
  onCellHover,
  showTooltip = true,
  showLegend = true
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCellData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('layoutShift');

  // Performance thresholds
  const thresholds = useMemo(() => ({
    layoutShift: { good: 0.1, poor: 0.25 },
    lcp: { good: 2500, poor: 4000 },
    fcp: { good: 1800, poor: 3000 },
    memoryUsage: { good: 70, poor: 90 },
    renderTime: { good: 16.67, poor: 33.33 },
    cacheHitRate: { good: 80, poor: 60 }
  }), []);

  // Colors based on theme
  const colors = {
    good: theme === 'dark' ? '#51cf66' : '#37b24d',
    warning: theme === 'dark' ? '#ffd43b' : '#f59f00',
    poor: theme === 'dark' ? '#ff6b6b' : '#e03131',
    background: theme === 'dark' ? '#212529' : '#ffffff',
    text: theme === 'dark' ? '#ced4da' : '#495057',
    grid: theme === 'dark' ? '#343a40' : '#e9ecef'
  };

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const granularityMs = {
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000
    };

    const timeRangeMs = ranges[timeRange ?? '24h'] ?? 0;
    const granularityStep = granularityMs[granularity ?? 'hour'] ?? 0;
    const startTime = now - timeRangeMs;
    
    // Create time buckets
    const buckets: { [key: string]: PerformanceSnapshot[] } = {};
    const bucketCount = granularityStep > 0 ? Math.ceil(timeRangeMs / granularityStep) : 0;
    
    for (let i = 0; i < bucketCount; i++) {
      const bucketStart = startTime + (i * granularityStep);
      const _bucketEnd = bucketStart + granularityStep;
      const bucketKey = new Date(bucketStart).toISOString();
      buckets[bucketKey] = [];
    }

    // Distribute snapshots into buckets
    history.forEach((snapshot: PerformanceSnapshot) => {
      const bucketIndex = Math.floor((snapshot.timestamp - startTime) / granularityStep);
      const bucketStart = startTime + (bucketIndex * granularityStep);
      const bucketKey = new Date(bucketStart).toISOString();
      
      if (buckets[bucketKey]) {
        buckets[bucketKey]?.push(snapshot);
      }
    });

    // Generate heatmap cells
    const cells: HeatmapCellData[] = [];
    const _days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const _hours = Array.from({ length: 24 }, (_, i) => i);

    Object.entries(buckets).forEach(([bucketKey, snapshots], index) => {
      if (snapshots.length === 0) return;

      const bucketTime = new Date(bucketKey);
      const dayOfWeek = bucketTime.getDay();
      const hourOfDay = bucketTime.getHours();
      
      // Calculate aggregated metric value
      const metricValues = snapshots.map((s: PerformanceSnapshot) => {
        switch (selectedMetric) {
          case 'layoutShift':
            return s.metrics.layoutShift.current;
          case 'lcp':
            return s.metrics.paintTiming.lcp ?? 0;
          case 'fcp':
            return s.metrics.paintTiming.fcp ?? 0;
          case 'memoryUsage':
            return s.metrics.memory ? (s.metrics.memory.usage * 100) : 0;
          case 'renderTime':
            return s.metrics.responsiveElements.averageRenderTime ?? 0;
          case 'cacheHitRate':
            return s.metrics.custom?.cacheHitRate ? (s.metrics.custom.cacheHitRate * 100) : 0;
          default:
            return 0;
        }
      });

      const avgValue = metricValues.reduce((sum, val) => sum + val, 0) / metricValues.length;
      const maxValue = Math.max(...metricValues);
      const minValue = Math.min(...metricValues);
      
      // Determine status based on thresholds
      const threshold = thresholds[selectedMetric as keyof typeof thresholds];
      let status: 'good' | 'warning' | 'poor' = 'good';
      if (avgValue > threshold.poor) {
        status = 'poor';
      } else if (avgValue > threshold.good) {
        status = 'warning';
      }

      cells.push({
        x: granularity === 'day' ? dayOfWeek : hourOfDay,
        y: granularity === 'day' ? Math.floor(index / 7) : dayOfWeek,
        value: avgValue,
        timestamp: bucketTime.getTime(),
        metric: selectedMetric,
        status,
        details: {
          avgValue,
          maxValue,
          minValue,
          sampleCount: snapshots.length
        }
      });
    });

    return cells;
  }, [history, timeRange, granularity, selectedMetric, thresholds]);

  // Handle cell hover
  const handleCellHover = useCallback((cell: HeatmapCellData | null) => {
    setHoveredCell(cell);
    if (onCellHover) {
      onCellHover(cell);
    }
  }, [onCellHover]);

  // Handle cell click
  const handleCellClick = useCallback((cell: HeatmapCellData) => {
    if (onCellClick) {
      onCellClick(cell);
    }
  }, [onCellClick]);

  // Get cell color based on value and status
  const getCellColor = (cell: HeatmapCellData) => {
    const { status } = cell;
    const _threshold = thresholds[selectedMetric as keyof typeof thresholds];
    
    if (status === 'good') {
      return colors.good;
    } else if (status === 'warning') {
      return colors.warning;
    } else {
      return colors.poor;
    }
  };

  // Get cell opacity based on value intensity
  const getCellOpacity = (cell: HeatmapCellData) => {
    const threshold = thresholds[selectedMetric as keyof typeof thresholds];
    const normalizedValue = Math.min(cell.value / (threshold.poor * 2), 1);
    return Math.max(0.3, normalizedValue);
  };

  // Metric options
  const metricOptions = [
    { key: 'layoutShift', label: 'Layout Shift', unit: '' },
    { key: 'lcp', label: 'LCP', unit: 'ms' },
    { key: 'fcp', label: 'FCP', unit: 'ms' },
    { key: 'memoryUsage', label: 'Memory Usage', unit: '%' },
    { key: 'renderTime', label: 'Render Time', unit: 'ms' },
    { key: 'cacheHitRate', label: 'Cache Hit Rate', unit: '%' }
  ];

  // Generate grid dimensions
  const gridDimensions = useMemo(() => {
    if (granularity === 'day') {
      return { width: 7, height: Math.ceil(heatmapData.length / 7) };
    } else {
      return { width: 24, height: 7 };
    }
  }, [granularity, heatmapData.length]);

  return (
    <div className="performance-heatmap">
      {/* Controls */}
      <div className="heatmap-controls">
        <div className="metric-selector">
          <label>Metric:</label>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            {metricOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="granularity-selector">
          <label>Granularity:</label>
          <select 
            value={granularity} 
            onChange={(_e) => {/* Handle granularity change */}}
          >
            <option value="minute">Minute</option>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
          </select>
        </div>

        <div className="time-range-selector">
          <label>Time Range:</label>
          <select 
            value={timeRange} 
            onChange={(_e) => {/* Handle time range change */}}
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="heatmap-container">
        <h3>
          {metricOptions.find(m => m.key === selectedMetric)?.label} Heatmap
          {granularity === 'day' && ' (Day of Week vs Week)'}
          {granularity === 'hour' && ' (Hour vs Day of Week)'}
          {granularity === 'minute' && ' (Minute vs Hour)'}
        </h3>

        <div className="heatmap-grid">
          {/* Y-axis labels */}
          <div className="y-axis-labels">
            {granularity === 'day' ? (
              Array.from({ length: gridDimensions.height }, (_, i) => (
                <div key={i} className="y-label">Week {i + 1}</div>
              ))
            ) : (
              ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} className="y-label">{day}</div>
              ))
            )}
          </div>

          {/* Heatmap cells */}
          <div className="heatmap-cells">
            {Array.from({ length: gridDimensions.height }, (_, y) => (
              <div key={y} className="heatmap-row">
                {Array.from({ length: gridDimensions.width }, (_, x) => {
                  const cell = heatmapData.find(c => c.x === x && c.y === y);
                  
                  if (!cell) {
                    return (
                      <div 
                        key={`${x}-${y}`} 
                        className="heatmap-cell empty"
                        style={{ backgroundColor: colors.grid }}
                      />
                    );
                  }

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`heatmap-cell ${cell.status}`}
                      style={{
                        backgroundColor: getCellColor(cell),
                        opacity: getCellOpacity(cell)
                      }}
                      onMouseEnter={() => handleCellHover(cell)}
                      onMouseLeave={() => handleCellHover(null)}
                      onClick={() => handleCellClick(cell)}
                      title={`${cell.value.toFixed(2)} - ${new Date(cell.timestamp).toLocaleString()}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="x-axis-labels">
            {granularity === 'day' ? (
              ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} className="x-label">{day}</div>
              ))
            ) : (
              Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="x-label">{i}</div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && hoveredCell && (
        <div className="heatmap-tooltip">
          <div className="tooltip-header">
            <strong>{new Date(hoveredCell.timestamp).toLocaleString()}</strong>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-metric">
              <span className="metric-label">
                {metricOptions.find(m => m.key === selectedMetric)?.label}:
              </span>
              <span className="metric-value">
                {hoveredCell.value.toFixed(2)}
                {metricOptions.find(m => m.key === selectedMetric)?.unit}
              </span>
            </div>
            <div className="tooltip-status">
              Status: <span className={`status ${hoveredCell.status}`}>
                {hoveredCell.status.toUpperCase()}
              </span>
            </div>
            <div className="tooltip-details">
              <div>Avg: {hoveredCell.details.avgValue.toFixed(2)}</div>
              <div>Max: {hoveredCell.details.maxValue.toFixed(2)}</div>
              <div>Min: {hoveredCell.details.minValue.toFixed(2)}</div>
              <div>Samples: {hoveredCell.details.sampleCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="heatmap-legend">
          <h4>Performance Status</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: colors.good }} />
              <span>Good</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: colors.warning }} />
              <span>Warning</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: colors.poor }} />
              <span>Poor</span>
            </div>
          </div>
          <div className="legend-note">
            <small>Darker colors indicate higher values</small>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="heatmap-summary">
        <h4>Summary Statistics</h4>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Cells:</span>
            <span className="stat-value">{heatmapData.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Good:</span>
            <span className="stat-value good">
              {heatmapData.filter(c => c.status === 'good').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Warning:</span>
            <span className="stat-value warning">
              {heatmapData.filter(c => c.status === 'warning').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Poor:</span>
            <span className="stat-value poor">
              {heatmapData.filter(c => c.status === 'poor').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Value:</span>
            <span className="stat-value">
              {heatmapData.length > 0 
                ? (heatmapData.reduce((sum, c) => sum + c.value, 0) / heatmapData.length).toFixed(2)
                : '0.00'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHeatmap;
