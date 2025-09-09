// @ts-nocheck - React type conflicts with Recharts components
import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ComposedChart,
  ReferenceLine,
  Brush,
  Legend,
  Cell
} from 'recharts';
import { PerformanceMetrics, PerformanceSnapshot } from '../../core/PerformanceMonitor';
import { DashboardTheme } from '../PerformanceDashboard';

export interface InteractiveChartsProps {
  metrics: PerformanceMetrics;
  history: PerformanceSnapshot[];
  theme: DashboardTheme;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  onDataPointClick?: (data: any) => void;
  onZoom?: (startTime: number, endTime: number) => void;
  showPredictions?: boolean;
  showAnomalies?: boolean;
  showThresholds?: boolean;
}

export const InteractiveCharts: React.FC<InteractiveChartsProps> = ({
  metrics,
  history,
  theme,
  timeRange = '1h',
  onDataPointClick = () => {},
  onZoom = () => {},
  showPredictions = false,
  showAnomalies = false,
  showThresholds = true
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('layoutShift');
  const [brushRange, setBrushRange] = useState<[number, number]>([0, 1]);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const chartRef = useRef<any>(null);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - ranges[timeRange];
    return history
      .filter(snapshot => snapshot.timestamp >= cutoff)
      .map((snapshot, index) => ({
        ...snapshot,
        index,
        time: new Date(snapshot.timestamp).toLocaleTimeString(),
        date: new Date(snapshot.timestamp).toLocaleDateString(),
        datetime: new Date(snapshot.timestamp).toISOString(),
        // Core Web Vitals
        layoutShift: snapshot.metrics.layoutShift.current,
        lcp: snapshot.metrics.paintTiming.lcp || 0,
        fcp: snapshot.metrics.paintTiming.fcp || 0,
        // Memory metrics
        memoryUsage: snapshot.metrics.memory ? (snapshot.metrics.memory.usage * 100) : 0,
        memoryUsed: snapshot.metrics.memory ? (snapshot.metrics.memory.used / 1024 / 1024) : 0,
        memoryTotal: snapshot.metrics.memory ? (snapshot.metrics.memory.total / 1024 / 1024) : 0,
        // Performance metrics
        renderTime: snapshot.metrics.responsiveElements.averageRenderTime || 0,
        elementCount: snapshot.metrics.responsiveElements.count,
        cacheHitRate: snapshot.metrics.custom?.cacheHitRate ? (snapshot.metrics.custom.cacheHitRate * 100) : 0,
        scalingOps: snapshot.metrics.custom?.scalingOperations || 0,
        // Resource metrics
        resourceRequests: snapshot.metrics.resources.recentRequests,
        transferSize: snapshot.metrics.resources.totalSize / 1024,
        // Anomaly detection
        isAnomaly: (snapshot.metrics.custom as any)?.isAnomaly || false,
        anomalyScore: (snapshot.metrics.custom as any)?.anomalyScore || 0,
        // Predictions
        predictedValue: (snapshot.metrics.custom as any)?.predictedValue || null,
        confidence: (snapshot.metrics.custom as any)?.confidence || 0
      }));
  }, [history, timeRange]);

  // Performance thresholds
  const thresholds = useMemo(() => ({
    layoutShift: { good: 0.1, poor: 0.25 },
    lcp: { good: 2500, poor: 4000 },
    fcp: { good: 1800, poor: 3000 },
    memoryUsage: { good: 70, poor: 90 },
    renderTime: { good: 16.67, poor: 33.33 },
    cacheHitRate: { good: 80, poor: 60 }
  }), []);

  // Chart colors based on theme
  const colors = {
    primary: theme === 'dark' ? '#4dabf7' : '#1c7ed6',
    success: theme === 'dark' ? '#51cf66' : '#37b24d',
    warning: theme === 'dark' ? '#ffd43b' : '#f59f00',
    danger: theme === 'dark' ? '#ff6b6b' : '#e03131',
    info: theme === 'dark' ? '#74c0fc' : '#339af0',
    grid: theme === 'dark' ? '#343a40' : '#e9ecef',
    text: theme === 'dark' ? '#ced4da' : '#495057',
    background: theme === 'dark' ? '#212529' : '#ffffff',
    anomaly: '#ff6b6b',
    prediction: '#9775fa'
  };

  // Enhanced tooltip with rich information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="interactive-tooltip">
          <div className="tooltip-header">
            <strong>{data.time}</strong>
            <span className="tooltip-date">{data.date}</span>
          </div>
          <div className="tooltip-content">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="tooltip-item">
                <div 
                  className="tooltip-color" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="tooltip-label">{entry.dataKey}:</span>
                <span className="tooltip-value">
                  {entry.value?.toFixed ? entry.value.toFixed(2) : entry.value}
                  {entry.unit || ''}
                </span>
              </div>
            ))}
            {data.isAnomaly && (
              <div className="tooltip-anomaly">
                <span className="anomaly-indicator">⚠️ Anomaly Detected</span>
                <span className="anomaly-score">Score: {data.anomalyScore.toFixed(2)}</span>
              </div>
            )}
            {data.predictedValue && (
              <div className="tooltip-prediction">
                <span className="prediction-indicator">🔮 Predicted: {data.predictedValue.toFixed(2)}</span>
                <span className="confidence">Confidence: {(data.confidence * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle brush change for zooming
  const handleBrushChange = (brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      const startTime = filteredData[brushData.startIndex]?.timestamp;
      const endTime = filteredData[brushData.endIndex]?.timestamp;
      if (startTime && endTime && onZoom) {
        onZoom(startTime, endTime);
      }
    }
  };

  // Handle data point click
  const handleDataPointClick = (data: any) => {
    if (onDataPointClick) {
      onDataPointClick(data);
    }
  };

  // Render threshold lines
  const renderThresholdLines = (metric: string) => {
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold || !showThresholds) return null;

    return (
      <>
        <ReferenceLine 
          y={threshold.good} 
          stroke={colors.success} 
          strokeDasharray="5 5" 
          label={{ value: "Good", position: "top" }}
        />
        <ReferenceLine 
          y={threshold.poor} 
          stroke={colors.danger} 
          strokeDasharray="5 5" 
          label={{ value: "Poor", position: "top" }}
        />
      </>
    );
  };

  // Render anomaly points
  const renderAnomalyPoints = () => {
    if (!showAnomalies) return null;

    return (
      <Scatter
        data={filteredData.filter(d => d.isAnomaly)}
        dataKey="anomalyScore"
        fill={colors.anomaly}
        onClick={handleDataPointClick}
      />
    );
  };

  // Render prediction line
  const renderPredictionLine = () => {
    if (!showPredictions) return null;

    return (
      <Line
        type="monotone"
        dataKey="predictedValue"
        stroke={colors.prediction}
        strokeWidth={2}
        strokeDasharray="5 5"
        dot={false}
        name="Prediction"
      />
    );
  };

  // Metric selector
  const metricOptions = [
    { key: 'layoutShift', label: 'Layout Shift', unit: '', color: colors.danger },
    { key: 'lcp', label: 'LCP', unit: 'ms', color: colors.primary },
    { key: 'fcp', label: 'FCP', unit: 'ms', color: colors.info },
    { key: 'memoryUsage', label: 'Memory Usage', unit: '%', color: colors.warning },
    { key: 'renderTime', label: 'Render Time', unit: 'ms', color: colors.success },
    { key: 'cacheHitRate', label: 'Cache Hit Rate', unit: '%', color: colors.info }
  ];

  const selectedMetricConfig = metricOptions.find(m => m.key === selectedMetric);

  return (
    <div className="interactive-charts">
      {/* Controls */}
      <div className="chart-controls">
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

        <div className="time-range-selector">
          <label>Time Range:</label>
          <select 
            value={timeRange} 
            onChange={(e) => {/* Handle time range change */}}
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div className="chart-options">
          <label>
            <input 
              type="checkbox" 
              checked={showThresholds}
              onChange={(e) => {/* Handle threshold toggle */}}
            />
            Show Thresholds
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={showAnomalies}
              onChange={(e) => {/* Handle anomaly toggle */}}
            />
            Show Anomalies
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={showPredictions}
              onChange={(e) => {/* Handle prediction toggle */}}
            />
            Show Predictions
          </label>
        </div>
      </div>

      {/* Main Chart */}
      <div className="main-chart-container">
        <h3>
          {selectedMetricConfig?.label} Over Time
          {selectedMetricConfig?.unit && ` (${selectedMetricConfig.unit})`}
        </h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart 
            data={filteredData}
            ref={chartRef}
            onClick={handleDataPointClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis 
              dataKey="time" 
              stroke={colors.text}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke={colors.text}
              tick={{ fontSize: 12 }}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Main metric line */}
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={selectedMetricConfig?.color || colors.primary}
              strokeWidth={3}
              dot={{ r: 4, fill: selectedMetricConfig?.color }}
              activeDot={{ r: 6, stroke: selectedMetricConfig?.color, strokeWidth: 2 }}
              name={selectedMetricConfig?.label}
            />

            {/* Threshold lines */}
            {renderThresholdLines(selectedMetric)}

            {/* Prediction line */}
            {renderPredictionLine()}

            {/* Anomaly points */}
            {renderAnomalyPoints()}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Brush for zooming */}
        <div className="chart-brush">
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={filteredData}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={selectedMetricConfig?.color}
                fill={selectedMetricConfig?.color}
                fillOpacity={0.3}
              />
              <Brush
                dataKey="time"
                height={30}
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.1}
                onChange={handleBrushChange}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-metric comparison */}
      <div className="comparison-charts">
        <h3>Multi-Metric Comparison</h3>
        <div className="comparison-grid">
          {metricOptions.slice(0, 4).map(metric => (
            <div key={metric.key} className="comparison-chart">
              <h4>{metric.label}</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={filteredData.slice(-20)}>
                  <Line
                    type="monotone"
                    dataKey={metric.key}
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      {/* Performance summary */}
      <div className="performance-summary">
        <h3>Performance Summary</h3>
        <div className="summary-grid">
          {metricOptions.map(metric => {
            const currentValue = (metrics[metric.key as keyof PerformanceMetrics] as any)?.current || 
                                (metrics[metric.key as keyof PerformanceMetrics] as any)?.usage || 
                                (metrics[metric.key as keyof PerformanceMetrics] as any)?.averageRenderTime || 
                                (metrics[metric.key as keyof PerformanceMetrics] as any)?.cacheHitRate || 
                                0;
            const threshold = thresholds[metric.key as keyof typeof thresholds];
            const status = currentValue <= threshold.good ? 'good' : 
                          currentValue <= threshold.poor ? 'warning' : 'poor';
            
            return (
              <div key={metric.key} className={`summary-item ${status}`}>
                <div className="summary-label">{metric.label}</div>
                <div className="summary-value">
                  {currentValue?.toFixed ? currentValue.toFixed(2) : currentValue}
                  {metric.unit}
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

export default InteractiveCharts;
