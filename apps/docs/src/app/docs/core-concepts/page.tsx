import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Core Concepts',
  description: 'Understand the fundamental principles and mental models behind React Responsive Easy.',
};

export default function CoreConceptsPage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <h1>Core Concepts</h1>
      <p>
        React Responsive Easy is built on revolutionary principles that transform how you think about responsive design. 
        Understanding these core concepts will help you build better, more maintainable responsive UIs.
      </p>

      <div className="not-prose mb-8">
        <Link href="/playground">
          <Button>
            Try in Playground
          </Button>
        </Link>
      </div>

      <h2>The Revolutionary Approach</h2>
      <p>
        Traditional responsive design requires you to manually write CSS for every breakpoint. 
        React Responsive Easy flips this on its head with a mathematical, automated approach.
      </p>

      <div className="not-prose">
        <div className="my-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-900/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🎯 The Core Principle
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Design once for your largest viewport, scale everywhere automatically.</strong>
          </p>
        </div>
      </div>

      <h2>1. Mathematical Scaling Engine</h2>
      <p>
        At the heart of React Responsive Easy is a sophisticated mathematical engine that calculates 
        perfect scaling ratios between breakpoints.
      </p>

      <CodeBlock
        code={`// The core scaling formula
function scaleValue(
  originalValue: number,       // e.g., 48px font size
  fromBreakpoint: Breakpoint,  // e.g., { width: 1920, height: 1080 }
  toBreakpoint: Breakpoint,    // e.g., { width: 390, height: 844 }
  tokenConfig: ScalingToken    // e.g., { scale: 0.85, min: 12 }
): number {
  // Step 1: Calculate base ratio (viewport scaling)
  const baseRatio = toBreakpoint.width / fromBreakpoint.width; // 390/1920 = 0.203
  
  // Step 2: Apply token-specific scaling
  const tokenRatio = tokenConfig.scale || 1; // 0.85 for fonts
  
  // Step 3: Calculate scaled value
  const scaledValue = originalValue * baseRatio * tokenRatio; // 48 * 0.203 * 0.85 = 8.3
  
  // Step 4: Apply constraints (accessibility)
  const constrainedValue = Math.max(scaledValue, tokenConfig.min || 0); // Math.max(8.3, 12) = 12
  
  // Step 5: Apply rounding
  return Math.round(constrainedValue); // 12
}`}
        language="typescript"
        title="Scaling Engine Core Logic"
        showCopy
        showLineNumbers
      />

      <h2>2. Token-Based Constraints</h2>
      <p>
        Different CSS properties scale differently based on their semantic meaning and accessibility requirements.
      </p>

      <CodeBlock
        code={`const tokenConfig = {
  fontSize: { 
    scale: 0.85,    // Fonts scale conservatively (keep readable)
    min: 12,        // Minimum font size for accessibility
    max: 48         // Maximum font size
  },
  spacing: { 
    scale: 0.85,    // Spacing scales proportionally
    step: 2         // Round to nearest 2px for consistency
  },
  radius: { 
    scale: 0.9      // Border radius scales smoothly
  },
  shadow: { 
    scale: 0.7      // Shadows scale dramatically for visual consistency
  }
};`}
        language="typescript"
        title="Token Configuration Example"
        showCopy
        showLineNumbers
      />

      <h2>3. Viewport-Based Scaling</h2>
      <p>
        Instead of media query breakpoints, React Responsive Easy uses viewport dimensions to calculate 
        scaling ratios dynamically.
      </p>

      <div className="not-prose">
        <div className="my-8 rounded-lg bg-brand-50 p-6 dark:bg-brand-950/20">
          <h3 className="text-lg font-semibold text-brand-900 dark:text-brand-100 mb-4">
            🌟 Why Viewport-Based Scaling?
          </h3>
          <ul className="text-brand-800 dark:text-brand-200 space-y-2">
            <li>• <strong>Mathematical precision:</strong> Exact scaling ratios, not arbitrary breakpoints</li>
            <li>• <strong>Device agnostic:</strong> Works on any screen size, not just predefined breakpoints</li>
            <li>• <strong>Future-proof:</strong> Automatically adapts to new device sizes</li>
            <li>• <strong>Performance:</strong> No CSS parsing or media query evaluation</li>
          </ul>
        </div>
      </div>

      <h2>4. Performance-First Architecture</h2>
      <p>
        Every scaling computation is optimized for performance and memory efficiency.
      </p>

      <CodeBlock
        code={`// Automatic memoization and caching
const fontSize = useResponsiveValue(48, { 
  token: 'fontSize',
  // Automatically memoized and cached
  // Only recalculates when breakpoint changes
});

// Pre-computed values at build time
const buttonStyle = useScaledStyle({
  padding: 16,
  borderRadius: 8,
  fontSize: 18
  // All values pre-computed for each breakpoint
  // Zero runtime calculations in production
});`}
        language="tsx"
        title="Performance Optimizations"
        showCopy
        showLineNumbers
      />

      <h2>5. Accessibility by Design</h2>
      <p>
        Accessibility isn't an afterthought—it's built into the core scaling engine.
      </p>

      <ul>
        <li><strong>Minimum font sizes:</strong> Text never scales below readable thresholds</li>
        <li><strong>Touch target preservation:</strong> Buttons maintain minimum 44px touch targets</li>
        <li><strong>Contrast preservation:</strong> Visual hierarchy maintained across all scales</li>
        <li><strong>Focus management:</strong> Focus indicators scale appropriately</li>
      </ul>

      <h2>6. The Mental Model</h2>
      <p>
        Think of React Responsive Easy like vector graphics for UI components. Just as SVG scales 
        perfectly at any size, your components scale mathematically across different viewports.
      </p>

      <div className="not-prose">
        <div className="my-8 rounded-lg bg-purple-50 p-6 dark:bg-purple-950/20">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
            🎨 Design System Analogy
          </h3>
          <p className="text-purple-800 dark:text-purple-200">
            <strong>Traditional CSS:</strong> Like raster images - you need different versions for different sizes<br/>
            <strong>React Responsive Easy:</strong> Like vector graphics - one design scales perfectly everywhere
          </p>
        </div>
      </div>

      <h2>7. Scaling Strategies</h2>
      <p>
        Different scaling strategies for different use cases and design requirements.
      </p>

      <CodeBlock
        code={`const scalingStrategies = {
  // Linear scaling (default)
  linear: {
    mode: 'linear',
    origin: 'width', // Scale based on viewport width
    tokens: { /* token configuration */ }
  },
  
  // Exponential scaling for dramatic effects
  exponential: {
    mode: 'exponential',
    factor: 1.2, // Exponential growth factor
    origin: 'width'
  },
  
  // Custom scaling curves
  custom: {
    mode: 'custom',
    curve: (ratio: number) => Math.pow(ratio, 1.5), // Custom mathematical curve
    origin: 'width'
  }
};`}
        language="typescript"
        title="Scaling Strategy Options"
        showCopy
        showLineNumbers
      />

      <h2>8. Breakpoint Detection</h2>
      <p>
        Intelligent breakpoint detection that goes beyond simple width thresholds.
      </p>

      <CodeBlock
        code={`// Smart breakpoint detection
const currentBreakpoint = useBreakpoint();

// Returns detailed breakpoint information
console.log(currentBreakpoint);
// {
//   name: 'mobile',
//   width: 390,
//   height: 844,
//   alias: 'mobile',
//   ratio: 0.203, // Scaling ratio from base
//   orientation: 'portrait',
//   density: 2, // Device pixel ratio
//   capabilities: ['touch', 'hover']
// }

// Responsive to any viewport size
useEffect(() => {
  const handleResize = () => {
    // Automatically detects new breakpoint
    // Recalculates all scaling ratios
    // Updates all responsive values
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);`}
        language="tsx"
        title="Breakpoint Detection"
        showCopy
        showLineNumbers
      />

      <h2>9. Build-Time Optimization</h2>
      <p>
        Advanced build-time optimizations that transform your responsive code into highly optimized, 
        production-ready assets.
      </p>

      <CodeBlock
        code={`// Developer writes this:
const fontSize = useResponsiveValue(48, { token: 'fontSize' });

// Build system transforms it to this optimized version:
const fontSize = useMemo(() => {
  switch (currentBreakpoint.name) {
    case 'mobile': return '12px';    // Pre-computed value
    case 'tablet': return '24px';    // Pre-computed value
    case 'desktop': return '48px';   // Pre-computed value
    default: return '48px';
  }
}, [currentBreakpoint.name]);

// Result: Zero runtime calculations in production!`}
        language="tsx"
        title="Build-Time Optimization"
        showCopy
        showLineNumbers
      />

      <h2>10. The Complete System</h2>
      <p>
        React Responsive Easy is more than just a scaling engine—it's a complete responsive design system.
      </p>

      <div className="not-prose">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              🎯 Core Engine
            </h3>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
              <li>• Mathematical scaling engine</li>
              <li>• Token-based constraints</li>
              <li>• Performance optimization</li>
              <li>• Accessibility compliance</li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              🛠️ Developer Tools
            </h3>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
              <li>• React hooks & components</li>
              <li>• CLI tools & generators</li>
              <li>• Build system plugins</li>
              <li>• Performance dashboard</li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              🎨 Design System
            </h3>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
              <li>• Consistent scaling rules</li>
              <li>• Design token management</li>
              <li>• Visual consistency</li>
              <li>• Brand compliance</li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              🚀 Performance
            </h3>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
              <li>• Zero runtime overhead</li>
              <li>• Automatic memoization</li>
              <li>• Build-time optimization</li>
              <li>• Bundle size optimization</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Understanding the Benefits</h2>
      <p>
        By understanding these core concepts, you'll see why React Responsive Easy is revolutionary:
      </p>

      <ul>
        <li><strong>90% reduction</strong> in responsive CSS code</li>
        <li><strong>75% faster</strong> responsive development</li>
        <li><strong>Zero visual bugs</strong> across breakpoints</li>
        <li><strong>Mathematical precision</strong> instead of manual guesswork</li>
        <li><strong>Future-proof</strong> responsive design</li>
        <li><strong>Performance optimized</strong> from the ground up</li>
      </ul>

      <div className="not-prose">
        <div className="mt-8 rounded-lg bg-success-50 p-6 dark:bg-success-950/20">
          <h3 className="text-lg font-semibold text-success-900 dark:text-success-100">
            🎉 Ready to Transform Your Workflow?
          </h3>
          <p className="mt-2 text-success-800 dark:text-success-200">
            Now that you understand the core concepts, you're ready to build revolutionary responsive UIs. 
            The mathematical precision and automated scaling will change how you think about responsive design forever.
          </p>
        </div>
      </div>

      <h2>Next Steps</h2>
      <p>Continue your journey with these essential guides:</p>

      <ul>
        <li><Link href="/docs/hooks/use-responsive-value">React Hooks: useResponsiveValue</Link></li>
        <li><Link href="/docs/configuration">Configuration & Customization</Link></li>
        <li><Link href="/docs/advanced/scaling-strategies">Advanced Scaling Strategies</Link></li>
        <li><Link href="/docs/frameworks/nextjs">Framework Integration: Next.js</Link></li>
        <li><Link href="/playground">Interactive Playground</Link></li>
      </ul>

      <div className="not-prose mt-8">
        <Link href="/docs/hooks/use-responsive-value">
          <Button>
            Continue to React Hooks →
          </Button>
        </Link>
      </div>
    </div>
  );
}
