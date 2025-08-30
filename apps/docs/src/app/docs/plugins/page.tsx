import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Build Plugins - React Responsive Easy',
  description: 'Complete guide to build plugins for React Responsive Easy, including Babel, PostCSS, Vite, and Next.js integrations.',
}

export default function PluginsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Build Plugins
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Seamlessly integrate React Responsive Easy with your build tools for optimal performance and development experience.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/docs/storybook">Next: Storybook Addon →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/cli">← CLI Commands</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          React Responsive Easy provides official plugins for popular build tools, enabling 
          build-time optimizations, automatic responsive code generation, and seamless 
          integration with your existing development workflow.
        </p>

        <h2>Available Plugins</h2>
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="#babel-plugin" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Babel Plugin
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Transform and optimize responsive code at build time with Babel.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Build Tool</span>
              <Button size="sm" asChild>
                <Link href="#babel-plugin">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="#postcss-plugin" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                PostCSS Plugin
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Process and optimize CSS with responsive design utilities.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">CSS Processing</span>
              <Button size="sm" asChild>
                <Link href="#postcss-plugin">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="#vite-plugin" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Vite Plugin
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Optimize Vite builds with responsive design features and HMR support.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Build Tool</span>
              <Button size="sm" asChild>
                <Link href="#vite-plugin">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <Link href="#nextjs-plugin" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Next.js Plugin
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Enhance Next.js with responsive optimizations and SSR support.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Framework</span>
              <Button size="sm" asChild>
                <Link href="#nextjs-plugin">Learn More →</Link>
              </Button>
            </div>
          </div>
        </div>

        <h2 id="babel-plugin">Babel Plugin</h2>
        <p>
          The Babel plugin transforms and optimizes responsive code at build time, providing 
          better performance and smaller bundle sizes.
        </p>

        <h3>Installation</h3>
        <CodeBlock 
          language="bash"
          code={`npm install --save-dev @react-responsive-easy/babel-plugin
# or
yarn add -D @react-responsive-easy/babel-plugin
# or
pnpm add -D @react-responsive-easy/babel-plugin`}
        />

        <h3>Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// babel.config.js
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@react-responsive-easy/babel-plugin', {
      // Plugin options
      optimize: true,
      generateHelpers: true,
      breakpoints: ['mobile', 'tablet', 'desktop']
    }]
  ]
}`}
        />

        <h3>Plugin Options</h3>
        <CodeBlock 
          language="javascript"
          code={`{
  // Enable build-time optimizations
  optimize: true,
  
  // Generate helper functions
  generateHelpers: true,
  
  // Define breakpoints for optimization
  breakpoints: ['mobile', 'tablet', 'desktop'],
  
  // Enable tree-shaking for unused responsive code
  treeShake: true,
  
  // Generate source maps
  sourceMaps: true,
  
  // Development mode features
  development: {
    enableDebugMode: true,
    logTransformations: true
  }
}`}
        />

        <h3>Code Transformations</h3>
        <p>
          The plugin transforms your responsive code for better performance:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// Before transformation
function MyComponent() {
  const fontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 16,
    desktop: 18
  })
  
  return <div style={{ fontSize: \`\${fontSize}px\` }}>Content</div>
}

// After transformation (optimized)
function MyComponent() {
  const fontSize = __RRE_OPTIMIZED_useResponsiveValue(16, {
    mobile: 14,
    tablet: 16,
    desktop: 18
  })
  
  return <div style={{ fontSize: \`\${fontSize}px\` }}>Content</div>
}`}
        />

        <h2 id="postcss-plugin">PostCSS Plugin</h2>
        <p>
          The PostCSS plugin processes CSS with responsive design utilities, enabling 
          responsive CSS-in-JS and optimized stylesheets.
        </p>

        <h3>Installation</h3>
        <CodeBlock 
          language="bash"
          code={`npm install --save-dev @react-responsive-easy/postcss-plugin
# or
yarn add -D @react-responsive-easy/postcss-plugin
# or
pnpm add -D @react-responsive-easy/postcss-plugin`}
        />

        <h3>Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// postcss.config.js
