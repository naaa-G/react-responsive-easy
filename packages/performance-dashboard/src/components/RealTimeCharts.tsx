import React, { useMemo } from 'react';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { PerformanceMetrics, PerformanceSnapshot } from '../core/PerformanceMonitor';
import { DashboardTheme } from './PerformanceDashboard';

export interface RealTimeChartsProps {
  metrics: PerformanceMetrics;
  history: PerformanceSnapshot[];
  theme: DashboardTheme;
  expanded?: boolean;
}

export const RealTimeCharts: React.FC<RealTimeChartsProps> = ({
  metrics,
  history,
  theme,
  expanded = false
}) => {
  // Prepare chart data
  const chartData = useMemo(() => {
    return history.map((snapshot, _index) => ({
      time: new Date(snapshot.timestamp).toLocaleTimeString(),
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
      transferSize: (snapshot.metrics.resources?.totalSize ?? 0) / 1024 // KB
    }));
  }, [history]);

  // Memory breakdown data
  const memoryData = useMemo(() => {
    if (!metrics.memory) return [];
    
    return [
      { name: 'Used', value: (metrics.memory.used ?? 0) / 1024 / 1024, color: '#ff6b6b' },
      { name: 'Free', value: ((metrics.memory.total ?? 0) - (metrics.memory.used ?? 0)) / 1024 / 1024, color: '#51cf66' }
    ];
  }, [metrics.memory]);

  // Layout shift sources
  const layoutShiftSources = useMemo(() => {
    const sources: Record<string, number> = {};
    
    metrics.layoutShift?.entries?.forEach(entry => {
      entry.sources?.forEach(source => {
        sources[source.element] = (sources[source.element] ?? 0) + (entry.value ?? 0);
      });
    });
    
    return Object.entries(sources)
      .map(([element, value]) => ({ element, value, color: getElementColor(element) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [metrics.layoutShift?.entries]);

  // Render time distribution
  const renderTimeData = useMemo(() => {
    const times = metrics.responsiveElements?.renderTimes ?? [];
    const buckets = [
      { range: '0-5ms', count: 0, color: '#51cf66' },
      { range: '5-10ms', count: 0, color: '#ffd43b' },
      { range: '10-16ms', count: 0, color: '#ff9f43' },
      { range: '16ms+', count: 0, color: '#ff6b6b' }
    ];
    
    times.forEach(time => {
      if (time <= 5) buckets[0].count++;
      else if (time <= 10) buckets[1].count++;
      else if (time <= 16) buckets[2].count++;
      else buckets[3].count++;
    });
    
    return buckets;
  }, [metrics.responsiveElements?.renderTimes]);

  // Chart colors based on theme
  const colors = {
    primary: theme === 'dark' ? '#4dabf7' : '#1c7ed6',
    success: theme === 'dark' ? '#51cf66' : '#37b24d',
    warning: theme === 'dark' ? '#ffd43b' : '#f59f00',
    danger: theme === 'dark' ? '#ff6b6b' : '#e03131',
    grid: theme === 'dark' ? '#343a40' : '#e9ecef',
    text: theme === 'dark' ? '#ced4da' : '#495057'
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      color: string;
      dataKey: string;
      value: number;
      unit?: string;
    }>;
    label?: string;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toFixed(2)}{entry.unit ?? ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Helper function to get element color
  const getElementColor = (element: string): string => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    const hash = element.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  if (expanded) {
    return (
      <div className="charts-expanded">
        <div className="charts-grid-large">
          {/* Layout Shift Over Time */}
          <div className="chart-container large">
            <h3>Layout Shift Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="time" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="layoutShift"
                  stroke={colors.danger}
                  fill={colors.danger}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Memory Usage */}
          <div className="chart-container large">
            <h3>Memory Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="time" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="memoryUsage"
                  stroke={colors.warning}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Paint Timing */}
          <div className="chart-container large">
            <h3>Paint Timing</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="time" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="lcp"
                  stroke={colors.primary}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="fcp"
                  stroke={colors.success}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Layout Shift Sources */}
          <div className="chart-container large">
            <h3>Layout Shift Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={layoutShiftSources}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="element" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={colors.danger} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Render Time Distribution */}
          <div className="chart-container large">
            <h3>Render Time Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={renderTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="range" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count">
                  {renderTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Memory Breakdown */}
          <div className="chart-container large">
            <h3>Memory Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={memoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {memoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown) => {
                    const numValue = typeof value === 'number' ? value : 0;
                    return [`${numValue.toFixed(2)} MB`, 'Memory'];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="charts-compact">
      <div className="charts-grid">
        {/* Performance Overview */}
        <div className="chart-container">
          <h3>Performance Overview</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData.slice(-20)}>
              <Line
                type="monotone"
                dataKey="renderTime"
                stroke={colors.primary}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Usage */}
        <div className="chart-container">
          <h3>Memory Usage</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={chartData.slice(-20)}>
              <Area
                type="monotone"
                dataKey="memoryUsage"
                stroke={colors.warning}
                fill={colors.warning}
                fillOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Layout Shift */}
        <div className="chart-container">
          <h3>Layout Shift</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData.slice(-20)}>
              <Line
                type="monotone"
                dataKey="layoutShift"
                stroke={colors.danger}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resource Usage */}
        <div className="chart-container">
          <h3>Resource Usage</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData.slice(-20)}>
              <Line
                type="monotone"
                dataKey="resourceRequests"
                stroke={colors.success}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};