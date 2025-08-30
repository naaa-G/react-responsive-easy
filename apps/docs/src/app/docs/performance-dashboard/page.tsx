import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Performance Dashboard - React Responsive Easy',
  description: 'Monitor your responsive design performance in real-time with comprehensive metrics, alerts, and optimization insights.',
}

export default function PerformanceDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Performance Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Real-time monitoring and insights for your responsive design performance
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            The Performance Dashboard provides comprehensive real-time monitoring of your responsive design
            system. Track rendering performance, scaling operations, cache efficiency, and user experience
            metrics across all breakpoints and devices.
          </p>

          <h2>Key Features</h2>
          <ul>
            <li>
              <strong>Real-time Metrics:</strong> Live performance data with instant updates
            </li>
            <li>
              <strong>Performance Scoring:</strong> Automated scoring system (0-100) for overall health
            </li>
            <li>
              <strong>Breakpoint Analysis:</strong> Performance breakdown by device and screen size
            </li>
            <li>
              <strong>Alert System:</strong> Proactive notifications for performance issues
            </li>
            <li>
              <strong>Historical Data:</strong> Performance trends and optimization tracking
            </li>
            <li>
              <strong>Export & Reporting:</strong> Generate performance reports for stakeholders
            </li>
          </ul>

          <h2>Installation</h2>
          <p>
            The Performance Dashboard is available as a separate package for advanced monitoring:
          </p>

          <CodeBlock
            language="bash"
            code={`npm install @react-responsive-easy/performance-dashboard
# or
yarn add @react-responsive-easy/performance-dashboard
# or
pnpm add @react-responsive-easy/performance-dashboard`}
          />

          <h2>Basic Setup</h2>
          <p>
            Initialize the performance monitor in your app:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { createPerformanceMonitor } from '@react-responsive-easy/performance-dashboard'

// Create monitor instance
const performanceMonitor = createPerformanceMonitor({
  enabled: true,
  samplingRate: 1000, // Sample every second
  alertThreshold: 80, // Alert when score drops below 80
  retentionDays: 30, // Keep 30 days of data
  metrics: ['renderTime', 'scalingOperations', 'cacheHitRate', 'userExperience']
})

// Start monitoring
performanceMonitor.start()

// Stop monitoring (cleanup)
performanceMonitor.stop()`}
          />

          <h2>Dashboard Components</h2>
          <p>
            The Performance Dashboard includes several key components for monitoring different aspects:
          </p>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Performance Overview</h3>
              <p className="text-gray-600 mb-4">
                High-level performance metrics and overall health score.
              </p>
              <div className="text-sm text-gray-500">
                <strong>Metrics:</strong> Overall score, trend, alerts<br />
                <strong>Update:</strong> Real-time
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Breakpoint Performance</h3>
              <p className="text-gray-600 mb-4">
                Performance breakdown by device breakpoint and screen size.
              </p>
              <div className="text-sm text-gray-500">
                <strong>Metrics:</strong> Mobile, tablet, desktop<br />
                <strong>Update:</strong> On breakpoint change
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Component Analysis</h3>
              <p className="text-gray-600 mb-4">
                Individual component performance and optimization opportunities.
              </p>
              <div className="text-sm text-gray-500">
                <strong>Metrics:</strong> Render time, scaling ops<br />
                <strong>Update:</strong> On component render
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Alert Center</h3>
              <p className="text-gray-600 mb-4">
                Performance alerts and recommendations for optimization.
              </p>
              <div className="text-sm text-gray-500">
                <strong>Types:</strong> Warnings, errors, suggestions<br />
                <strong>Update:</strong> Instant
              </div>
            </div>
          </div>

          <h2>Performance Metrics</h2>
          <p>
            The dashboard tracks several key performance indicators:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Render Performance</h3>
              <p>
                Measures how quickly components render and update across different breakpoints.
              </p>
              <CodeBlock
                language="tsx"
                code={`// Render performance metrics
const renderMetrics = {
  averageRenderTime: 12.5, // milliseconds
  renderTimeVariance: 2.1,
  slowRenders: 3, // renders > 16ms
  totalRenders: 150
}`}
              />
            </div>

            <div>
              <h3>Scaling Operations</h3>
              <p>
                Tracks the efficiency of responsive scaling calculations and caching.
              </p>
              <CodeBlock
                language="tsx"
                code={`// Scaling operation metrics
const scalingMetrics = {
  scalingOperations: 89,
  cacheHitRate: 0.94, // 94% cache hits
  averageScalingTime: 0.8, // milliseconds
  scalingErrors: 0
}`}
              />
            </div>

            <div>
              <h3>User Experience</h3>
              <p>
                Measures perceived performance and user interaction responsiveness.
              </p>
              <CodeBlock
                language="tsx"
                code={`// User experience metrics
const uxMetrics = {
  interactionDelay: 45, // milliseconds
  smoothnessScore: 0.92, // 0-1 scale
  accessibilityScore: 0.98,
  responsiveScore: 0.95
}`}
              />
            </div>

            <div>
              <h3>Resource Usage</h3>
              <p>
                Monitors memory usage, CPU utilization, and bundle size impact.
              </p>
              <CodeBlock
                language="tsx"
                code={`// Resource usage metrics