module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ['@react-responsive-easy/postcss-plugin', {
      // Plugin options
      enableResponsiveUtils: true,
      generateBreakpointClasses: true,
      optimizeOutput: true
    }]
  ]
}`}
        />

        <h3>Plugin Options</h3>
        <CodeBlock 
          language="javascript"
          code={`{
  // Enable responsive utility classes
  enableResponsiveUtils: true,
  
  // Generate breakpoint-specific CSS classes
  generateBreakpointClasses: true,
  
  // Optimize CSS output
  optimizeOutput: true,
  
  // Custom breakpoints
  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1920px'
  },
  
  // Generate CSS custom properties
  generateCustomProperties: true,
  
  // Enable responsive media queries
  enableMediaQueries: true
}`}
        />

        <h3>Generated CSS</h3>
        <p>
          The plugin generates responsive CSS utilities and classes:
        </p>
        <CodeBlock 
          language="css"
          code={`/* Generated responsive utilities */
.rre-text-mobile { font-size: 14px; }
.rre-text-tablet { font-size: 16px; }
.rre-text-desktop { font-size: 18px; }

.rre-padding-mobile { padding: 16px; }
.rre-padding-tablet { padding: 20px; }
.rre-padding-desktop { padding: 24px; }

/* Responsive media queries */
@media (max-width: 767px) {
  .rre-hidden-mobile { display: none; }
}

@media (min-width: 768px) and (max-width: 1919px) {
  .rre-hidden-tablet { display: none; }
}

@media (min-width: 1920px) {
  .rre-hidden-desktop { display: none; }
}

/* CSS custom properties */
:root {
  --rre-breakpoint-mobile: 375px;
  --rre-breakpoint-tablet: 768px;
  --rre-breakpoint-desktop: 1920px;
}`}
        />

        <h2 id="vite-plugin">Vite Plugin</h2>
        <p>
          The Vite plugin optimizes your Vite builds with responsive design features, 
          hot module replacement, and build-time optimizations.
        </p>

        <h3>Installation</h3>
        <CodeBlock 
          language="bash"
          code={`npm install --save-dev @react-responsive-easy/vite-plugin
# or
yarn add -D @react-responsive-easy/vite-plugin
# or
pnpm add -D @react-responsive-easy/vite-plugin`}
        />

        <h3>Configuration</h3>
        <CodeBlock 
          language="typescript"
          code={`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rrePlugin from '@react-responsive-easy/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    rrePlugin({
      // Plugin options
      enableHMR: true,
      optimizeBuild: true,
      generateTypes: true
    })
  ]
})`}
        />

        <h3>Plugin Options</h3>
        <CodeBlock 
          language="typescript"
          code={`{
  // Enable hot module replacement for responsive components
  enableHMR: true,
  
  // Optimize build output
  optimizeBuild: true,
  
  // Generate TypeScript types
  generateTypes: true,
  
  // Enable responsive dev tools
  enableDevTools: true,
  
  // Custom breakpoint configuration
  breakpoints: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
  },
  
  // Development features
  development: {
    enableDebugMode: true,
    showResponsiveInfo: true
  }
}`}
        />

        <h3>HMR Support</h3>
        <p>
          The plugin provides hot module replacement for responsive components:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// Component with HMR support
function ResponsiveButton() {
  const fontSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 16,
    desktop: 18
  })
  
  return (
    <button style={{ fontSize: \`\${fontSize}px\` }}>
      Responsive Button
    </button>
  )
}

// Changes to breakpoint values or responsive logic
// will trigger HMR without full page reload`}
        />

        <h2 id="nextjs-plugin">Next.js Plugin</h2>
        <p>
          The Next.js plugin enhances your Next.js application with responsive optimizations, 
          SSR support, and build-time enhancements.
        </p>

        <h3>Installation</h3>
        <CodeBlock 
          language="bash"
          code={`npm install --save-dev @react-responsive-easy/next-plugin
# or
yarn add -D @react-responsive-easy/next-plugin
# or
pnpm add -D @react-responsive-easy/next-plugin`}
        />

        <h3>Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// next.config.js
const rrePlugin = require('@react-responsive-easy/next-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js configuration
  experimental: {
    appDir: true
  },
  
  // React Responsive Easy plugin
  ...rrePlugin({
    // Plugin options
    enableSSR: true,
    optimizeImages: true,
    generateStaticProps: true
  })
}

