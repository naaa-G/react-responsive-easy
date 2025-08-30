import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  Rocket, 
  Play,
  FileText,
  Package 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Learn how to install and use React Responsive Easy in your React applications.',
};

export default function DocsPage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h3:text-lg prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-ul:text-gray-600 dark:prose-ul:text-gray-300">
      {/* Header */}
      <div className="not-prose mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Getting Started
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Learn how to install and use React Responsive Easy in your React applications.
        </p>
      </div>

      {/* Quick Links */}
      <div className="not-prose mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/playground"
          className="group relative rounded-lg border border-gray-200 p-4 hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-brand-600 transition-all"
        >
          <div className="flex items-center space-x-3">
            <Play size={18} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Try Playground
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Interactive editor
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/docs/installation"
          className="group relative rounded-lg border border-gray-200 p-4 hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-brand-600 transition-all"
        >
          <div className="flex items-center space-x-3">
            <Rocket size={18} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Installation
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Install packages
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/docs/quick-start"
          className="group relative rounded-lg border border-gray-200 p-4 hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-brand-600 transition-all"
        >
          <div className="flex items-center space-x-3">
            <Package size={18} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Quick Start
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                First component
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/docs/configuration"
          className="group relative rounded-lg border border-gray-200 p-4 hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-brand-600 transition-all"
        >
          <div className="flex items-center space-x-3">
            <FileText size={18} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Configuration
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Setup breakpoints
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Introduction */}
      <h2>What is React Responsive Easy?</h2>
      <p>
        React Responsive Easy is an enterprise-grade responsive design system that allows you to build 
        responsive React applications with mathematical precision. Instead of writing manual media queries 
        and breakpoint-specific styles, you design for your largest breakpoint and let our scaling engine 
        handle the rest.
      </p>

      <h3>Key Features</h3>
      <ul>
        <li><strong>Mathematical Scaling</strong> - Precise algorithms ensure pixel-perfect responsive design</li>
        <li><strong>TypeScript First</strong> - Complete type safety and IntelliSense support</li>
        <li><strong>Zero Config</strong> - Sensible defaults with automatic breakpoint detection</li>
        <li><strong>Performance Optimized</strong> - Sub-15KB bundle with tree-shaking</li>
        <li><strong>Enterprise Ready</strong> - Built for scale with comprehensive testing</li>
      </ul>

      <h2>Installation</h2>
      <p>Install React Responsive Easy using your preferred package manager:</p>

      <div className="not-prose">
        <CodeBlock
          code="npm install @react-responsive-easy/core"
          language="bash"
          title="npm"
          showCopy
        />
      </div>

      <div className="not-prose">
        <CodeBlock
          code="yarn add @react-responsive-easy/core"
          language="bash"
          title="yarn"
          showCopy
        />
      </div>

      <div className="not-prose">
        <CodeBlock
          code="pnpm add @react-responsive-easy/core"
          language="bash"
          title="pnpm"
          showCopy
        />
      </div>

      <h2>Quick Start</h2>
      <p>Get up and running in under 5 minutes:</p>

      <h3>1. Set up the Provider</h3>
      <p>Wrap your app with the ResponsiveProvider:</p>

      <div className="not-prose">
        <CodeBlock
          code={`import { ResponsiveProvider } from '@react-responsive-easy/core';

const config = {
  base: { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' },
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
};

function App() {
  return (
    <ResponsiveProvider config={config}>
      <YourApp />
    </ResponsiveProvider>
  );
}`}
          language="tsx"
          title="App.tsx"
          showCopy
          showLineNumbers
        />
      </div>

      <h3>2. Use Responsive Values</h3>
      <p>Design for your base breakpoint and let the scaling engine handle the rest:</p>

      <div className="not-prose">
        <CodeBlock
          code={`import { useResponsiveValue, useScaledStyle } from '@react-responsive-easy/core';

function Hero() {
  // Scale individual values
  const fontSize = useResponsiveValue(48);
  const padding = useResponsiveValue(32);
  
  // Scale entire style objects
  const cardStyles = useScaledStyle({
    padding: 24,
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 1.5,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  });
  
  return (
    <div style={{ fontSize, padding }}>
      <h1>Welcome to React Responsive Easy</h1>
      <div style={cardStyles}>
        This card scales perfectly across all breakpoints!
      </div>
    </div>
  );
}`}
          language="tsx"
          title="Hero.tsx"
          showCopy
          showLineNumbers
        />
      </div>

      <h3>3. Get Breakpoint Information</h3>
      <p>Access current breakpoint data for conditional rendering:</p>

      <div className="not-prose">
        <CodeBlock
          code={`import { useBreakpoint } from '@react-responsive-easy/core';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();
  
  return (
    <div>
      <h2>Current Breakpoint: {breakpoint.name}</h2>
      <p>Screen Size: {breakpoint.width} × {breakpoint.height}</p>
      
      {breakpoint.alias === 'mobile' && (
        <MobileOnlyComponent />
      )}
      
      {breakpoint.width > 768 && (
        <DesktopFeatures />
      )}
    </div>
  );
}`}
          language="tsx"
          title="ResponsiveComponent.tsx"
          showCopy
          showLineNumbers
        />
      </div>

      <h2>What's Next?</h2>
      <p>Now that you have the basics working, explore these advanced features:</p>

      <div className="not-prose">
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link href="/docs/configuration" className="group rounded-lg border border-gray-200 p-4 hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-brand-600 transition-all">
            <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
              Configuration →
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Configure breakpoints, scaling strategies, and performance options.
            </p>
          </Link>

          <Link href="/docs/hooks/use-responsive-value" className="group rounded-lg border border-gray-200 p-4 hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-brand-600 transition-all">
            <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
              React Hooks →
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Deep dive into all available hooks and their usage patterns.
            </p>
          </Link>

          <Link href="/playground" className="group rounded-lg border border-gray-200 p-4 hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-brand-600 transition-all">
            <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
              Interactive Playground →
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Try React Responsive Easy in our live code editor.
            </p>
          </Link>

          <Link href="/examples" className="group rounded-lg border border-gray-200 p-4 hover:border-brand-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-brand-600 transition-all">
            <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
              Examples Gallery →
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Browse real-world examples and copy-paste ready components.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
