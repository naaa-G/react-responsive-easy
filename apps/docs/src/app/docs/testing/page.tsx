import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Testing - React Responsive Easy',
  description: 'Comprehensive testing strategies for responsive design including E2E testing, visual regression testing, and performance testing.',
}

export default function TestingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Testing</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Comprehensive testing strategies for responsive design systems
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            Testing responsive design requires a multi-faceted approach that covers functionality,
            visual consistency, performance, and user experience across all breakpoints and devices.
            React Responsive Easy provides comprehensive testing tools and strategies to ensure
            your responsive components work flawlessly in production.
          </p>

          <h2>Testing Strategy</h2>
          <ul>
            <li>
              <strong>Unit Testing:</strong> Test individual hooks and utility functions
            </li>
            <li>
              <strong>Component Testing:</strong> Test components across different breakpoints
            </li>
            <li>
              <strong>Visual Regression Testing:</strong> Ensure visual consistency across devices
            </li>
            <li>
              <strong>E2E Testing:</strong> Test complete user flows on real devices
            </li>
            <li>
              <strong>Performance Testing:</strong> Validate responsive scaling performance
            </li>
            <li>
              <strong>Accessibility Testing:</strong> Ensure responsive design maintains accessibility
            </li>
          </ul>

          <h2>Installation</h2>
          <p>
            Install testing dependencies for comprehensive responsive testing:
          </p>

          <CodeBlock
            language="bash"
            code={`# Core testing utilities
npm install @react-responsive-easy/testing

# Visual regression testing
npm install @react-responsive-easy/visual-testing

# E2E testing with Playwright
npm install @playwright/test

# Performance testing
npm install @react-responsive-easy/performance-testing

# Accessibility testing
npm install @axe-core/react`}
          />

          <h2>Unit Testing</h2>
          <p>
            Test individual hooks and utility functions with Jest and React Testing Library:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { renderHook, act } from '@testing-library/react'
import { useResponsiveValue, ResponsiveProvider } from '@react-responsive-easy/core'
import { createResponsiveTestEnvironment } from '@react-responsive-easy/testing'

describe('useResponsiveValue', () => {
  const TestWrapper = ({ children, breakpoints }) => (
    <ResponsiveProvider breakpoints={breakpoints}>
      {children}
    </ResponsiveProvider>
  )

  it('should return correct value for mobile breakpoint', () => {
    const { result } = renderHook(
      () => useResponsiveValue(16, { mobile: 14, tablet: 16, desktop: 18 }),
      {
        wrapper: ({ children }) => (
          <TestWrapper breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
            {children}
          </TestWrapper>
        )
      }
    )

    // Mock viewport to mobile size
    act(() => {
      window.innerWidth = 375
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current).toBe(14)
  })

  it('should handle custom scaling functions', () => {
    const customScale = (baseValue, ratio) => baseValue * Math.pow(1.2, ratio)
    
    const { result } = renderHook(
      () => useResponsiveValue(16, customScale),
      {
        wrapper: ({ children }) => (
          <TestWrapper breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
            {children}
          </TestWrapper>
        )
      }
    )

    expect(result.current).toBeGreaterThan(16)
  })
})`}
          />

          <h2>Component Testing</h2>
          <p>
            Test components across different breakpoints and responsive states:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { render, screen } from '@testing-library/react'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import { createResponsiveTestEnvironment } from '@react-responsive-easy/testing'
import { ResponsiveComponent } from './ResponsiveComponent'

describe('ResponsiveComponent', () => {
  const testEnvironment = createResponsiveTestEnvironment({
    breakpoints: {
      mobile: 320,
      tablet: 768,
      desktop: 1024
    }
  })

  it('should render correctly on mobile', async () => {
    await testEnvironment.setViewport('mobile')
    
    render(
      <ResponsiveProvider breakpoints={testEnvironment.breakpoints}>
        <ResponsiveComponent />
      </ResponsiveProvider>
    )

    expect(screen.getByText('Mobile Layout')).toBeInTheDocument()
    expect(screen.queryByText('Desktop Layout')).not.toBeInTheDocument()
  })

  it('should render correctly on tablet', async () => {
    await testEnvironment.setViewport('tablet')
    
    render(
      <ResponsiveProvider breakpoints={testEnvironment.breakpoints}>
        <ResponsiveComponent />
      </ResponsiveProvider>
    )

    expect(screen.getByText('Tablet Layout')).toBeInTheDocument()
  })

  it('should handle responsive style changes', async () => {
    const { rerender } = render(
      <ResponsiveProvider breakpoints={testEnvironment.breakpoints}>
        <ResponsiveComponent />
      </ResponsiveProvider>
    )

    // Test mobile styles
    await testEnvironment.setViewport('mobile')
    rerender(
      <ResponsiveProvider breakpoints={testEnvironment.breakpoints}>
        <ResponsiveComponent />
      </ResponsiveProvider>
    )

    const component = screen.getByTestId('responsive-component')
    expect(component).toHaveStyle({ fontSize: '14px' })

    // Test desktop styles
    await testEnvironment.setViewport('desktop')
    rerender(
      <ResponsiveProvider breakpoints={testEnvironment.breakpoints}>
        <ResponsiveComponent />
      </ResponsiveProvider>
    )

    expect(component).toHaveStyle({ fontSize: '18px' })
  })
})`}
          />

          <h2>Visual Regression Testing</h2>
          <p>
            Ensure visual consistency across all breakpoints with automated visual testing:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { createVisualTestSuite } from '@react-responsive-easy/visual-testing'
