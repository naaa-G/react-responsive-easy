import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Generic skeleton loading component
 */
export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = '',
  animation = 'pulse'
}: SkeletonProps) => {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius,
    backgroundColor: 'var(--skeleton-bg, #e2e8f0)',
    animation: animation === 'none' ? 'none' : `skeleton-${animation} 1.5s ease-in-out infinite`
  };

  return (
    <div 
      className={`skeleton ${className}`}
      style={style}
      aria-label="Loading content"
    />
  );
};

/**
 * Chart skeleton for loading states
 */
export const ChartSkeleton = ({ height = 300, showHeader = true, showLegend = true }: {
  height?: number;
  showHeader?: boolean;
  showLegend?: boolean;
}) => (
  <div className="chart-skeleton">
    {showHeader && (
      <div className="chart-skeleton-header">
        <Skeleton width="200px" height="24px" />
        <Skeleton width="100px" height="16px" />
      </div>
    )}
    
    <div className="chart-skeleton-content" style={{ height }}>
      <Skeleton width="100%" height="100%" borderRadius="8px" />
    </div>
    
    {showLegend && (
      <div className="chart-skeleton-legend">
        <Skeleton width="80px" height="16px" />
        <Skeleton width="80px" height="16px" />
        <Skeleton width="80px" height="16px" />
      </div>
    )}
  </div>
);

/**
 * Metrics skeleton for loading states
 */
export const MetricsSkeleton = ({ count = 4, layout = 'grid' }: {
  count?: number;
  layout?: 'grid' | 'list';
}) => (
  <div className={`metrics-skeleton ${layout}`}>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="metric-skeleton-item">
        <Skeleton width="100%" height="60px" borderRadius="8px" />
      </div>
    ))}
  </div>
);

/**
 * Heatmap skeleton for loading states
 */
export const HeatmapSkeleton = ({ rows = 7, columns = 24 }: {
  rows?: number;
  columns?: number;
}) => (
  <div className="heatmap-skeleton">
    <div className="heatmap-skeleton-header">
      <Skeleton width="200px" height="24px" />
    </div>
    
    <div className="heatmap-skeleton-grid">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="heatmap-skeleton-row">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              width="20px" 
              height="20px" 
              borderRadius="2px"
              animation="wave"
            />
          ))}
        </div>
      ))}
    </div>
    
    <div className="heatmap-skeleton-legend">
      <Skeleton width="120px" height="16px" />
    </div>
  </div>
);

/**
 * Dashboard skeleton for loading states
 */
export const DashboardSkeleton = ({ showHeader = true, showNavigation = true, showFooter = true }: {
  showHeader?: boolean;
  showNavigation?: boolean;
  showFooter?: boolean;
}) => (
  <div className="dashboard-skeleton">
    {showHeader && (
      <div className="dashboard-skeleton-header">
        <Skeleton width="300px" height="32px" />
        <div className="dashboard-skeleton-controls">
          <Skeleton width="120px" height="32px" />
          <Skeleton width="120px" height="32px" />
          <Skeleton width="120px" height="32px" />
        </div>
      </div>
    )}
    
    {showNavigation && (
      <div className="dashboard-skeleton-nav">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} width="120px" height="40px" />
        ))}
      </div>
    )}
    
    <div className="dashboard-skeleton-content">
      <div className="dashboard-skeleton-main">
        <ChartSkeleton height={400} />
      </div>
      
      <div className="dashboard-skeleton-sidebar">
        <MetricsSkeleton count={3} layout="list" />
      </div>
    </div>
    
    {showFooter && (
      <div className="dashboard-skeleton-footer">
        <Skeleton width="200px" height="16px" />
        <Skeleton width="150px" height="16px" />
      </div>
    )}
  </div>
);

/**
 * Table skeleton for loading states
 */
export const TableSkeleton = ({ rows = 5, columns = 4, showHeader = true }: {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}) => (
  <div className="table-skeleton">
    {showHeader && (
      <div className="table-skeleton-header">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} width="120px" height="20px" />
        ))}
      </div>
    )}
    
    <div className="table-skeleton-body">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="table-skeleton-row">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={colIndex} width="100px" height="16px" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Loading spinner component
 */
export const LoadingSpinner = ({ size = 'medium', color = 'var(--primary-color, #1c7ed6)', className = '' }: {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  return (
    <div 
      className={`loading-spinner ${className}`}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: `2px solid ${color}20`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
      aria-label="Loading"
    />
  );
};

/**
 * Loading overlay component
 */
export const LoadingOverlay = ({ isLoading, message = 'Loading...', children }: {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}) => (
  <div className="loading-overlay-container">
    {children}
    {isLoading && (
      <div className="loading-overlay">
        <div className="loading-overlay-content">
          <LoadingSpinner size="large" />
          <p className="loading-message">{message}</p>
        </div>
      </div>
    )}
  </div>
);

export default {
  Skeleton,
  ChartSkeleton,
  MetricsSkeleton,
  HeatmapSkeleton,
  DashboardSkeleton,
  TableSkeleton,
  LoadingSpinner,
  LoadingOverlay
};
