import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Vite Integration - React Responsive Easy',
  description: 'Learn how to integrate React Responsive Easy with Vite for modern build tooling and optimal development experience.',
}

export default function ViteGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Vite Integration</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Leverage Vite's lightning-fast build tooling with React Responsive Easy for optimal development experience
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            Vite provides exceptional performance for React Responsive Easy through its native ES modules support,
            instant hot module replacement (HMR), and optimized build process. This guide covers everything you need
            to know about integrating responsive design with Vite-powered React applications.
          </p>

          <h2>Installation</h2>
          <p>
            Install React Responsive Easy in your Vite project:
          </p>

          <CodeBlock
            language="bash"
            code={`# Install core package
npm install @react-responsive-easy/core

# Install Vite plugin for build optimizations
npm install @react-responsive-easy/vite-plugin

# Install additional packages as needed
npm install @react-responsive-easy/performance-dashboard
npm install @react-responsive-easy/ai-optimizer`}
          />

          <h2>Basic Setup</h2>
          <p>
            Set up the ResponsiveProvider in your Vite app:
          </p>

          <CodeBlock
            language="tsx"
            code={`// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
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

          <h2>Vite Plugin Configuration</h2>
          <p>
            Configure the Vite plugin for optimal build performance:
          </p>

          <CodeBlock
            language="typescript"
            code={`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactResponsiveEasy } from '@react-responsive-easy/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
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
      },
      // Enable HMR for responsive components
      enableHMR: true,
      // CSS extraction options
      cssExtraction: {
        enabled: true,
        filename: 'responsive-[hash].css'
      }
    })
  ],
  // Vite-specific optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-responsive': ['@react-responsive-easy/core']
        }
      }
    }
  }
})`}
          />

          <h2>Development Experience</h2>
          <p>
            Vite provides excellent development experience for responsive design:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Hot Module Replacement (HMR)</h3>
              <p>
                Instant updates when modifying responsive components:
              </p>
              <CodeBlock
                language="tsx"
                code={`// src/components/ResponsiveCard.tsx
import { useResponsiveValue } from '@react-responsive-easy/core'

export default function ResponsiveCard() {
  const padding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24
  })

  const fontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 15,
    desktop: 16
  })

  return (
    <div 
      style={{ 
        padding, 
        fontSize,
        border: '1px solid #e5e7eb',
        borderRadius: 8
      }}
    >
      <h3>Responsive Card</h3>
      <p>This card adapts to different screen sizes</p>
    </div>
  )
}

