import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Performance',
  description: 'Learn about performance optimization, monitoring, and best practices in React Responsive Easy.',
};

export default function PerformancePage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <h1>Performance</h1>
      <p>
        React Responsive Easy is built with performance as a first-class concern. From build-time 
        optimizations to runtime monitoring, every aspect is designed to deliver lightning-fast 
        responsive experiences.
      </p>

      <div className="not-prose mb-8">
        <Link href="/playground">
          <Button>
            Try in Playground
          </Button>
        </Link>
      </div>

      <h2>Performance Philosophy</h2>
      <p>
        Our performance philosophy is simple: <strong>Zero runtime overhead</strong>. We believe that 
        responsive design shouldn't come at the cost of performance. Every scaling calculation, 
        every breakpoint detection, and every responsive update is optimized for speed.
      </p>

      <div className="not-prose">
        <div className="my-8 rounded-lg bg-green-50 p-6 dark:bg-green-950/20">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
            🚀 Performance Goals
          </h3>
          <ul className="text-green-800 dark:text-green-200 space-y-2">
            <li>• <strong>Zero runtime calculations</strong> in production builds</li>
            <li>• <strong>Sub-1ms</strong> breakpoint detection</li>
            <li>• <strong>Memory efficient</strong> caching and storage</li>
            <li>• <strong>Bundle size optimized</strong> with tree-shaking</li>
            <li>• <strong>Real-time monitoring</strong> and optimization</li>
          </ul>
        </div>
      </div>

      <h2>1. Build-Time Optimizations</h2>
      <p>
        The most significant performance gains come from build-time optimizations that eliminate 
        runtime calculations entirely.
      </p>

      <CodeBlock
        code={`// Build-time optimization transforms your code from this:
const fontSize = useResponsiveValue(48, { token: 'fontSize' });

// To this optimized version:
const fontSize = useMemo(() => {
  switch (currentBreakpoint.name) {
    case 'mobile': return '12px';    // Pre-computed value
    case 'tablet': return '24px';    // Pre-computed value
    case 'desktop': return '48px';   // Pre-computed value
    default: return '48px';
  }
}, [currentBreakpoint.name]);

// Result: Zero runtime calculations!`}
        language="tsx"
        title="Build-Time Transformation"
        showCopy
        showLineNumbers
      />

      <h3>How Build-Time Optimization Works</h3>
      <p>
        During the build process, our build plugins analyze your code and pre-compute all possible 
        scaling values:
      </p>

      <CodeBlock
        code={`// Build plugin optimization process
class BuildTimeOptimizer {
  optimizeResponsiveCode(ast: AST, config: ResponsiveConfig): AST {
    // 1. Find all useResponsiveValue calls
    const responsiveCalls = this.findResponsiveCalls(ast);
    
    // 2. Pre-compute values for each breakpoint
    responsiveCalls.forEach(call => {
      const { originalValue, token } = this.extractCallInfo(call);
      
      // Calculate values for each breakpoint
      const computedValues = config.breakpoints.map(breakpoint => {
        const scaledValue = this.computeScaledValue(
          originalValue,
          config.base,
          breakpoint,
          token
        );
        
        return {
          breakpoint: breakpoint.alias,
          value: \`\${scaledValue}px\`
        };
      });
      
      // 3. Replace with optimized switch statement
      const optimizedCode = this.generateOptimizedCode(computedValues);
      this.replaceNode(call, optimizedCode);
    });
    
    return ast;
  }
  
  private computeScaledValue(
    original: number,
    base: Breakpoint,
    target: Breakpoint,
    token: ScalingToken
  ): number {
    // Apply the same scaling logic that would run at runtime
    const ratio = target.width / base.width;
    let scaled = original * ratio;
    
    if (token.scale) scaled *= token.scale;
    if (token.min) scaled = Math.max(scaled, token.min);
    if (token.max) scaled = Math.min(scaled, token.max);
    if (token.step) scaled = Math.round(scaled / token.step) * token.step;
    
    return scaled;
  }
}

// Build configuration
const buildConfig = {
  plugins: [
    // Babel plugin for build-time optimization
    ['@react-responsive-easy/babel-plugin', {
      optimize: true,
      precompute: true,
      inline: true
    }],
    
    // PostCSS plugin for CSS optimization
    ['@react-responsive-easy/postcss-plugin', {
      optimize: true,
      minify: true
    }]
  ]
};`}
        language="typescript"
        title="Build-Time Optimization Process"
        showCopy
        showLineNumbers
      />

      <h2>2. Runtime Performance Optimizations</h2>
      <p>
        Even with build-time optimizations, runtime performance is crucial for dynamic scenarios:
      </p>

      <div className="not-prose">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-950/20">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              💾 Intelligent Caching
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
              <li>• Scaling ratios cached per breakpoint</li>
              <li>• Computed values memoized</li>
              <li>• Breakpoint detection cached</li>
              <li>• Automatic cache invalidation</li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-purple-50 p-6 dark:bg-purple-950/20">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
              ⚡ Efficient Updates
            </h3>
            <ul className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
              <li>• Debounced resize handlers</li>
              <li>• Selective re-renders</li>
              <li>• Batch updates</li>
              <li>• Change detection optimization</li>
            </ul>
          </div>
        </div>
      </div>

      <CodeBlock
        code={`// Runtime performance optimizations
class PerformanceOptimizedProvider {
  private cache = new Map<string, any>();
  private resizeObserver: ResizeObserver;
  private updateQueue = new Set<string>();
  private isUpdating = false;
  
  constructor(private config: ResponsiveConfig) {
    this.setupOptimizedResizeHandling();
  }
  
  private setupOptimizedResizeHandling(): void {
    // Use ResizeObserver for efficient viewport monitoring
    this.resizeObserver = new ResizeObserver(
      debounce((entries) => {
        this.handleResize(entries);
      }, 16) // ~60fps
    );
    
    this.resizeObserver.observe(document.documentElement);
  }
  
  private handleResize(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      
      // Check if breakpoint actually changed
      const newBreakpoint = this.detectBreakpoint(width, height);
      if (newBreakpoint.name === this.currentBreakpoint.name) {
        continue; // No change, skip update
      }
      
      // Queue update instead of immediate execution
      this.queueUpdate(newBreakpoint);
    }
  }
  
  private queueUpdate(newBreakpoint: Breakpoint): void {
    this.updateQueue.add(newBreakpoint.name);
    
    if (!this.isUpdating) {
      this.processUpdateQueue();
    }
  }
  
  private processUpdateQueue(): void {
    this.isUpdating = true;
    
    // Process all queued updates in one batch
    requestAnimationFrame(() => {
      const updates = Array.from(this.updateQueue);
      this.updateQueue.clear();
      
      // Single state update for all changes
      this.setState({
        currentBreakpoint: this.currentBreakpoint,
        scalingRatios: this.computeScalingRatios(this.currentBreakpoint),
        lastUpdate: Date.now()
      });
      
      this.isUpdating = false;
    });
  }
  
  // Optimized scaling with caching
  scaleValue(value: number, token: string): number {
    const cacheKey = \`\${value}-\${this.currentBreakpoint.name}-\${token}\`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const scaledValue = this.computeScaledValue(value, token);
    this.cache.set(cacheKey, scaledValue);
    
    return scaledValue;
  }
  
  // Cache management
  clearCache(): void {
    this.cache.clear();
  }
  
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: this.calculateHitRate()
    };
  }
}`}
        language="typescript"
        title="Runtime Performance Optimizations"
        showCopy
        showLineNumbers
      />

      <h2>3. Performance Monitoring</h2>
      <p>
        Built-in performance monitoring helps you identify and resolve performance bottlenecks:
      </p>

      <CodeBlock
        code={`// Performance monitoring system
interface PerformanceMetrics {
  renderTime: number;           // Time to render responsive components
  updateTime: number;           // Time to update responsive values
  cacheHitRate: number;         // Cache efficiency
  memoryUsage: number;          // Memory consumption
  breakpointChanges: number;    // Number of breakpoint changes
  scalingOperations: number;    // Number of scaling calculations
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    updateTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    breakpointChanges: 0,
    scalingOperations: 0
  };
  
  private cacheHits = 0;
  private cacheMisses = 0;
  private renderTimes: number[] = [];
  private updateTimes: number[] = [];
  
  // Monitor render performance
  startRenderTimer(): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      this.renderTimes.push(renderTime);
      this.metrics.renderTime = this.calculateAverage(this.renderTimes);
      
      // Keep only last 100 measurements
      if (this.renderTimes.length > 100) {
        this.renderTimes.shift();
      }
    };
  }
  
  // Monitor update performance
  startUpdateTimer(): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const updateTime = endTime - startTime;
      
      this.updateTimes.push(updateTime);
      this.metrics.updateTime = this.calculateAverage(this.updateTimes);
      
      if (this.updateTimes.length > 100) {
        this.updateTimes.shift();
      }
    };
  }
  
  // Track cache performance
  recordCacheHit(): void {
    this.cacheHits++;
    this.updateCacheHitRate();
  }
  
  recordCacheMiss(): void {
    this.cacheMisses++;
    this.updateCacheHitRate();
  }
  
  private updateCacheHitRate(): void {
    const total = this.cacheHits + this.cacheMisses;
    this.metrics.cacheHitRate = total > 0 ? this.cacheHits / total : 0;
  }
  
  // Memory usage monitoring
  updateMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;
    }
  }
  
  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  // Performance alerts
  checkPerformanceAlerts(): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = [];
    
    if (this.metrics.renderTime > 16) { // > 60fps threshold
      alerts.push({
        type: 'warning',
        message: 'Render time exceeds 16ms threshold',
        metric: 'renderTime',
        value: this.metrics.renderTime,
        threshold: 16
      });
    }
    
    if (this.metrics.cacheHitRate < 0.8) { // < 80% cache hit rate
      alerts.push({
        type: 'warning',
        message: 'Cache hit rate below 80%',
        metric: 'cacheHitRate',
        value: this.metrics.cacheHitRate,
        threshold: 0.8
      });
    }
    
    if (this.metrics.memoryUsage > 50 * 1024 * 1024) { // > 50MB
      alerts.push({
        type: 'error',
        message: 'Memory usage exceeds 50MB',
        metric: 'memoryUsage',
        value: this.metrics.memoryUsage,
        threshold: 50 * 1024 * 1024
      });
    }
    
    return alerts;
  }
  
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
}

// Usage in components
function ResponsiveComponent() {
  const { performanceMonitor } = useResponsiveContext();
  
  useEffect(() => {
    const stopRenderTimer = performanceMonitor.startRenderTimer();
    
    return () => {
      stopRenderTimer();
    };
  }, [performanceMonitor]);
  
  // Component logic...
  
  return <div>Responsive content</div>;
}`}
        language="typescript"
        title="Performance Monitoring System"
        showCopy
        showLineNumbers
      />

      <h2>4. Bundle Size Optimization</h2>
      <p>
        React Responsive Easy is designed to minimize bundle size impact:
      </p>

      <CodeBlock
        code={`// Bundle size optimization strategies
const bundleOptimizations = {
  // Tree-shaking support
  exports: {
    // Only export what you need
    useResponsiveValue: './hooks/useResponsiveValue',
    useScaledStyle: './hooks/useScaledStyle',
    useBreakpoint: './hooks/useBreakpoint',
    ResponsiveProvider: './components/ResponsiveProvider'
  },
  
  // Conditional imports
  conditionalImports: {
    // Development-only features
    development: {
      'performance-monitoring': './monitoring/PerformanceMonitor',
      'debug-tools': './debug/DebugTools'
    },
    
    // Production-only features
    production: {
      'optimized-engine': './engine/OptimizedScalingEngine'
    }
  },
  
  // Code splitting
  codeSplitting: {
    // Split by feature
    'responsive-core': './core/index',
    'responsive-hooks': './hooks/index',
    'responsive-components': './components/index',
    'responsive-utils': './utils/index'
  }
};

// Rollup configuration for optimal bundling
const rollupConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    // Tree-shaking
    nodeResolve(),
    commonjs(),
    
    // TypeScript compilation
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationMap: true
        }
      }
    }),
    
    // Bundle analysis
    bundleAnalyzer({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-analysis.html'
    })
  ],
  external: ['react', 'react-dom'],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
};

// Bundle size targets
const bundleSizeTargets = {
  'index.esm.js': '< 15KB gzipped',
  'index.cjs.js': '< 18KB gzipped',
  'hooks.esm.js': '< 8KB gzipped',
  'components.esm.js': '< 12KB gzipped'
};

// Bundle size monitoring
function checkBundleSize() {
  const fs = require('fs');
  const path = require('path');
  
  Object.entries(bundleSizeTargets).forEach(([filename, target]) => {
    const filePath = path.join(__dirname, 'dist', filename);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      console.log(\`\${filename}: \${sizeKB}KB\`);
      
      // Check against target
      const targetKB = parseInt(target.match(/< (\d+)KB/)?.[1] || '0');
      if (parseFloat(sizeKB) >= targetKB) {
        console.warn(\`⚠️ \${filename} exceeds size target of \${target}\`);
      }
    }
  });
}`}
        language="typescript"
        title="Bundle Size Optimization"
        showCopy
        showLineNumbers
      />

      <h2>5. Performance Best Practices</h2>
      <p>
        Follow these best practices to ensure optimal performance:
      </p>

      <div className="not-prose">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="rounded-lg bg-green-50 p-6 dark:bg-green-950/20">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              ✅ Do's
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
              <li>• Use build-time optimization plugins</li>
              <li>• Enable production mode in builds</li>
              <li>• Monitor performance metrics</li>
              <li>• Use appropriate token configurations</li>
              <li>• Implement proper error boundaries</li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-red-50 p-6 dark:bg-red-950/20">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
              ❌ Don'ts
            </h3>
            <ul className="text-red-800 dark:text-red-200 space-y-2 text-sm">
              <li>• Don't disable build optimizations</li>
              <li>• Don't ignore performance warnings</li>
              <li>• Don't use too many breakpoints</li>
              <li>• Don't forget to clear caches</li>
              <li>• Don't skip performance testing</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>6. Performance Testing</h2>
      <p>
        Test your responsive application's performance across different scenarios:
      </p>

      <CodeBlock
        code={`// Performance testing utilities
class PerformanceTester {
  // Test breakpoint detection performance
  testBreakpointDetection(): PerformanceTestResult {
    const iterations = 1000;
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Simulate breakpoint detection
      const width = 375 + (i % 1000);
      const height = 667 + (i % 500);
      detectBreakpoint(width, height, breakpoints);
      
      const endTime = performance.now();
      results.push(endTime - startTime);
    }
    
    const averageTime = results.reduce((sum, time) => sum + time, 0) / results.length;
    const maxTime = Math.max(...results);
    const minTime = Math.min(...results);
    
    return {
      test: 'Breakpoint Detection',
      iterations,
      averageTime,
      maxTime,
      minTime,
      passed: averageTime < 1 // Should be under 1ms
    };
  }
  
  // Test scaling performance
  testScalingPerformance(): PerformanceTestResult {
    const iterations = 10000;
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Test scaling operations
      const value = Math.random() * 100;
      scaleValue(value, desktopBreakpoint, mobileBreakpoint, tokenConfig.fontSize);
      
      const endTime = performance.now();
      results.push(endTime - startTime);
    }
    
    const averageTime = results.reduce((sum, time) => sum + time, 0) / results.length;
    const maxTime = Math.max(...results);
    const minTime = Math.min(...results);
    
    return {
      test: 'Scaling Operations',
      iterations,
      averageTime,
      maxTime,
      minTime,
      passed: averageTime < 0.1 // Should be under 0.1ms
    };
  }
  
  // Test memory usage
  testMemoryUsage(): MemoryTestResult {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Perform operations that might allocate memory
    const responsiveValues = [];
    for (let i = 0; i < 1000; i++) {
      responsiveValues.push(useResponsiveValue(i, { token: 'fontSize' }));
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    return {
      test: 'Memory Usage',
      initialMemory,
      finalMemory,
      memoryIncrease,
      passed: memoryIncrease < 1024 * 1024 // Less than 1MB increase
    };
  }
  
  // Run all performance tests
  runAllTests(): PerformanceTestReport {
    const results = [
      this.testBreakpointDetection(),
      this.testScalingPerformance(),
      this.testMemoryUsage()
    ];
    
    const allPassed = results.every(result => result.passed);
    const totalTime = results.reduce((sum, result) => sum + result.averageTime, 0);
    
    return {
      timestamp: new Date().toISOString(),
      results,
      summary: {
        totalTests: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length,
        allPassed,
        totalTime
      }
    };
  }
}

// Usage
const tester = new PerformanceTester();
const report = tester.runAllTests();

console.log('Performance Test Report:', report);

if (report.summary.allPassed) {
  console.log('✅ All performance tests passed!');
} else {
  console.log('❌ Some performance tests failed. Check the results above.');
}`}
        language="typescript"
        title="Performance Testing"
        showCopy
        showLineNumbers
      />

      <h2>7. Performance Dashboard</h2>
      <p>
        The built-in performance dashboard provides real-time insights into your application's performance:
      </p>

      <CodeBlock
        code={`// Performance dashboard component
function PerformanceDashboard() {
  const { performanceMonitor } = useResponsiveContext();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  
  useEffect(() => {
    const updateMetrics = () => {
      const currentMetrics = performanceMonitor.getMetrics();
      const currentAlerts = performanceMonitor.checkPerformanceAlerts();
      
      setMetrics(currentMetrics);
      setAlerts(currentAlerts);
    };
    
    // Update metrics every second
    const interval = setInterval(updateMetrics, 1000);
    updateMetrics(); // Initial update
    
    return () => clearInterval(interval);
  }, [performanceMonitor]);
  
  if (!metrics) return <div>Loading metrics...</div>;
  
  return (
    <div className="performance-dashboard">
      <h3>Performance Metrics</h3>
      
      <div className="metrics-grid">
        <div className="metric">
          <label>Render Time</label>
          <value className={metrics.renderTime > 16 ? 'warning' : 'normal'}>
            {metrics.renderTime.toFixed(2)}ms
          </value>
        </div>
        
        <div className="metric">
          <label>Update Time</label>
          <value className={metrics.updateTime > 8 ? 'warning' : 'normal'}>
            {metrics.updateTime.toFixed(2)}ms
          </value>
        </div>
        
        <div className="metric">
          <label>Cache Hit Rate</label>
          <value className={metrics.cacheHitRate < 0.8 ? 'warning' : 'normal'}>
            {(metrics.cacheHitRate * 100).toFixed(1)}%
          </value>
        </div>
        
        <div className="metric">
          <label>Memory Usage</label>
          <value className={metrics.memoryUsage > 50 * 1024 * 1024 ? 'error' : 'normal'}>
            {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
          </value>
        </div>
      </div>
      
      {alerts.length > 0 && (
        <div className="alerts">
          <h4>Performance Alerts</h4>
          {alerts.map((alert, index) => (
            <div key={index} className={\`alert \${alert.type}\`}>
              <strong>{alert.type.toUpperCase()}:</strong> {alert.message}
            </div>
          ))}
        </div>
      )}
      
      <div className="actions">
        <button onClick={() => performanceMonitor.clearCache()}>
          Clear Cache
        </button>
        <button onClick={() => performanceMonitor.updateMemoryUsage()}>
          Update Memory
        </button>
      </div>
    </div>
  );
}

// CSS for the dashboard
const dashboardStyles = \`
  .performance-dashboard {
    padding: 20px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin: 20px 0;
  }
  
  .metric {
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    text-align: center;
  }
  
  .metric label {
    display: block;
    font-size: 14px;
    color: #64748b;
    margin-bottom: 8px;
  }
  
  .metric value {
    display: block;
    font-size: 24px;
    font-weight: bold;
  }
  
  .metric value.normal { color: #059669; }
  .metric value.warning { color: #d97706; }
  .metric value.error { color: #dc2626; }
  
  .alerts {
    margin: 20px 0;
  }
  
  .alert {
    padding: 12px;
    margin: 8px 0;
    border-radius: 6px;
    border-left: 4px solid;
  }
  
  .alert.warning {
    background: #fef3c7;
    border-left-color: #d97706;
    color: #92400e;
  }
  
  .alert.error {
    background: #fee2e2;
    border-left-color: #dc2626;
    color: #991b1b;
  }
\`;`}
        language="tsx"
        title="Performance Dashboard"
        showCopy
        showLineNumbers
      />

      <h2>8. Production Performance Checklist</h2>
      <p>
        Use this checklist to ensure optimal performance in production:
      </p>

      <div className="not-prose">
        <div className="my-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-900/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📋 Production Performance Checklist
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <strong>Build Optimizations:</strong>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <li>• Build-time optimization plugins enabled</li>
                  <li>• Production mode builds</li>
                  <li>• Tree-shaking enabled</li>
                  <li>• Bundle size within targets</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <strong>Runtime Performance:</strong>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <li>• Breakpoint detection under 1ms</li>
                  <li>• Scaling operations under 0.1ms</li>
                  <li>• Cache hit rate above 80%</li>
                  <li>• Memory usage under 50MB</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <strong>Monitoring & Alerts:</strong>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <li>• Performance monitoring enabled</li>
                  <li>• Alerts configured for thresholds</li>
                  <li>• Real-time dashboard accessible</li>
                  <li>• Performance metrics logged</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <strong>Testing & Validation:</strong>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <li>• Performance tests passing</li>
                  <li>• Load testing completed</li>
                  <li>• Cross-device testing done</li>
                  <li>• Performance budget met</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>Next Steps</h2>
      <p>Now that you understand performance optimization, explore these related topics:</p>

      <ul>
        <li><Link href="/docs/core-concepts">Core Concepts</Link> - Understand the fundamental principles</li>
        <li><Link href="/docs/responsive-provider">Responsive Provider</Link> - Learn how the provider works</li>
        <li><Link href="/docs/scaling-engine">Scaling Engine</Link> - Dive into the mathematical scaling</li>
        <li><Link href="/docs/hooks/use-responsive-value">useResponsiveValue Hook</Link> - Start using responsive values</li>
        <li><Link href="/playground">Interactive Playground</Link> - Test performance in action</li>
      </ul>

      <div className="not-prose mt-8">
        <Link href="/docs/hooks/use-responsive-value">
          <Button>
            Continue to React Hooks →
          </Button>
        </Link>
      </div>
    </div>
  );
}
