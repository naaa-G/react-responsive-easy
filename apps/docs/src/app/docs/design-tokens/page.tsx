import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Design Tokens - React Responsive Easy',
  description: 'Integrate with Figma and manage design tokens for consistent, scalable responsive design systems.',
}

export default function DesignTokensPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Design Tokens</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Seamlessly integrate with Figma and manage design tokens for consistent, scalable design systems
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            Design Tokens bridge the gap between design and development by providing a single source of truth
            for design values. React Responsive Easy integrates with Figma to automatically extract design tokens
            and convert them into responsive, scalable CSS variables and JavaScript objects.
          </p>

          <h2>Key Features</h2>
          <ul>
            <li>
              <strong>Figma Integration:</strong> Direct connection to Figma files for token extraction
            </li>
            <li>
              <strong>Automatic Token Generation:</strong> Convert Figma styles to responsive design tokens
            </li>
            <li>
              <strong>Responsive Scaling:</strong> Tokens automatically scale across breakpoints
            </li>
            <li>
              <strong>Type Safety:</strong> Full TypeScript support for all design tokens
            </li>
            <li>
              <strong>Version Control:</strong> Track token changes and maintain design consistency
            </li>
            <li>
              <strong>Multi-format Export:</strong> Generate tokens in CSS, JSON, TypeScript, and more
            </li>
          </ul>

          <h2>Installation</h2>
          <p>
            Install the design tokens package and Figma plugin:
          </p>

          <CodeBlock
            language="bash"
            code={`# Core package with design token support
npm install @react-responsive-easy/core

# Figma plugin for token extraction
npm install @react-responsive-easy/figma-plugin

# CLI for token management
npm install -g @react-responsive-easy/cli`}
          />

          <h2>Figma Plugin Setup</h2>
          <p>
            The Figma plugin allows you to extract design tokens directly from your Figma files:
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
              Figma Plugin Installation
            </h3>
            <ol className="space-y-2 text-yellow-800 dark:text-yellow-200">
              <li>1. Open Figma and go to Plugins → Browse plugins</li>
              <li>2. Search for "React Responsive Easy"</li>
              <li>3. Click "Install" to add the plugin to your Figma account</li>
              <li>4. Open your design file and run the plugin</li>
              <li>5. Select the frames/components you want to extract tokens from</li>
            </ol>
          </div>

          <h2>Token Extraction</h2>
          <p>
            Extract design tokens from your Figma components:
          </p>

          <CodeBlock
            language="tsx"
            code={`// Figma plugin token extraction
const extractedTokens = {
  colors: {
    primary: {
      value: '#3B82F6',
      type: 'color',
      description: 'Primary brand color'
    },
    secondary: {
      value: '#6B7280',
      type: 'color',
      description: 'Secondary text color'
    }
  },
  typography: {
    heading: {
      fontSize: { value: 32, unit: 'px' },
      lineHeight: { value: 1.2, unit: 'em' },
      fontWeight: { value: 700, unit: 'number' }
    },
    body: {
      fontSize: { value: 16, unit: 'px' },
      lineHeight: { value: 1.5, unit: 'em' },
      fontWeight: { value: 400, unit: 'number' }
    }
  },
  spacing: {
    xs: { value: 4, unit: 'px' },
    sm: { value: 8, unit: 'px' },
    md: { value: 16, unit: 'px' },
    lg: { value: 24, unit: 'px' },
    xl: { value: 32, unit: 'px' }
  }
}`}
          />

          <h2>Token Configuration</h2>
          <p>
            Configure how your design tokens should scale across breakpoints:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { createDesignTokenSystem } from '@react-responsive-easy/core'