// Changes to this component will update instantly in the browser
// thanks to Vite's HMR and the responsive plugin`}
              />
            </div>

            <div>
              <h3>Fast Refresh</h3>
              <p>
                Maintain component state during responsive updates:
              </p>
              <CodeBlock
                language="tsx"
                code={`// src/components/ResponsiveForm.tsx
import { useState } from 'react'
import { useResponsiveValue, useBreakpoint } from '@react-responsive-easy/core'

export default function ResponsiveForm() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const breakpoint = useBreakpoint()
  
  const formWidth = useResponsiveValue('100%', {
    mobile: '100%',
    tablet: '80%',
    desktop: '60%'
  })

  const inputPadding = useResponsiveValue(12, {
    mobile: 8,
    tablet: 10,
    desktop: 12
  })

  return (
    <form style={{ width: formWidth, margin: '0 auto' }}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        style={{ padding: inputPadding, width: '100%' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        style={{ padding: inputPadding, width: '100%' }}
      />
      <button type="submit">Submit</button>
    </form>
  )
}`}
              />
            </div>

            <div>
              <h3>Environment Variables</h3>
              <p>
                Use Vite's environment variable system for responsive configuration:
              </p>
              <CodeBlock
                language="bash"
                code={`# .env
VITE_RESPONSIVE_DEBUG=true
VITE_DEFAULT_BREAKPOINT=mobile
VITE_ENABLE_AI_OPTIMIZATION=false

# .env.development
VITE_RESPONSIVE_DEBUG=true
VITE_DEFAULT_BREAKPOINT=tablet
VITE_ENABLE_AI_OPTIMIZATION=true

# .env.production
VITE_RESPONSIVE_DEBUG=false
VITE_DEFAULT_BREAKPOINT=desktop
VITE_ENABLE_AI_OPTIMIZATION=true`}
              />

              <CodeBlock
                language="tsx"
                code={`// src/config/responsive.ts
export const responsiveConfig = {
  debug: import.meta.env.VITE_RESPONSIVE_DEBUG === 'true',
  defaultBreakpoint: import.meta.env.VITE_DEFAULT_BREAKPOINT || 'mobile',
  enableAIOptimization: import.meta.env.VITE_ENABLE_AI_OPTIMIZATION === 'true'
}

// src/main.tsx
import { ResponsiveProvider } from '@react-responsive-easy/core'
import { responsiveConfig } from './config/responsive'

ReactDOM.createRoot(document.getElementById('root')!).render(
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
  </React.StrictMode>
)`}
              />
            </div>
          </div>

          <h2>Build Optimizations</h2>
          <p>
            Vite-specific build optimizations for responsive design:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Bundle Splitting</h3>
              <p>
                Optimize bundle size with intelligent code splitting:
              </p>
              <CodeBlock
                language="typescript"
                code={`// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate responsive utilities
          'responsive-core': ['@react-responsive-easy/core'],
          'responsive-hooks': [
            '@react-responsive-easy/core/useResponsiveValue',
            '@react-responsive-easy/core/useBreakpoint'
          ],
          'responsive-utils': [
            '@react-responsive-easy/core/useScaledStyle',
            '@react-responsive-easy/core/usePerformanceMonitor'
          ]
        }
      }
    },
    // Optimize CSS extraction
    cssCodeSplit: true,
    // Enable source maps for debugging
    sourcemap: true
  }
})`}
              />
            </div>

            <div>
              <h3>CSS Optimization</h3>
              <p>
                Optimize CSS generation and extraction:
              </p>
              <CodeBlock
                language="typescript"
                code={`// vite.config.ts
import { reactResponsiveEasy } from '@react-responsive-easy/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
      cssExtraction: {
        enabled: true,
        filename: 'responsive-[hash].css',
        // Extract only used responsive styles
        purgeUnused: true,
        // Minify CSS in production
        minify: true,
        // Generate source maps
        sourcemap: true
      }
    })
  ],
  css: {
    // PostCSS processing
    postcss: {
      plugins: [
        // Autoprefixer for cross-browser compatibility
        require('autoprefixer'),
        // CSS custom properties polyfill
        require('postcss-custom-properties')
      ]
    }
  }
})`}
              />
            </div>

            <div>
              <h3>Tree Shaking</h3>
              <p>
                Remove unused responsive code from production builds:
              </p>
              <CodeBlock
                language="typescript"
                code={`// vite.config.ts
export default defineConfig({
  build: {
    // Enable tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove unused code
        drop_console: true,
        drop_debugger: true,
        // Remove unused functions
        pure_funcs: ['console.log', 'console.info']
      }
    }
  },
  // Plugin configuration for tree shaking
  plugins: [
    react(),
    reactResponsiveEasy({
      treeShake: true,
      // Remove unused breakpoints
      removeUnusedBreakpoints: true,
      // Remove unused responsive utilities
      removeUnusedUtilities: true
    })
  ]
})`}
              />
            </div>
          </div>

          <h2>Development Tools</h2>
          <p>
            Vite provides excellent development tools for responsive design:
          </p>

          <div className="space-y-6">
            <div>
              <h3>Dev Server Configuration</h3>
              <p>
                Configure the development server for responsive testing:
              </p>
              <CodeBlock
                language="typescript"
                code={`// vite.config.ts
export default defineConfig({
  server: {
    // Enable HTTPS for device testing
    https: false,
    // Configure host for mobile device testing
    host: '0.0.0.0',
    // Custom port
    port: 3000,
    // Enable CORS for cross-device testing
    cors: true,
    // Proxy configuration for API calls
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  // Preview configuration for production testing
  preview: {
    port: 4173,
    host: true,
    open: true
  }
})`}
              />
            </div>

            <div>
              <h3>Hot Module Replacement</h3>
              <p>
                Configure HMR for responsive components:
              </p>
              <CodeBlock
                language="typescript"
                code={`// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
      enableHMR: true,
      hmrOptions: {
        // Preserve responsive state during updates
        preserveState: true,
        // Custom HMR handling for responsive components
        customHMR: (id, callback) => {
          // Handle responsive component updates
          if (id.includes('Responsive')) {
            callback()
          }
        }
      }
    })
  ]
})`}
              />
            </div>
          </div>

          <h2>Performance Monitoring</h2>
          <p>
            Monitor responsive performance in Vite development:
          </p>

          <CodeBlock
            language="tsx"
            code={`// src/components/PerformanceMonitor.tsx
import { usePerformanceMonitor } from '@react-responsive-easy/core'
import { useEffect } from 'react'

export default function PerformanceMonitor() {
  const performance = usePerformanceMonitor()

  useEffect(() => {
    // Log performance metrics in development
    if (import.meta.env.DEV) {
      console.log('Responsive Performance:', {
        score: performance.performanceScore,
        renderTime: performance.renderTime,
        scalingOperations: performance.scalingOperations
      })
    }

    // Send to analytics in production
    if (import.meta.env.PROD) {
      // Send performance data to monitoring service
      sendToAnalytics(performance)
    }
  }, [performance])

  return null
}

// src/components/ResponsiveGrid.tsx
import { useResponsiveValue, usePerformanceMonitor } from '@react-responsive-easy/core'
import { memo } from 'react'

const ResponsiveGrid = memo(function ResponsiveGrid() {
  const performance = usePerformanceMonitor()
  const columns = useResponsiveValue(1, {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  })

  const gap = useResponsiveValue(16, {
    mobile: 12,
    tablet: 16,
    desktop: 24
  })

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
        gap,
        padding: 16
      }}
    >
      {/* Grid items */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid-item">
          Item {i + 1}
        </div>
      ))}
      
      {/* Performance indicator in development */}
      {import.meta.env.DEV && (
        <div className="performance-indicator">
          Score: {performance.performanceScore}
        </div>
      )}
    </div>
  )
})

export default ResponsiveGrid`}
          />

          <h2>Testing Configuration</h2>
          <p>
            Set up testing for responsive components in Vite:
          </p>

          <CodeBlock
            language="typescript"
            code={`// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { reactResponsiveEasy } from '@react-responsive-easy/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
      // Enable testing mode
      testing: true,
      // Mock breakpoints for tests
      testBreakpoints: {
        mobile: 375,
        tablet: 768,
        desktop: 1024
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  }
})

// src/test/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window resize events
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// src/components/__tests__/ResponsiveComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import ResponsiveComponent from '../ResponsiveComponent'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
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
})`}
          />

          <h2>Production Build</h2>
          <p>
            Optimize production builds for responsive applications:
          </p>

          <CodeBlock
            language="typescript"
            code={`// vite.config.ts
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react(),
      reactResponsiveEasy({
        optimize: isProduction,
        generateCSS: isProduction,
        treeShake: isProduction,
        cssExtraction: {
          enabled: isProduction,
          minify: isProduction,
          sourcemap: !isProduction
        }
      })
    ],
    build: {
      // Production optimizations
      minify: isProduction ? 'terser' : false,
      sourcemap: !isProduction,
      // Bundle analysis
      rollupOptions: {
        output: {
          manualChunks: isProduction ? {
            'react-responsive': ['@react-responsive-easy/core'],
            'vendor': ['react', 'react-dom']
          } : undefined
        }
      }
    }
  }
})

// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:analyze": "tsc && vite build --mode analyze",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}`}
          />

          <h2>Advanced Features</h2>
          <p>
            Advanced Vite features for responsive development:
          </p>

          <div className="space-y-6">
            <div>
              <h3>CSS Modules</h3>
              <p>
                Use CSS modules with responsive design:
              </p>
              <CodeBlock
                language="typescript"
                code={`// vite.config.ts
export default defineConfig({
  css: {
    modules: {
      // Enable CSS modules
      localsConvention: 'camelCase',
      // Generate scoped class names
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
})

// src/components/ResponsiveCard.module.css
.card {
  padding: var(--responsive-padding);
  font-size: var(--responsive-font-size);
}

// src/components/ResponsiveCard.tsx
import { useResponsiveValue } from '@react-responsive-easy/core'
import styles from './ResponsiveCard.module.css'

export default function ResponsiveCard() {
  const padding = useResponsiveValue(24, {
    mobile: 16,
    tablet: 20,
    desktop: 24
  })

  const fontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 15,
    desktop: 16
  })

  return (
    <div 
      className={styles.card}
      style={{
        '--responsive-padding': \`\${padding}px\`,
        '--responsive-font-size': \`\${fontSize}px\`
      } as React.CSSProperties}
    >
      <h3>Responsive Card</h3>
      <p>Using CSS modules with responsive values</p>
    </div>
  )
}`}
              />
            </div>

            <div>
              <h3>Asset Optimization</h3>
              <p>
                Optimize assets for responsive applications:
              </p>
              <CodeBlock
                language="typescript"
                code={`// vite.config.ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 4kb
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return \`images/[name]-[hash][extname]\`
          }
          return \`assets/[name]-[hash][extname]\`
        }
      }
    }
  }
})

// src/components/ResponsiveImage.tsx
import { useResponsiveValue } from '@react-responsive-easy/core'

export default function ResponsiveImage({ src, alt }: { src: string; alt: string }) {
  const imageWidth = useResponsiveValue(400, {
    mobile: 300,
    tablet: 350,
    desktop: 400,
    wide: 500
  })

  return (
    <img
      src={src}
      alt={alt}
      width={imageWidth}
      height={imageWidth * 0.75}
      loading="lazy"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}`}
              />
            </div>
          </div>

          <h2>Best Practices</h2>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Vite Integration Best Practices
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li>• Use the Vite plugin for build optimizations</li>
              <li>• Leverage HMR for responsive component development</li>
              <li>• Configure proper bundle splitting for responsive utilities</li>
              <li>• Use CSS extraction for production builds</li>
              <li>• Enable tree shaking to remove unused code</li>
              <li>• Configure environment variables for different modes</li>
              <li>• Use CSS modules with responsive design</li>
              <li>• Optimize assets for responsive applications</li>
            </ul>
          </div>

          <h2>Next Steps</h2>
          <p>
            Now that you understand Vite integration, explore these related topics:
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/frameworks/create-react-app">
                <span className="font-semibold">Create React App</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Learn CRA integration
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
