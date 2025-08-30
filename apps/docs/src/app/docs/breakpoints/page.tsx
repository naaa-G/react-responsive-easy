import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Breakpoints',
  description: 'Learn how to configure breakpoints and define your responsive strategy in React Responsive Easy.',
};

export default function BreakpointsPage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <h1>Breakpoints</h1>
      <p>
        Breakpoints in React Responsive Easy are more than just CSS media query breakpoints—they're 
        mathematical reference points that define how your design scales across different viewport sizes.
      </p>

      <div className="not-prose mb-8">
        <Link href="/playground">
          <Button>
            Try in Playground
          </Button>
        </Link>
      </div>

      <h2>Understanding Breakpoints</h2>
      <p>
        Unlike traditional CSS breakpoints that trigger layout changes, React Responsive Easy breakpoints 
        define scaling ratios and mathematical relationships between different viewport sizes.
      </p>

      <div className="not-prose">
        <div className="my-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-950/20">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            🎯 Key Differences from Traditional Breakpoints
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-2">
            <li>• <strong>Mathematical scaling:</strong> Not just layout changes, but precise scaling ratios</li>
            <li>• <strong>Continuous scaling:</strong> Smooth transitions between breakpoints, not abrupt jumps</li>
            <li>• <strong>Design-first approach:</strong> Design for largest viewport, scale down automatically</li>
            <li>• <strong>Performance optimized:</strong> Pre-computed values, not runtime CSS calculations</li>
          </ul>
        </div>
      </div>

      <h2>Breakpoint Structure</h2>
      <p>
        Each breakpoint is defined with specific properties that determine how scaling works:
      </p>

      <CodeBlock
        code={`interface Breakpoint {
  name: string;        // Human-readable name (e.g., "Mobile", "Tablet", "Desktop")
  width: number;       // Viewport width in pixels
  height: number;      // Viewport height in pixels
  alias: string;       // Short identifier (e.g., "mobile", "tablet", "desktop")
  metadata?: {         // Optional additional information
    orientation?: 'portrait' | 'landscape';
    deviceType?: 'mobile' | 'tablet' | 'desktop' | 'tv';
    capabilities?: string[];  // ['touch', 'hover', 'pointer-fine', etc.]
    pixelDensity?: number;   // Device pixel ratio
  };
}

// Example breakpoint definitions
const breakpoints: Breakpoint[] = [
  {
    name: 'Mobile',
    width: 375,
    height: 667,
    alias: 'mobile',
    metadata: {
      orientation: 'portrait',
      deviceType: 'mobile',
      capabilities: ['touch'],
      pixelDensity: 2
    }
  },
  {
    name: 'Tablet',
    width: 768,
    height: 1024,
    alias: 'tablet',
    metadata: {
      orientation: 'portrait',
      deviceType: 'tablet',
      capabilities: ['touch', 'hover'],
      pixelDensity: 2
    }
  },
  {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    alias: 'desktop',
    metadata: {
      orientation: 'landscape',
      deviceType: 'desktop',
      capabilities: ['hover', 'pointer-fine'],
      pixelDensity: 1
    }
  }
];`}
        language="typescript"
        title="Breakpoint Interface"
        showCopy
        showLineNumbers
      />

      <h2>Base Breakpoint Concept</h2>
      <p>
        The <strong>base breakpoint</strong> is your design reference point—usually the largest viewport 
        you design for. All other breakpoints scale relative to this base.
      </p>

      <CodeBlock
        code={`// Base breakpoint configuration
const responsiveConfig = {
  // This is your design reference point
  base: {
    name: 'Desktop',
    width: 1920,    // Design for 1920px width
    height: 1080,   // Design for 1080px height
    alias: 'desktop'
  },
  
  // All other breakpoints scale relative to the base
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
  ]
};

// Scaling calculation example:
// Mobile scaling ratio = 375 / 1920 = 0.195
// Tablet scaling ratio = 768 / 1920 = 0.4
// Desktop scaling ratio = 1920 / 1920 = 1.0

// A 48px font on desktop becomes:
// Mobile: 48 * 0.195 = 9.36px (constrained to minimum 12px)
// Tablet: 48 * 0.4 = 19.2px
// Desktop: 48 * 1.0 = 48px`}
        language="typescript"
        title="Base Breakpoint Example"
        showCopy
        showLineNumbers
      />

      <h2>Breakpoint Configuration Strategies</h2>
      <p>
        Different projects require different breakpoint strategies. Here are common approaches:
      </p>

      <h3>1. Standard Device Breakpoints</h3>
      <CodeBlock
        code={`// Standard device breakpoints (most common)
const standardBreakpoints = {
  base: { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' },
  breakpoints: [
    { name: 'Mobile Small', width: 320, height: 568, alias: 'mobile-s' },
    { name: 'Mobile Large', width: 414, height: 896, alias: 'mobile-l' },
    { name: 'Tablet Portrait', width: 768, height: 1024, alias: 'tablet-p' },
    { name: 'Tablet Landscape', width: 1024, height: 768, alias: 'tablet-l' },
    { name: 'Desktop Small', width: 1366, height: 768, alias: 'desktop-s' },
    { name: 'Desktop Large', width: 1920, height: 1080, alias: 'desktop-l' },
    { name: 'Ultra Wide', width: 2560, height: 1440, alias: 'ultra-wide' }
  ]
};`}
        language="typescript"
        title="Standard Device Breakpoints"
        showCopy
        showLineNumbers
      />

      <h3>2. Content-First Breakpoints</h3>
      <CodeBlock
        code={`// Content-first breakpoints (based on content needs)
const contentFirstBreakpoints = {
  base: { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' },
  breakpoints: [
    { name: 'Narrow Content', width: 600, height: 800, alias: 'narrow' },
    { name: 'Medium Content', width: 900, height: 900, alias: 'medium' },
    { name: 'Wide Content', width: 1200, height: 900, alias: 'wide' },
    { name: 'Full Content', width: 1440, height: 900, alias: 'full' }
  ]
};

// This approach focuses on content readability rather than device sizes
// Breakpoints are chosen where content layout naturally changes`}
        language="typescript"
        title="Content-First Breakpoints"
        showCopy
        showLineNumbers
      />

      <h3>3. Custom Business Breakpoints</h3>
      <CodeBlock
        code={`// Custom business-specific breakpoints
const businessBreakpoints = {
  base: { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' },
  breakpoints: [
    { name: 'Phone', width: 375, height: 667, alias: 'phone' },
    { name: 'Small Tablet', width: 600, height: 800, alias: 'small-tablet' },
    { name: 'Large Tablet', width: 900, height: 1200, alias: 'large-tablet' },
    { name: 'Small Desktop', width: 1200, height: 800, alias: 'small-desktop' },
    { name: 'Standard Desktop', width: 1600, height: 900, alias: 'standard-desktop' },
    { name: 'Large Desktop', width: 1920, height: 1080, alias: 'large-desktop' },
    { name: 'Conference Room', width: 2560, height: 1440, alias: 'conference' }
  ]
};

// Business-specific names make it easier for stakeholders to understand
// and discuss responsive behavior`}
        language="typescript"
        title="Custom Business Breakpoints"
        showCopy
        showLineNumbers
      />

      <h2>Breakpoint Detection Logic</h2>
      <p>
        React Responsive Easy uses intelligent breakpoint detection that goes beyond simple width thresholds:
      </p>

      <CodeBlock
        code={`// Breakpoint detection algorithm
function detectBreakpoint(width: number, height: number, breakpoints: Breakpoint[]): Breakpoint {
  // 1. Find the best matching breakpoint
  let bestMatch = breakpoints[0];
  let bestScore = 0;
  
  for (const breakpoint of breakpoints) {
    // Calculate match score based on multiple factors
    const widthScore = calculateWidthScore(width, breakpoint.width);
    const heightScore = calculateHeightScore(height, breakpoint.height);
    const aspectRatioScore = calculateAspectRatioScore(width, height, breakpoint);
    const deviceCapabilityScore = calculateDeviceCapabilityScore(breakpoint);
    
    const totalScore = widthScore + heightScore + aspectRatioScore + deviceCapabilityScore;
    
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMatch = breakpoint;
    }
  }
  
  return bestMatch;
}

// Width scoring (closer width = higher score)
function calculateWidthScore(actualWidth: number, targetWidth: number): number {
  const difference = Math.abs(actualWidth - targetWidth);
  const maxDifference = 1000; // Maximum expected difference
  return Math.max(0, 100 - (difference / maxDifference) * 100);
}

// Height scoring (closer height = higher score)
function calculateHeightScore(actualHeight: number, targetHeight: number): number {
  const difference = Math.abs(actualHeight - targetHeight);
  const maxDifference = 1000;
  return Math.max(0, 100 - (difference / maxDifference) * 100);
}

// Aspect ratio scoring (orientation matching)
function calculateAspectRatioScore(width: number, height: number, breakpoint: Breakpoint): number {
  const actualRatio = width / height;
  const targetRatio = breakpoint.width / breakpoint.height;
  const ratioDifference = Math.abs(actualRatio - targetRatio);
  
  // Higher score for matching orientation
  if ((actualRatio > 1 && targetRatio > 1) || (actualRatio < 1 && targetRatio < 1)) {
    return 50 - ratioDifference * 10;
  }
  
  return 0;
}

// Device capability scoring
function calculateDeviceCapabilityScore(breakpoint: Breakpoint): number {
  let score = 0;
  
  // Check if current device capabilities match breakpoint expectations
  if (breakpoint.metadata?.capabilities) {
    const hasTouch = 'ontouchstart' in window;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    if (breakpoint.metadata.capabilities.includes('touch') && hasTouch) score += 25;
    if (breakpoint.metadata.capabilities.includes('hover') && hasHover) score += 25;
  }
  
  return score;
}`}
        language="typescript"
        title="Breakpoint Detection Algorithm"
        showCopy
        showLineNumbers
      />

      <h2>Dynamic Breakpoint Updates</h2>
      <p>
        Breakpoints can be updated dynamically based on user preferences, device capabilities, or business rules:
      </p>

      <CodeBlock
        code={`// Dynamic breakpoint configuration
function useDynamicBreakpoints() {
  const [breakpoints, setBreakpoints] = useState(defaultBreakpoints);
  
  // Update breakpoints based on user preferences
  useEffect(() => {
    const userPreferences = getUserPreferences();
    
    if (userPreferences.largeText) {
      // Adjust breakpoints for better readability
      setBreakpoints(prev => prev.map(bp => ({
        ...bp,
        width: Math.round(bp.width * 1.2),
        height: Math.round(bp.height * 1.2)
      })));
    }
    
    if (userPreferences.reducedMotion) {
      // Use fewer breakpoints for smoother transitions
      setBreakpoints(prev => prev.filter((_, index) => index % 2 === 0));
    }
  }, []);
  
  // Update breakpoints based on device capabilities
  useEffect(() => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    if (devicePixelRatio > 2) {
      // High DPI devices might need different breakpoints
      setBreakpoints(prev => prev.map(bp => ({
        ...bp,
        width: Math.round(bp.width * 0.8),
        height: Math.round(bp.height * 0.8)
      })));
    }
  }, []);
  
  return breakpoints;
}

// Usage in ResponsiveProvider
function ResponsiveProvider({ children }) {
  const dynamicBreakpoints = useDynamicBreakpoints();
  
  const config = {
    base: dynamicBreakpoints[0], // First breakpoint becomes base
    breakpoints: dynamicBreakpoints,
    strategy: defaultStrategy
  };
  
  return (
    <ResponsiveProvider config={config}>
      {children}
    </ResponsiveProvider>
  );
}`}
        language="tsx"
        title="Dynamic Breakpoint Updates"
        showCopy
        showLineNumbers
      />

      <h2>Breakpoint Testing & Validation</h2>
      <p>
        Test your breakpoint configuration to ensure it works correctly across different scenarios:
      </p>

      <CodeBlock
        code={`// Breakpoint testing utility
function testBreakpoints(breakpoints: Breakpoint[]) {
  const testCases = [
    { width: 320, height: 568, expected: 'mobile' },
    { width: 768, height: 1024, expected: 'tablet' },
    { width: 1920, height: 1080, expected: 'desktop' },
    { width: 2560, height: 1440, expected: 'ultra-wide' }
  ];
  
  console.log('🧪 Testing breakpoint detection...');
  
  testCases.forEach(({ width, height, expected }) => {
    const detected = detectBreakpoint(width, height, breakpoints);
    const passed = detected.alias === expected;
    
    console.log(\`\${passed ? '✅' : '❌'} \${width}×\${height} → \${detected.alias} (expected: \${expected})\`);
    
    if (!passed) {
      console.warn(\`   Expected \${expected}, got \${detected.alias}\`);
    }
  });
}

// Test scaling ratios
function testScalingRatios(base: Breakpoint, breakpoints: Breakpoint[]) {
  console.log('📏 Testing scaling ratios...');
  
  breakpoints.forEach(bp => {
    const widthRatio = bp.width / base.width;
    const heightRatio = bp.height / base.height;
    
    console.log(\`\${bp.name} (\${bp.alias}):\`);
    console.log(\`  Width ratio: \${widthRatio.toFixed(3)}\`);
    console.log(\`  Height ratio: \${heightRatio.toFixed(3)}\`);
    console.log(\`  Scaling factor: \${((widthRatio + heightRatio) / 2).toFixed(3)}\`);
  });
}

// Run tests
const config = {
  base: { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' },
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
  ]
};

testBreakpoints(config.breakpoints);
testScalingRatios(config.base, config.breakpoints);`}
        language="typescript"
        title="Breakpoint Testing"
        showCopy
        showLineNumbers
      />

      <h2>Best Practices</h2>
      
      <div className="not-prose">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="rounded-lg bg-green-50 p-6 dark:bg-green-950/20">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              ✅ Do's
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
              <li>• Start with your largest design as the base breakpoint</li>
              <li>• Use meaningful names that your team understands</li>
              <li>• Test breakpoints across real devices and browsers</li>
              <li>• Consider content needs, not just device sizes</li>
              <li>• Document your breakpoint strategy for the team</li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-red-50 p-6 dark:bg-red-950/20">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
              ❌ Don'ts
            </h3>
            <ul className="text-red-800 dark:text-red-200 space-y-2 text-sm">
              <li>• Don't use too many breakpoints (3-7 is ideal)</li>
              <li>• Don't copy breakpoints without understanding your content</li>
              <li>• Don't ignore device capabilities and user preferences</li>
              <li>• Don't forget to test edge cases and unusual viewport sizes</li>
              <li>• Don't make breakpoints too close together</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Common Breakpoint Patterns</h2>
      <p>
        Here are some proven breakpoint patterns for different types of applications:
      </p>

      <h3>E-commerce Applications</h3>
      <CodeBlock
        code={`const ecommerceBreakpoints = {
  base: { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' },
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Small Desktop', width: 1366, height: 768, alias: 'small-desktop' },
    { name: 'Large Desktop', width: 1920, height: 1080, alias: 'large-desktop' }
  ]
};

// Focus on shopping experience across devices
// Mobile: Single column, large touch targets
// Tablet: Two columns, touch-friendly
// Desktop: Multi-column, hover interactions`}
        language="typescript"
        title="E-commerce Breakpoints"
        showCopy
        showLineNumbers
      />

      <h3>Dashboard Applications</h3>
      <CodeBlock
        code={`const dashboardBreakpoints = {
  base: { name: 'Large Desktop', width: 2560, height: 1440, alias: 'large-desktop' },
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Small Desktop', width: 1366, height: 768, alias: 'small-desktop' },
    { name: 'Standard Desktop', width: 1920, height: 1080, alias: 'standard-desktop' },
    { name: 'Large Desktop', width: 2560, height: 1440, alias: 'large-desktop' }
  ]
};

// Dashboard needs more breakpoints for data visualization
// Each breakpoint can show different amounts of information
// Larger screens can display more charts and data simultaneously`}
        language="typescript"
        title="Dashboard Breakpoints"
        showCopy
        showLineNumbers
      />

      <h2>Next Steps</h2>
      <p>Now that you understand breakpoints, explore these related topics:</p>

      <ul>
        <li><Link href="/docs/core-concepts">Core Concepts</Link> - Understand the fundamental principles</li>
        <li><Link href="/docs/responsive-provider">Responsive Provider</Link> - Learn how the provider works</li>
        <li><Link href="/docs/scaling-engine">Scaling Engine</Link> - Dive into the mathematical scaling</li>
        <li><Link href="/docs/configuration">Configuration</Link> - Learn about advanced configuration options</li>
        <li><Link href="/playground">Interactive Playground</Link> - Test different breakpoint configurations</li>
      </ul>

      <div className="not-prose mt-8">
        <Link href="/docs/scaling-engine">
          <Button>
            Continue to Scaling Engine →
          </Button>
        </Link>
      </div>
    </div>
  );
}
