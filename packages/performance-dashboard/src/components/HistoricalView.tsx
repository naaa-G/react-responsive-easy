import React from 'react';
import { PerformanceSnapshot } from '../core/PerformanceMonitor';
import { DashboardTheme } from './PerformanceDashboard';

export interface HistoricalViewProps {
  history: PerformanceSnapshot[];
  theme: DashboardTheme;
}

export const HistoricalView: React.FC<HistoricalViewProps> = ({ history, theme: _theme }) => {
  return (
    <div className="historical-view">
      <div className="panel-header">
        <h2>Historical Performance Data</h2>
        <p>Performance trends over time</p>
      </div>
      
      <div className="historical-content">
        <p>Historical view implementation coming soon...</p>
        <p>Data points available: {history.length}</p>
      </div>
    </div>
  );
};
