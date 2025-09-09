// @ts-nocheck - React type conflicts with Recharts components
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
    return history.map((snapshot, index) => ({
      time: new Date(snapshot.timestamp).toLocaleTimeString(),
      timestamp: snapshot.timestamp,
      layoutShift: snapshot.metrics.layoutShift.current,
      memoryUsage: snapshot.metrics.memory ? (snapshot.metrics.memory.usage * 100) : 0,
      lcp: snapshot.metrics.paintTiming.lcp || 0,
      fcp: snapshot.metrics.paintTiming.fcp || 0,
      renderTime: snapshot.metrics.responsiveElements.averageRenderTime || 0,
      elementCount: snapshot.metrics.responsiveElements.count,
      cacheHitRate: snapshot.metrics.custom?.cacheHitRate ? (snapshot.metrics.custom.cacheHitRate * 100) : 0,
      scalingOps: snapshot.metrics.custom?.scalingOperations || 0,
      resourceRequests: snapshot.metrics.resources.recentRequests,
      transferSize: snapshot.metrics.resources.totalSize / 1024 // KB
    }));
  }, [history]);

  // Memory breakdown data
  const memoryData = useMemo(() => {
    if (!metrics.memory) return [];
    
    return [
      { name: 'Used', value: metrics.memory.used / 1024 / 1024, color: '#ff6b6b' },
      { name: 'Free', value: (metrics.memory.total - metrics.memory.used) / 1024 / 1024, color: '#51cf66' }
    ];
  }, [metrics.memory]);

  // Layout shift sources
  const layoutShiftSources = useMemo(() => {
    const sources: Record<string, number> = {};
    
    metrics.layoutShift.entries.forEach(entry => {
      entry.sources.forEach(source => {
        sources[source.element] = (sources[source.element] || 0) + entry.value;
      });
    });
    
    return Object.entries(sources)
      .map(([element, value]) => ({ element, value, color: getElementColor(element) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [metrics.layoutShift.entries]);

  // Render time distribution
  const renderTimeData = useMemo(() => {
    const times = metrics.responsiveElements.renderTimes;
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
  }, [metrics.responsiveElements.renderTimes]);

  // Chart colors based on theme
  const colors = {
    primary: theme === 'dark' ? '#4dabf7' : '#1c7ed6',
    success: theme === 'dark' ? '#51cf66' : '#37b24d',
    warning: theme === 'dark' ? '#ffd43b' : '#f59f00',
    danger: theme === 'dark' ? '#ff6b6b' : '#e03131',
    grid: theme === 'dark' ? '#343a40' : '#e9ecef',
    text: theme === 'dark' ? '#ced4da' : '#495057'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toFixed(2)}{entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
                  dataKey="fcp"
                  stroke={colors.success}
                  strokeWidth={2}
                  name="FCP"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lcp"
                  stroke={colors.primary}
                  strokeWidth={2}
                  name="LCP"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Render Performance */}
          <div className="chart-container large">
            <h3>Render Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="time" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="renderTime"
                  stroke={colors.warning}
                  strokeWidth={2}
                  name="Avg Render Time"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Element Count */}
          <div className="chart-container medium">
            <h3>Responsive Elements</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="time" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="elementCount"
                  stroke={colors.primary}
                  fill={colors.primary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cache Performance */}
          <div className="chart-container medium">
            <h3>Cache Hit Rate</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="time" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="cacheHitRate"
                  stroke={colors.success}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Analysis Charts */}
        <div className="analysis-charts">
          {/* Memory Breakdown */}
          {memoryData.length > 0 && (
            <div className="chart-container small">
              <h3>Memory Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={memoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {memoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)} MB`, 'Memory']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Layout Shift Sources */}
          {layoutShiftSources.length > 0 && (
            <div className="chart-container small">
              <h3>Layout Shift Sources</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={layoutShiftSources}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis dataKey="element" stroke={colors.text} />
                  <YAxis stroke={colors.text} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill={colors.danger} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Render Time Distribution */}
          <div className="chart-container small">
            <h3>Render Time Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
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
        </div>
      </div>
    );
  }

  return (
    <div className="charts-compact">
      <div className="charts-grid">
        {/* Layout Shift */}
        <div className="chart-container">
          <h4>Layout Shift</h4>
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

        {/* Memory Usage */}
        <div className="chart-container">
          <h4>Memory %</h4>
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

        {/* Render Time */}
        <div className="chart-container">
          <h4>Render Time</h4>
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

        {/* Cache Hit Rate */}
        <div className="chart-container">
          <h4>Cache Hit %</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData.slice(-20)}>
              <Line
                type="monotone"
                dataKey="cacheHitRate"
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

// Helper functions
function getElementColor(element: string): string {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a55eea'];
  const hash = element.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
}