const tokenSystem = createDesignTokenSystem({
  tokens: extractedTokens,
  scaling: {
    // Linear scaling for typography
    typography: {
      strategy: 'linear',
      baseBreakpoint: 'mobile',
      scaleFactor: 1.2
    },
    
    // Exponential scaling for spacing
    spacing: {
      strategy: 'exponential',
      baseBreakpoint: 'mobile',
      scaleFactor: 1.5
    },
    
    // Custom scaling for colors
    colors: {
      strategy: 'custom',
      baseBreakpoint: 'mobile',
      customScale: (value, breakpoint) => {
        // Custom color scaling logic
        return value
      }
    }
  },
  
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  }
})`}
          />

          <h2>Token Types</h2>
          <p>
            React Responsive Easy supports various token types with automatic scaling:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Color Tokens</h3>
              <p>
                Colors can scale with opacity, brightness, or custom color spaces:
              </p>
              <CodeBlock
                language="tsx"
                code={`// Color token with responsive scaling
const colorTokens = {
  primary: {
    base: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
    // Responsive variants
    responsive: {
      mobile: { opacity: 0.9 },
      tablet: { opacity: 0.95 },
      desktop: { opacity: 1.0 }
    }
  }
}`}
              />
            </div>

            <div>
              <h3>Typography Tokens</h3>
              <p>
                Typography tokens scale font sizes, line heights, and letter spacing:
              </p>
              <CodeBlock
                language="tsx"
                code={`// Typography token with responsive scaling
const typographyTokens = {
  heading: {
    fontSize: {
      mobile: 24,
      tablet: 28,
      desktop: 32,
      wide: 36
    },
    lineHeight: {
      mobile: 1.2,
      tablet: 1.3,
      desktop: 1.4,
      wide: 1.5
    }
  }
}`}
              />
            </div>

            <div>
              <h3>Spacing Tokens</h3>
              <p>
                Spacing tokens provide consistent margins, padding, and gaps:
              </p>
              <CodeBlock
                language="tsx"
                code={`// Spacing token with mathematical scaling
const spacingTokens = {
  base: 8, // Base spacing unit
  scale: 1.5, // Scale factor between sizes
  
  // Generated spacing scale
  xs: 4,    // base / 2
  sm: 8,    // base
  md: 12,   // base * 1.5
  lg: 18,   // base * 2.25
  xl: 27,   // base * 3.375
  xxl: 40   // base * 5
}`}
              />
            </div>

            <div>
              <h3>Layout Tokens</h3>
              <p>
                Layout tokens define grid systems, container widths, and component dimensions:
              </p>
              <CodeBlock
                language="tsx"
                code={`// Layout token with responsive grid
const layoutTokens = {
  container: {
    maxWidth: {
      mobile: '100%',
      tablet: '768px',
      desktop: '1024px',
      wide: '1440px'
    },
    padding: {
      mobile: 16,
      tablet: 24,
      desktop: 32,
      wide: 40
    }
  },
  
  grid: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 4
    },
    gap: {
      mobile: 16,
      tablet: 24,
      desktop: 32,
      wide: 40
    }
  }
}`}
              />
            </div>
          </div>

          <h2>Using Tokens in Components</h2>
          <p>
            Apply design tokens to your React components with automatic responsive scaling:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { useDesignTokens, useResponsiveValue } from '@react-responsive-easy/core'

function TokenBasedComponent() {
  const tokens = useDesignTokens()
  
  // Use tokens directly
  const styles = {
    backgroundColor: tokens.colors.primary.base,
    padding: tokens.spacing.md,
    fontSize: tokens.typography.body.fontSize,
    borderRadius: tokens.spacing.sm
  }
  
  // Or use responsive scaling
  const responsivePadding = useResponsiveValue(tokens.spacing.md, {
    mobile: tokens.spacing.sm,
    tablet: tokens.spacing.md,
    desktop: tokens.spacing.lg
  })
  
  return (
    <div style={{ ...styles, padding: responsivePadding }}>
      <h2 style={{ fontSize: tokens.typography.heading.fontSize }}>
        Token-Based Component
      </h2>
      <p style={{ fontSize: tokens.typography.body.fontSize }}>
        This component uses design tokens for consistent styling
      </p>
    </div>
  )
}`}
          />

          <h2>Token Generation</h2>
          <p>
            Generate tokens in various formats for different use cases:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { generateTokens } from '@react-responsive-easy/core'

// Generate CSS custom properties
const cssTokens = generateTokens(tokenSystem, {
  format: 'css',
  output: 'variables',
  includeResponsive: true
})