const resourceMetrics = {
  memoryUsage: '2.3 MB',
  cpuUtilization: 0.15, // 15%
  bundleSize: '45.2 KB',
  networkRequests: 12
}`}
              />
            </div>
          </div>

          <h2>Using the Dashboard</h2>
          <p>
            Integrate the Performance Dashboard into your React components:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { usePerformanceMonitor } from '@react-responsive-easy/core'
import { PerformanceDashboard } from '@react-responsive-easy/performance-dashboard'

function AppWithDashboard() {
  const performance = usePerformanceMonitor()

  return (
    <div>
      {/* Your app content */}
      <main>
        <h1>My Responsive App</h1>
        {/* ... */}
      </main>

      {/* Performance Dashboard */}
      <PerformanceDashboard
        metrics={performance}
        showAlerts={true}
        showBreakdown={true}
        theme="dark"
        position="bottom-right"
      />
    </div>
  )
}`}
          />

          <h2>Alert System</h2>
          <p>
            The dashboard provides intelligent alerts for performance issues:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { usePerformanceMonitor } from '@react-responsive-easy/core'

function AlertComponent() {
  const { alerts, performanceScore } = usePerformanceMonitor()

  return (
    <div className="alerts-container">
      {'{alerts.map((alert) => ('}
        <div key={'{alert.id}'} className={\`alert alert-\${alert.severity}\`}>
          <h4>{'{alert.title}'}</h4>
          <p>{'{alert.message}'}</p>
          <p>Impact: {'{alert.impact}'}</p>
          <p>Recommendation: {'{alert.recommendation}'}</p>
        </div>
      {'))}'}
      
      {'{performanceScore < 80 && ('}
        <div className="alert alert-warning">
          <h4>Performance Warning</h4>
          <p>Performance score is below optimal threshold</p>
        </div>
      {'})'}
    </div>
  )
}`}
          />

          <h2>Custom Metrics</h2>
          <p>
            Define custom performance metrics for your specific use cases:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { createPerformanceMonitor } from '@react-responsive-easy/performance-dashboard'

const customMonitor = createPerformanceMonitor({
  enabled: true,
  customMetrics: {
    // Custom business metrics
    conversionRate: {
      type: 'percentage',
      threshold: 0.05, // 5%
      alert: 'low'
    },
    
    // Custom performance metrics
    animationFrameRate: {
      type: 'number',
      threshold: 60,
      alert: 'critical'
    },
    
    // Custom user experience metrics
    scrollPerformance: {
      type: 'number',
      threshold: 0.9, // 90% smooth scrolling
      alert: 'medium'
    }
  },
  
  // Custom alert handlers
  onAlert: (alert) => {
    console.log('Performance Alert:', alert)
    // Send to analytics, Slack, etc.
  }
})`}
          />

          <h2>Real-time Monitoring</h2>
          <p>
            Set up real-time monitoring with WebSocket or Server-Sent Events:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { createPerformanceMonitor } from '@react-responsive-easy/performance-dashboard'

const realtimeMonitor = createPerformanceMonitor({
  enabled: true,
  realtime: {
    enabled: true,
    endpoint: 'wss://your-api.com/performance',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  },
  
  // Real-time event handlers
  onRealtimeConnect: () => {
    console.log('Connected to real-time monitoring')
  },
  
  onRealtimeDisconnect: () => {
    console.log('Disconnected from real-time monitoring')
  },
  
  onRealtimeData: (data) => {
    console.log('Real-time performance data:', data)
    // Update dashboard in real-time
  }
})`}
          />

          <h2>Performance Reporting</h2>
          <p>
            Generate comprehensive performance reports for stakeholders:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { generatePerformanceReport } from '@react-responsive-easy/performance-dashboard'

async function generateReport() {
  const report = await generatePerformanceReport({
    timeRange: 'last-30-days',
    metrics: ['renderTime', 'scalingOperations', 'userExperience'],
    format: 'pdf', // or 'html', 'json', 'csv'
    includeCharts: true,
    includeRecommendations: true
  })
  
  // Download or email report
  downloadReport(report)
}

// Scheduled reporting
const scheduledReport = setInterval(() => {
  if (isBusinessHours()) {
    generateReport()
  }
}, 24 * 60 * 60 * 1000) // Daily`}
          />

          <h2>Integration with Build Tools</h2>
          <p>
            Integrate performance monitoring with your build and deployment pipeline:
          </p>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">CI/CD Integration</h3>
              <p className="text-gray-600 mb-4">
                Automatically run performance tests in your CI/CD pipeline.
              </p>
              <CodeBlock
                language="yaml"
                code={`# .github/workflows/performance.yml
name: Performance Test
on: [push, pull_request]
jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Performance Tests
        run: |
          npm run test:performance
          npm run build:analyze`}
              />
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Bundle Analysis</h3>
              <p className="text-gray-600 mb-4">
                Analyze bundle size impact of responsive features.
              </p>
              <CodeBlock
                language="json"
                code={`// package.json scripts
{
  "scripts": {
    "build:analyze": "ANALYZE=true npm run build",
    "test:performance": "jest --testPathPattern=performance",
    "report:performance": "rre analyze --output=html"
  }
}`}
              />
            </div>
          </div>

          <h2>Best Practices</h2>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Performance Monitoring Best Practices
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li>• Set realistic performance thresholds based on your app's requirements</li>
              <li>• Monitor performance in production, not just development</li>
              <li>• Use sampling to avoid performance overhead in high-traffic apps</li>
              <li>• Set up automated alerts for critical performance issues</li>
              <li>• Regularly review and update performance baselines</li>
              <li>• Correlate performance metrics with business metrics</li>
              <li>• Use performance data to guide optimization efforts</li>
            </ul>
          </div>

          <h2>Next Steps</h2>
          <p>
            Now that you understand the Performance Dashboard, explore these related topics:
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/ai-optimization">
                <span className="font-semibold">AI Optimization</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Get AI-powered performance suggestions
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/performance">
                <span className="font-semibold">Performance</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Learn performance optimization techniques
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/testing">
                <span className="font-semibold">Testing</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Test performance improvements
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/quick-start">
                <span className="font-semibold">Quick Start</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Set up performance monitoring quickly
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
