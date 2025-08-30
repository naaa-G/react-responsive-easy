import React, { useState, useEffect } from 'react';
import { 
  PerformanceDashboard, 
  PerformanceMonitor, 
  PERFORMANCE_PRESETS,
  DashboardTheme 
} from '../../src/index';

export const DashboardApp: React.FC = () => {
  const [monitor] = useState(() => new PerformanceMonitor(PERFORMANCE_PRESETS.development));
  const [theme, setTheme] = useState<DashboardTheme>('light');
  const [isConnected, setIsConnected] = useState(false);

  // Initialize theme from system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check if we're connected to a React Responsive Easy application
  useEffect(() => {
    // This would normally connect to a running application
    // For demo purposes, we'll simulate a connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleExportData = () => {
    const data = {
      timestamp: Date.now(),
      metrics: monitor.getMetrics(),
      history: monitor.getHistory(),
      report: monitor.generateReport()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rre-performance-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isConnected) {
    return (
      <div className="dashboard-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Connecting to React Responsive Easy Application...</h2>
          <p>Make sure your application is running with the performance monitoring enabled.</p>
          
          <div className="connection-help">
            <h3>Quick Setup:</h3>
            <pre><code>{`import { PerformanceMonitor } from '@react-responsive-easy/performance-dashboard';

const monitor = new PerformanceMonitor();
monitor.start();`}</code></pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-app theme-${theme}`}>
      <PerformanceDashboard
        monitor={monitor}
        theme={theme}
        config={{
          autoStart: true,
          showAlerts: true,
          showRecommendations: true,
          showHistorical: true,
          refreshInterval: 1000
        }}
        onExportData={handleExportData}
        onSettingsChange={(settings) => {
          console.log('Settings changed:', settings);
        }}
      />
      
      {/* Theme Toggle */}
      <button 
        className="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};
