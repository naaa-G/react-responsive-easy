import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'useResponsiveValue - React Responsive Easy',
  description: 'Learn how to use the useResponsiveValue hook to scale individual values responsively across breakpoints.',
}

export default function UseResponsiveValuePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          useResponsiveValue
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Scale individual values responsively across breakpoints with mathematical precision.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/docs/hooks/use-scaled-style">Next: useScaledStyle →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/hooks">← Back to Hooks</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          The <code>useResponsiveValue</code> hook is the foundation of React Responsive Easy. 
          It allows you to scale any numeric value (sizes, spacing, fonts, etc.) across different 
          breakpoints using mathematical scaling algorithms.
        </p>

        <h2>Basic Usage</h2>
        <p>
          Import and use the hook in your component:
        </p>
        <CodeBlock 
          language="tsx"
          code={`import { useResponsiveValue } from '@react-responsive-easy/core'

function MyComponent() {
  const fontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 16,
    desktop: 18
  })

  return (
    <div style={{ fontSize: \`\${fontSize}px\` }}>
      Responsive text that scales perfectly
    </div>
  )
}`}
        />

        <h2>Hook Signature</h2>
        <CodeBlock 
          language="typescript"
          code={`function useResponsiveValue<T extends number>(
  baseValue: T,
  breakpointValues?: Partial<Record<BreakpointAlias, T>>,
  options?: ResponsiveValueOptions
): T`}
        />

        <h2>Parameters</h2>
        <ul>
          <li>
            <strong>baseValue</strong> - The base value to scale from (usually desktop)
          </li>
          <li>
            <strong>breakpointValues</strong> - Optional specific values for each breakpoint
          </li>
          <li>
            <strong>options</strong> - Configuration options for scaling behavior
          </li>
        </ul>

        <h2>Scaling Strategies</h2>
        <p>
          The hook supports different scaling strategies that determine how values are calculated:
        </p>

        <h3>Width-Based Scaling (Default)</h3>
        <CodeBlock 
          language="tsx"
          code={`const width = useResponsiveValue(100, undefined, { strategy: 'width' })
// Scales based on viewport width ratio`}
        />

        <h3>Height-Based Scaling</h3>
        <CodeBlock 
          language="tsx"
          code={`const height = useResponsiveValue(100, undefined, { strategy: 'height' })
// Scales based on viewport height ratio`}
        />

        <h3>Area-Based Scaling</h3>
        <CodeBlock 
          language="tsx"
          code={`const area = useResponsiveValue(100, undefined, { strategy: 'area' })
// Scales based on viewport area ratio`}
        />

        <h2>Advanced Examples</h2>

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
      <h1 style={{ fontSize: \`\${headingSize}px\` }}>
        Responsive Heading
      </h1>
      <p style={{ fontSize: \`\${bodySize}px\` }}>
        Body text that scales proportionally
      </p>
    </div>
  )
}`}
        />

        <h3>Spacing and Layout</h3>
        <CodeBlock 
          language="tsx"
          code={`function ResponsiveLayout() {
  const padding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24
  })
  
  const margin = useResponsiveValue(32, {
    mobile: 16,
    tablet: 24,
    desktop: 32
  })

  return (
    <div style={{ 
      padding: \`\${padding}px\`,
      margin: \`\${margin}px\`
    }}>
      Content with responsive spacing
    </div>
  )
}`}
        />

        <h3>Component Dimensions</h3>
        <CodeBlock 
          language="tsx"
          code={`function ResponsiveButton() {
  const width = useResponsiveValue(200, {
    mobile: 160,
    tablet: 180,
    desktop: 200
  })
  
  const height = useResponsiveValue(48, {
    mobile: 40,
    tablet: 44,
    desktop: 48
  })

  return (
    <button style={{
      width: \`\${width}px\`,
      height: \`\${height}px\`
    }}>
      Responsive Button
    </button>
  )
}`}
        />

        <h2>Performance Optimization</h2>
        <p>
          The hook automatically memoizes values and only recalculates when breakpoints change:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// Values are cached and reused efficiently
const optimizedValue = useResponsiveValue(100, {
  mobile: 80,
  tablet: 90,
  desktop: 100
})

// No unnecessary recalculations on re-renders`}
        />

        <h2>Custom Scaling Functions</h2>
        <p>
          For complex scaling logic, you can provide custom functions:
        </p>
        <CodeBlock 
          language="tsx"
          code={`const customValue = useResponsiveValue(100, {
  mobile: (ratio) => 100 * Math.pow(ratio, 1.5),
  tablet: (ratio) => 100 * ratio,
  desktop: 100
})`}
        />

        <h2>Error Handling</h2>
        <p>
          The hook gracefully handles edge cases and provides fallbacks:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// Invalid values fall back to base value
const safeValue = useResponsiveValue(16, {
  mobile: -5,  // Invalid, will use base value
  tablet: 14,
  desktop: 16
})

// Missing breakpoints use mathematical scaling
const scaledValue = useResponsiveValue(100, {
  mobile: 80
  // tablet and desktop will be calculated automatically
})`}
        />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Use semantic values:</strong> Define values that make sense for your design system
          </li>
          <li>
            <strong>Leverage defaults:</strong> Only specify breakpoint values when you need custom behavior
          </li>
          <li>
            <strong>Consistent ratios:</strong> Maintain consistent scaling ratios across related values
          </li>
          <li>
            <strong>Performance:</strong> The hook is optimized, but avoid creating new objects in render
          </li>
        </ul>

        <h2>Common Patterns</h2>

        <h3>Design Token Integration</h3>
        <CodeBlock 
          language="tsx"
          code={`import { tokens } from './design-tokens'

function TokenizedComponent() {
  const spacing = useResponsiveValue(tokens.spacing.lg, {
    mobile: tokens.spacing.md,
    tablet: tokens.spacing.lg,
    desktop: tokens.spacing.xl
  })
  
  return <div style={{ padding: spacing }}>Content</div>
}`}
        />

        <h3>Conditional Scaling</h3>
        <CodeBlock 
          language="tsx"
          code={`function ConditionalComponent({ isCompact }) {
  const baseSize = isCompact ? 16 : 24
  
  const size = useResponsiveValue(baseSize, {
    mobile: baseSize * 0.8,
    tablet: baseSize * 0.9,
    desktop: baseSize
  })
  
  return <div style={{ fontSize: \`\${size}px\` }}>Content</div>
}`}
        />

        <h2>Debugging</h2>
        <p>
          Enable debug mode to see scaling calculations in the console:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// In your ResponsiveProvider config
<ResponsiveProvider
  config={{
    development: {
      enableDebugMode: true,
      logScalingCalculations: true
    }
  }}
>
  {/* Your app */}
</ResponsiveProvider>`}
        />

        <h2>Testing</h2>
        <p>
          Test your responsive values across different viewport sizes:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// In your test
import { renderHook } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'

test('scales value correctly', () => {
  const { result } = renderHook(
    () => useResponsiveValue(100, { mobile: 80 }),
    {
      wrapper: ResponsiveProvider
    }
  )
  
  expect(result.current).toBe(80) // On mobile breakpoint
})`}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/hooks">← Back to Hooks</Link>
            </Button>
            <Button asChild>
              <Link href="/docs/hooks/use-scaled-style">Next: useScaledStyle →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
