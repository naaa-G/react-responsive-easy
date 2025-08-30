import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Browser Extension - React Responsive Easy',
  description: 'Complete guide to the browser extension for React Responsive Easy, including visual debugging, responsive inspection, and development tools.',
}

export default function BrowserExtensionPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Browser Extension
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Powerful visual debugging tools for responsive design, component inspection, and development workflow enhancement.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/docs/advanced">Next: Advanced Features →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/storybook">← Storybook Addon</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          The React Responsive Easy browser extension provides comprehensive visual debugging 
          tools for responsive design. It integrates seamlessly with your browser's developer 
          tools, offering real-time responsive inspection, breakpoint visualization, and 
          performance monitoring directly in the browser.
        </p>

        <h2>Installation</h2>
        <p>
          Install the extension from your browser's extension store:
        </p>

        <h3>Chrome/Edge</h3>
        <CodeBlock 
          language="bash"
          code={`# Install from Chrome Web Store
1. Visit the Chrome Web Store
2. Search for "React Responsive Easy"
3. Click "Add to Chrome"
4. Confirm installation

# Or install manually
1. Download the .crx file
2. Go to chrome://extensions/
3. Enable "Developer mode"
4. Drag and drop the .crx file`}
        />

        <h3>Firefox</h3>
        <CodeBlock 
          language="bash"
          code={`# Install from Firefox Add-ons
1. Visit addons.mozilla.org
2. Search for "React Responsive Easy"
3. Click "Add to Firefox"
4. Confirm installation

# Or install manually
1. Download the .xpi file
2. Go to about:addons
3. Click the gear icon
4. Select "Install Add-on From File"`}
        />

        <h2>Extension Features</h2>
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="#responsive-inspector" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Responsive Inspector
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Inspect responsive components and see breakpoint information in real-time.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Core Feature</span>
              <Button size="sm" asChild>
                <Link href="#responsive-inspector">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="#breakpoint-visualizer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Breakpoint Visualizer
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Visualize breakpoints and responsive behavior across different screen sizes.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Visualization</span>
              <Button size="sm" asChild>
                <Link href="#breakpoint-visualizer">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="#performance-monitor" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Performance Monitor
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Monitor responsive component performance and identify optimization opportunities.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Monitoring</span>
              <Button size="sm" asChild>
                <Link href="#performance-monitor">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="#devtools-panel" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                DevTools Panel
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Integrated panel in browser developer tools for seamless debugging experience.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Integration</span>
              <Button size="sm" asChild>
                <Link href="#devtools-panel">Learn More →</Link>
              </Button>
            </div>
          </div>
        </div>

        <h2 id="responsive-inspector">Responsive Inspector</h2>
        <p>
          The responsive inspector allows you to examine responsive components and see 
          their breakpoint behavior, scaling calculations, and responsive properties.
        </p>

        <h3>Inspector Features</h3>
        <ul>
          <li>
            <strong>Component Selection:</strong> Click on any element to inspect its responsive properties
          </li>
          <li>
            <strong>Breakpoint Information:</strong> See current breakpoint and responsive values
          </li>
          <li>
            <strong>Scaling Details:</strong> View scaling calculations and mathematical formulas
          </li>
          <li>
            <strong>Property Overrides:</strong> Identify breakpoint-specific property overrides
          </li>
          <li>
            <strong>Real-time Updates:</strong> See changes as you resize the browser window
          </li>
        </ul>

        <h3>Inspector Interface</h3>
        <CodeBlock 
          language="javascript"
          code={`// Inspector panel shows:
{
  "component": "Button",
  "currentBreakpoint": "tablet",
  "responsiveProperties": {
    "fontSize": {
      "base": 16,
      "mobile": 14,
      "tablet": 16,
      "desktop": 18,
      "current": 16,
      "scalingRatio": 1.0
    },
    "padding": {
      "base": 24,
      "mobile": 16,
      "tablet": 20,
      "desktop": 24,
      "current": 20,
      "scalingRatio": 0.83
    }
  },
  "scalingStrategy": "width",
  "performance": {
    "renderTime": 2.4,
    "scalingOperations": 3,
    "cacheHitRate": 100
  }
}`}
        />

        <h2 id="breakpoint-visualizer">Breakpoint Visualizer</h2>
        <p>
          The breakpoint visualizer provides a visual representation of your responsive 
          design system, showing breakpoints, scaling relationships, and responsive behavior.
        </p>

        <h3>Visualization Features</h3>
        <ul>
          <li>
            <strong>Breakpoint Timeline:</strong> Visual timeline showing all breakpoints
          </li>
          <li>
            <strong>Scaling Curves:</strong> Mathematical curves showing how values scale
          </li>
          <li>
            <strong>Responsive Grid:</strong> Grid view of components across breakpoints
          </li>
          <li>
            <strong>Orientation Support:</strong> Portrait and landscape breakpoint views
          </li>
          <li>
            <strong>Custom Breakpoints:</strong> Support for custom breakpoint definitions
          </li>
        </ul>

        <h3>Breakpoint Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// Extension configuration
{
  "breakpoints": [
    {
      "name": "Mobile",
      "width": 375,
      "height": 667,
      "alias": "mobile",
      "color": "#ff6b6b"
    },
    {
      "name": "Tablet",
      "width": 768,
      "height": 1024,
      "alias": "tablet",
      "color": "#4ecdc4"
    },
    {
      "name": "Desktop",
      "width": 1920,
      "height": 1080,
      "alias": "desktop",
      "color": "#45b7d1"
    }
  ],
  "visualization": {
    "showTimeline": true,
    "showScalingCurves": true,
    "showResponsiveGrid": true,
    "enableAnimations": true
  }
}`}
        />

        <h2 id="performance-monitor">Performance Monitor</h2>
        <p>
          The performance monitor tracks responsive component performance, providing 
          real-time metrics and optimization suggestions.
        </p>

        <h3>Performance Metrics</h3>
        <CodeBlock 
          language="javascript"
          code={`// Performance data
{
  "overview": {
    "totalComponents": 24,
    "responsiveComponents": 18,
    "performanceScore": 87,
    "optimizationOpportunities": 3
  },
  "metrics": {
    "renderTime": {
      "average": 3.2,
      "peak": 12.8,
      "threshold": 16.0,
      "status": "good"
    },
    "scalingOperations": {
      "total": 156,
      "cached": 142,
      "cacheHitRate": 91.0,
      "status": "excellent"
    },
    "memoryUsage": {
      "current": "2.4 MB",
      "peak": "3.1 MB",
      "threshold": "5.0 MB",
      "status": "good"
    }
  },
  "alerts": [
    {
      "type": "warning",
      "component": "ResponsiveGrid",
      "message": "High render time detected",
      "suggestion": "Consider memoization"
    }
  ]
}`}
        />

        <h3>Performance Alerts</h3>
        <ul>
          <li>
            <strong>Render Time Warnings:</strong> Alerts when components exceed 16ms render time
          </li>
          <li>
            <strong>Cache Performance:</strong> Warnings for low cache hit rates
          </li>
          <li>
            <strong>Memory Usage:</strong> Alerts for excessive memory consumption
          </li>
          <li>
            <strong>Scaling Efficiency:</strong> Suggestions for optimizing scaling operations
          </li>
          <li>
            <strong>Bundle Impact:</strong> Warnings about large responsive code bundles
          </li>
        </ul>

        <h2 id="devtools-panel">DevTools Panel</h2>
        <p>
          The extension integrates seamlessly with your browser's developer tools, 
          providing a dedicated panel for responsive design debugging.
        </p>

        <h3>Panel Features</h3>
        <ul>
          <li>
            <strong>Responsive Tab:</strong> Dedicated tab in Elements panel
          </li>
          <li>
            <strong>Breakpoint Switcher:</strong> Quick breakpoint switching
          </li>
          <li>
            <strong>Responsive Console:</strong> Console for responsive debugging
          </li>
          <li>
            <strong>Network Monitoring:</strong> Track responsive asset loading
          </li>
          <li>
            <strong>Storage Inspector:</strong> View responsive configuration data
          </li>
        </ul>

        <h3>Panel Integration</h3>
        <CodeBlock 
          language="javascript"
          code={`// DevTools panel configuration
{
  "panels": {
    "responsive": {
      "title": "Responsive",
      "icon": "responsive-icon.svg",
      "position": "elements",
      "enabled": true
    },
    "performance": {
      "title": "Performance",
      "icon": "performance-icon.svg",
      "position": "performance",
      "enabled": true
    }
  },
  "shortcuts": {
    "toggleResponsive": "Ctrl+Shift+R",
    "switchBreakpoint": "Ctrl+Shift+B",
    "showInspector": "Ctrl+Shift+I"
  }
}`}
        />

        <h2>Context Menu Integration</h2>
        <p>
          The extension adds context menu options for quick access to responsive features:
        </p>

        <h3>Context Menu Options</h3>
        <CodeBlock 
          language="javascript"
          code={`// Context menu integration
{
  "contextMenus": [
    {
      "id": "inspectResponsive",
      "title": "Inspect Responsive Properties",
      "contexts": ["element"],
      "onclick": "inspectResponsiveElement"
    },
    {
      "id": "switchBreakpoint",
      "title": "Switch Breakpoint",
      "contexts": ["page"],
      "submenu": [
        {
          "id": "mobile",
          "title": "Mobile (375x667)"
        },
        {
          "id": "tablet",
          "title": "Tablet (768x1024)"
        },
        {
          "id": "desktop",
          "title": "Desktop (1920x1080)"
        }
      ]
    },
    {
      "id": "showPerformance",
      "title": "Show Performance Data",
      "contexts": ["page"]
    }
  ]
}`}
        />

        <h2>Keyboard Shortcuts</h2>
        <p>
          Use keyboard shortcuts for quick access to extension features:
        </p>

        <h3>Default Shortcuts</h3>
        <CodeBlock 
          language="javascript"
          code={`// Keyboard shortcuts
{
  "shortcuts": {
    "toggleInspector": "Ctrl+Shift+I",
    "switchBreakpoint": "Ctrl+Shift+B",
    "showPerformance": "Ctrl+Shift+P",
    "toggleVisualizer": "Ctrl+Shift+V",
    "nextBreakpoint": "Ctrl+Shift+Right",
    "previousBreakpoint": "Ctrl+Shift+Left",
    "toggleResponsiveMode": "Ctrl+Shift+R"
  }
}`}
        />

        <h3>Custom Shortcuts</h3>
        <p>
          Customize keyboard shortcuts in the extension settings:
        </p>
        <CodeBlock 
          language="javascript"
          code={`// Custom shortcut configuration
{
  "customShortcuts": {
    "inspectElement": "Alt+I",
    "showBreakpoints": "Alt+B",
    "performancePanel": "Alt+P",
    "responsiveGrid": "Alt+G"
  }
}`}
        />

        <h2>Extension Settings</h2>
        <p>
          Configure the extension behavior and appearance through the settings panel:
        </p>

        <h3>General Settings</h3>
        <CodeBlock 
          language="javascript"
          code={`// General settings
{
  "general": {
    "autoStart": true,
    "showNotifications": true,
    "enableHotkeys": true,
    "language": "en",
    "theme": "auto"
  },
  "inspection": {
    "autoInspect": false,
    "highlightElements": true,
    "showTooltips": true,
    "inspectionDelay": 200
  },
  "performance": {
    "enableMonitoring": true,
    "updateInterval": 1000,
    "showAlerts": true,
    "performanceThresholds": {
      "renderTime": 16,
      "cacheHitRate": 80,
      "memoryUsage": 5
    }
  }
}`}
        />

        <h3>Breakpoint Settings</h3>
        <CodeBlock 
          language="javascript"
          code={`// Breakpoint configuration
{
  "breakpoints": {
    "default": [
      { "name": "Mobile", "width": 375, "height": 667, "alias": "mobile" },
      { "name": "Tablet", "width": 768, "height": 1024, "alias": "tablet" },
      { "name": "Desktop", "width": 1920, "height": 1080, "alias": "desktop" }
    ],
    "custom": [
      { "name": "Small Mobile", "width": 320, "height": 568, "alias": "xs" },
      { "name": "Large Desktop", "width": 2560, "height": 1440, "alias": "xl" }
    ],
    "orientation": {
      "portrait": true,
      "landscape": true
    }
  }
}`}
        />

        <h2>Development Workflow</h2>
        <p>
          Integrate the extension into your development workflow for efficient responsive design:
        </p>

        <h3>Workflow Integration</h3>
        <CodeBlock 
          language="javascript"
          code={`// Development workflow
{
  "workflow": {
    "development": {
      "autoInspect": true,
      "showPerformance": true,
      "enableDebugMode": true
    },
    "testing": {
      "testAllBreakpoints": true,
      "visualRegression": true,
      "performanceTesting": true
    },
    "production": {
      "monitorPerformance": true,
      "showAlerts": false,
      "minimalUI": true
    }
  }
}`}
        />

        <h3>Testing Workflow</h3>
        <ol>
          <li>
            <strong>Component Development:</strong> Use inspector to verify responsive behavior
          </li>
          <li>
            <strong>Breakpoint Testing:</strong> Test components across all breakpoints
          </li>
          <li>
            <strong>Performance Monitoring:</strong> Monitor performance during development
          </li>
          <li>
            <strong>Visual Verification:</strong> Use visualizer to verify responsive layouts
          </li>
          <li>
            <strong>Production Monitoring:</strong> Monitor performance in production
          </li>
        </ol>

        <h2>Advanced Features</h2>
        
        <h3>Custom Inspectors</h3>
        <p>
          Create custom inspectors for specific component types:
        </p>
        <CodeBlock 
          language="javascript"
          code={`// Custom inspector