import { ResponsiveComponent } from './ResponsiveComponent'

describe('ResponsiveComponent Visual Tests', () => {
  const visualTestSuite = createVisualTestSuite({
    component: ResponsiveComponent,
    breakpoints: ['mobile', 'tablet', 'desktop', 'wide'],
    viewports: {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1024, height: 768 },
      wide: { width: 1440, height: 900 }
    },
    threshold: 0.98, // 98% similarity required
    outputDir: './visual-test-results'
  })

  it('should maintain visual consistency across breakpoints', async () => {
    const results = await visualTestSuite.runVisualTests({
      scenarios: [
        { name: 'default-state', props: {} },
        { name: 'with-content', props: { content: 'Test content' } },
        { name: 'interactive-state', props: { isInteractive: true } }
      ]
    })

    results.forEach(result => {
      expect(result.similarity).toBeGreaterThan(0.98)
      expect(result.differences).toHaveLength(0)
    })
  })

  it('should handle responsive layout changes', async () => {
    const layoutTest = await visualTestSuite.testResponsiveLayout({
      component: ResponsiveComponent,
      breakpoints: ['mobile', 'tablet', 'desktop'],
      testCases: [
        { name: 'single-column', props: { layout: 'single' } },
        { name: 'two-column', props: { layout: 'two-column' } },
        { name: 'grid-layout', props: { layout: 'grid' } }
      ]
    })

    expect(layoutTest.passed).toBe(true)
    expect(layoutTest.breakpointTests).toHaveLength(3)
  })
})`}
          />

          <h2>E2E Testing</h2>
          <p>
            Test complete user flows across different devices and breakpoints:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { test, expect } from '@playwright/test'
import { createResponsiveE2ETest } from '@react-responsive-easy/testing'

test.describe('Responsive E2E Tests', () => {
  const responsiveTest = createResponsiveE2ETest({
    baseURL: 'http://localhost:3000',
    breakpoints: ['mobile', 'tablet', 'desktop']
  })

  test('should handle responsive navigation on all devices', async ({ page }) => {
    await responsiveTest.runOnAllBreakpoints(async (breakpoint) => {
      await page.goto('/')
      
      // Test navigation menu
      if (breakpoint === 'mobile') {
        // Mobile: hamburger menu should be visible
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
        await expect(page.locator('[data-testid="desktop-menu"]')).not.toBeVisible()
        
        // Open mobile menu
        await page.click('[data-testid="mobile-menu-toggle"]')
        await expect(page.locator('[data-testid="mobile-menu-items"]')).toBeVisible()
      } else {
        // Desktop/Tablet: horizontal menu should be visible
        await expect(page.locator('[data-testid="desktop-menu"]')).toBeVisible()
        await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible()
      }
      
      // Test navigation links
      await page.click('text=Features')
      await expect(page).toHaveURL('/features')
    })
  })

  test('should maintain responsive layout during user interactions', async ({ page }) => {
    await responsiveTest.runOnAllBreakpoints(async (breakpoint) => {
      await page.goto('/dashboard')
      
      // Test responsive grid layout
      const gridItems = page.locator('[data-testid="grid-item"]')
      
      if (breakpoint === 'mobile') {
        await expect(gridItems).toHaveCount(1) // Single column
      } else if (breakpoint === 'tablet') {
        await expect(gridItems).toHaveCount(2) // Two columns
      } else {
        await expect(gridItems).toHaveCount(3) // Three columns
      }
      
      // Test responsive form
      await page.fill('[data-testid="search-input"]', 'test query')
      await page.click('[data-testid="search-button"]')
      
      // Verify responsive search results
      const results = page.locator('[data-testid="search-result"]')
      await expect(results).toHaveCount.greaterThan(0)
    })
  })

  test('should handle responsive image loading', async ({ page }) => {
    await responsiveTest.runOnAllBreakpoints(async (breakpoint) => {
      await page.goto('/gallery')
      
      // Test responsive image loading
      const images = page.locator('img[data-responsive="true"]')
      
      for (let i = 0; i < await images.count(); i++) {
        const image = images.nth(i)
        const src = await image.getAttribute('src')
        
        if (breakpoint === 'mobile') {
          expect(src).toContain('mobile')
        } else if (breakpoint === 'tablet') {
          expect(src).toContain('tablet')
        } else {
          expect(src).toContain('desktop')
        }
      }
    })
  })
})`}
          />

          <h2>Performance Testing</h2>
          <p>
            Test responsive scaling performance and optimization:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { createPerformanceTestSuite } from '@react-responsive-easy/performance-testing'
