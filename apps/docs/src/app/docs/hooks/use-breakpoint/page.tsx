import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'useBreakpoint - React Responsive Easy',
  description: 'Learn how to use the useBreakpoint hook to get current breakpoint information and create responsive logic.',
}

export default function UseBreakpointPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          useBreakpoint
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Get current breakpoint information and create responsive logic with precision.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/docs/hooks/use-performance-monitor">Next: usePerformanceMonitor →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/hooks/use-scaled-style">← useScaledStyle</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          The <code>useBreakpoint</code> hook provides real-time access to the current breakpoint 
          information, including the breakpoint name, dimensions, and scaling ratios. This hook is 
          essential for creating responsive logic, conditional rendering, and breakpoint-specific behavior.
        </p>

        <h2>Basic Usage</h2>
        <p>
          Import and use the hook to get current breakpoint information:
        </p>
        <CodeBlock language="tsx" code={`import { useBreakpoint } from '@react-responsive-easy/core'

function MyComponent() {
  const breakpoint = useBreakpoint()
  
  return (
    <div>
      <p>Current breakpoint: {breakpoint.name}</p>
      <p>Viewport width: {breakpoint.width}px</p>
      <p>Viewport height: {breakpoint.height}px</p>
      <p>Scaling ratio: {breakpoint.scalingRatio}</p>
    </div>
  )
}`} />

        <h2>Hook Signature</h2>
        <CodeBlock language="typescript" code={`function useBreakpoint(): BreakpointInfo

interface BreakpointInfo {
  name: string
  alias: string
  width: number
  height: number
  scalingRatio: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isAbove: (breakpoint: string) => boolean
  isBelow: (breakpoint: string) => boolean
  isBetween: (min: string, max: string) => boolean
}`} />

        <h2>Return Value Properties</h2>
        <ul>
          <li>
            <strong>name</strong> - The full breakpoint name (e.g., "Mobile", "Tablet", "Desktop")
          </li>
          <li>
            <strong>alias</strong> - The short breakpoint alias (e.g., "mobile", "tablet", "desktop")
          </li>
          <li>
            <strong>width</strong> - Current viewport width in pixels
          </li>
          <li>
            <strong>height</strong> - Current viewport height in pixels
          </li>
          <li>
            <strong>scalingRatio</strong> - The scaling ratio relative to the base breakpoint
          </li>
          <li>
            <strong>isMobile</strong> - Boolean indicating if current breakpoint is mobile
          </li>
          <li>
            <strong>isTablet</strong> - Boolean indicating if current breakpoint is tablet
          </li>
          <li>
            <strong>isDesktop</strong> - Boolean indicating if current breakpoint is desktop
          </li>
        </ul>

        <h2>Utility Methods</h2>
        <p>
          The hook provides convenient methods for breakpoint comparisons:
        </p>

        <h3>isAbove Method</h3>
        <CodeBlock language="tsx" code={`const breakpoint = useBreakpoint()

// Check if current breakpoint is above a specific breakpoint
if (breakpoint.isAbove('tablet')) {
  // This will run on desktop and above
  console.log('Large screen detected')
}`} />

        <h3>isBelow Method</h3>
        <CodeBlock language="tsx" code={`const breakpoint = useBreakpoint()

// Check if current breakpoint is below a specific breakpoint
if (breakpoint.isBelow('tablet')) {
  // This will run on mobile only
  console.log('Small screen detected')
}`} />

        <h3>isBetween Method</h3>
        <CodeBlock language="tsx" code={`const breakpoint = useBreakpoint()

// Check if current breakpoint is between two breakpoints
if (breakpoint.isBetween('mobile', 'tablet')) {
  // This will run on mobile and tablet
  console.log('Medium or small screen detected')
}`} />

        <h2>Advanced Examples</h2>

        <h3>Conditional Rendering</h3>
        <CodeBlock language="tsx" code={`function ResponsiveComponent() {
  const breakpoint = useBreakpoint()
  
  if (breakpoint.isMobile) {
    return <MobileLayout />
  }
  
  if (breakpoint.isTablet) {
    return <TabletLayout />
  }
  
  return <DesktopLayout />
}`} />

        <h3>Responsive Navigation</h3>
        <CodeBlock language="tsx" code={`function ResponsiveNavigation() {
  const breakpoint = useBreakpoint()
  
  return (
    <nav>
      {breakpoint.isAbove('mobile') && (
        <div className="desktop-menu">
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      )}
      
      {breakpoint.isMobile && (
        <button className="mobile-menu-button">
          <span>☰</span>
        </button>
      )}
    </nav>
  )
}`} />

        <h3>Dynamic Grid Layout</h3>
        <CodeBlock language="tsx" code={`function ResponsiveGrid() {
  const breakpoint = useBreakpoint()
  
  const getGridColumns = () => {
    if (breakpoint.isMobile) return 1
    if (breakpoint.isTablet) return 2
    return 3
  }
  
  const getGridGap = () => {
    if (breakpoint.isMobile) return 16
    if (breakpoint.isTablet) return 20
    return 24
  }
  
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${getGridColumns()}, 1fr)\`,
        gap: \`\${getGridGap()}px\`
      }}
    >
      {/* Grid items */}
    </div>
  )
}`} />

        <h3>Responsive Typography</h3>
        <CodeBlock language="tsx" code={`function ResponsiveTypography() {
  const breakpoint = useBreakpoint()
  
  const getFontSize = () => {
    switch (breakpoint.alias) {
      case 'mobile':
        return 14
      case 'tablet':
        return 16
      case 'desktop':
        return 18
      default:
        return 16
    }
  }
  
  const getLineHeight = () => {
    if (breakpoint.isMobile) return 1.4
    if (breakpoint.isTablet) return 1.5
    return 1.6
  }
  
  return (
    <p style={{
      fontSize: \`\${getFontSize()}px\`,
      lineHeight: getLineHeight()
    }}>
      Responsive text that adapts to screen size
    </p>
  )
}`} />

        <h2>Performance Optimization</h2>
        <p>
          The hook is optimized for performance and provides several benefits:
        </p>

        <h3>Automatic Memoization</h3>
        <CodeBlock language="tsx" code={`// The hook automatically memoizes the breakpoint info
const breakpoint = useBreakpoint()

// No unnecessary recalculations on re-renders
// Only updates when the actual breakpoint changes`} />

        <h3>Efficient Comparisons</h3>
        <CodeBlock language="tsx" code={`// Use the provided boolean properties for better performance
const breakpoint = useBreakpoint()

// Good - direct boolean check
if (breakpoint.isMobile) { /* ... */ }

// Better than manual comparison
// if (breakpoint.name === 'Mobile') { /* ... */ }`} />

        <h2>Integration with Other Hooks</h2>
        <p>
          Combine <code>useBreakpoint</code> with other responsive hooks for powerful patterns:
        </p>

        <h3>With useResponsiveValue</h3>
        <CodeBlock language="tsx" code={`function SmartComponent() {
  const breakpoint = useBreakpoint()
  const fontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 16,
    desktop: 18
  })
  
  // Use breakpoint info for additional logic
  const shouldShowDetails = breakpoint.isAbove('mobile')
  
  return (
    <div style={{ fontSize: \`\${fontSize}px\` }}>
      <h2>Title</h2>
      {shouldShowDetails && (
        <p>Additional details for larger screens</p>
      )}
    </div>
  )
}`} />

        <h3>With useScaledStyle</h3>
        <CodeBlock language="tsx" code={`function AdaptiveComponent() {
  const breakpoint = useBreakpoint()
  const baseStyles = {
    padding: 24,
    fontSize: 16,
    borderRadius: 8
  }
  
  const styles = useScaledStyle(baseStyles, {
    mobile: {
      padding: 16,
      fontSize: 14,
      borderRadius: 6
    }
  })
  
  // Add breakpoint-specific styles
  const finalStyles = {
    ...styles,
    ...(breakpoint.isMobile && { flexDirection: 'column' }),
    ...(breakpoint.isDesktop && { maxWidth: 1200 })
  }
  
  return <div style={finalStyles}>Content</div>
}`} />

        <h2>Custom Breakpoint Logic</h2>
        <p>
          Create custom breakpoint logic for complex responsive behavior:
        </p>

        <h3>Custom Breakpoint Groups</h3>
        <CodeBlock language="tsx" code={`function useCustomBreakpointLogic() {
  const breakpoint = useBreakpoint()
  
  const isSmallScreen = breakpoint.isBelow('tablet')
  const isMediumScreen = breakpoint.isBetween('tablet', 'desktop')
  const isLargeScreen = breakpoint.isAbove('tablet')
  
  const isTouchDevice = isSmallScreen || isMediumScreen
  const isDesktopOnly = isLargeScreen
  
  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isTouchDevice,
    isDesktopOnly
  }
}`} />

        <h3>Breakpoint-Based Features</h3>
        <CodeBlock language="tsx" code={`function FeatureFlags() {
  const breakpoint = useBreakpoint()
  
  const features = {
    showAdvancedMenu: breakpoint.isAbove('mobile'),
    enableAnimations: breakpoint.isAbove('mobile'),
    showSidebar: breakpoint.isAbove('tablet'),
    enableKeyboardShortcuts: breakpoint.isDesktop,
    showTooltips: breakpoint.isAbove('mobile')
  }
  
  return features
}`} />

        <h2>Error Handling</h2>
        <p>
          The hook gracefully handles edge cases and provides fallbacks:
        </p>

        <h3>Fallback Values</h3>
        <CodeBlock language="tsx" code={`function SafeComponent() {
  const breakpoint = useBreakpoint()
  
  // Always provide fallback values
  const getResponsiveValue = (mobile: number, tablet: number, desktop: number) => {
    if (breakpoint.isMobile) return mobile
    if (breakpoint.isTablet) return tablet
    if (breakpoint.isDesktop) return desktop
    return desktop // Fallback to desktop
  }
  
  const fontSize = getResponsiveValue(14, 16, 18)
  
  return <div style={{ fontSize: \`\${fontSize}px\` }}>Content</div>
}`} />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Use boolean properties:</strong> Prefer <code>isMobile</code> over manual string comparisons
          </li>
          <li>
            <strong>Avoid magic numbers:</strong> Use the hook's utility methods for breakpoint comparisons
          </li>
          <li>
            <strong>Memoize complex logic:</strong> Use <code>useMemo</code> for expensive breakpoint-based calculations
          </li>
          <li>
            <strong>Provide fallbacks:</strong> Always handle edge cases and provide default values
          </li>
          <li>
            <strong>Test across breakpoints:</strong> Ensure your responsive logic works at all breakpoints
          </li>
        </ul>

        <h2>Common Patterns</h2>

        <h3>Responsive Hooks</h3>
        <CodeBlock language="tsx" code={`// Create custom hooks that combine breakpoint logic
function useResponsiveBehavior() {
  const breakpoint = useBreakpoint()
  
  const behavior = {
    showSidebar: breakpoint.isAbove('mobile'),
    enableHoverEffects: breakpoint.isAbove('mobile'),
    showFullNavigation: breakpoint.isAbove('tablet'),
    enableKeyboardNavigation: breakpoint.isDesktop
  }
  
  return behavior
}`} />

        <h3>Breakpoint-Aware Components</h3>
        <CodeBlock language="tsx" code={`// Create components that automatically adapt to breakpoints
function ResponsiveContainer({ children, mobileProps, tabletProps, desktopProps }) {
  const breakpoint = useBreakpoint()
  
  const getProps = () => {
    if (breakpoint.isMobile) return mobileProps || {}
    if (breakpoint.isTablet) return tabletProps || {}
    return desktopProps || {}
  }
  
  return (
    <div {...getProps()}>
      {children}
    </div>
  )
}`} />

        <h2>Debugging</h2>
        <p>
          Enable debug mode to see breakpoint information in the console:
        </p>
        <CodeBlock language="tsx" code={`// In your ResponsiveProvider config
<ResponsiveProvider
  config={{
    development: {
      enableDebugMode: true,
      showScalingInfo: true
    }
  }}
>
  {/* Your app */}
</ResponsiveProvider>

// The hook will log breakpoint changes when debug mode is enabled`} />

        <h2>Testing</h2>
        <p>
          Test your breakpoint logic across different viewport sizes:
        </p>
        <CodeBlock language="tsx" code={`// In your test
import { renderHook } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'

test('returns correct breakpoint info', () => {
  const { result } = renderHook(() => useBreakpoint(), {
    wrapper: ResponsiveProvider
  })
  
  expect(result.current.name).toBe('Mobile')
  expect(result.current.isMobile).toBe(true)
  expect(result.current.isAbove('mobile')).toBe(false)
})`} />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/hooks/use-scaled-style">← useScaledStyle</Link>
            </Button>
            <Button asChild>
              <Link href="/docs/hooks/use-performance-monitor">Next: usePerformanceMonitor →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
