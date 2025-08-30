import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'useScaledStyle - React Responsive Easy',
  description: 'Learn how to use the useScaledStyle hook to scale entire style objects responsively across breakpoints.',
}

export default function UseScaledStylePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          useScaledStyle
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Scale entire style objects responsively across breakpoints with mathematical precision.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/docs/hooks/use-breakpoint">Next: useBreakpoint →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/hooks/use-responsive-value">← useResponsiveValue</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          The <code>useScaledStyle</code> hook extends the power of <code>useResponsiveValue</code> 
          by allowing you to scale entire style objects at once. This is perfect for components 
          that need multiple responsive properties or when you want to maintain consistent scaling ratios.
        </p>

        <h2>Basic Usage</h2>
        <p>
          Import and use the hook to scale style objects:
        </p>
        <CodeBlock language="tsx" code={`import { useScaledStyle } from '@react-responsive-easy/core'

function MyComponent() {
  const styles = useScaledStyle({
    fontSize: 16,
    padding: 24,
    margin: 16,
    borderRadius: 8
  }, {
    mobile: {
      fontSize: 14,
      padding: 16,
      margin: 12,
      borderRadius: 6
    },
    tablet: {
      fontSize: 15,
      padding: 20,
      margin: 14,
      borderRadius: 7
    },
    desktop: {
      fontSize: 16,
      padding: 24,
      margin: 16,
      borderRadius: 8
    }
  })

  return (
    <div style={styles}>
      Responsive component with scaled styles
    </div>
  )
}`} />

        <h2>Hook Signature</h2>
        <CodeBlock language="typescript" code={`function useScaledStyle<T extends Record<string, number>>(
  baseStyles: T,
  breakpointStyles?: Partial<Record<BreakpointAlias, Partial<T>>>,
  options?: ResponsiveStyleOptions
): T`} />

        <h2>Parameters</h2>
        <ul>
          <li>
            <strong>baseStyles</strong> - The base style object to scale from
          </li>
          <li>
            <strong>breakpointStyles</strong> - Optional specific styles for each breakpoint
          </li>
          <li>
            <strong>options</strong> - Configuration options for scaling behavior
          </li>
        </ul>

        <h2>Style Object Scaling</h2>
        <p>
          The hook intelligently scales numeric values while preserving non-numeric properties:
        </p>

        <h3>Mixed Property Types</h3>
        <CodeBlock language="tsx" code={`const styles = useScaledStyle({
  fontSize: 16,           // Will be scaled
  color: '#333',          // Will be preserved
  fontWeight: 'bold',     // Will be preserved
  padding: 24,            // Will be scaled
  border: '1px solid'     // Will be preserved
}, {
  mobile: {
    fontSize: 14,
    padding: 16
  }
})

// Result: { fontSize: 14, color: '#333', fontWeight: 'bold', padding: 16, border: '1px solid' }`} />

        <h3>Partial Breakpoint Overrides</h3>
        <CodeBlock language="tsx" code={`const styles = useScaledStyle({
  fontSize: 16,
  padding: 24,
  margin: 16
}, {
  mobile: {
    fontSize: 14,
    // padding and margin will be mathematically scaled
  },
  tablet: {
    // Only fontSize and padding will be scaled, margin uses base
  }
})`} />

        <h2>Advanced Examples</h2>

        <h3>Card Component Styling</h3>
        <CodeBlock language="tsx" code={`function ResponsiveCard() {
  const cardStyles = useScaledStyle({
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: 400,
    fontSize: 16,
    lineHeight: 1.5
  }, {
    mobile: {
      padding: 16,
      borderRadius: 8,
      maxWidth: 320,
      fontSize: 14
    },
    tablet: {
      padding: 20,
      borderRadius: 10,
      maxWidth: 360,
      fontSize: 15
    }
  })

  return (
    <div style={cardStyles} className="bg-white">
      <h3>Card Title</h3>
      <p>Card content with responsive styling</p>
    </div>
  )
}`} />

        <h3>Button Component Styling</h3>
        <CodeBlock language="tsx" code={`function ResponsiveButton({ children, variant = 'primary' }) {
  const baseStyles = {
    padding: 16,
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  const variantStyles = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: 'white'
    }
  }

  const responsiveStyles = useScaledStyle(baseStyles, {
    mobile: {
      padding: 12,
      fontSize: 14,
      borderRadius: 6
    },
    tablet: {
      padding: 14,
      fontSize: 15,
      borderRadius: 7
    }
  })

  const finalStyles = {
    ...responsiveStyles,
    ...variantStyles[variant]
  }

  return (
    <button style={finalStyles}>
      {children}
    </button>
  )
}`} />

        <h3>Layout Component Styling</h3>
        <CodeBlock language="tsx" code={`function ResponsiveLayout() {
  const containerStyles = useScaledStyle({
    maxWidth: 1200,
    margin: '0 auto',
    padding: 24,
    display: 'flex',
    gap: 24
  }, {
    mobile: {
      maxWidth: '100%',
      padding: 16,
      gap: 16,
      flexDirection: 'column'
    },
    tablet: {
      maxWidth: 768,
      padding: 20,
      gap: 20
    }
  })

  return (
    <div style={containerStyles}>
      <aside style={{ flex: '0 0 250px' }}>Sidebar</aside>
      <main style={{ flex: 1 }}>Main content</main>
    </div>
  )
}`} />

        <h2>Performance Optimization</h2>
        <p>
          The hook provides several optimization features:
        </p>

        <h3>Memoization</h3>
        <CodeBlock language="tsx" code={`// Styles are memoized and only recalculated when breakpoints change
const memoizedStyles = useScaledStyle({
  fontSize: 16,
  padding: 24
}, {
  mobile: { fontSize: 14, padding: 16 }
})

// No unnecessary recalculations on re-renders`} />

        <h3>Selective Scaling</h3>
        <CodeBlock language="tsx" code={`// Only scale properties that actually change
const optimizedStyles = useScaledStyle({
  fontSize: 16,
  color: '#333',      // Won't be processed
  padding: 24         // Will be scaled
}, {
  mobile: {
    fontSize: 14,     // Only this and padding will be processed
    // color is preserved as-is
  }
})`} />

        <h2>Custom Scaling Functions</h2>
        <p>
          For complex scaling logic, you can provide custom functions for specific properties:
        </p>
        <CodeBlock language="tsx" code={`const customStyles = useScaledStyle({
  fontSize: 16,
  padding: 24,
  borderRadius: 8
}, {
  mobile: {
    fontSize: (ratio) => 16 * Math.pow(ratio, 1.2),
    padding: (ratio) => 24 * ratio,
    borderRadius: 6
  }
})`} />

        <h2>Error Handling</h2>
        <p>
          The hook gracefully handles various edge cases:
        </p>

        <h3>Invalid Values</h3>
        <CodeBlock language="tsx" code={`// Invalid numeric values fall back to base values
const safeStyles = useScaledStyle({
  fontSize: 16,
  padding: 24
}, {
  mobile: {
    fontSize: -5,     // Invalid, will use base value (16)
    padding: 16
  }
})`} />

        <h3>Missing Properties</h3>
        <CodeBlock language="tsx" code={`// Missing properties use mathematical scaling
const scaledStyles = useScaledStyle({
  fontSize: 16,
  padding: 24,
  margin: 16
}, {
  mobile: {
    fontSize: 14
    // padding and margin will be calculated automatically
  }
})`} />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Group related styles:</strong> Keep related properties together for better maintainability
          </li>
          <li>
            <strong>Use consistent ratios:</strong> Maintain consistent scaling ratios across related components
          </li>
          <li>
            <strong>Avoid inline styles:</strong> Consider using CSS-in-JS or CSS modules for complex styling
          </li>
          <li>
            <strong>Performance:</strong> Don't create new style objects in render functions
          </li>
          <li>
            <strong>Semantic naming:</strong> Use descriptive property names that reflect their purpose
          </li>
        </ul>

        <h2>Common Patterns</h2>

        <h3>Theme Integration</h3>
        <CodeBlock language="tsx" code={`import { theme } from './theme'

function ThemedComponent() {
  const styles = useScaledStyle({
    fontSize: theme.typography.body,
    padding: theme.spacing.lg,
    color: theme.colors.text,
    backgroundColor: theme.colors.background
  }, {
    mobile: {
      fontSize: theme.typography.bodySmall,
      padding: theme.spacing.md
    }
  })
  
  return <div style={styles}>Themed content</div>
}`} />

        <h3>Conditional Styling</h3>
        <CodeBlock language="tsx" code={`function ConditionalComponent({ isActive, isCompact }) {
  const baseStyles = {
    padding: isCompact ? 16 : 24,
    fontSize: isCompact ? 14 : 16,
    borderRadius: 8
  }
  
  const styles = useScaledStyle(baseStyles, {
    mobile: {
      padding: isCompact ? 12 : 16,
      fontSize: isCompact ? 12 : 14
    }
  })
  
  const finalStyles = {
    ...styles,
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : '#333'
  }
  
  return <div style={finalStyles}>Content</div>
}`} />

        <h3>Responsive Grid System</h3>
        <CodeBlock language="tsx" code={`function ResponsiveGrid({ columns = 3 }) {
  const gridStyles = useScaledStyle({
    display: 'grid',
    gap: 24,
    gridTemplateColumns: \`repeat(\${columns}, 1fr)\`
  }, {
    mobile: {
      gap: 16,
      gridTemplateColumns: '1fr'
    },
    tablet: {
      gap: 20,
      gridTemplateColumns: \`repeat(\${Math.min(columns, 2)}, 1fr)\`
    }
  })

  return (
    <div style={gridStyles}>
      {/* Grid items */}
    </div>
  )
}`} />

        <h2>Debugging</h2>
        <p>
          Enable debug mode to see style scaling calculations:
        </p>
        <CodeBlock language="tsx" code={`// In your ResponsiveProvider config
<ResponsiveProvider
  config={{
    development: {
      enableDebugMode: true,
      logScalingCalculations: true,
      showScalingInfo: true
    }
  }}
>
  {/* Your app */}
</ResponsiveProvider>`} />

        <h2>Testing</h2>
        <p>
          Test your responsive styles across different viewport sizes:
        </p>
        <CodeBlock language="tsx" code={`// In your test
import { renderHook } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'

test('scales styles correctly', () => {
  const { result } = renderHook(
    () => useScaledStyle(
      { fontSize: 16, padding: 24 },
      { mobile: { fontSize: 14, padding: 16 } }
    ),
    {
      wrapper: ResponsiveProvider
    }
  )
  
  expect(result.current.fontSize).toBe(14)
  expect(result.current.padding).toBe(16)
})`} />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/hooks/use-responsive-value">← useResponsiveValue</Link>
            </Button>
            <Button asChild>
              <Link href="/docs/hooks/use-breakpoint">Next: useBreakpoint →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