class CustomButtonInspector {
  constructor(element) {
    this.element = element
    this.type = 'button'
  }
  
  inspect() {
    return {
      type: this.type,
      responsiveProps: this.getResponsiveProps(),
      breakpointInfo: this.getBreakpointInfo(),
      performance: this.getPerformanceData()
    }
  }
  
  getResponsiveProps() {
    // Custom responsive property extraction
    return {
      fontSize: this.extractFontSize(),
      padding: this.extractPadding(),
      borderRadius: this.extractBorderRadius()
    }
  }
}

// Register custom inspector
extension.registerInspector('button', CustomButtonInspector)`}
        />

        <h3>Performance Profiling</h3>
        <p>
          Advanced performance profiling for responsive components:
        </p>
        <CodeBlock 
          language="javascript"
          code={`// Performance profiling
{
  "profiling": {
    "enableProfiling": true,
    "profilingMode": "detailed", // 'basic' | 'detailed' | 'expert'
    "metrics": {
      "renderTime": true,
      "scalingOperations": true,
      "cachePerformance": true,
      "memoryUsage": true,
      "networkRequests": true
    },
    "sampling": {
      "interval": 100,
      "duration": 5000,
      "autoStart": false
    }
  }
}`}
        />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Use during development:</strong> Enable inspection while developing responsive components
          </li>
          <li>
            <strong>Monitor performance:</strong> Keep performance panel open to catch issues early
          </li>
          <li>
            <strong>Test all breakpoints:</strong> Use breakpoint switcher to test across screen sizes
          </li>
          <li>
            <strong>Customize settings:</strong> Adjust extension settings to match your workflow
          </li>
          <li>
            <strong>Use shortcuts:</strong> Learn keyboard shortcuts for efficient debugging
          </li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          Now that you understand the browser extension, explore advanced features:
        </p>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Button asChild className="w-full">
            <Link href="/docs/advanced">
              Explore Advanced Features →
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/docs/ai-optimization">
              AI Optimization →
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/storybook">← Storybook Addon</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/advanced">Next: Advanced Features →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
