import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Quick Start',
  description: 'Get up and running with React Responsive Easy in minutes.',
};

export default function QuickStartPage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <h1>Quick Start</h1>
      <p>
        Get up and running with React Responsive Easy in under 5 minutes.
      </p>

      <div className="not-prose mb-8">
        <Link href="/playground">
          <Button>
            Try in Playground
          </Button>
        </Link>
      </div>

      <h2>Step 1: Install</h2>
      <CodeBlock
        code="npm install @react-responsive-easy/core"
        language="bash"
        showCopy
      />

      <h2>Step 2: Configure</h2>
      <p>Create your responsive configuration:</p>
      
      <CodeBlock
        code={`// responsive.config.js
export const responsiveConfig = {
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
        language="javascript"
        title="responsive.config.js"
        showCopy
        showLineNumbers
      />

      <h2>Step 3: Setup Provider</h2>
      <p>Wrap your app with the ResponsiveProvider:</p>

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

      <h2>Step 4: Use Responsive Values</h2>
      <p>Start using responsive values in your components:</p>

      <CodeBlock
        code={`import { useResponsiveValue } from '@react-responsive-easy/core';

function Hero() {
  const fontSize = useResponsiveValue(48);
  const padding = useResponsiveValue(32);
  
  return (
    <div style={{ 
      fontSize, 
      padding,
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 12
    }}>
      <h1>Welcome!</h1>
      <p>This scales perfectly across all devices</p>
    </div>
  );
}`}
        language="tsx"
        title="Hero.tsx"
        showCopy
        showLineNumbers
      />

      <h2>That's It! 🎉</h2>
      <p>
        Your component will now automatically scale across all breakpoints. 
        The fontSize will be 48px on desktop, but automatically scale down 
        proportionally on tablet and mobile.
      </p>

      <div className="not-prose">
        <div className="mt-8 rounded-lg bg-brand-50 p-6 dark:bg-brand-950/20">
          <h3 className="text-lg font-semibold text-brand-900 dark:text-brand-100">
            💡 Pro Tip
          </h3>
          <p className="mt-2 text-brand-800 dark:text-brand-200">
            Design all your components for your largest breakpoint (usually desktop). 
            React Responsive Easy will automatically scale everything down for smaller screens.
          </p>
        </div>
      </div>

      <h2>Next Steps</h2>
      <p>Now that you have the basics working, explore these features:</p>

      <ul>
        <li><Link href="/docs/hooks/use-scaled-style">Scale entire style objects</Link></li>
        <li><Link href="/docs/hooks/use-breakpoint">Get current breakpoint info</Link></li>
        <li><Link href="/docs/configuration">Advanced configuration options</Link></li>
        <li><Link href="/playground">Try the interactive playground</Link></li>
      </ul>
    </div>
  );
}
