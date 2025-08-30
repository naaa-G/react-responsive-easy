import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'usePerformanceMonitor - React Responsive Easy',
  description: 'Learn how to use the usePerformanceMonitor hook to monitor component performance and optimize responsive scaling.',
}

export default function UsePerformanceMonitorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          usePerformanceMonitor
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Monitor component performance and optimize responsive scaling in real-time.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/docs/hooks/use-breakpoint">← useBreakpoint</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/hooks">← Back to Hooks</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          The <code>usePerformanceMonitor</code> hook provides real-time performance monitoring 
          for responsive components. It tracks rendering times, scaling calculations, and performance 
          metrics to help you optimize your responsive design system.
        </p>

        <h2>Basic Usage</h2>
        <p>
          Import and use the hook to monitor component performance:
        </p>
        <CodeBlock 
          language="tsx"
          code={`import { usePerformanceMonitor } from '@react-responsive-easy/core'

function MyComponent() {
  const performance = usePerformanceMonitor()
  
  return (
    <div>
      <p>Render time: {performance.renderTime}ms</p>
      <p>Scaling operations: {performance.scalingOperations}</p>
      <p>Cache hit rate: {performance.cacheHitRate}%</p>
    </div>
  )
}`}
        />

        <h2>Hook Signature</h2>
        <CodeBlock 
          language="typescript"
          code={`function usePerformanceMonitor(): PerformanceMetrics

interface PerformanceMetrics {
  renderTime: number
  scalingOperations: number
  cacheHitRate: number
  memoryUsage: number
  breakpointChanges: number
  scalingCalculations: number
  performanceScore: number
  alerts: PerformanceAlert[]
  subscribe: (callback: (metrics: PerformanceMetrics) => void) => () => void
  getMetrics: () => PerformanceMetrics
  reset: () => void
}`}
        />

        <h2>Return Value Properties</h2>
        <ul>
          <li>
            <strong>renderTime</strong> - Time taken to render the component in milliseconds
          </li>
          <li>
            <strong>scalingOperations</strong> - Number of scaling calculations performed
          </li>
          <li>
            <strong>cacheHitRate</strong> - Percentage of cache hits for scaling operations
          </li>
          <li>
            <strong>memoryUsage</strong> - Current memory usage in bytes
          </li>
          <li>
            <strong>breakpointChanges</strong> - Number of breakpoint changes detected
          </li>
          <li>
            <strong>scalingCalculations</strong> - Total number of scaling calculations
          </li>
          <li>
            <strong>performanceScore</strong> - Overall performance score (0-100)
          </li>
          <li>
            <strong>alerts</strong> - Array of performance alerts and warnings
          </li>
        </ul>

        <h2>Performance Monitoring Features</h2>
        <p>
          The hook provides comprehensive performance monitoring capabilities:
        </p>

        <h3>Real-time Metrics</h3>
        <CodeBlock 
          language="tsx"
          code={`function PerformanceDisplay() {
  const performance = usePerformanceMonitor()
  
  return (
    <div className="performance-panel">
      <h3>Performance Metrics</h3>
      <div className="metrics-grid">
        <div className="metric">
          <span className="label">Render Time:</span>
          <span className="value">{performance.renderTime}ms</span>
        </div>
        <div className="metric">
          <span className="label">Cache Hit Rate:</span>
          <span className="value">{performance.cacheHitRate}%</span>
        </div>
        <div className="metric">
          <span className="label">Performance Score:</span>
          <span className="value">{performance.performanceScore}/100</span>
        </div>
      </div>
    </div>
  )
}`}
        />

        <h3>Performance Alerts</h3>
        <CodeBlock 
          language="tsx"
          code={`function PerformanceAlerts() {
  const performance = usePerformanceMonitor()
  
  return (
    <div className="alerts-panel">
      {performance.alerts.map((alert, index) => (
        <div key={index} className={\`alert alert-\${alert.severity}\`}>
          <span className="alert-icon">{alert.icon}</span>
          <span className="alert-message">{alert.message}</span>
          <span className="alert-timestamp">{alert.timestamp}</span>
        </div>
      ))}
    </div>
  )
}`}
        />

        <h2>Advanced Examples</h2>

        <h3>Performance Dashboard Component</h3>
        <CodeBlock 
          language="tsx"
          code={`function PerformanceDashboard() {
  const performance = usePerformanceMonitor()
  const [showDetails, setShowDetails] = useState(false)
  
  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getPerformanceLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }
  
  return (
    <div className="performance-dashboard">
      <div className="dashboard-header">
        <h2>Performance Monitor</h2>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="card-title">Overall Score</div>
          <div className={\`card-value \${getPerformanceColor(performance.performanceScore)}\`}>
            {performance.performanceScore}
          </div>
          <div className="card-label">{getPerformanceLabel(performance.performanceScore)}</div>
        </div>
        
        <div className="summary-card">
          <div className="card-title">Render Time</div>
          <div className="card-value">{performance.renderTime}ms</div>
          <div className="card-label">Last Render</div>
        </div>
        
        <div className="summary-card">
          <div className="card-title">Cache Efficiency</div>
          <div className="card-value">{performance.cacheHitRate}%</div>
          <div className="card-label">Hit Rate</div>
        </div>
      </div>
      
      {showDetails && (
        <div className="dashboard-details">
          <h3>Detailed Metrics</h3>
          <div className="metrics-table">
            <div className="metric-row">
              <span>Scaling Operations:</span>
              <span>{performance.scalingOperations}</span>
            </div>
            <div className="metric-row">
              <span>Breakpoint Changes:</span>
              <span>{performance.breakpointChanges}</span>
            </div>
            <div className="metric-row">
              <span>Memory Usage:</span>
              <span>{(performance.memoryUsage / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`}
        />

        <h3>Performance-Optimized Component</h3>
        <CodeBlock 
          language="tsx"
          code={`function OptimizedComponent() {
  const performance = usePerformanceMonitor()
  const [isOptimized, setIsOptimized] = useState(false)
  
  // Use performance data to optimize rendering
  useEffect(() => {
    if (performance.renderTime > 16) { // 60fps threshold
      console.warn('Component render time exceeds 16ms, consider optimization')
      setIsOptimized(true)
    }
  }, [performance.renderTime])
  
  // Optimize based on cache performance
  useEffect(() => {
    if (performance.cacheHitRate < 70) {
      console.warn('Low cache hit rate, review scaling calculations')
    }
  }, [performance.cacheHitRate])
  
  return (
    <div className={\`component \${isOptimized ? 'optimized' : ''}\`}>
      {isOptimized && (
        <div className="optimization-notice">
          Performance optimization mode enabled
        </div>
      )}
      
      <div className="performance-indicator">
        <span className={\`indicator \${performance.performanceScore >= 80 ? 'good' : 'warning'}\`}>
          {performance.performanceScore >= 80 ? '✓' : '⚠'}
        </span>
        <span className="score">{performance.performanceScore}</span>
      </div>
      
      {/* Component content */}
    </div>
  )
}`}
        />

        <h3>Real-time Performance Tracking</h3>
        <CodeBlock 
          language="tsx"
          code={`function PerformanceTracker() {
  const performance = usePerformanceMonitor()
  const [metricsHistory, setMetricsHistory] = useState<PerformanceMetrics[]>([])
  
  // Subscribe to performance updates
  useEffect(() => {
    const unsubscribe = performance.subscribe((metrics) => {
      setMetricsHistory(prev => [...prev.slice(-9), metrics]) // Keep last 10
    })
    
    return unsubscribe
  }, [performance])
  
  // Calculate trends
  const getTrend = (property: keyof PerformanceMetrics) => {
    if (metricsHistory.length < 2) return 'stable'
    
    const recent = metricsHistory[metricsHistory.length - 1][property] as number
    const previous = metricsHistory[metricsHistory.length - 2][property] as number
    
    if (recent > previous * 1.1) return 'increasing'
    if (recent < previous * 0.9) return 'decreasing'
    return 'stable'
  }
  
  return (
    <div className="performance-tracker">
      <h3>Performance Trends</h3>
      
      <div className="trends-grid">
        <div className="trend-item">
          <span className="trend-label">Render Time</span>
          <span className={\`trend-value \${getTrend('renderTime')}\`}>
            {getTrend('renderTime') === 'increasing' ? '↗' : 
             getTrend('renderTime') === 'decreasing' ? '↘' : '→'}
          </span>
        </div>
        
        <div className="trend-item">
          <span className="trend-label">Cache Hit Rate</span>
          <span className={\`trend-value \${getTrend('cacheHitRate')}\`}>
            {getTrend('cacheHitRate') === 'increasing' ? '↗' : 
             getTrend('cacheHitRate') === 'decreasing' ? '↘' : '→'}
          </span>
        </div>
        
        <div className="trend-item">
          <span className="trend-label">Performance Score</span>
          <span className={\`trend-value \${getTrend('performanceScore')}\`}>
            {getTrend('performanceScore') === 'increasing' ? '↗' : 
             getTrend('performanceScore') === 'decreasing' ? '↘' : '→'}
          </span>
        </div>
      </div>
      
      <div className="metrics-chart">
        {/* Chart visualization of metrics over time */}
        <div className="chart-placeholder">
          Performance metrics chart (implement with your preferred charting library)
        </div>
      </div>
    </div>
  )
}`}
        />

        <h2>Performance Optimization</h2>
        <p>
          Use the performance data to optimize your responsive components:
        </p>

        <h3>Render Time Optimization</h3>
        <CodeBlock 
          language="tsx"
          code={`function OptimizedResponsiveComponent() {
  const performance = usePerformanceMonitor()
  
  // Memoize expensive calculations based on performance
  const memoizedValue = useMemo(() => {
    // Only recalculate if performance is good
    if (performance.renderTime < 16) {
      return expensiveCalculation()
    }
    return cachedValue
  }, [performance.renderTime, dependencies])
  
  // Use performance data to adjust rendering strategy
  const shouldUseOptimizedMode = performance.renderTime > 16
  
  return (
    <div className={shouldUseOptimizedMode ? 'optimized-mode' : 'normal-mode'}>
      {/* Optimized content rendering */}
    </div>
  )
}`}
        />

        <h3>Cache Optimization</h3>
        <CodeBlock 
          language="tsx"
          code={`function CacheOptimizedComponent() {
  const performance = usePerformanceMonitor()
  
  // Adjust caching strategy based on performance
  useEffect(() => {
    if (performance.cacheHitRate < 70) {
      // Increase cache size or improve cache keys
      console.log('Optimizing cache strategy...')
    }
  }, [performance.cacheHitRate])
  
  // Use performance data to determine caching behavior
  const shouldUseAggressiveCaching = performance.cacheHitRate < 60
  
  return (
    <div className={shouldUseAggressiveCaching ? 'aggressive-cache' : 'normal-cache'}>
      {/* Component with optimized caching */}
    </div>
  )
}`}
        />

        <h2>Integration with Performance Dashboard</h2>
        <p>
          The hook integrates seamlessly with the Performance Dashboard package:
        </p>

        <h3>Dashboard Integration</h3>
        <CodeBlock 
          language="tsx"
          code={`import { createPerformanceMonitor } from '@react-responsive-easy/performance-dashboard'

function DashboardIntegration() {
  const performance = usePerformanceMonitor()
  
  useEffect(() => {
    // Send metrics to performance dashboard
    const monitor = createPerformanceMonitor()
    
    monitor.trackComponent('MyComponent', {
      renderTime: performance.renderTime,
      scalingOperations: performance.scalingOperations,
      cacheHitRate: performance.cacheHitRate,
      performanceScore: performance.performanceScore
    })
    
    return () => monitor.untrackComponent('MyComponent')
  }, [performance])
  
  return (
    <div>
      {/* Component content */}
      <div className="performance-badge">
        Score: {performance.performanceScore}
      </div>
    </div>
  )
}`}
        />

        <h2>Error Handling</h2>
        <p>
          The hook provides robust error handling for performance monitoring:
        </p>

        <h3>Graceful Degradation</h3>
        <CodeBlock 
          language="tsx"
          code={`function SafePerformanceComponent() {
  const performance = usePerformanceMonitor()
  
  // Handle cases where performance monitoring might fail
  const safeMetrics = {
    renderTime: performance?.renderTime || 0,
    performanceScore: performance?.performanceScore || 100,
    cacheHitRate: performance?.cacheHitRate || 100
  }
  
  // Provide fallback behavior
  const shouldOptimize = safeMetrics.renderTime > 16 || safeMetrics.performanceScore < 80
  
  return (
    <div className={shouldOptimize ? 'optimized' : 'normal'}>
      {/* Component with fallback performance handling */}
    </div>
  )
}`}
        />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Monitor key metrics:</strong> Focus on render time, cache hit rate, and performance score
          </li>
          <li>
            <strong>Set performance thresholds:</strong> Define acceptable performance levels for your app
          </li>
          <li>
            <strong>Use performance data:</strong> Act on performance insights to improve user experience
          </li>
          <li>
            <strong>Optimize incrementally:</strong> Make small performance improvements based on metrics
          </li>
          <li>
            <strong>Monitor in production:</strong> Track performance in real-world usage scenarios
          </li>
        </ul>

        <h2>Common Patterns</h2>

        <h3>Performance-Aware Rendering</h3>
        <CodeBlock 
          language="tsx"
          code={`// Create components that adapt based on performance
function PerformanceAwareComponent() {
  const performance = usePerformanceMonitor()
  
  const renderStrategy = useMemo(() => {
    if (performance.performanceScore >= 90) {
      return 'full-featured'
    } else if (performance.performanceScore >= 70) {
      return 'balanced'
    } else {
      return 'minimal'
    }
  }, [performance.performanceScore])
  
  switch (renderStrategy) {
    case 'full-featured':
      return <FullFeaturedContent />
    case 'balanced':
      return <BalancedContent />
    case 'minimal':
      return <MinimalContent />
    default:
      return <MinimalContent />
  }
}`}
        />

        <h3>Performance Budgeting</h3>
        <CodeBlock 
          language="tsx"
          code={`// Implement performance budgets for components
function BudgetedComponent() {
  const performance = usePerformanceMonitor()
  const [budgetExceeded, setBudgetExceeded] = useState(false)
  
  useEffect(() => {
    const renderBudget = 16 // 60fps target
    const cacheBudget = 80 // 80% cache hit rate target
    
    if (performance.renderTime > renderBudget || performance.cacheHitRate < cacheBudget) {
      setBudgetExceeded(true)
      console.warn('Performance budget exceeded')
    } else {
      setBudgetExceeded(false)
    }
  }, [performance.renderTime, performance.cacheHitRate])
  
  return (
    <div className={budgetExceeded ? 'budget-exceeded' : 'within-budget'}>
      {budgetExceeded && (
        <div className="budget-warning">
          Performance budget exceeded - consider optimization
        </div>
      )}
      
      {/* Component content */}
    </div>
  )
}`}
        />

        <h2>Debugging</h2>
        <p>
          Enable debug mode to see detailed performance information:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// In your ResponsiveProvider config
<ResponsiveProvider
  config={{
    development: {
      enableDebugMode: true,
      logScalingCalculations: true,
      showPerformanceMetrics: true
    }
  }}
>
  {/* Your app */}
</ResponsiveProvider>

// The hook will provide detailed performance logging when debug mode is enabled`}
        />

        <h2>Testing</h2>
        <p>
          Test your performance monitoring across different scenarios:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// In your test
import { renderHook } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'

test('monitors performance correctly', () => {
  const { result } = renderHook(() => usePerformanceMonitor(), {
    wrapper: ResponsiveProvider
  })
  
  expect(result.current.renderTime).toBeGreaterThan(0)
  expect(result.current.performanceScore).toBeGreaterThan(0)
  expect(result.current.cacheHitRate).toBeGreaterThan(0)
})`}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/hooks/use-breakpoint">← useBreakpoint</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/hooks">← Back to Hooks</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
