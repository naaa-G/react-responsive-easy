import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Responsive Provider',
  description: 'The heart of React Responsive Easy - understand how the ResponsiveProvider works and powers the entire system.',
};

export default function ResponsiveProviderPage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <h1>Responsive Provider</h1>
      <p>
        The <code>ResponsiveProvider</code> is the heart of React Responsive Easy. It's a React Context Provider 
        that wraps your application and provides the responsive scaling engine to all child components.
      </p>

      <div className="not-prose mb-8">
        <Link href="/playground">
          <Button>
            Try in Playground
          </Button>
        </Link>
      </div>

      <h2>What is the ResponsiveProvider?</h2>
      <p>
        The <code>ResponsiveProvider</code> is a React Context Provider that:
      </p>

      <ul>
        <li><strong>Manages breakpoint detection</strong> - Automatically detects viewport changes</li>
        <li><strong>Calculates scaling ratios</strong> - Computes mathematical scaling between breakpoints</li>
        <li><strong>Provides responsive context</strong> - Makes scaling data available to all components</li>
        <li><strong>Optimizes performance</strong> - Caches calculations and minimizes re-renders</li>
        <li><strong>Handles accessibility</strong> - Ensures minimum sizes and touch targets</li>
      </ul>

      <h2>Basic Usage</h2>
      <p>
        Wrap your app with the <code>ResponsiveProvider</code> and pass your configuration:
      </p>

      <CodeBlock
        code={`import { ResponsiveProvider } from '@react-responsive-easy/core';
import { responsiveConfig } from './responsive.config';

function App() {
  return (
    <ResponsiveProvider config={responsiveConfig}>
      <YourApp />
    </ResponsiveProvider>
  );
}

export default App;`}
        language="tsx"
        title="App.tsx"
        showCopy
        showLineNumbers
      />

      <h2>Provider Configuration</h2>
      <p>
        The <code>ResponsiveProvider</code> accepts a configuration object that defines your responsive strategy:
      </p>

      <CodeBlock
        code={`interface ResponsiveConfig {
  // Base breakpoint (usually your largest design)
  base: Breakpoint;
  
  // All breakpoints in your system
  breakpoints: Breakpoint[];
  
  // Scaling strategy configuration
  strategy: ScalingStrategy;
  
  // Development options
  development?: DevelopmentOptions;
  
  // Performance settings
  performance?: PerformanceOptions;
  
  // Visual customization
  visual?: VisualOptions;
}

// Example configuration
const responsiveConfig: ResponsiveConfig = {
  base: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    alias: 'desktop'
  },
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
  ],
  strategy: {
    mode: 'scale',
    origin: 'top-left',
    tokens: {
      fontSize: { scale: 0.85, min: 12 },
      spacing: { scale: 0.85, step: 2 },
      radius: { scale: 0.9 },
      shadow: { scale: 0.7 }
    }
  },
  development: {
    enableDebugMode: true,
    showScalingInfo: true,
    logScalingCalculations: true
  }
};`}
        language="typescript"
        title="Configuration Interface"
        showCopy
        showLineNumbers
      />

      <h2>How It Works</h2>
      <p>
        The <code>ResponsiveProvider</code> works in several phases:
      </p>

      <h3>1. Initialization Phase</h3>
      <CodeBlock
        code={`// When ResponsiveProvider mounts:
function ResponsiveProvider({ config, children }) {
  // 1. Parse and validate configuration
  const validatedConfig = validateConfig(config);
  
  // 2. Calculate initial breakpoint
  const initialBreakpoint = detectBreakpoint(window.innerWidth, window.innerHeight);
  
  // 3. Compute scaling ratios for all breakpoints
  const scalingRatios = computeScalingRatios(validatedConfig.base, validatedConfig.breakpoints);
  
  // 4. Initialize performance monitoring
  const performanceMonitor = createPerformanceMonitor(validatedConfig.performance);
  
  // 5. Set up event listeners
  useEffect(() => {
    const handleResize = debounce(() => {
      const newBreakpoint = detectBreakpoint(window.innerWidth, window.innerHeight);
      if (newBreakpoint.name !== currentBreakpoint.name) {
        setCurrentBreakpoint(newBreakpoint);
        // Recalculate all scaling ratios
        updateScalingRatios(newBreakpoint);
      }
    }, 100);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 6. Provide context to children
  const contextValue = {
    currentBreakpoint,
    scalingRatios,
    config: validatedConfig,
    performanceMonitor
  };
  
  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
}`}
        language="tsx"
        title="Provider Initialization"
        showCopy
        showLineNumbers
      />

      <h3>2. Runtime Phase</h3>
      <p>
        During runtime, the provider continuously monitors viewport changes and updates the context:
      </p>

      <CodeBlock
        code={`// Runtime behavior:
useEffect(() => {
  // Monitor viewport changes
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      
      // Check if we need to switch breakpoints
      const newBreakpoint = findMatchingBreakpoint(width, height, config.breakpoints);
      
      if (newBreakpoint && newBreakpoint.name !== currentBreakpoint.name) {
        // Breakpoint changed - update context
        setCurrentBreakpoint(newBreakpoint);
        
        // Recalculate scaling ratios
        const newRatios = computeScalingRatios(config.base, newBreakpoint);
        setScalingRatios(newRatios);
        
        // Notify performance monitor
        performanceMonitor.onBreakpointChange(newBreakpoint);
        
        // Log in development mode
        if (config.development?.logScalingCalculations) {
          console.log('🔄 Breakpoint changed:', {
            from: currentBreakpoint.name,
            to: newBreakpoint.name,
            ratios: newRatios
          });
        }
      }
    }
  });
  
  observer.observe(document.documentElement);
  return () => observer.disconnect();
}, [currentBreakpoint, config, performanceMonitor]);`}
        language="tsx"
        title="Runtime Monitoring"
        showCopy
        showLineNumbers
      />

      <h2>Context Value Structure</h2>
      <p>
        The provider makes this context available to all child components:
      </p>

      <CodeBlock
        code={`interface ResponsiveContextValue {
  // Current breakpoint information
  currentBreakpoint: Breakpoint & {
    ratio: number;           // Scaling ratio from base
    orientation: 'portrait' | 'landscape';
    density: number;         // Device pixel ratio
    capabilities: string[];  // ['touch', 'hover', etc.]
  };
  
  // Pre-computed scaling ratios for all breakpoints
  scalingRatios: Record<string, number>;
  
  // Configuration object
  config: ResponsiveConfig;
  
  // Performance monitoring instance
  performanceMonitor: PerformanceMonitor;
  
  // Utility functions
  scaleValue: (value: number, token?: string) => number;
  scaleStyle: (style: CSSProperties) => CSSProperties;
  getBreakpoint: (width: number, height: number) => Breakpoint;
}

// Usage in components:
const { currentBreakpoint, scalingRatios, scaleValue } = useResponsiveContext();

// Scale a value
const fontSize = scaleValue(48, 'fontSize');

// Get current breakpoint info
console.log('Current breakpoint:', currentBreakpoint.name);
console.log('Scaling ratio:', currentBreakpoint.ratio);`}
        language="typescript"
        title="Context Value Interface"
        showCopy
        showLineNumbers
      />

      <h2>Performance Optimizations</h2>
      <p>
        The <code>ResponsiveProvider</code> includes several performance optimizations:
      </p>

      <div className="not-prose">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="rounded-lg bg-green-50 p-6 dark:bg-green-950/20">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              🚀 Caching & Memoization
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
              <li>• Scaling ratios cached per breakpoint</li>
              <li>• useMemo for expensive calculations</li>
              <li>• Debounced resize handlers</li>
              <li>• Selective re-renders only when needed</li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-950/20">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              📱 Smart Breakpoint Detection
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
              <li>• ResizeObserver for efficient monitoring</li>
              <li>• Breakpoint change detection</li>
              <li>• Orientation change handling</li>
              <li>• Device capability detection</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Development Features</h2>
      <p>
        When <code>enableDebugMode</code> is true, the provider provides helpful development features:
      </p>

      <CodeBlock
        code={`// Development mode features:
if (config.development?.enableDebugMode) {
  // 1. Visual breakpoint indicator
  if (config.development.showScalingInfo) {
    renderBreakpointIndicator(currentBreakpoint);
  }
  
  // 2. Console logging
  if (config.development.logScalingCalculations) {
    console.log('🔍 ResponsiveProvider Debug:', {
      currentBreakpoint,
      scalingRatios,
      cacheSize: performanceMonitor.getCacheSize(),
      config: validatedConfig
    });
  }
  
  // 3. Performance metrics
  if (config.development.showPerformanceMetrics) {
    renderPerformanceMetrics(performanceMonitor.getMetrics());
  }
  
  // 4. Scaling visualization
  if (config.development.showScalingVisualization) {
    renderScalingVisualization(currentBreakpoint, scalingRatios);
  }
}`}
        language="typescript"
        title="Development Features"
        showCopy
        showLineNumbers
      />

      <h2>Error Handling</h2>
      <p>
        The provider includes robust error handling for various scenarios:
      </p>

      <CodeBlock
        code={`// Error handling in ResponsiveProvider:
try {
  // Validate configuration
  const validatedConfig = validateConfig(config);
  
  // Check for required properties
  if (!validatedConfig.base || !validatedConfig.breakpoints) {
    throw new Error('Missing required configuration: base and breakpoints are required');
  }
  
  // Validate breakpoint data
  validatedConfig.breakpoints.forEach((breakpoint, index) => {
    if (!breakpoint.name || !breakpoint.width || !breakpoint.height) {
      throw new Error(\`Invalid breakpoint at index \${index}: missing required properties\`);
    }
    
    if (breakpoint.width <= 0 || breakpoint.height <= 0) {
      throw new Error(\`Invalid breakpoint dimensions at index \${index}: width and height must be positive\`);
    }
  });
  
  // Check for duplicate breakpoint names
  const names = validatedConfig.breakpoints.map(b => b.name);
  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    throw new Error('Duplicate breakpoint names found');
  }
  
} catch (error) {
  console.error('❌ ResponsiveProvider configuration error:', error);
  
  // Fallback to default configuration
  const fallbackConfig = createFallbackConfig();
  console.warn('⚠️ Using fallback configuration:', fallbackConfig);
  
  // Continue with fallback
  return <ResponsiveProvider config={fallbackConfig}>{children}</ResponsiveProvider>;
}`}
        language="tsx"
        title="Error Handling"
        showCopy
        showLineNumbers
      />

      <h2>Advanced Configuration</h2>
      <p>
        The provider supports advanced configuration options for enterprise use cases:
      </p>

      <CodeBlock
        code={`// Advanced configuration example:
const advancedConfig: ResponsiveConfig = {
  base: { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' },
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
  ],
  strategy: {
    mode: 'custom',
    origin: 'center',
    curve: (ratio: number) => Math.pow(ratio, 1.2),
    tokens: {
      fontSize: { scale: 0.8, min: 14, max: 64, step: 1 },
      spacing: { scale: 0.9, min: 4, max: 128, step: 4 },
      radius: { scale: 0.95, min: 0, max: 32, step: 1 },
      shadow: { scale: 0.6, min: 0, max: 64, step: 2 }
    }
  },
  development: {
    enableDebugMode: process.env.NODE_ENV === 'development',
    showScalingInfo: true,
    logScalingCalculations: true,
    showPerformanceMetrics: true,
    showScalingVisualization: true
  },
  performance: {
    enableCaching: true,
    cacheSize: 1000,
    enableOptimizations: true,
    enableMonitoring: true
  },
  visual: {
    enableSmoothTransitions: true,
    transitionDuration: 300,
    enableReducedMotion: true
  }
};`}
        language="typescript"
        title="Advanced Configuration"
        showCopy
        showLineNumbers
      />

      <h2>Testing the Provider</h2>
      <p>
        You can test that the provider is working correctly by checking the console and using the debug features:
      </p>

      <CodeBlock
        code={`// Test that the provider is working:
function TestComponent() {
  const { currentBreakpoint, scalingRatios } = useResponsiveContext();
  
  useEffect(() => {
    // Check console for debug logs
    console.log('Current breakpoint:', currentBreakpoint);
    console.log('Scaling ratios:', scalingRatios);
    
    // Test scaling
    const testValue = 48;
    const scaledValue = testValue * scalingRatios[currentBreakpoint.alias];
    console.log(\`\${testValue}px scales to \${scaledValue}px on \${currentBreakpoint.name}\`);
  }, [currentBreakpoint, scalingRatios]);
  
  return (
    <div className="p-4 border rounded">
      <h3>Provider Test</h3>
      <p>Current breakpoint: <strong>{currentBreakpoint.name}</strong></p>
      <p>Viewport: {currentBreakpoint.width} × {currentBreakpoint.height}</p>
      <p>Scaling ratio: {scalingRatios[currentBreakpoint.alias]}</p>
    </div>
  );
}`}
        language="tsx"
        title="Testing Component"
        showCopy
        showLineNumbers
      />

      <h2>Common Issues & Solutions</h2>
      
      <div className="not-prose">
        <div className="my-8 rounded-lg bg-yellow-50 p-6 dark:bg-yellow-950/20">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
            ⚠️ Common Issues
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Provider not wrapping components</h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Make sure <code>ResponsiveProvider</code> wraps all components that need responsive features.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Configuration errors</h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Check console for configuration validation errors. Ensure all required properties are provided.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Performance issues</h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Enable performance monitoring and check for excessive re-renders or calculations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2>Next Steps</h2>
      <p>Now that you understand the ResponsiveProvider, explore these related topics:</p>

      <ul>
        <li><Link href="/docs/core-concepts">Core Concepts</Link> - Understand the fundamental principles</li>
        <li><Link href="/docs/breakpoints">Breakpoints</Link> - Learn how to configure breakpoints</li>
        <li><Link href="/docs/scaling-engine">Scaling Engine</Link> - Dive into the mathematical scaling</li>
        <li><Link href="/docs/hooks/use-responsive-value">useResponsiveValue Hook</Link> - Start using responsive values</li>
        <li><Link href="/playground">Interactive Playground</Link> - Test the provider in action</li>
      </ul>

      <div className="not-prose mt-8">
        <Link href="/docs/breakpoints">
          <Button>
            Continue to Breakpoints →
          </Button>
        </Link>
      </div>
    </div>
  );
}
