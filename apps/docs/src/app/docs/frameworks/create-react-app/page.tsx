import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Create React App Integration - React Responsive Easy',
  description: 'Learn how to integrate React Responsive Easy with Create React App for classic React development workflow.',
}

export default function CreateReactAppGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Create React App Integration</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Integrate React Responsive Easy with Create React App for reliable, battle-tested React development
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            Create React App (CRA) provides a stable, well-tested foundation for React applications. React Responsive Easy
            integrates seamlessly with CRA, offering the same powerful responsive capabilities while maintaining the
            familiar development workflow that developers know and trust.
          </p>

          <h2>Installation</h2>
          <p>
            Install React Responsive Easy in your Create React App project:
          </p>

          <CodeBlock
            language="bash"
            code={`# Install core package
npm install @react-responsive-easy/core

# Install CRA-specific optimizations
npm install @react-responsive-easy/babel-plugin

# Install additional packages as needed
npm install @react-responsive-easy/performance-dashboard
npm install @react-responsive-easy/ai-optimizer`}
          />

          <h2>Basic Setup</h2>
          <p>
            Set up the ResponsiveProvider in your CRA app:
          </p>

          <CodeBlock
            language="tsx"
            code={`// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <ResponsiveProvider
      breakpoints={{
        mobile: 320,
        tablet: 768,
        desktop: 1024,
        wide: 1440
      }}
      defaultBreakpoint="mobile"
    >
      <App />
    </ResponsiveProvider>
  </React.StrictMode>
)`}
          />

          <h2>Babel Plugin Configuration</h2>
          <p>
            Configure the Babel plugin for build-time optimizations:
          </p>

          <CodeBlock
            language="javascript"
            code={`// .babelrc (or babel.config.js)
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@react-responsive-easy/babel-plugin",
    {
      "optimize": true,
      "generateCSS": true,
      "breakpoints": {
        "mobile": 320,
        "tablet": 768,
        "desktop": 1024,
        "wide": 1440
      }
    }
  ]
}

// Or in package.json
{
  "babel": {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    "plugins": [
      "@react-responsive-easy/babel-plugin"
    ]
  }
}`}
          />

          <h2>Ejecting Considerations</h2>
          <p>
            If you need to eject from CRA, configure the build tools manually:
          </p>

          <CodeBlock
            language="javascript"
            code={`// config/webpack.config.js (after ejecting)
const ReactResponsiveEasyPlugin = require('@react-responsive-easy/webpack-plugin')

module.exports = function(webpackEnv) {
  return {
    // ... existing webpack config
    plugins: [
      // ... other plugins
      new ReactResponsiveEasyPlugin({
        optimize: webpackEnv === 'production',
        generateCSS: true,
        breakpoints: {
          mobile: 320,
          tablet: 768,
          desktop: 1024,
          wide: 1440
        }
      })
    ]
  }
}

// config/webpackDevServer.config.js
module.exports = function(proxy, allowedHost) {
  return {
    // ... existing dev server config
    hot: true,
    // Enable responsive debugging in development
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }
}`}
          />

          <h2>Component Development</h2>
          <p>
            Build responsive components with CRA's development workflow:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Responsive Components</h3>
              <p>
                Create responsive components using React Responsive Easy hooks:
              </p>
              <CodeBlock
                language="tsx"
                code={`// src/components/ResponsiveHeader.tsx
import React from 'react'
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'

interface ResponsiveHeaderProps {
  title: string
  subtitle?: string
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ title, subtitle }) => {
  const breakpoint = useBreakpoint()
  
  const fontSize = useResponsiveValue(32, {
    mobile: 24,
    tablet: 28,
    desktop: 32,
    wide: 36
  })

  const padding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24,
    wide: 32
  })

  const marginBottom = useResponsiveValue(16, {
    mobile: 12,
    tablet: 14,
    desktop: 16,
    wide: 20
  })

  return (
    <header
      style={{
        fontSize,
        padding,
        marginBottom,
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <h1 style={{ margin: 0, color: '#1e293b' }}>{title}</h1>
      {subtitle && (
        <p 
          style={{ 
            margin: '8px 0 0 0', 
            color: '#64748b',
            fontSize: fontSize * 0.6
          }}
        >
          {subtitle}
        </p>
      )}
      <div style={{ fontSize: '14px', color: '#94a3b8' }}>
        Current breakpoint: {breakpoint.name} ({breakpoint.width}px)
      </div>
    </header>
  )
}

export default ResponsiveHeader`}
              />
            </div>

            <div>
              <h3>Responsive Layouts</h3>
              <p>
                Build responsive layouts with CSS Grid and Flexbox:
              </p>
              <CodeBlock
                language="tsx"
                code={`// src/components/ResponsiveGrid.tsx
import React from 'react'
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'

interface GridItem {
  id: string
  title: string
  content: string
}

interface ResponsiveGridProps {
  items: GridItem[]
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ items }) => {
  const breakpoint = useBreakpoint()
  
  const columns = useResponsiveValue(1, {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  })

  const gap = useResponsiveValue(16, {
    mobile: 12,
    tablet: 16,
    desktop: 24,
    wide: 32
  })

  const itemPadding = useResponsiveValue(20, {
    mobile: 16,
    tablet: 18,
    desktop: 20,
    wide: 24
  })

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
        gap: \`\${gap}px\`,
        padding: \`\${gap}px\`
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            padding: \`\${itemPadding}px\`,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
            {item.title}
          </h3>
          <p style={{ margin: 0, color: '#64748b' }}>
            {item.content}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ResponsiveGrid`}
              />
            </div>

            <div>
              <h3>Responsive Forms</h3>
              <p>
                Create responsive forms that adapt to different screen sizes:
              </p>
              <CodeBlock
                language="tsx"
                code={`// src/components/ResponsiveForm.tsx
import React, { useState } from 'react'
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'

interface FormData {
  name: string
  email: string
  message: string
}

const ResponsiveForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })

  const breakpoint = useBreakpoint()
  
  const formWidth = useResponsiveValue('100%', {
    mobile: '100%',
    tablet: '80%',
    desktop: '60%',
    wide: '50%'
  })

  const inputPadding = useResponsiveValue(12, {
    mobile: 10,
    tablet: 11,
    desktop: 12,
    wide: 14
  })

  const labelFontSize = useResponsiveValue(14, {
    mobile: 13,
    tablet: 13.5,
    desktop: 14,
    wide: 15
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: formWidth,
        margin: '0 auto',
        padding: '24px'
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: labelFontSize,
            fontWeight: '500',
            color: '#374151'
          }}
        >
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          style={{
            width: '100%',
            padding: \`\${inputPadding}px\`,
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '16px'
          }}
          required
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: labelFontSize,
            fontWeight: '500',
            color: '#374151'
          }}
        >
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          style={{
            width: '100%',
            padding: \`\${inputPadding}px\`,
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '16px'
          }}
          required
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: labelFontSize,
            fontWeight: '500',
            color: '#374151'
          }}
        >
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: \`\${inputPadding}px\`,
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '16px',
            resize: 'vertical'
          }}
          required
        />
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: \`\${inputPadding}px 24px\`,
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          width: breakpoint.name === 'mobile' ? '100%' : 'auto'
        }}
      >
        Submit
      </button>
    </form>
  )
}

export default ResponsiveForm`}
              />
            </div>
          </div>

          <h2>CSS Integration</h2>
          <p>
            Integrate responsive design with CRA's CSS system:
          </p>

          <div className="space-y-6">
            <div>
              <h3>CSS Modules</h3>
              <p>
                Use CSS modules with responsive design:
              </p>
              <CodeBlock
                language="css"
                code={`/* src/components/ResponsiveCard.module.css */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.title {
  margin: 0 0 12px 0;
  color: #1e293b;
}

.content {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}

/* Responsive variants */
@media (max-width: 767px) {
  .card {
    padding: 16px;
  }
  
  .title {
    font-size: 18px;
  }
  
  .content {
    font-size: 14px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .card {
    padding: 20px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .content {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .card {
    padding: 24px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .content {
    font-size: 16px;
  }
}`}
              />

              <CodeBlock
                language="tsx"
                code={`// src/components/ResponsiveCard.tsx
import React from 'react'
import { useResponsiveValue } from '@react-responsive-easy/core'
import styles from './ResponsiveCard.module.css'

interface ResponsiveCardProps {
  title: string
  content: string
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ title, content }) => {
  const padding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24
  })

  return (
    <div 
      className={styles.card}
      style={{ padding }}
    >
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.content}>{content}</p>
    </div>
  )
}

export default ResponsiveCard`}
              />
            </div>

            <div>
              <h3>Styled Components</h3>
              <p>
                Use styled-components with responsive design:
              </p>
              <CodeBlock
                language="tsx"
                code={`// src/components/StyledResponsiveCard.tsx
import React from 'react'
import styled from 'styled-components'
import { useResponsiveValue } from '@react-responsive-easy/core'

interface StyledCardProps {
  $padding: number
}

const StyledCard = styled.div<StyledCardProps>\`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: \${props => props.$padding}px;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
\`

const StyledTitle = styled.h3\`
  margin: 0 0 12px 0;
  color: #1e293b;
  font-size: \${props => props.theme.fontSize}px;
\`

const StyledContent = styled.p\`
  margin: 0;
  color: #64748b;
  line-height: 1.5;
  font-size: \${props => props.theme.contentFontSize}px;
\`

interface StyledResponsiveCardProps {
  title: string
  content: string
}

const StyledResponsiveCard: React.FC<StyledResponsiveCardProps> = ({ 
  title, 
  content 
}) => {
  const padding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24
  })

  const fontSize = useResponsiveValue(22, {
    mobile: 18,
    tablet: 20,
    desktop: 22
  })

  const contentFontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 15,
    desktop: 16
  })

  const theme = {
    fontSize,
    contentFontSize
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledCard $padding={padding}>
        <StyledTitle>{title}</StyledTitle>
        <StyledContent>{content}</StyledContent>
      </StyledCard>
    </ThemeProvider>
  )
}

export default StyledResponsiveCard`}
              />
            </div>
          </div>

          <h2>Performance Optimization</h2>
          <p>
            Optimize performance in CRA applications:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Code Splitting</h3>
              <p>
                Implement code splitting for responsive components:
              </p>
              <CodeBlock
                language="tsx"
                code={`// src/components/LazyResponsiveComponent.tsx
import React, { Suspense, lazy } from 'react'
import { useResponsiveValue } from '@react-responsive-easy/core'

// Lazy load heavy responsive components
const ResponsiveChart = lazy(() => import('./ResponsiveChart'))
const ResponsiveDataTable = lazy(() => import('./ResponsiveDataTable'))

const LazyResponsiveComponent: React.FC = () => {
  const showChart = useResponsiveValue(false, {
    mobile: false,
    tablet: true,
    desktop: true
  })

  const showDataTable = useResponsiveValue(false, {
    mobile: false,
    tablet: false,
    desktop: true
  })

  return (
    <div>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <ResponsiveChart />
        </Suspense>
      )}
      
      {showDataTable && (
        <Suspense fallback={<div>Loading data table...</div>}>
          <ResponsiveDataTable />
        </Suspense>
      )}
    </div>
  )
}

export default LazyResponsiveComponent`}
              />
            </div>

            <div>
              <h3>Memoization</h3>
              <p>
                Use React.memo and useMemo for performance:
              </p>
              <CodeBlock
                language="tsx"
                code={`// src/components/OptimizedResponsiveGrid.tsx
import React, { useMemo, memo } from 'react'
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'

interface GridItem {
  id: string
  title: string
  content: string
}

interface OptimizedResponsiveGridProps {
  items: GridItem[]
}

const OptimizedResponsiveGrid: React.FC<OptimizedResponsiveGridProps> = memo(({ items }) => {
  const breakpoint = useBreakpoint()
  
  const columns = useResponsiveValue(1, {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  })

  const gap = useResponsiveValue(16, {
    mobile: 12,
    tablet: 16,
    desktop: 24,
    wide: 32
  })

  // Memoize grid styles to prevent unnecessary recalculations
  const gridStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
    gap: \`\${gap}px\`,
    padding: \`\${gap}px\`
  }), [columns, gap])

  // Memoize item styles
  const itemStyles = useMemo(() => ({
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  }), [])

  return (
    <div style={gridStyles}>
      {items.map((item) => (
        <div key={item.id} style={itemStyles}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
            {item.title}
          </h3>
          <p style={{ margin: 0, color: '#64748b' }}>
            {item.content}
          </p>
        </div>
      ))}
    </div>
  )
})

OptimizedResponsiveGrid.displayName = 'OptimizedResponsiveGrid'

export default OptimizedResponsiveGrid`}
              />
            </div>
          </div>

          <h2>Testing Setup</h2>
          <p>
            Set up testing for responsive components in CRA:
          </p>

          <CodeBlock
            language="typescript"
            code={`// src/setupTests.ts
import '@testing-library/jest-dom'

// Mock window resize events
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// src/components/__tests__/ResponsiveComponent.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import ResponsiveComponent from '../ResponsiveComponent'

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ResponsiveProvider breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
    {children}
  </ResponsiveProvider>
)

describe('ResponsiveComponent', () => {
  it('renders correctly on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    })

    render(
      <TestWrapper>
        <ResponsiveComponent />
      </TestWrapper>
    )

    expect(screen.getByText('Mobile Layout')).toBeInTheDocument()
  })

  it('renders correctly on desktop', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })

    render(
      <TestWrapper>
        <ResponsiveComponent />
      </TestWrapper>
    )

    expect(screen.getByText('Desktop Layout')).toBeInTheDocument()
  })
})

// package.json scripts
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`}
          />

          <h2>Environment Configuration</h2>
          <p>
            Configure environment variables for different deployment stages:
          </p>

          <CodeBlock
            language="bash"
            code={`# .env
REACT_APP_RESPONSIVE_DEBUG=true
REACT_APP_DEFAULT_BREAKPOINT=mobile
REACT_APP_ENABLE_AI_OPTIMIZATION=false

# .env.development
REACT_APP_RESPONSIVE_DEBUG=true
REACT_APP_DEFAULT_BREAKPOINT=tablet
REACT_APP_ENABLE_AI_OPTIMIZATION=true

# .env.production
REACT_APP_RESPONSIVE_DEBUG=false
REACT_APP_DEFAULT_BREAKPOINT=desktop
REACT_APP_ENABLE_AI_OPTIMIZATION=true`}
          />

          <CodeBlock
            language="tsx"
            code={`// src/config/responsive.ts
export const responsiveConfig = {
  debug: process.env.REACT_APP_RESPONSIVE_DEBUG === 'true',
  defaultBreakpoint: process.env.REACT_APP_DEFAULT_BREAKPOINT || 'mobile',
  enableAIOptimization: process.env.REACT_APP_ENABLE_AI_OPTIMIZATION === 'true'
}

// src/index.tsx
import { ResponsiveProvider } from '@react-responsive-easy/core'
import { responsiveConfig } from './config/responsive'

ReactDOM.render(
  <React.StrictMode>
    <ResponsiveProvider
      breakpoints={{
        mobile: 320,
        tablet: 768,
        desktop: 1024,
        wide: 1440
      }}
      defaultBreakpoint={responsiveConfig.defaultBreakpoint}
      debug={responsiveConfig.debug}
      aiOptimization={{
        enabled: responsiveConfig.enableAIOptimization
      }}
    >
      <App />
    </ResponsiveProvider>
  </React.StrictMode>,
  document.getElementById('root')
)`}
          />

          <h2>Build Optimization</h2>
          <p>
            Optimize builds for production deployment:
          </p>

          <CodeBlock
            language="json"
            code={`// package.json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "build:analyze": "ANALYZE=true react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "@react-responsive-easy/core": "^1.0.0"
  },
  "devDependencies": {
    "@react-responsive-easy/babel-plugin": "^1.0.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

// .env.production
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false`}
          />

          <h2>Best Practices</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Create React App Integration Best Practices
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>• Use the Babel plugin for build optimizations</li>
              <li>• Leverage CSS modules or styled-components for styling</li>
              <li>• Implement proper code splitting for heavy components</li>
              <li>• Use React.memo and useMemo for performance</li>
              <li>• Test responsive behavior across all breakpoints</li>
              <li>• Configure environment variables for different modes</li>
              <li>• Use lazy loading for responsive components</li>
              <li>• Optimize bundle size with proper imports</li>
            </ul>
          </div>

          <h2>Next Steps</h2>
          <p>
            Now that you understand Create React App integration, explore these related topics:
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/frameworks/remix">
                <span className="font-semibold">Remix Integration</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Learn Remix integration
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/plugins">
                <span className="font-semibold">Build Plugins</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Configure build optimizations
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/performance">
                <span className="font-semibold">Performance</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Optimize performance
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/quick-start">
                <span className="font-semibold">Quick Start</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Get started quickly
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
