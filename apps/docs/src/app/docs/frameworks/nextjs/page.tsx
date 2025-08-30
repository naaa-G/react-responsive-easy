import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Next.js Integration - React Responsive Easy',
  description: 'Learn how to integrate React Responsive Easy with Next.js for server-side rendering and optimal performance.',
}

export default function NextJSGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Next.js Integration</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Seamlessly integrate React Responsive Easy with Next.js for server-side rendering and optimal performance
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            Next.js provides excellent support for React Responsive Easy through its server-side rendering capabilities,
            static generation, and optimized build process. This guide covers everything you need to know about
            integrating responsive design with Next.js applications.
          </p>

          <h2>Installation</h2>
          <p>
            Install React Responsive Easy in your Next.js project:
          </p>

          <CodeBlock
            language="bash"
            code={`# Install core package
npm install @react-responsive-easy/core

# Install Next.js plugin for build optimizations
npm install @react-responsive-easy/next-plugin

# Install additional packages as needed
npm install @react-responsive-easy/performance-dashboard
npm install @react-responsive-easy/ai-optimizer`}
          />

          <h2>Basic Setup</h2>
          <p>
            Set up the ResponsiveProvider in your Next.js app:
          </p>

          <CodeBlock
            language="tsx"
            code={`// app/layout.tsx (App Router)
import { ResponsiveProvider } from '@react-responsive-easy/core'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ResponsiveProvider
          breakpoints={{
            mobile: 320,
            tablet: 768,
            desktop: 1024,
            wide: 1440
          }}
          defaultBreakpoint="mobile"
        >
          {children}
        </ResponsiveProvider>
      </body>
    </html>
  )
}`}
          />

          <h2>Next.js Plugin Configuration</h2>
          <p>
            Configure the Next.js plugin for optimal build performance:
          </p>

          <CodeBlock
            language="javascript"
            code={`// next.config.js
const { withReactResponsiveEasy } = require('@react-responsive-easy/next-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Plugin configuration
  reactResponsiveEasy: {
    // Enable build-time optimizations
    optimize: true,
    // Generate responsive CSS at build time
    generateCSS: true,
    // Optimize bundle size
    treeShake: true,
    // Custom breakpoints
    breakpoints: {
      mobile: 320,
      tablet: 768,
      desktop: 1024,
      wide: 1440
    }
  }
}

module.exports = withReactResponsiveEasy(nextConfig)`}
          />

          <h2>Server-Side Rendering</h2>
          <p>
            React Responsive Easy works seamlessly with Next.js SSR:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Static Generation (SSG)</h3>
              <p>
                Generate responsive pages at build time for optimal performance:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/blog/[slug]/page.tsx
import { useResponsiveValue } from '@react-responsive-easy/core'

export async function generateStaticParams() {
  // Generate static params for all blog posts
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const responsivePadding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24
  })

  return (
    <article style={{ padding: responsivePadding }}>
      <h1>Blog Post Title</h1>
      <p>Content with responsive padding...</p>
    </article>
  )
}`}
              />
            </div>

            <div>
              <h3>Server Components</h3>
              <p>
                Use responsive design in Next.js 13+ server components:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/components/ResponsiveHeader.tsx
import { ResponsiveProvider } from '@react-responsive-easy/core'

// Server Component
export default async function ResponsiveHeader() {
  const user = await getUser()
  
  return (
    <ResponsiveProvider breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
      <ClientHeader user={user} />
    </ResponsiveProvider>
  )
}

// Client Component
'use client'
import { useResponsiveValue } from '@react-responsive-easy/core'

function ClientHeader({ user }: { user: User }) {
  const fontSize = useResponsiveValue(24, {
    mobile: 20,
    tablet: 22,
    desktop: 24
  })

  return (
    <header style={{ fontSize }}>
      <h1>Welcome, {user.name}</h1>
    </header>
  )
}`}
              />
            </div>

            <div>
              <h3>Dynamic Rendering</h3>
              <p>
                Handle dynamic content with responsive design:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/dashboard/page.tsx
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'

