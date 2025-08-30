import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Scaling Engine',
  description: 'Dive deep into the mathematical scaling algorithms that power React Responsive Easy.',
};

export default function ScalingEnginePage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <h1>Scaling Engine</h1>
      <p>
        The Scaling Engine is the mathematical heart of React Responsive Easy. It transforms your design 
        values into perfectly scaled versions across all breakpoints using sophisticated algorithms and 
        mathematical precision.
      </p>

      <div className="not-prose mb-8">
        <Link href="/playground">
          <Button>
            Try in Playground
          </Button>
        </Link>
      </div>

      <h2>How the Scaling Engine Works</h2>
      <p>
        The scaling engine operates on a simple but powerful principle: <strong>mathematical relationships</strong>. 
        Instead of arbitrary CSS rules, it calculates exact scaling ratios between viewport sizes.
      </p>

      <div className="not-prose">
        <div className="my-8 rounded-lg bg-purple-50 p-6 dark:bg-purple-950/20">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
            🧮 The Core Scaling Formula
          </h3>
          <p className="text-purple-800 dark:text-purple-200">
            <strong>Scaled Value = Original Value × Viewport Ratio × Token Multiplier</strong><br/>
            This formula ensures perfect mathematical scaling across all devices.
          </p>
        </div>
      </div>

      <h2>1. Basic Scaling Algorithm</h2>
      <p>
        At its core, the scaling engine uses viewport ratios to calculate scaled values:
      </p>

      <CodeBlock
        code={`// Basic scaling algorithm
function scaleValue(
  originalValue: number,
  fromBreakpoint: Breakpoint,
  toBreakpoint: Breakpoint
): number {
  // Calculate viewport ratio
  const widthRatio = toBreakpoint.width / fromBreakpoint.width;
  const heightRatio = toBreakpoint.height / fromBreakpoint.height;
  
  // Use width ratio for horizontal scaling (most common)
  // Use height ratio for vertical scaling (when needed)
  const scalingRatio = widthRatio;
  
  // Apply scaling
  const scaledValue = originalValue * scalingRatio;
  
  return scaledValue;
}

// Example usage:
const desktopValue = 48; // 48px font on desktop
const mobileBreakpoint = { width: 375, height: 667, alias: 'mobile' };
const desktopBreakpoint = { width: 1920, height: 1080, alias: 'desktop' };

const mobileValue = scaleValue(desktopValue, desktopBreakpoint, mobileBreakpoint);
// mobileValue = 48 * (375 / 1920) = 48 * 0.195 = 9.375px

console.log(\`\${desktopValue}px on desktop scales to \${mobileValue.toFixed(2)}px on mobile\`);`}
        language="typescript"
        title="Basic Scaling Algorithm"
        showCopy
        showLineNumbers
      />

      <h2>2. Advanced Scaling with Tokens</h2>
      <p>
        The scaling engine supports different scaling behaviors for different CSS properties through tokens:
      </p>

      <CodeBlock
        code={`// Advanced scaling with token configuration
interface ScalingToken {
  scale?: number;        // Custom scaling multiplier (default: 1)
  min?: number;          // Minimum value constraint
  max?: number;          // Maximum value constraint
  step?: number;         // Rounding step (e.g., 2 for even numbers)
  curve?: 'linear' | 'exponential' | 'logarithmic' | 'custom';
  customCurve?: (ratio: number) => number;
}

function scaleValueAdvanced(
  originalValue: number,
  fromBreakpoint: Breakpoint,
  toBreakpoint: Breakpoint,
  token: ScalingToken = {}
): number {
  // 1. Calculate base viewport ratio
  const baseRatio = toBreakpoint.width / fromBreakpoint.width;
  
  // 2. Apply token-specific scaling
  let scalingRatio = baseRatio;
  
  if (token.scale !== undefined) {
    scalingRatio *= token.scale;
  }
  
  // 3. Apply custom curve if specified
  if (token.curve === 'exponential') {
    scalingRatio = Math.pow(scalingRatio, 1.2); // Exponential scaling
  } else if (token.curve === 'logarithmic') {
    scalingRatio = Math.log(scalingRatio + 1) / Math.log(2); // Logarithmic scaling
  } else if (token.curve === 'custom' && token.customCurve) {
    scalingRatio = token.customCurve(baseRatio);
  }
  
  // 4. Calculate scaled value
  let scaledValue = originalValue * scalingRatio;
  
  // 5. Apply constraints
  if (token.min !== undefined) {
    scaledValue = Math.max(scaledValue, token.min);
  }
  
  if (token.max !== undefined) {
    scaledValue = Math.min(scaledValue, token.max);
  }
  
  // 6. Apply rounding step
  if (token.step !== undefined) {
    scaledValue = Math.round(scaledValue / token.step) * token.step;
  }
  
  return scaledValue;
}

// Example token configurations
const tokenConfig = {
  fontSize: { 
    scale: 0.85,    // Fonts scale conservatively
    min: 12,        // Never smaller than 12px
    max: 64,        // Never larger than 64px
    step: 1         // Round to nearest pixel
  },
  spacing: { 
    scale: 0.9,     // Spacing scales smoothly
    min: 4,         // Minimum 4px spacing
    step: 4         // Round to nearest 4px
  },
  radius: { 
    scale: 0.95,    // Border radius scales very smoothly
    min: 0,         // Can be 0px
    step: 1         // Round to nearest pixel
  },
  shadow: { 
    scale: 0.7,     // Shadows scale dramatically
    min: 0,         // Can be 0px
    step: 2         // Round to nearest 2px
  }
};

// Usage example
const fontSize = scaleValueAdvanced(48, desktopBreakpoint, mobileBreakpoint, tokenConfig.fontSize);
const padding = scaleValueAdvanced(32, desktopBreakpoint, mobileBreakpoint, tokenConfig.spacing);
const borderRadius = scaleValueAdvanced(12, desktopBreakpoint, mobileBreakpoint, tokenConfig.radius);

console.log(\`Font: \${fontSize}px, Padding: \${padding}px, Radius: \${borderRadius}px\`);`}
        language="typescript"
        title="Advanced Scaling with Tokens"
        showCopy
        showLineNumbers
      />

      <h2>3. Multi-Dimensional Scaling</h2>
      <p>
        The scaling engine can handle complex multi-dimensional scaling scenarios:
      </p>

      <CodeBlock
        code={`// Multi-dimensional scaling
interface ScalingStrategy {
  mode: 'width' | 'height' | 'both' | 'custom';
  origin: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  widthWeight?: number;  // Weight for width-based scaling
  heightWeight?: number; // Weight for height-based scaling
}

function scaleValueMultiDimensional(
  originalValue: number,
  fromBreakpoint: Breakpoint,
  toBreakpoint: Breakpoint,
  token: ScalingToken,
  strategy: ScalingStrategy
): number {
  let scalingRatio = 1;
  
  switch (strategy.mode) {
    case 'width':
      // Scale based on width only
      scalingRatio = toBreakpoint.width / fromBreakpoint.width;
      break;
      
    case 'height':
      // Scale based on height only
      scalingRatio = toBreakpoint.height / fromBreakpoint.height;
      break;
      
    case 'both':
      // Scale based on both width and height with weights
      const widthRatio = toBreakpoint.width / fromBreakpoint.width;
      const heightRatio = toBreakpoint.height / fromBreakpoint.height;
      const widthWeight = strategy.widthWeight || 0.7;
      const heightWeight = strategy.heightWeight || 0.3;
      
      scalingRatio = (widthRatio * widthWeight) + (heightRatio * heightWeight);
      break;
      
    case 'custom':
      // Custom scaling logic
      const areaRatio = (toBreakpoint.width * toBreakpoint.height) / 
                       (fromBreakpoint.width * fromBreakpoint.height);
      scalingRatio = Math.sqrt(areaRatio); // Square root for area-based scaling
      break;
  }
  
  // Apply token scaling and constraints
  return scaleValueAdvanced(originalValue, fromBreakpoint, toBreakpoint, token, scalingRatio);
}

// Example usage with different strategies
const strategies = {
  // Standard width-based scaling (most common)
  standard: { mode: 'width', origin: 'top-left' },
  
  // Height-based scaling for vertical layouts
  vertical: { mode: 'height', origin: 'top-left' },
  
  // Balanced scaling for square elements
  balanced: { 
    mode: 'both', 
    origin: 'center',
    widthWeight: 0.5,
    heightWeight: 0.5
  },
  
  // Area-based scaling for complex layouts
  area: { mode: 'custom', origin: 'center' }
};

// Test different strategies
const testValue = 100;
console.log('Standard scaling:', scaleValueMultiDimensional(testValue, desktopBreakpoint, mobileBreakpoint, {}, strategies.standard));
console.log('Vertical scaling:', scaleValueMultiDimensional(testValue, desktopBreakpoint, mobileBreakpoint, {}, strategies.vertical));
console.log('Balanced scaling:', scaleValueMultiDimensional(testValue, desktopBreakpoint, mobileBreakpoint, {}, strategies.balanced));
console.log('Area scaling:', scaleValueMultiDimensional(testValue, desktopBreakpoint, mobileBreakpoint, {}, strategies.area));`}
        language="typescript"
        title="Multi-Dimensional Scaling"
        showCopy
        showLineNumbers
      />

      <h2>4. Scaling Curves and Functions</h2>
      <p>
        The scaling engine supports various mathematical curves for different scaling behaviors:
      </p>

      <CodeBlock
        code={`// Scaling curves and functions
type ScalingCurve = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'exponential' | 'logarithmic';

interface CurveConfig {
  type: ScalingCurve;
  factor?: number;        // Curve intensity factor
  customFunction?: (ratio: number) => number;
}

function applyScalingCurve(ratio: number, curve: CurveConfig): number {
  switch (curve.type) {
    case 'linear':
      return ratio;
      
    case 'ease-in':
      return Math.pow(ratio, 2);
      
    case 'ease-out':
      return 1 - Math.pow(1 - ratio, 2);
      
    case 'ease-in-out':
      return ratio < 0.5 
        ? 2 * Math.pow(ratio, 2) 
        : 1 - 2 * Math.pow(1 - ratio, 2);
      
    case 'exponential':
      const factor = curve.factor || 1.5;
      return Math.pow(ratio, factor);
      
    case 'logarithmic':
      return Math.log(ratio + 1) / Math.log(2);
      
    case 'custom':
      return curve.customFunction ? curve.customFunction(ratio) : ratio;
      
    default:
      return ratio;
  }
}

// Custom scaling functions
const customCurves = {
  // Dramatic scaling for hero elements
  dramatic: (ratio: number) => Math.pow(ratio, 2.5),
  
  // Subtle scaling for fine details
  subtle: (ratio: number) => Math.pow(ratio, 0.7),
  
  // Bounce effect for interactive elements
  bounce: (ratio: number) => {
    if (ratio < 0.5) {
      return 2 * ratio * ratio;
    } else {
      return 1 - 2 * (1 - ratio) * (1 - ratio);
    }
  },
  
  // Stair-step scaling for grid-based layouts
  stairStep: (ratio: number) => {
    const steps = 4;
    return Math.floor(ratio * steps) / steps;
  }
};

// Example usage
const curveConfig: CurveConfig = {
  type: 'custom',
  customFunction: customCurves.dramatic
};

const dramaticValue = scaleValueAdvanced(48, desktopBreakpoint, mobileBreakpoint, {
  ...tokenConfig.fontSize,
  curve: 'custom',
  customCurve: customCurves.dramatic
});

console.log('Dramatic scaling:', dramaticValue);`}
        language="typescript"
        title="Scaling Curves and Functions"
        showCopy
        showLineNumbers
      />

      <h2>5. Performance Optimizations</h2>
      <p>
        The scaling engine includes several performance optimizations for production use:
      </p>

      <div className="not-prose">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="rounded-lg bg-green-50 p-6 dark:bg-green-950/20">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              🚀 Build-Time Optimization
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
              <li>• Pre-computed scaling ratios</li>
              <li>• Zero runtime calculations</li>
              <li>• Optimized bundle size</li>
              <li>• Tree-shaking support</li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-950/20">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              💾 Runtime Caching
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
              <li>• Memoized calculations</li>
              <li>• Breakpoint change detection</li>
              <li>• Selective re-computation</li>
              <li>• Memory-efficient storage</li>
            </ul>
          </div>
        </div>
      </div>

      <CodeBlock
        code={`// Performance-optimized scaling engine
class OptimizedScalingEngine {
  private cache = new Map<string, number>();
  private breakpointCache = new Map<string, Breakpoint>();
  private ratioCache = new Map<string, number>();
  
  constructor(private config: ResponsiveConfig) {
    // Pre-compute all scaling ratios at initialization
    this.precomputeRatios();
  }
  
  private precomputeRatios(): void {
    const { base, breakpoints } = this.config;
    
    breakpoints.forEach(breakpoint => {
      const key = \`\${base.alias}-\${breakpoint.alias}\`;
      const ratio = breakpoint.width / base.width;
      this.ratioCache.set(key, ratio);
    });
  }
  
  scaleValue(
    originalValue: number,
    fromBreakpoint: Breakpoint,
    toBreakpoint: Breakpoint,
    token: ScalingToken = {}
  ): number {
    // Create cache key
    const cacheKey = \`\${originalValue}-\${fromBreakpoint.alias}-\${toBreakpoint.alias}-\${JSON.stringify(token)}\`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    // Get cached ratio
    const ratioKey = \`\${fromBreakpoint.alias}-\${toBreakpoint.alias}\`;
    const baseRatio = this.ratioCache.get(ratioKey) || 1;
    
    // Calculate scaled value
    const scaledValue = this.calculateScaledValue(originalValue, baseRatio, token);
    
    // Cache result
    this.cache.set(cacheKey, scaledValue);
    
    return scaledValue;
  }
  
  private calculateScaledValue(value: number, ratio: number, token: ScalingToken): number {
    let scaledValue = value * ratio;
    
    // Apply token scaling
    if (token.scale !== undefined) {
      scaledValue *= token.scale;
    }
    
    // Apply constraints
    if (token.min !== undefined) {
      scaledValue = Math.max(scaledValue, token.min);
    }
    
    if (token.max !== undefined) {
      scaledValue = Math.min(scaledValue, token.max);
    }
    
    // Apply rounding
    if (token.step !== undefined) {
      scaledValue = Math.round(scaledValue / token.step) * token.step;
    }
    
    return scaledValue;
  }
  
  // Clear cache when configuration changes
  clearCache(): void {
    this.cache.clear();
    this.ratioCache.clear();
    this.precomputeRatios();
  }
  
  // Get cache statistics
  getCacheStats(): { cacheSize: number; ratioCacheSize: number } {
    return {
      cacheSize: this.cache.size,
      ratioCacheSize: this.ratioCache.size
    };
  }
}

// Usage
const scalingEngine = new OptimizedScalingEngine(responsiveConfig);

// First call - calculates and caches
const fontSize1 = scalingEngine.scaleValue(48, desktopBreakpoint, mobileBreakpoint, tokenConfig.fontSize);

// Second call - returns cached result instantly
const fontSize2 = scalingEngine.scaleValue(48, desktopBreakpoint, mobileBreakpoint, tokenConfig.fontSize);

console.log('Cache stats:', scalingEngine.getCacheStats());`}
        language="typescript"
        title="Performance-Optimized Scaling Engine"
        showCopy
        showLineNumbers
      />

      <h2>6. Real-World Scaling Examples</h2>
      <p>
        Here are practical examples of how the scaling engine works in real applications:
      </p>

      <CodeBlock
        code={`// Real-world scaling examples
const realWorldExamples = {
  // Typography scaling
  typography: {
    h1: { fontSize: 64, lineHeight: 1.1, fontWeight: 700 },
    h2: { fontSize: 48, lineHeight: 1.2, fontWeight: 600 },
    h3: { fontSize: 32, lineHeight: 1.3, fontWeight: 600 },
    body: { fontSize: 18, lineHeight: 1.6, fontWeight: 400 },
    caption: { fontSize: 14, lineHeight: 1.4, fontWeight: 500 }
  },
  
  // Spacing system
  spacing: {
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 16,   // 16px
    lg: 24,   // 24px
    xl: 32,   // 32px
    xxl: 48   // 48px
  },
  
  // Component dimensions
  components: {
    button: { height: 48, padding: 16, borderRadius: 8 },
    input: { height: 40, padding: 12, borderRadius: 6 },
    card: { padding: 24, borderRadius: 12, shadow: 4 }
  }
};

// Scale typography for mobile
function scaleTypographyForBreakpoint(breakpoint: Breakpoint) {
  const scaledTypography: Record<string, any> = {};
  
  Object.entries(realWorldExamples.typography).forEach(([key, styles]) => {
    scaledTypography[key] = {};
    
    Object.entries(styles).forEach(([property, value]) => {
      if (typeof value === 'number') {
        const token = property === 'fontSize' ? tokenConfig.fontSize : {};
        scaledTypography[key][property] = scalingEngine.scaleValue(
          value, 
          desktopBreakpoint, 
          breakpoint, 
          token
        );
      } else {
        scaledTypography[key][property] = value;
      }
    });
  });
  
  return scaledTypography;
}

// Scale spacing system
function scaleSpacingForBreakpoint(breakpoint: Breakpoint) {
  const scaledSpacing: Record<string, number> = {};
  
  Object.entries(realWorldExamples.spacing).forEach(([key, value]) => {
    scaledSpacing[key] = scalingEngine.scaleValue(
      value, 
      desktopBreakpoint, 
      breakpoint, 
      tokenConfig.spacing
    );
  });
  
  return scaledSpacing;
}

// Example usage
const mobileTypography = scaleTypographyForBreakpoint(mobileBreakpoint);
const mobileSpacing = scaleSpacingForBreakpoint(mobileBreakpoint);

console.log('Mobile Typography:', mobileTypography);
console.log('Mobile Spacing:', mobileSpacing);

// Apply scaled values to CSS
const mobileStyles = {
  '--h1-font-size': \`\${mobileTypography.h1.fontSize}px\`,
  '--h2-font-size': \`\${mobileTypography.h2.fontSize}px\`,
  '--spacing-md': \`\${mobileSpacing.md}px\`,
  '--spacing-lg': \`\${mobileSpacing.lg}px\`
};

// Apply to document root
Object.entries(mobileStyles).forEach(([property, value]) => {
  document.documentElement.style.setProperty(property, value);
});`}
        language="typescript"
        title="Real-World Scaling Examples"
        showCopy
        showLineNumbers
      />

      <h2>7. Testing and Validation</h2>
      <p>
        Test your scaling engine to ensure it produces the expected results:
      </p>

      <CodeBlock
        code={`// Scaling engine testing and validation
function testScalingEngine() {
  console.log('🧪 Testing Scaling Engine...');
  
  const testCases = [
    {
      name: 'Font Size Scaling',
      original: 48,
      expected: { mobile: 12, tablet: 24, desktop: 48 },
      token: tokenConfig.fontSize
    },
    {
      name: 'Spacing Scaling',
      original: 32,
      expected: { mobile: 8, tablet: 16, desktop: 32 },
      token: tokenConfig.spacing
    },
    {
      name: 'Border Radius Scaling',
      original: 16,
      expected: { mobile: 4, tablet: 8, desktop: 16 },
      token: tokenConfig.radius
    }
  ];
  
  testCases.forEach(testCase => {
    console.log(\`\\n📝 \${testCase.name}:\`);
    
    Object.entries(testCase.expected).forEach(([breakpointName, expectedValue]) => {
      const breakpoint = breakpoints.find(bp => bp.alias === breakpointName);
      if (!breakpoint) return;
      
      const actualValue = scalingEngine.scaleValue(
        testCase.original,
        desktopBreakpoint,
        breakpoint,
        testCase.token
      );
      
      const passed = Math.abs(actualValue - expectedValue) < 0.1;
      const status = passed ? '✅' : '❌';
      
      console.log(\`  \${status} \${breakpointName}: \${actualValue}px (expected: \${expectedValue}px)\`);
      
      if (!passed) {
        console.warn(\`    Difference: \${Math.abs(actualValue - expectedValue).toFixed(2)}px\`);
      }
    });
  });
}

// Performance testing
function testScalingPerformance() {
  console.log('\\n⚡ Performance Testing...');
  
  const iterations = 10000;
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    scalingEngine.scaleValue(
      Math.random() * 100,
      desktopBreakpoint,
      mobileBreakpoint,
      tokenConfig.fontSize
    );
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const averageTime = totalTime / iterations;
  
  console.log(\`  \${iterations} scaling operations in \${totalTime.toFixed(2)}ms\`);
  console.log(\`  Average time per operation: \${averageTime.toFixed(4)}ms\`);
  console.log(\`  Operations per second: \${(1000 / averageTime).toFixed(0)}\`);
}

// Run tests
testScalingEngine();
testScalingPerformance();`}
        language="typescript"
        title="Testing and Validation"
        showCopy
        showLineNumbers
      />

      <h2>8. Advanced Scaling Techniques</h2>
      <p>
        The scaling engine supports advanced techniques for complex use cases:
      </p>

      <CodeBlock
        code={`// Advanced scaling techniques
class AdvancedScalingEngine extends OptimizedScalingEngine {
  // Conditional scaling based on viewport characteristics
  scaleValueConditional(
    originalValue: number,
    fromBreakpoint: Breakpoint,
    toBreakpoint: Breakpoint,
    token: ScalingToken,
    conditions: ScalingConditions
  ): number {
    let scaledValue = this.scaleValue(originalValue, fromBreakpoint, toBreakpoint, token);
    
    // Apply conditional modifications
    if (conditions.orientation === 'portrait' && toBreakpoint.height > toBreakpoint.width) {
      scaledValue *= 1.1; // Slightly larger in portrait mode
    }
    
    if (conditions.devicePixelRatio > 2) {
      scaledValue *= 0.9; // Slightly smaller on high DPI devices
    }
    
    if (conditions.touchDevice) {
      scaledValue *= 1.2; // Larger touch targets
    }
    
    return scaledValue;
  }
  
  // Adaptive scaling based on content
  scaleValueAdaptive(
    originalValue: number,
    fromBreakpoint: Breakpoint,
    toBreakpoint: Breakpoint,
    token: ScalingToken,
    contentMetrics: ContentMetrics
  ): number {
    let scaledValue = this.scaleValue(originalValue, fromBreakpoint, toBreakpoint, token);
    
    // Adjust based on content density
    if (contentMetrics.textLength > 100) {
      scaledValue *= 0.9; // Smaller text for long content
    }
    
    if (contentMetrics.complexity === 'high') {
      scaledValue *= 1.1; // Larger elements for complex content
    }
    
    return scaledValue;
  }
  
  // Responsive scaling with breakpoint interpolation
  scaleValueInterpolated(
    originalValue: number,
    fromBreakpoint: Breakpoint,
    toBreakpoint: Breakpoint,
    token: ScalingToken,
    interpolationFactor: number
  ): number {
    // Find intermediate breakpoint
    const intermediateBreakpoint = {
      width: fromBreakpoint.width + (toBreakpoint.width - fromBreakpoint.width) * interpolationFactor,
      height: fromBreakpoint.height + (toBreakpoint.height - fromBreakpoint.height) * interpolationFactor,
      alias: 'intermediate'
    };
    
    return this.scaleValue(originalValue, fromBreakpoint, intermediateBreakpoint, token);
  }
}

// Usage examples
const advancedEngine = new AdvancedScalingEngine(responsiveConfig);

// Conditional scaling
const conditionalValue = advancedEngine.scaleValueConditional(
  48, desktopBreakpoint, mobileBreakpoint, tokenConfig.fontSize,
  { orientation: 'portrait', devicePixelRatio: 3, touchDevice: true }
);

// Adaptive scaling
const adaptiveValue = advancedEngine.scaleValueAdaptive(
  48, desktopBreakpoint, mobileBreakpoint, tokenConfig.fontSize,
  { textLength: 150, complexity: 'high' }
);

// Interpolated scaling
const interpolatedValue = advancedEngine.scaleValueInterpolated(
  48, desktopBreakpoint, mobileBreakpoint, tokenConfig.fontSize, 0.5
);

console.log('Conditional scaling:', conditionalValue);
console.log('Adaptive scaling:', adaptiveValue);
console.log('Interpolated scaling:', interpolatedValue);`}
        language="typescript"
        title="Advanced Scaling Techniques"
        showCopy
        showLineNumbers
      />

      <h2>Next Steps</h2>
      <p>Now that you understand the scaling engine, explore these related topics:</p>

      <ul>
        <li><Link href="/docs/core-concepts">Core Concepts</Link> - Understand the fundamental principles</li>
        <li><Link href="/docs/responsive-provider">Responsive Provider</Link> - Learn how the provider works</li>
        <li><Link href="/docs/breakpoints">Breakpoints</Link> - Configure your responsive strategy</li>
        <li><Link href="/docs/hooks/use-responsive-value">useResponsiveValue Hook</Link> - Start using the scaling engine</li>
        <li><Link href="/playground">Interactive Playground</Link> - Test different scaling strategies</li>
      </ul>

      <div className="not-prose mt-8">
        <Link href="/docs/performance">
          <Button>
            Continue to Performance →
          </Button>
        </Link>
      </div>
    </div>
  );
}
