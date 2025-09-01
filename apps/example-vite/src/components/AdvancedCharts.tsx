import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    fill?: boolean;
  }[];
}

interface PerformanceMetrics {
  timestamp: string;
  cpu: number;
  memory: number;
  network: number;
  renderTime: number;
}

const AdvancedCharts: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics[]>([]);
  const [currentMetric, setCurrentMetric] = useState<'cpu' | 'memory' | 'network' | 'renderTime'>('cpu');
  const intervalRef = useRef<NodeJS.Timeout>();

  // Responsive values
  const chartHeight = useResponsiveValue(400, { token: 'spacing' });
  const chartPadding = useResponsiveValue(24, { token: 'spacing' });
  const fontSize = useResponsiveValue(14, { token: 'fontSize' });

  // Generate mock performance data
  const generatePerformanceData = (): PerformanceMetrics[] => {
    const now = new Date();
    const data: PerformanceMetrics[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        timestamp: time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 100,
        renderTime: Math.random() * 50 + 10
      });
    }
    
    return data;
  };

  useEffect(() => {
    // Initialize with mock data
    setPerformanceData(generatePerformanceData());

    // Simulate real-time updates
    intervalRef.current = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          timestamp: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          network: Math.random() * 100,
          renderTime: Math.random() * 50 + 10
        });
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getChartData = (): ChartData => {
    const labels = performanceData.map(d => d.timestamp);
    const data = performanceData.map(d => d[currentMetric]);
    
    return {
      labels,
      datasets: [
        {
          label: currentMetric.charAt(0).toUpperCase() + currentMetric.slice(1),
          data,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
        }
      ]
    };
  };

  const getBarChartData = (): ChartData => {
    const metrics = ['CPU', 'Memory', 'Network', 'Render Time'];
    const averages = [
      performanceData.reduce((sum, d) => sum + d.cpu, 0) / performanceData.length,
      performanceData.reduce((sum, d) => sum + d.memory, 0) / performanceData.length,
      performanceData.reduce((sum, d) => sum + d.network, 0) / performanceData.length,
      performanceData.reduce((sum, d) => sum + d.renderTime, 0) / performanceData.length
    ];

    return {
      labels: metrics,
      datasets: [
        {
          label: 'Average Performance',
          data: averages,
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
        }
      ]
    };
  };

  const getDoughnutData = (): ChartData => {
    const current = performanceData[performanceData.length - 1];
    if (!current) return { labels: [], datasets: [] };

    return {
      labels: ['CPU', 'Memory', 'Network', 'Render Time'],
      datasets: [
        {
          label: 'Current Performance',
          data: [current.cpu, current.memory, current.network, current.renderTime],
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { size: fontSize },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { font: { size: fontSize - 2 } },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      },
      y: {
        ticks: { font: { size: fontSize - 2 } },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      }
    }
  };

  const metricButtons = [
    { key: 'cpu', label: 'CPU Usage', color: '#6366f1' },
    { key: 'memory', label: 'Memory Usage', color: '#22c55e' },
    { key: 'network', label: 'Network', color: '#fb923c' },
    { key: 'renderTime', label: 'Render Time', color: '#ef4444' }
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ padding: chartPadding }}
      className="advanced-charts"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: fontSize + 8, marginBottom: chartPadding }}
        className="text-2xl font-bold text-gray-900 mb-6"
      >
        Real-Time Performance Analytics
      </motion.h2>

      {/* Metric Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        {metricButtons.map(({ key, label, color }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentMetric(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentMetric === key
                ? 'text-white shadow-lg'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: currentMetric === key ? color : undefined,
            }}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {currentMetric.charAt(0).toUpperCase() + currentMetric.slice(1)} Over Time
        </h3>
        <div style={{ height: chartHeight }}>
          <Line data={getChartData()} options={chartOptions} />
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance Averages
          </h3>
          <div style={{ height: chartHeight * 0.8 }}>
            <Bar data={getBarChartData()} options={chartOptions} />
          </div>
        </motion.div>

        {/* Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Current Performance Distribution
          </h3>
          <div style={{ height: chartHeight * 0.8 }}>
            <Doughnut data={getDoughnutData()} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Live Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Live Data Streaming</span>
          </div>
          <span className="text-sm opacity-90">
            Updates every 5 seconds • Last: {performanceData[performanceData.length - 1]?.timestamp}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedCharts;