module.exports = nextConfig`}
        />

        <h3>Plugin Options</h3>
        <CodeBlock 
          language="javascript"
          code={`{
  // Enable SSR support for responsive components
  enableSSR: true,
  
  // Optimize responsive images
  optimizeImages: true,
  
  // Generate static props for responsive data
  generateStaticProps: true,
  
  // Enable responsive middleware
  enableMiddleware: true,
  
  // Custom breakpoint detection
  breakpointDetection: {
    strategy: 'user-agent',
    fallback: 'desktop'
  },
  
  // Performance optimizations
  performance: {
    enableLazyLoading: true,
    optimizeBundle: true,
    enableCompression: true
  }
}`}
        />

        <h3>SSR Support</h3>
        <p>
          The plugin provides server-side rendering support for responsive components:
        </p>
        <CodeBlock 
          language="tsx"
          code={`// pages/index.tsx
import { GetServerSideProps } from 'next'
import { ResponsiveProvider } from '@react-responsive-easy/core'

interface HomeProps {
  userAgent: string
  initialBreakpoint: string
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const userAgent = context.req.headers['user-agent'] || ''
  
  // Server-side breakpoint detection
  const initialBreakpoint = detectBreakpoint(userAgent)
  
  return {
    props: {
      userAgent,
      initialBreakpoint
    }
  }
}

export default function Home({ userAgent, initialBreakpoint }: HomeProps) {
  return (
    <ResponsiveProvider
      config={{
        initialBreakpoint,
        enableSSR: true
      }}
    >
      <div>Responsive content with SSR support</div>
    </ResponsiveProvider>
  )
}`}
        />

        <h2>Plugin Integration</h2>
        <p>
          Combine multiple plugins for comprehensive responsive design support:
        </p>

        <h3>Full Stack Configuration</h3>
        <CodeBlock 
          language="javascript"
          code={`// Complete build configuration
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@react-responsive-easy/babel-plugin', {
      optimize: true,
      generateHelpers: true
    }]
  ]
}

// postcss.config.js
module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ['@react-responsive-easy/postcss-plugin', {
      enableResponsiveUtils: true,
      generateBreakpointClasses: true
    }]
  ]
}

// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rrePlugin from '@react-responsive-easy/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    rrePlugin({
      enableHMR: true,
      optimizeBuild: true
    })
  ]
})`}
        />

        <h3>Performance Benefits</h3>
        <ul>
          <li>
            <strong>Build-time Optimization:</strong> Responsive code is optimized during build
          </li>
          <li>
            <strong>Tree Shaking:</strong> Unused responsive utilities are removed
          </li>
          <li>
            <strong>Code Splitting:</strong> Responsive components are split for optimal loading
          </li>
          <li>
            <strong>Bundle Optimization:</strong> Reduced bundle sizes and improved performance
          </li>
          <li>
            <strong>HMR Support:</strong> Fast development with hot module replacement
          </li>
        </ul>

        <h2>Development Workflow</h2>
        
        <h3>Plugin Development</h3>
        <p>
          Use plugins during development for immediate feedback:
        </p>
        <CodeBlock 
          language="bash"
          code={`# Development with plugins
npm run dev

# Build with optimization
npm run build

# Analyze build output
npm run analyze

# Preview production build
npm run preview`}
        />

        <h3>Debugging</h3>
        <p>
          Enable debug mode to see plugin transformations:
        </p>
        <CodeBlock 
          language="javascript"
          code={`// Enable debug mode in plugins
{
  development: {
    enableDebugMode: true,
    logTransformations: true,
    showResponsiveInfo: true
  }
}

// Check console for transformation logs
// and responsive design information`}
        />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Use appropriate plugins:</strong> Choose plugins that match your build tool
          </li>
          <li>
            <strong>Configure consistently:</strong> Use consistent breakpoint configurations across plugins
          </li>
          <li>
            <strong>Enable optimizations:</strong> Enable build-time optimizations for production
          </li>
          <li>
            <strong>Monitor performance:</strong> Use plugin analytics to monitor build performance
          </li>
          <li>
            <strong>Stay updated:</strong> Keep plugins updated for latest features and optimizations
          </li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          Now that you understand the build plugins, explore the Storybook addon and browser extension:
        </p>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Button asChild className="w-full">
            <Link href="/docs/storybook">
              Explore Storybook Addon →
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/docs/browser-extension">
              Browser Extension →
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/cli">← CLI Commands</Link>
            </Button>
            <Button asChild>
              <Link href="/docs/storybook">Next: Storybook Addon →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
