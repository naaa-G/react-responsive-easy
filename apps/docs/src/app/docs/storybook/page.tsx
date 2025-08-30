import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Storybook Addon - React Responsive Easy',
  description: 'Complete guide to the Storybook addon for React Responsive Easy, including responsive preview, breakpoint switching, and component documentation.',
}

export default function StorybookPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Storybook Addon
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Document and showcase your responsive components with powerful Storybook integration.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/docs/browser-extension">Next: Browser Extension →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/plugins">← Build Plugins</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          The React Responsive Easy Storybook addon provides a comprehensive set of tools 
          for documenting, testing, and showcasing responsive components. It includes 
          breakpoint switching, responsive preview modes, performance monitoring, and 
          interactive documentation features.
        </p>

        <h2>Installation</h2>
        <p>
          Install the addon in your Storybook project:
        </p>
        <CodeBlock 
          language="bash"
          code={`npm install --save-dev @react-responsive-easy/storybook-addon
# or
yarn add -D @react-responsive-easy/storybook-addon
# or
pnpm add -D @react-responsive-easy/storybook-addon`}
        />

        <h2>Configuration</h2>
        <p>
          Configure the addon in your Storybook configuration files:
        </p>

        <h3>Main Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@react-responsive-easy/storybook-addon'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
}`}
        />

        <h3>Manager Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// .storybook/manager.js
import { addons } from '@storybook/manager-api'
import { createManager } from '@react-responsive-easy/storybook-addon'

addons.setConfig({
  panelPosition: 'bottom',
  selectedPanel: 'responsive-panel'
})

// Initialize the responsive addon manager
createManager()`}
        />

        <h3>Preview Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// .storybook/preview.js
import { withResponsiveProvider } from '@react-responsive-easy/storybook-addon'

export const decorators = [
  withResponsiveProvider({
    // Addon configuration
    breakpoints: [
      { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
      { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
      { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
    ],
    base: 'desktop',
    enableDebugMode: true
  })
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}`}
        />

        <h2>Addon Features</h2>
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Breakpoint Toolbar
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Switch between breakpoints with a click and see your components adapt in real-time.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Core Feature</span>
              <Button size="sm" asChild>
                <Link href="#breakpoint-toolbar">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Responsive Preview
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Preview components across different screen sizes and orientations.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Preview Mode</span>
              <Button size="sm" asChild>
                <Link href="#responsive-preview">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Performance Panel
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Monitor component performance and responsive scaling metrics.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Monitoring</span>
              <Button size="sm" asChild>
                <Link href="#performance-panel">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Responsive Decorator
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Wrap stories with responsive context and breakpoint information.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Story Wrapper</span>
              <Button size="sm" asChild>
                <Link href="#responsive-decorator">Learn More →</Link>
              </Button>
            </div>
          </div>
        </div>

        <h2 id="breakpoint-toolbar">Breakpoint Toolbar</h2>
        <p>
          The breakpoint toolbar allows you to switch between different screen sizes 
          and see your components adapt in real-time.
        </p>

        <h3>Toolbar Features</h3>
        <ul>
          <li>
            <strong>Breakpoint Switching:</strong> Click to switch between mobile, tablet, and desktop views
          </li>
          <li>
            <strong>Custom Breakpoints:</strong> Define custom breakpoints for your design system
          </li>
          <li>
            <strong>Orientation Support:</strong> Switch between portrait and landscape orientations
          </li>
          <li>
            <strong>Real-time Updates:</strong> See changes immediately without page refresh
          </li>
        </ul>

        <h3>Custom Breakpoints</h3>
        <CodeBlock 
          language="javascript"
          code={`// .storybook/preview.js
import { withResponsiveProvider } from '@react-responsive-easy/storybook-addon'

export const decorators = [
  withResponsiveProvider({
    breakpoints: [
      { name: 'Small Mobile', width: 320, height: 568, alias: 'xs' },
      { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
      { name: 'Large Mobile', width: 414, height: 896, alias: 'lg-mobile' },
      { name: 'Small Tablet', width: 768, height: 1024, alias: 'tablet' },
      { name: 'Large Tablet', width: 1024, height: 1366, alias: 'lg-tablet' },
      { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' },
      { name: 'Large Desktop', width: 2560, height: 1440, alias: 'lg-desktop' }
    ],
    base: 'desktop'
  })
]`}
        />

        <h2 id="responsive-preview">Responsive Preview</h2>
        <p>
          The responsive preview mode shows your components across different screen sizes 
          simultaneously, making it easy to compare layouts and identify responsive issues.
        </p>

        <h3>Preview Modes</h3>
        <CodeBlock 
          language="javascript"
          code={`// Story with responsive preview
export const ResponsiveButton = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    responsive: {
      // Enable responsive preview
      enablePreview: true,
      
      // Show multiple breakpoints simultaneously
      showMultipleBreakpoints: true,
      
      // Custom preview layout
      layout: 'grid', // 'grid' | 'stack' | 'side-by-side'
      
      // Breakpoints to show in preview
      breakpoints: ['mobile', 'tablet', 'desktop'],
      
      // Enable orientation switching
      enableOrientation: true
    }
  }
}`}
        />

        <h3>Preview Layouts</h3>
        <CodeBlock 
          language="javascript"
          code={`// Grid layout - show all breakpoints in a grid
{
  responsive: {
    layout: 'grid',
    breakpoints: ['mobile', 'tablet', 'desktop']
  }
}

// Stack layout - show breakpoints stacked vertically
{
  responsive: {
    layout: 'stack',
    breakpoints: ['mobile', 'tablet', 'desktop']
  }
}

// Side-by-side layout - show breakpoints horizontally
{
  responsive: {
    layout: 'side-by-side',
    breakpoints: ['mobile', 'tablet', 'desktop']
  }
}`}
        />

        <h2 id="performance-panel">Performance Panel</h2>
        <p>
          The performance panel provides real-time monitoring of your responsive components, 
          including rendering times, scaling calculations, and optimization suggestions.
        </p>

        <h3>Performance Metrics</h3>
        <CodeBlock 
          language="javascript"
          code={`// Story with performance monitoring
export const PerformanceButton = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    responsive: {
      // Enable performance monitoring
      enablePerformance: true,
      
      // Performance thresholds
      performance: {
        renderTimeThreshold: 16, // 60fps target
        scalingOperationsThreshold: 100,
        cacheHitRateThreshold: 80
      },
      
      // Show performance warnings
      showWarnings: true,
      
      // Performance optimization suggestions
      enableSuggestions: true
    }
  }
}`}
        />

        <h3>Performance Data</h3>
        <ul>
          <li>
            <strong>Render Time:</strong> Time taken to render the component
          </li>
          <li>
            <strong>Scaling Operations:</strong> Number of responsive scaling calculations
          </li>
          <li>
            <strong>Cache Hit Rate:</strong> Percentage of cached scaling operations
          </li>
          <li>
            <strong>Memory Usage:</strong> Memory consumption of responsive operations
          </li>
          <li>
            <strong>Performance Score:</strong> Overall performance rating
          </li>
        </ul>

        <h2 id="responsive-decorator">Responsive Decorator</h2>
        <p>
          The responsive decorator wraps your stories with responsive context, providing 
          breakpoint information and responsive utilities to your components.
        </p>

        <h3>Basic Usage</h3>
        <CodeBlock 
          language="javascript"
          code={`// Story with responsive decorator
import { withResponsiveProvider } from '@react-responsive-easy/storybook-addon'

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [withResponsiveProvider()]
}