import { ResponsiveComponent } from './ResponsiveComponent'

describe('Responsive Performance Tests', () => {
  const performanceSuite = createPerformanceTestSuite({
    component: ResponsiveComponent,
    breakpoints: ['mobile', 'tablet', 'desktop'],
    metrics: ['renderTime', 'scalingOperations', 'memoryUsage']
  })

  it('should render within performance budget', async () => {
    const results = await performanceSuite.runPerformanceTests({
      budget: {
        renderTime: 16, // 16ms budget for 60fps
        scalingOperations: 100, // Max 100 scaling operations
        memoryUsage: '5MB' // Max 5MB memory usage
      }
    })

    results.forEach(result => {
      expect(result.renderTime).toBeLessThan(16)
      expect(result.scalingOperations).toBeLessThan(100)
      expect(result.memoryUsage).toBeLessThan(5 * 1024 * 1024) // 5MB in bytes
    })
  })

  it('should handle rapid breakpoint changes efficiently', async () => {
    const rapidChangeTest = await performanceSuite.testBreakpointChanges({
      changeSequence: ['mobile', 'tablet', 'desktop', 'tablet', 'mobile'],
      changeInterval: 100, // Change every 100ms
      maxRenderTime: 16
    })

    expect(rapidChangeTest.averageRenderTime).toBeLessThan(16)
    expect(rapidChangeTest.totalRenderTime).toBeLessThan(100)
  })

  it('should optimize scaling operations', async () => {
    const scalingTest = await performanceSuite.testScalingOptimization({
      component: ResponsiveComponent,
      testCases: [
        { props: { complex: false }, maxScalingOps: 50 },
        { props: { complex: true }, maxScalingOps: 200 }
      ]
    })

    scalingTest.results.forEach(result => {
      expect(result.scalingOperations).toBeLessThanOrEqual(result.maxScalingOps)
    })
  })
})`}
          />

          <h2>Accessibility Testing</h2>
          <p>
            Ensure responsive design maintains accessibility across all breakpoints:
          </p>

          <CodeBlock
            language="tsx"
            code={`import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ResponsiveProvider } from '@react-responsive-easy/core'