export default function DashboardPage() {
  const breakpoint = useBreakpoint()
  const gridColumns = useResponsiveValue(1, {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  })

  return (
    <div className="dashboard">
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: \`repeat(\${gridColumns}, 1fr)\`,
          gap: useResponsiveValue(16, { mobile: 12, tablet: 16, desktop: 24 })
        }}
      >
        {/* Dashboard widgets */}
        <DashboardWidget />
        <DashboardWidget />
        <DashboardWidget />
      </div>
    </div>
  )
}`}
              />
            </div>
          </div>

          <h2>Performance Optimizations</h2>
          <p>
            Next.js-specific performance optimizations for responsive design:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Bundle Optimization</h3>
              <p>
                Optimize bundle size with dynamic imports:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/components/ResponsiveChart.tsx
import dynamic from 'next/dynamic'
import { useResponsiveValue } from '@react-responsive-easy/core'

// Dynamically import heavy chart components
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false // Disable SSR for client-only components
})

export default function ResponsiveChart() {
  const chartHeight = useResponsiveValue(400, {
    mobile: 300,
    tablet: 350,
    desktop: 400
  })

  return (
    <div style={{ height: chartHeight }}>
      <Chart />
    </div>
  )
}`}
              />
            </div>

            <div>
              <h3>Image Optimization</h3>
              <p>
                Use Next.js Image component with responsive sizing:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/components/ResponsiveImage.tsx
import Image from 'next/image'
import { useResponsiveValue } from '@react-responsive-easy/core'

export default function ResponsiveImage({ src, alt }: { src: string; alt: string }) {
  const imageWidth = useResponsiveValue(400, {
    mobile: 300,
    tablet: 350,
    desktop: 400,
    wide: 500
  })

  const imageHeight = useResponsiveValue(300, {
    mobile: 225,
    tablet: 263,
    desktop: 300,
    wide: 375
  })

  return (
    <Image
      src={src}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      className="responsive-image"
      priority={false}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  )
}`}
              />
            </div>

            <div>
              <h3>CSS-in-JS Optimization</h3>
              <p>
                Optimize CSS generation for Next.js:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/components/OptimizedComponent.tsx
import { useScaledStyle } from '@react-responsive-easy/core'
import { memo } from 'react'

const OptimizedComponent = memo(function OptimizedComponent() {
  const styles = useScaledStyle({
    padding: 24,
    margin: 16,
    borderRadius: 8
  }, {
    mobile: {
      padding: 16,
      margin: 12,
      borderRadius: 6
    }
  })

  return (
    <div style={styles}>
      <h2>Optimized Component</h2>
      <p>This component uses memoization and optimized styles</p>
    </div>
  )
})

export default OptimizedComponent`}
              />
            </div>
          </div>

          <h2>API Routes Integration</h2>
          <p>
            Integrate responsive design with Next.js API routes:
          </p>

          <CodeBlock
            language="tsx"
            code={`// app/api/responsive-data/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const breakpoint = searchParams.get('breakpoint') || 'desktop'
  
  // Return different data based on breakpoint
  const responsiveData = {
    mobile: {
      itemsPerPage: 10,
      showSidebar: false,
      compactLayout: true
    },
    tablet: {
      itemsPerPage: 20,
      showSidebar: true,
      compactLayout: false
    },
    desktop: {
      itemsPerPage: 30,
      showSidebar: true,
      compactLayout: false
    }
  }

  return NextResponse.json(responsiveData[breakpoint] || responsiveData.desktop)
}

// app/components/DataFetcher.tsx
'use client'
import { useBreakpoint } from '@react-responsive-easy/core'
import { useEffect, useState } from 'react'