export const Default = {
  args: {
    children: 'Click me',
    variant: 'primary'
  }
}`}
        />

        <h3>Advanced Decorator Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// Advanced decorator configuration
export const decorators = [
  withResponsiveProvider({
    // Breakpoint configuration
    breakpoints: [
      { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
      { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
      { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
    ],
    
    // Base breakpoint
    base: 'desktop',
    
    // Development features
    development: {
      enableDebugMode: true,
      logScalingCalculations: true,
      showScalingInfo: true
    },
    
    // Performance monitoring
    performance: {
      enableMonitoring: true,
      trackMetrics: true,
      showAlerts: true
    }
  })
]`}
        />

        <h2>Story Parameters</h2>
        <p>
          Configure responsive behavior for individual stories using story parameters:
        </p>

        <h3>Responsive Parameters</h3>
        <CodeBlock 
          language="javascript"
          code={`// Story with responsive parameters
export const ResponsiveButton = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    responsive: {
      // Enable responsive features
      enablePreview: true,
      enablePerformance: true,
      enableBreakpoints: true,
      
      // Breakpoint-specific behavior
      breakpoints: {
        mobile: {
          showMobileOnly: true,
          hideOnMobile: false
        },
        tablet: {
          showTabletOnly: true,
          hideOnTablet: false
        },
        desktop: {
          showDesktopOnly: true,
          hideOnDesktop: false
        }
      },
      
      // Responsive testing
      testing: {
        enableVisualRegression: true,
        enableAccessibility: true,
        enablePerformance: true
      }
    }
  }
}`}
        />

        <h3>Breakpoint-Specific Stories</h3>
        <CodeBlock 
          language="javascript"
          code={`// Create breakpoint-specific stories
export const MobileButton = {
  ...ResponsiveButton,
  parameters: {
    responsive: {
      ...ResponsiveButton.parameters.responsive,
      breakpoints: {
        mobile: { showMobileOnly: true },
        tablet: { hideOnTablet: true },
        desktop: { hideOnDesktop: true }
      }
    }
  }
}

export const DesktopButton = {
  ...ResponsiveButton,
  parameters: {
    responsive: {
      ...ResponsiveButton.parameters.responsive,
      breakpoints: {
        mobile: { hideOnMobile: true },
        tablet: { hideOnTablet: true },
        desktop: { showDesktopOnly: true }
      }
    }
  }
}`}
        />

        <h2>Interactive Documentation</h2>
        <p>
          Create interactive documentation that showcases responsive behavior:
        </p>

        <h3>Responsive Controls</h3>
        <CodeBlock 
          language="javascript"
          code={`// Story with responsive controls
export const InteractiveButton = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    fontSize: {
      control: { type: 'range', min: 12, max: 32, step: 1 },
      description: 'Base font size (will scale responsively)'
    },
    padding: {
      control: { type: 'range', min: 8, max: 32, step: 2 },
      description: 'Base padding (will scale responsively)'
    }
  },
  parameters: {
    responsive: {
      enablePreview: true,
      enableControls: true,
      showResponsiveInfo: true
    }
  }
}`}
        />

        <h3>Responsive Documentation</h3>
        <CodeBlock 
          language="javascript"
          code={`// Story with responsive documentation
export const DocumentedButton = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: \`
          ## Responsive Button Component
        
          This button automatically scales across breakpoints:
        
          - **Mobile**: Smaller padding and font size
          - **Tablet**: Medium padding and font size  
          - **Desktop**: Full padding and font size
        
          ### Usage
        
          \`\`\`tsx
          <Button fontSize={16} padding={16}>
            Responsive Button
          </Button>
          \`\`\`
        \`
      }
    },
    responsive: {
      enablePreview: true,
      showDocumentation: true
    }
  }
}`}
        />

        <h2>Testing and Quality Assurance</h2>
        <p>
          Use the addon for testing responsive components and ensuring quality:
        </p>

        <h3>Visual Regression Testing</h3>
        <CodeBlock 
          language="javascript"
          code={`// Story for visual regression testing
export const VisualRegressionButton = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    responsive: {
      enablePreview: true,
      enableVisualRegression: true,
      breakpoints: ['mobile', 'tablet', 'desktop'],
      orientations: ['portrait', 'landscape']
    },
    chromatic: {
      viewports: [375, 768, 1920],
      pauseAnimationAtEnd: true
    }
  }
}`}
        />

        <h3>Accessibility Testing</h3>
        <CodeBlock 
          language="javascript"
          code={`// Story for accessibility testing
export const AccessibilityButton = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    responsive: {
      enablePreview: true,
      enableAccessibility: true,
      breakpoints: ['mobile', 'tablet', 'desktop']
    },
    a11y: {
      config: {
        rules: [
          { id: 'button-name', enabled: true },
          { id: 'color-contrast', enabled: true }
        ]
      }
    }
  }
}`}
        />

        <h2>Advanced Features</h2>
        
        <h3>Custom Breakpoint Detection</h3>
        <CodeBlock 
          language="javascript"
          code={`// Custom breakpoint detection
export const decorators = [
  withResponsiveProvider({
    breakpointDetection: {
      // Custom detection strategy
      strategy: 'custom',
      
      // Custom detection function
      detect: (width, height) => {
        if (width < 480) return 'mobile'
        if (width < 768) return 'tablet'
        if (width < 1200) return 'desktop'
        return 'large-desktop'
      },
      
      // Custom breakpoints
      breakpoints: [
        { name: 'Mobile', width: 480, height: 800, alias: 'mobile' },
        { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
        { name: 'Desktop', width: 1200, height: 800, alias: 'desktop' },
        { name: 'Large Desktop', width: 1920, height: 1080, alias: 'large-desktop' }
      ]
    }
  })
]`}
        />

        <h3>Responsive Context</h3>
        <CodeBlock 
          language="javascript"
          code={`// Access responsive context in stories
import { useResponsiveContext } from '@react-responsive-easy/storybook-addon'

export const ContextAwareButton = {
  title: 'Components/Button',
  component: () => {
    const { breakpoint, width, height } = useResponsiveContext()
    
    return (
      <div>
        <p>Current breakpoint: {breakpoint}</p>
        <p>Viewport: {width}x{height}</p>
        <Button>Responsive Button</Button>
      </div>
    )
  },
  parameters: {
    responsive: {
      enablePreview: true,
      showContextInfo: true
    }
  }
}`}
        />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Use consistent breakpoints:</strong> Define breakpoints once and reuse across stories
          </li>
          <li>
            <strong>Test all breakpoints:</strong> Ensure components work correctly at all screen sizes
          </li>
          <li>
            <strong>Document responsive behavior:</strong> Use story descriptions to explain responsive features
          </li>
          <li>
            <strong>Monitor performance:</strong> Use performance panel to identify optimization opportunities
          </li>
          <li>
            <strong>Enable accessibility:</strong> Test accessibility across all breakpoints
          </li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          Now that you understand the Storybook addon, explore the browser extension:
        </p>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Button asChild className="w-full">
            <Link href="/docs/browser-extension">
              Explore Browser Extension →
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/docs/advanced">
              Advanced Features →
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/plugins">← Build Plugins</Link>
            </Button>
            <Button asChild>
              <Link href="/docs/browser-extension">Next: Browser Extension →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