// Generate TypeScript types
const tsTokens = generateTokens(tokenSystem, {
  format: 'typescript',
  output: 'types',
  includeResponsive: true
})

// Generate JSON for design tools
const jsonTokens = generateTokens(tokenSystem, {
  format: 'json',
  output: 'flat',
  includeResponsive: false
})

// Generate Tailwind CSS config
const tailwindConfig = generateTokens(tokenSystem, {
  format: 'tailwind',
  output: 'config',
  includeResponsive: true
})`}
          />

          <h2>CLI Token Management</h2>
          <p>
            Use the CLI to manage design tokens from the command line:
          </p>

          <CodeBlock
            language="bash"
            code={`# Extract tokens from Figma
rre tokens extract --figma-file=your-file-id --output=tokens.json

# Generate responsive variants
rre tokens generate --input=tokens.json --output=responsive-tokens.json

# Export to different formats
rre tokens export --input=responsive-tokens.json --format=css --output=tokens.css
rre tokens export --input=responsive-tokens.json --format=typescript --output=tokens.ts
rre tokens export --input=responsive-tokens.json --format=tailwind --output=tailwind.config.js

# Validate token consistency
rre tokens validate --input=responsive-tokens.json

# Sync tokens with Figma
rre tokens sync --figma-file=your-file-id --input=responsive-tokens.json`}
          />

          <h2>Token Versioning</h2>
          <p>
            Track changes and maintain version control for your design tokens:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { TokenVersionControl } from '@react-responsive-easy/core'

const versionControl = new TokenVersionControl({
  repository: './design-tokens',
  autoCommit: true,
  branchStrategy: 'feature-branches'
})

// Create a new token version
await versionControl.createVersion({
  version: '2.0.0',
  description: 'Major redesign with new color system',
  changes: [
    'Added new primary color palette',
    'Updated typography scale',
    'Revised spacing system'
  ]
})

// Compare versions
const diff = await versionControl.compareVersions('1.0.0', '2.0.0')
console.log('Changes:', diff.changes)

// Rollback to previous version
await versionControl.rollback('1.0.0')`}
          />

          <h2>Integration with Design Systems</h2>
          <p>
            Integrate tokens with popular design system tools:
          </p>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Storybook Integration</h3>
              <p className="text-gray-600 mb-4">
                Use tokens in Storybook for consistent component documentation.
              </p>
              <CodeBlock
                language="tsx"
                code={`// .storybook/preview.tsx
import { withDesignTokens } from '@react-responsive-easy/storybook-addon'

export const decorators = [
  withDesignTokens({
    tokens: designTokens,
    theme: 'light'
  })
]`}
              />
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Figma Dev Mode</h3>
              <p className="text-gray-600 mb-4">
                Sync tokens with Figma Dev Mode for seamless handoff.
              </p>
              <CodeBlock
                language="tsx"
                code={`// Sync with Figma Dev Mode
const devModeSync = await syncWithFigmaDevMode({
  fileId: 'your-figma-file-id',
  tokens: designTokens,
  mode: 'dev-mode'
})`}
              />
            </div>
          </div>

          <h2>Best Practices</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Design Token Best Practices
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>• Use semantic naming (e.g., 'primary' not '#3B82F6')</li>
              <li>• Establish a clear token hierarchy and organization</li>
              <li>• Document token usage and purpose</li>
              <li>• Use consistent units and scales across token types</li>
              <li>• Test tokens across all breakpoints and devices</li>
              <li>• Version control tokens alongside your code</li>
              <li>• Automate token extraction and generation</li>
              <li>• Validate token consistency regularly</li>
            </ul>
          </div>

          <h2>Next Steps</h2>
          <p>
            Now that you understand Design Tokens, explore these related topics:
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/ai-optimization">
                <span className="font-semibold">AI Optimization</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Get AI-powered token suggestions
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/storybook">
                <span className="font-semibold">Storybook Addon</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Document tokens in Storybook
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/cli">
                <span className="font-semibold">CLI Commands</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Manage tokens from command line
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/quick-start">
                <span className="font-semibold">Quick Start</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Set up design tokens quickly
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