import { ResponsiveComponent } from './ResponsiveComponent'

expect.extend(toHaveNoViolations)

describe('Responsive Accessibility Tests', () => {
  const TestWrapper = ({ children, breakpoints }) => (
    <ResponsiveProvider breakpoints={breakpoints}>
      {children}
    </ResponsiveProvider>
  )

  it('should be accessible on mobile', async () => {
    const { container } = render(
      <TestWrapper breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
        <ResponsiveComponent />
      </TestWrapper>
    )

    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    })

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should maintain focus management across breakpoints', async () => {
    const { container } = render(
      <TestWrapper breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
        <ResponsiveComponent />
      </TestWrapper>
    )

    // Test focus management
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    // Verify focus order is logical
    for (let i = 0; i < focusableElements.length - 1; i++) {
      const current = focusableElements[i]
      const next = focusableElements[i + 1]
      
      current.focus()
      expect(document.activeElement).toBe(current)
      
      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      current.dispatchEvent(tabEvent)
      
      // Focus should move to next element
      expect(document.activeElement).toBe(next)
    }
  })

  it('should handle screen reader announcements', async () => {
    const { container } = render(
      <TestWrapper breakpoints={{ mobile: 320, tablet: 768, desktop: 1024 }}>
        <ResponsiveComponent />
      </TestWrapper>
    )

    // Test ARIA live regions
    const liveRegions = container.querySelectorAll('[aria-live]')
    expect(liveRegions.length).toBeGreaterThan(0)

    liveRegions.forEach(region => {
      const liveValue = region.getAttribute('aria-live')
      expect(['polite', 'assertive', 'off']).toContain(liveValue)
    })
  })
})`}
          />

          <h2>Testing Configuration</h2>
          <p>
            Configure testing environment for different scenarios:
          </p>

          <CodeBlock
            language="tsx"
            code={`// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}

// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Tablet Chrome',
      use: { ...devices['iPad Pro 11'] }
    },
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
}

export default config`}
          />

          <h2>Continuous Integration</h2>
          <p>
            Set up automated testing in your CI/CD pipeline:
          </p>

          <CodeBlock
            language="yaml"
            code={`# .github/workflows/test.yml
name: Responsive Testing
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        browser: [chrome, firefox, safari]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run component tests
        run: npm run test:component
      
      - name: Run visual regression tests
        run: npm run test:visual
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Run accessibility tests
        run: npm run test:a11y
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results-\${{ matrix.node-version }}-\${{ matrix.browser }}
          path: test-results/`}
          />

          <h2>Best Practices</h2>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Testing Best Practices
            </h3>
            <ul className="space-y-2 text-green-800 dark:text-green-200">
              <li>• Test on real devices, not just emulators</li>
              <li>• Use visual regression testing for UI consistency</li>
              <li>• Test performance budgets across all breakpoints</li>
              <li>• Automate accessibility testing in CI/CD</li>
              <li>• Test responsive behavior during user interactions</li>
              <li>• Use data-testid attributes for reliable element selection</li>
              <li>• Mock network conditions for realistic testing</li>
              <li>• Test edge cases like rapid breakpoint changes</li>
              <li>• Maintain test data that covers all responsive scenarios</li>
              <li>• Use parallel testing for faster feedback</li>
            </ul>
          </div>

          <h2>Next Steps</h2>
          <p>
            Now that you understand testing strategies, explore these related topics:
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/performance-dashboard">
                <span className="font-semibold">Performance Dashboard</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor testing performance metrics
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/ai-optimization">
                <span className="font-semibold">AI Optimization</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Get AI-powered testing suggestions
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/storybook">
                <span className="font-semibold">Storybook Addon</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Test components in Storybook
                </span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
              <Link href="/docs/quick-start">
                <span className="font-semibold">Quick Start</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Set up testing quickly
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
