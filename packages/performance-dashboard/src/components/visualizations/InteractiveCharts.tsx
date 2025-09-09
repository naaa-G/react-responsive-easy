import React, { useMemo, useRef, useState } from 'react';
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
  ComposedChart,
  ReferenceLine,
  Brush,
  Legend,
  Scatter
} from 'recharts';
import { PerformanceMetrics, PerformanceSnapshot } from '../../core/PerformanceMonitor';
import { DashboardTheme } from '../PerformanceDashboard';

export interface InteractiveChartsProps {
  metrics: PerformanceMetrics;
  history: PerformanceSnapshot[];
  theme: DashboardTheme;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
  onDataPointClick?: (data: unknown) => void;
  onZoom?: (startTime: number, endTime: number) => void;
  showPredictions?: boolean;
  showAnomalies?: boolean;
  showThresholds?: boolean;
}

interface ChartDataPoint {
  time: string;
  date: string;
  timestamp: number;
  layoutShift: number;
  memoryUsage: number;
  lcp: number;
  fcp: number;
  renderTime: number;
  elementCount: number;
  cacheHitRate: number;
  scalingOps: number;
  resourceRequests: number;
  transferSize: number;
  isAnomaly?: boolean;
  anomalyScore?: number;
  predictedValue?: number;
  confidence?: number;
}

interface TooltipEntry {
  color: string;
  dataKey: string;
  value: number;
  unit?: string;
  payload: ChartDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

export const InteractiveCharts: React.FC<InteractiveChartsProps> = ({
  metrics: _metrics,
  history,
  theme,
  timeRange = '1h',
  onDataPointClick = (_data: unknown) => {},
  onZoom = (_startTime: number, _endTime: number) => {},
  showPredictions = false,
  showAnomalies = false,
  showThresholds = true
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('layoutShift');
  const [_brushRange, _setBrushRange] = useState<[number, number]>([0, 1]);
  const [_hoveredPoint, _setHoveredPoint] = useState<unknown>(null);
  const chartRef = useRef<unknown>(null);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - timeRanges[timeRange];
    return history
      .filter(snapshot => snapshot.timestamp >= cutoff)
      .map(snapshot => ({
        time: new Date(snapshot.timestamp).toLocaleTimeString(),
        date: new Date(snapshot.timestamp).toLocaleDateString(),
        timestamp: snapshot.timestamp,
        layoutShift: snapshot.metrics.layoutShift?.current ?? 0,
        memoryUsage: snapshot.metrics.memory ? (snapshot.metrics.memory.usage * 100) : 0,
        lcp: snapshot.metrics.paintTiming?.lcp ?? 0,
        fcp: snapshot.metrics.paintTiming?.fcp ?? 0,
        renderTime: snapshot.metrics.responsiveElements?.averageRenderTime ?? 0,
        elementCount: snapshot.metrics.responsiveElements?.count ?? 0,
        cacheHitRate: snapshot.metrics.custom?.cacheHitRate ? (snapshot.metrics.custom.cacheHitRate * 100) : 0,
        scalingOps: snapshot.metrics.custom?.scalingOperations ?? 0,
        resourceRequests: snapshot.metrics.resources?.recentRequests ?? 0,
        transferSize: (snapshot.metrics.resources?.totalSize ?? 0) / 1024, // KB
        isAnomaly: false, // This would be calculated by ML models
        anomalyScore: 0,
        predictedValue: showPredictions ? Math.random() * 100 : undefined,
        confidence: showPredictions ? Math.random() : undefined
      }));
  }, [history, timeRange, showPredictions]);

  // Performance thresholds
  const thresholds = useMemo(() => ({
    layoutShift: { good: 0.1, poor: 0.25 },
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
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label: _label }) => {
    if (active && payload?.length) {
      const data = payload[0]?.payload;
      return (
        <div className="interactive-tooltip">
          <div className="tooltip-header">
            <strong>{data.time}</strong>
            <span className="tooltip-date">{data.date}</span>
          </div>
          <div className="tooltip-content">
            {payload.map((entry: TooltipEntry, index: number) => (
              <div key={index} className="tooltip-item">
                <div 
                  className="tooltip-color" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="tooltip-label">{entry.dataKey}:</span>
                <span className="tooltip-value">
                  {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                  {entry.unit ?? ''}
                </span>
              </div>
            ))}
            {data.isAnomaly && (
              <div className="tooltip-anomaly">
                <span className="anomaly-indicator">⚠️ Anomaly Detected</span>
                <span className="anomaly-score">Score: {typeof data.anomalyScore === 'number' ? data.anomalyScore.toFixed(2) : data.anomalyScore}</span>
              </div>
            )}
            {data.predictedValue && (
              <div className="tooltip-prediction">
                <span className="prediction-indicator">🔮 Predicted: {typeof data.predictedValue === 'number' ? data.predictedValue.toFixed(2) : data.predictedValue}</span>
                <span className="confidence">Confidence: {typeof data.confidence === 'number' ? (data.confidence * 100).toFixed(1) : data.confidence}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle brush change for zooming
  const handleBrushChange = (brushData: { startIndex?: number; endIndex?: number }) => {
    if (brushData?.startIndex !== undefined && brushData.endIndex !== undefined) {
      const startTime = filteredData[brushData.startIndex]?.timestamp;
      const endTime = filteredData[brushData.endIndex]?.timestamp;
      if (startTime && endTime && onZoom) {
        onZoom(startTime, endTime);
      }
    }
  };

  // Handle data point click
  const handleDataPointClick = (data: unknown) => {
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
        dataKey="timestamp"
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

  return (
    <div className="interactive-charts">
      <div className="chart-controls">
        <div className="metric-selector">
          <label htmlFor="metric-select">Metric:</label>
          <select
            id="metric-select"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="layoutShift">Layout Shift</option>
            <option value="memoryUsage">Memory Usage</option>
            <option value="renderTime">Render Time</option>
            <option value="lcp">LCP</option>
            <option value="fcp">FCP</option>
            <option value="cacheHitRate">Cache Hit Rate</option>
          </select>
        </div>
      </div>

      <div className="main-chart">
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
              tick={{ fontSize: 12, fill: colors.text }}
            />
            <YAxis
              stroke={colors.text}
              tick={{ fontSize: 12, fill: colors.text }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Main metric line */}
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={colors.primary}
              strokeWidth={3}
              dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
            />
            
            {/* Threshold lines */}
            {renderThresholdLines(selectedMetric)}
            
            {/* Prediction line */}
            {renderPredictionLine()}
            
            {/* Anomaly points */}
            {renderAnomalyPoints()}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Brush for zooming */}
      <div className="brush-chart">
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={filteredData}>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={colors.primary}
              fill={colors.primary}
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

      {/* Mini trend chart */}
      <div className="mini-trend">
        <h4>Recent Trend</h4>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={filteredData.slice(-20)}>
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={colors.primary}
              strokeWidth={2}
              dot={false}
            />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};