import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';

export const metadata: Metadata = {
  title: 'Configuration',
  description: 'Learn how to configure breakpoints, scaling strategies, and performance options.',
};

export default function ConfigurationPage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <h1>Configuration</h1>
      <p>
        Learn how to configure React Responsive Easy for your specific needs.
      </p>

      <h2>Basic Configuration</h2>
      <p>
        The ResponsiveProvider accepts a configuration object that defines your breakpoints and scaling strategy:
      </p>

      <CodeBlock
        code={`import { ResponsiveProvider } from '@react-responsive-easy/core';

const config = {
  base: { 
    name: 'Desktop', 
    width: 1440, 
    height: 900, 
    alias: 'desktop' 
  },
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' }
  ],
  strategy: {
    mode: 'scale',
    origin: 'top-left',
    tokens: {}
  }
};`}
        language="tsx"
        showCopy
        showLineNumbers
      />

      <h2>Breakpoints</h2>
      <p>
        Define the screen sizes your app should support. Each breakpoint has:
      </p>

      <ul>
        <li><strong>name</strong> - Human-readable name</li>
        <li><strong>width</strong> - Screen width in pixels</li>
        <li><strong>height</strong> - Screen height in pixels</li>
        <li><strong>alias</strong> - Short identifier for conditional logic</li>
      </ul>

      <h3>Common Breakpoint Sets</h3>

      <h4>Mobile First</h4>
      <CodeBlock
        code={`const mobileFirstBreakpoints = [
  { name: 'Mobile', width: 320, height: 568, alias: 'xs' },
  { name: 'Mobile Large', width: 375, height: 667, alias: 'sm' },
  { name: 'Tablet', width: 768, height: 1024, alias: 'md' },
  { name: 'Desktop', width: 1024, height: 768, alias: 'lg' },
  { name: 'Desktop Large', width: 1440, height: 900, alias: 'xl' },
  { name: 'Desktop XL', width: 1920, height: 1080, alias: '2xl' }
];`}
        language="javascript"
        showCopy
        showLineNumbers
      />

      <h4>Design System Aligned</h4>
      <CodeBlock
        code={`const designSystemBreakpoints = [
  { name: 'Phone', width: 375, height: 812, alias: 'phone' },
  { name: 'Tablet Portrait', width: 768, height: 1024, alias: 'tablet-p' },
  { name: 'Tablet Landscape', width: 1024, height: 768, alias: 'tablet-l' },
  { name: 'Laptop', width: 1366, height: 768, alias: 'laptop' },
  { name: 'Desktop', width: 1920, height: 1080, alias: 'desktop' }
];`}
        language="javascript"
        showCopy
        showLineNumbers
      />

      <h2>Scaling Strategy</h2>
      <p>
        The scaling strategy determines how values are transformed between breakpoints:
      </p>

      <CodeBlock
        code={`const strategy = {
  mode: 'scale',           // 'scale' | 'step'
  origin: 'top-left',      // 'top-left' | 'center'
  lineHeight: 'preserve',  // 'preserve' | 'scale'
  shadow: 'scale',         // 'scale' | 'preserve'
  border: 'scale',         // 'scale' | 'preserve'
  accessibility: {
    minFontSize: 12,       // Minimum font size
    maxScaleFactor: 2.5,   // Maximum scale multiplier
    preserveReadability: true
  },
  performance: {
    enableCaching: true,
    precomputeValues: false,
    optimizeAnimations: true
  }
};`}
        language="javascript"
        showCopy
        showLineNumbers
      />

      <h3>Scaling Modes</h3>

      <h4>Scale Mode (Recommended)</h4>
      <p>
        Smoothly scales values proportionally based on screen size ratio:
      </p>
      <CodeBlock
        code={`// 48px on 1440px screen becomes:
// - 24px on 720px screen (50% scale)  
// - 36px on 1080px screen (75% scale)`}
        language="javascript"
      />

      <h4>Step Mode</h4>
      <p>
        Uses predefined steps for each breakpoint:
      </p>
      <CodeBlock
        code={`const stepStrategy = {
  mode: 'step',
  steps: {
    mobile: 0.6,    // 60% of base value
    tablet: 0.8,    // 80% of base value  
    desktop: 1.0    // 100% of base value
  }
};`}
        language="javascript"
        showCopy
        showLineNumbers
      />

      <h2>Design Tokens</h2>
      <p>
        Define reusable design tokens that scale consistently:
      </p>

      <CodeBlock
        code={`const config = {
  // ... other config
  strategy: {
    mode: 'scale',
    origin: 'top-left',
    tokens: {
      // Spacing scale
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48
      },
      
      // Typography scale
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36
      },
      
      // Border radius
      borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16
      }
    }
  }
};`}
        language="javascript"
        showCopy
        showLineNumbers
      />

      <h3>Using Tokens</h3>
      <CodeBlock
        code={`import { useResponsiveToken } from '@react-responsive-easy/core';

function Card() {
  const padding = useResponsiveToken('spacing.lg');     // 24px scaled
  const fontSize = useResponsiveToken('fontSize.xl');   // 20px scaled
  const borderRadius = useResponsiveToken('borderRadius.md'); // 8px scaled
  
  return (
    <div style={{ padding, fontSize, borderRadius }}>
      Consistent design tokens!
    </div>
  );
}`}
        language="tsx"
        showCopy
        showLineNumbers
      />

      <h2>Advanced Options</h2>

      <h3>Debug Mode</h3>
      <p>Enable debug mode to see scaling calculations:</p>
      <CodeBlock
        code={`<ResponsiveProvider config={config} debug>
  <App />
</ResponsiveProvider>`}
        language="tsx"
        showCopy
      />

      <h3>Initial Breakpoint</h3>
      <p>Set the initial breakpoint for SSR:</p>
      <CodeBlock
        code={`<ResponsiveProvider 
  config={config} 
  initialBreakpoint="desktop"
>
  <App />
</ResponsiveProvider>`}
        language="tsx"
        showCopy
      />

      <h2>TypeScript Configuration</h2>
      <p>
        For full type safety, create a typed configuration:
      </p>

      <CodeBlock
        code={`import type { ResponsiveConfig } from '@react-responsive-easy/core';

const config: ResponsiveConfig = {
  base: { 
    name: 'Desktop', 
    width: 1440, 
    height: 900, 
    alias: 'desktop' 
  } as const,
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' }
  ] as const,
  strategy: {
    mode: 'scale',
    origin: 'top-left',
    tokens: {
      spacing: { sm: 8, md: 16, lg: 24 },
      fontSize: { sm: 14, md: 16, lg: 20 }
    }
  }
} as const;

export default config;`}
        language="typescript"
        showCopy
        showLineNumbers
      />
    </div>
  );
}