export default function DataFetcher() {
  const breakpoint = useBreakpoint()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(\`/api/responsive-data?breakpoint=\${breakpoint.name}\`)
      .then(res => res.json())
      .then(setData)
  }, [breakpoint.name])

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <p>Items per page: {data.itemsPerPage}</p>
      <p>Show sidebar: {data.showSidebar ? 'Yes' : 'No'}</p>
      <p>Compact layout: {data.compactLayout ? 'Yes' : 'No'}</p>
    </div>
  )
}`}
          />

          <h2>Middleware Integration</h2>
          <p>
            Use Next.js middleware for responsive device detection:
          </p>

          <CodeBlock
            language="typescript"
            code={`// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const viewport = request.headers.get('viewport-width')
  
  // Detect device type
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
  const isTablet = /iPad|Android.*Tablet/.test(userAgent)
  
  // Set responsive headers
  const response = NextResponse.next()
  response.headers.set('x-device-type', isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop')
  
  if (viewport) {
    response.headers.set('x-viewport-width', viewport)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}`}
          />

          <h2>Environment Configuration</h2>
          <p>
            Configure environment variables for different deployment stages:
          </p>

          <CodeBlock
            language="bash"
            code={`# .env.local
NEXT_PUBLIC_RESPONSIVE_DEBUG=true
NEXT_PUBLIC_DEFAULT_BREAKPOINT=mobile
NEXT_PUBLIC_ENABLE_AI_OPTIMIZATION=false

# .env.production
NEXT_PUBLIC_RESPONSIVE_DEBUG=false
NEXT_PUBLIC_DEFAULT_BREAKPOINT=desktop
NEXT_PUBLIC_ENABLE_AI_OPTIMIZATION=true

# .env.development
NEXT_PUBLIC_RESPONSIVE_DEBUG=true
NEXT_PUBLIC_DEFAULT_BREAKPOINT=tablet
NEXT_PUBLIC_ENABLE_AI_OPTIMIZATION=true`}
          />

          <CodeBlock
            language="tsx"
            code={`// lib/config.ts
export const config = {
  responsive: {
    debug: process.env.NEXT_PUBLIC_RESPONSIVE_DEBUG === 'true',
    defaultBreakpoint: process.env.NEXT_PUBLIC_DEFAULT_BREAKPOINT || 'mobile',
    enableAIOptimization: process.env.NEXT_PUBLIC_ENABLE_AI_OPTIMIZATION === 'true'
  }
}

// app/providers.tsx
import { ResponsiveProvider } from '@react-responsive-easy/core'
import { config } from '@/lib/config'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ResponsiveProvider
      breakpoints={{
        mobile: 320,
        tablet: 768,
        desktop: 1024,
        wide: 1440
      }}
      defaultBreakpoint={config.responsive.defaultBreakpoint}
      debug={config.responsive.debug}
      aiOptimization={{
        enabled: config.responsive.enableAIOptimization
      }}
    >
      {children}
    </ResponsiveProvider>
  )
}`}
          />

          <h2>Testing with Next.js</h2>
          <p>
            Set up testing for responsive components in Next.js:
          </p>

          <CodeBlock
            language="tsx"
            code={`// __tests__/ResponsiveComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import ResponsiveComponent from '@/components/ResponsiveComponent'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ResponsiveProvider breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
    {children}
  </ResponsiveProvider>
)

describe('ResponsiveComponent', () => {
  it('renders correctly on mobile', () => {
    // Mock viewport
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
})

// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}

// jest.setup.js
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))`}
          />

          <h2>Deployment Considerations</h2>
          <p>
            Important considerations when deploying responsive Next.js apps:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Build Optimization</h3>
              <p>
                Optimize builds for production deployment:
              </p>
              <CodeBlock
                language="json"
                code={`// package.json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@react-responsive-easy/core": "^1.0.0"
  },
  "devDependencies": {
    "@react-responsive-easy/next-plugin": "^1.0.0"
  }
}`}
              />
            </div>

            <div>
              <h3>Performance Monitoring</h3>
              <p>
                Monitor performance in production:
              </p>
              <CodeBlock
                language="tsx"
                code={`// app/components/PerformanceMonitor.tsx
'use client'
import { usePerformanceMonitor } from '@react-responsive-easy/core'
import { useEffect } from 'react'

export default function PerformanceMonitor() {
  const performance = usePerformanceMonitor()

  useEffect(() => {
    // Send performance data to analytics
    if (performance.performanceScore < 80) {
      console.warn('Performance below threshold:', performance.performanceScore)
      // Send to monitoring service
    }
  }, [performance.performanceScore])

  return null // This component doesn't render anything
}`}
              />
            </div>
          </div>

          <h2>Best Practices</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Next.js Integration Best Practices
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>• Use the Next.js plugin for build optimizations</li>
              <li>• Leverage SSR/SSG for responsive content</li>
              <li>• Implement proper loading states for responsive components</li>
              <li>• Use dynamic imports for heavy responsive components</li>
              <li>• Test responsive behavior across all breakpoints</li>
              <li>• Monitor performance in production environments</li>
              <li>• Use environment variables for configuration</li>
              <li>• Implement proper error boundaries for responsive components</li>
            </ul>
          </div>

          <h2>Next Steps</h2>
          <p>
            Now that you understand Next.js integration, explore these related topics:
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/frameworks/vite">
                <span className="font-semibold">Vite Integration</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Learn Vite integration
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
