import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'React Hooks - React Responsive Easy',
  description: 'Complete guide to React hooks for responsive design, including useResponsiveValue, useScaledStyle, useBreakpoint, and usePerformanceMonitor.',
}

export default function HooksPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          React Hooks
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Powerful hooks for building responsive React applications with mathematical precision.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/docs/hooks/use-responsive-value">Get Started →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/core-concepts">← Core Concepts</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          React Responsive Easy provides a comprehensive set of hooks that make it easy to build 
          responsive applications. These hooks handle the complex mathematics of responsive scaling 
          while providing a simple, intuitive API for React developers.
        </p>

        <h2>Available Hooks</h2>
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="/docs/hooks/use-responsive-value" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                useResponsiveValue
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Scale individual values responsively across breakpoints with mathematical precision.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Core Hook</span>
              <Button size="sm" asChild>
                <Link href="/docs/hooks/use-responsive-value">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="/docs/hooks/use-scaled-style" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                useScaledStyle
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Scale entire style objects responsively across breakpoints with mathematical precision.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Style Hook</span>
              <Button size="sm" asChild>
                <Link href="/docs/hooks/use-scaled-style">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="/docs/hooks/use-breakpoint" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                useBreakpoint
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get current breakpoint information and create responsive logic with precision.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Breakpoint Hook</span>
              <Button size="sm" asChild>
                <Link href="/docs/hooks/use-breakpoint">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="/docs/hooks/use-performance-monitor" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                usePerformanceMonitor
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Monitor component performance and optimize responsive scaling in real-time.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Performance Hook</span>
              <Button size="sm" asChild>
                <Link href="/docs/hooks/use-performance-monitor">Learn More →</Link>
              </Button>
            </div>
          </div>
        </div>

        <h2>Quick Start</h2>
        <p>
          Get started with responsive hooks in just a few lines of code:
        </p>
        <CodeBlock 
          language="tsx"
          code={`import { 
  useResponsiveValue, 
  useScaledStyle, 
  useBreakpoint,
  usePerformanceMonitor 
} from '@react-responsive-easy/core'

function ResponsiveComponent() {
  const breakpoint = useBreakpoint()
  const fontSize = useResponsiveValue(16, { mobile: 14, tablet: 16, desktop: 18 })
  const styles = useScaledStyle({ padding: 24, borderRadius: 8 }, {
    mobile: { padding: 16, borderRadius: 6 }
  })
  const performance = usePerformanceMonitor()
  
  return (
    <div style={styles}>
      <h2 style={{ fontSize: \`\${fontSize}px\` }}>
        Responsive Component
      </h2>
      <p>Current breakpoint: {breakpoint.name}</p>
      <p>Performance score: {performance.performanceScore}</p>
    </div>
  )
}`}
        />

        <h2>Hook Categories</h2>
        
        <h3>Core Scaling Hooks</h3>
        <p>
          These hooks form the foundation of responsive scaling:
        </p>
        <ul>
          <li>
            <strong>useResponsiveValue</strong> - Scale individual numeric values
          </li>
          <li>
            <strong>useScaledStyle</strong> - Scale entire style objects
          </li>
        </ul>

        <h3>Breakpoint Management</h3>
        <p>
          Hooks for managing and responding to breakpoint changes:
        </p>
        <ul>
          <li>
            <strong>useBreakpoint</strong> - Access current breakpoint information
          </li>
        </ul>

        <h3>Performance & Monitoring</h3>
        <p>
          Hooks for monitoring and optimizing performance:
        </p>
        <ul>
          <li>
            <strong>usePerformanceMonitor</strong> - Track component performance metrics
          </li>
        </ul>

        <h2>Integration with ResponsiveProvider</h2>
        <p>
          All hooks require the <code>ResponsiveProvider</code> to be set up in your app:
        </p>
        <CodeBlock 
          language="tsx"
          code={`import { ResponsiveProvider } from '@react-responsive-easy/core'

function App() {
  return (
    <ResponsiveProvider
      config={{
        base: 'desktop',
        breakpoints: [
          { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
          { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
          { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
        ],
        strategy: 'width'
      }}
    >
      {/* Your app components */}
    </ResponsiveProvider>
  )
}`}
        />

        <h2>Common Use Cases</h2>
        
        <h3>Typography Scaling</h3>
        <CodeBlock 
          language="tsx"
          code={`function ResponsiveTypography() {
  const headingSize = useResponsiveValue(48, {
    mobile: 32,
    tablet: 40,
    desktop: 48
  })
  
  const bodySize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 15,
    desktop: 16
  })
  
  return (
    <div>
      <h1 style={{ fontSize: \`\${headingSize}px\` }}>Responsive Heading</h1>
      <p style={{ fontSize: \`\${bodySize}px\` }}>Responsive body text</p>
    </div>
  )
}`}
        />

        <h3>Layout Adaptation</h3>
        <CodeBlock 
          language="tsx"
          code={`function ResponsiveLayout() {
  const breakpoint = useBreakpoint()
  const containerStyles = useScaledStyle({
    maxWidth: 1200,
    padding: 24,
    gap: 24
  }, {
    mobile: {
      maxWidth: '100%',
      padding: 16,
      gap: 16
    }
  })
  
  return (
    <div style={containerStyles}>
      {breakpoint.isMobile ? (
        <div className="mobile-layout">Mobile Layout</div>
      ) : (
        <div className="desktop-layout">Desktop Layout</div>
      )}
    </div>
  )
}`}
        />

        <h3>Performance Optimization</h3>
        <CodeBlock 
          language="tsx"
          code={`function OptimizedComponent() {
  const performance = usePerformanceMonitor()
  
  // Optimize based on performance
  const shouldOptimize = performance.renderTime > 16 || performance.performanceScore < 80
  
  return (
    <div className={shouldOptimize ? 'optimized' : 'normal'}>
      {shouldOptimize && (
        <div className="optimization-notice">
          Performance optimization mode enabled
        </div>
      )}
      {/* Component content */}
    </div>
  )
}`}
        />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Use the right hook for the job:</strong> Choose between <code>useResponsiveValue</code> for single values and <code>useScaledStyle</code> for multiple properties
          </li>
          <li>
            <strong>Leverage breakpoint information:</strong> Use <code>useBreakpoint</code> for conditional rendering and logic
          </li>
          <li>
            <strong>Monitor performance:</strong> Use <code>usePerformanceMonitor</code> to identify optimization opportunities
          </li>
          <li>
            <strong>Memoize expensive calculations:</strong> Use <code>useMemo</code> with responsive values to avoid unnecessary recalculations
          </li>
          <li>
            <strong>Provide fallbacks:</strong> Always handle edge cases and provide default values
          </li>
        </ul>

        <h2>Advanced Patterns</h2>
        
        <h3>Custom Hooks</h3>
        <p>
          Create custom hooks that combine multiple responsive hooks:
        </p>
        <CodeBlock 
          language="tsx"
          code={`function useResponsiveLayout() {
  const breakpoint = useBreakpoint()
  const spacing = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24
  })
  
  const layout = {
    isMobile: breakpoint.isMobile,
    isTablet: breakpoint.isTablet,
    isDesktop: breakpoint.isDesktop,
    spacing,
    columns: breakpoint.isMobile ? 1 : breakpoint.isTablet ? 2 : 3
  }
  
  return layout
}`}
        />

        <h3>Performance-Aware Components</h3>
        <p>
          Create components that adapt based on performance:
        </p>
        <CodeBlock 
          language="tsx"
          code={`function usePerformanceAwareRendering() {
  const performance = usePerformanceMonitor()
  
  const renderStrategy = useMemo(() => {
    if (performance.performanceScore >= 90) return 'full-featured'
    if (performance.performanceScore >= 70) return 'balanced'
    return 'minimal'
  }, [performance.performanceScore])
  
  return renderStrategy
}`}
        />

        <h2>Testing</h2>
        <p>
          Test your responsive hooks with the testing utilities:
        </p>
        <CodeBlock 
          language="tsx"
          code={`import { renderHook } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'

test('useResponsiveValue scales correctly', () => {
  const { result } = renderHook(
    () => useResponsiveValue(100, { mobile: 80 }),
    { wrapper: ResponsiveProvider }
  )
  
  expect(result.current).toBe(80)
})`}
        />

        <h2>Next Steps</h2>
        <p>
          Now that you understand the available hooks, explore each one in detail:
        </p>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Button asChild className="w-full">
            <Link href="/docs/hooks/use-responsive-value">
              Start with useResponsiveValue →
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/docs/cli">
              Explore CLI & Tools →
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/core-concepts">← Core Concepts</Link>
            </Button>
            <Button asChild>
              <Link href="/docs/hooks/use-responsive-value">Get Started with Hooks →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
