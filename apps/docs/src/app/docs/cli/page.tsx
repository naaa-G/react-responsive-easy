import { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'CLI Commands - React Responsive Easy',
  description: 'Complete guide to command-line interface tools for React Responsive Easy, including project setup, optimization, and development workflows.',
}

export default function CLIPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          CLI Commands
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Powerful command-line tools for setting up, optimizing, and managing React Responsive Easy projects.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/docs/plugins">Next: Build Plugins →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/hooks">← React Hooks</Link>
          </Button>
        </div>
      </div>

      <div className="prose prose-lg prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          React Responsive Easy provides a comprehensive command-line interface that helps you 
          set up projects, optimize performance, generate responsive components, and manage your 
          responsive design system from the terminal.
        </p>

        <h2>Installation</h2>
        <p>
          Install the CLI globally to access commands from anywhere:
        </p>
        <CodeBlock 
          language="bash"
          code={`npm install -g @react-responsive-easy/cli
# or
yarn global add @react-responsive-easy/cli
# or
pnpm add -g @react-responsive-easy/cli`}
        />

        <h2>Available Commands</h2>
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <code className="text-blue-600 dark:text-blue-400">rre init</code>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Initialize a new React Responsive Easy project with best practices and configuration.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Project Setup</span>
              <Button size="sm" asChild>
                <Link href="#init-command">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <code className="text-blue-600 dark:text-blue-400">rre optimize</code>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Analyze and optimize your responsive components for performance and accessibility.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Performance</span>
              <Button size="sm" asChild>
                <Link href="#optimize-command">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <code className="text-blue-600 dark:text-blue-400">rre generate</code>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Generate responsive components, hooks, and utilities with customizable templates.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Code Generation</span>
              <Button size="sm" asChild>
                <Link href="#generate-command">Learn More →</Link>
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              <code className="text-blue-600 dark:text-blue-400">rre analyze</code>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Analyze your codebase for responsive design patterns and optimization opportunities.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Code Analysis</span>
              <Button size="sm" asChild>
                <Link href="#analyze-command">Learn More →</Link>
              </Button>
            </div>
          </div>
        </div>

        <h2 id="init-command">Project Initialization</h2>
        <p>
          The <code>rre init</code> command sets up a new project with React Responsive Easy:
        </p>
        <CodeBlock 
          language="bash"
          code={`# Initialize in current directory
rre init

# Initialize in specific directory
rre init my-responsive-app

# Initialize with specific template
rre init --template nextjs
rre init --template vite
rre init --template cra

# Initialize with custom configuration
rre init --config custom-config.json`}
        />

        <h3>Initialization Options</h3>
        <CodeBlock 
          language="bash"
          code={`rre init [project-name] [options]

Options:
  --template <template>     Project template (nextjs|vite|cra|custom)
  --config <path>          Custom configuration file path
  --typescript             Enable TypeScript support
  --tailwind              Include Tailwind CSS configuration
  --storybook             Include Storybook setup
  --testing               Include testing setup (Jest/Vitest)
  --git                   Initialize git repository
  --install               Install dependencies automatically
  --force                 Overwrite existing files`}
        />

        <h3>Generated Project Structure</h3>
        <CodeBlock 
          language="bash"
          code={`my-responsive-app/
├── src/
│   ├── components/
│   │   └── ResponsiveProvider.tsx
│   ├── hooks/
│   │   └── useResponsiveValue.ts
│   ├── styles/
│   │   └── responsive.css
│   └── App.tsx
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── rre.config.js
└── README.md`}
        />

        <h2 id="optimize-command">Performance Optimization</h2>
        <p>
          The <code>rre optimize</code> command analyzes and optimizes your responsive components:
        </p>
        <CodeBlock 
          language="bash"
          code={`# Optimize current project
rre optimize

# Optimize specific files
rre optimize src/components/Button.tsx

# Optimize with specific rules
rre optimize --rules performance,accessibility

# Generate optimization report
rre optimize --report`}
        />

        <h3>Optimization Features</h3>
        <ul>
          <li>
            <strong>Performance Analysis:</strong> Identifies slow rendering components and scaling operations
          </li>
          <li>
            <strong>Bundle Size Optimization:</strong> Analyzes and reduces bundle size impact
          </li>
          <li>
            <strong>Accessibility Checks:</strong> Ensures responsive components meet accessibility standards
          </li>
          <li>
            <strong>Code Splitting:</strong> Suggests optimal code splitting strategies
          </li>
          <li>
            <strong>Memory Usage:</strong> Monitors and optimizes memory consumption
          </li>
        </ul>

        <h3>Optimization Report Example</h3>
        <CodeBlock 
          language="json"
          code={`{
  "summary": {
    "totalComponents": 15,
    "optimizedComponents": 8,
    "performanceScore": 85,
    "bundleSizeReduction": "12.5%"
  },
  "recommendations": [
    {
      "type": "performance",
      "component": "Button.tsx",
      "issue": "Excessive re-renders on breakpoint changes",
      "solution": "Use React.memo and useMemo for expensive calculations"
    },
    {
      "type": "bundle",
      "component": "ResponsiveGrid.tsx",
      "issue": "Large component size",
      "solution": "Implement lazy loading for grid items"
    }
  ]
}`}
        />

        <h2 id="generate-command">Code Generation</h2>
        <p>
          The <code>rre generate</code> command creates responsive components and utilities:
        </p>
        <CodeBlock 
          language="bash"
          code={`# Generate a responsive component
rre generate component Button

# Generate with specific breakpoints
rre generate component Card --breakpoints mobile,tablet,desktop

# Generate a custom hook
rre generate hook useResponsiveLayout

# Generate from template
rre generate component Modal --template card`}
        />

        <h3>Generation Templates</h3>
        <CodeBlock 
          language="bash"
          code={`# Available templates
rre generate component <name> --template <template>

Templates:
  button      - Responsive button component
  card        - Responsive card component
  grid        - Responsive grid layout
  navigation  - Responsive navigation
  modal       - Responsive modal/dialog
  form        - Responsive form components
  custom      - Custom template from file`}
        />

        <h3>Generated Component Example</h3>
        <CodeBlock 
          language="tsx"
          code={`// Generated: src/components/ResponsiveButton.tsx
import React from 'react'
import { useResponsiveValue, useScaledStyle } from '@react-responsive-easy/core'

interface ResponsiveButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function ResponsiveButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick 
}: ResponsiveButtonProps) {
  const buttonSize = useResponsiveValue(16, {
    mobile: 14,
    tablet: 16,
    desktop: 18
  })
  
  const buttonStyles = useScaledStyle({
    padding: 16,
    fontSize: buttonSize,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }, {
    mobile: {
      padding: 12,
      borderRadius: 6
    }
  })

  return (
    <button 
      style={buttonStyles}
      onClick={onClick}
      className={\`btn btn-\${variant} btn-\${size}\`}
    >
      {children}
    </button>
  )
}`}
        />

        <h2 id="analyze-command">Code Analysis</h2>
        <p>
          The <code>rre analyze</code> command analyzes your codebase for responsive patterns:
        </p>
        <CodeBlock 
          language="bash"
          code={`# Analyze current project
rre analyze

# Analyze specific directory
rre analyze src/components

# Analyze with detailed output
rre analyze --verbose

# Export analysis to file
rre analyze --export analysis-report.json`}
        />

        <h3>Analysis Features</h3>
        <ul>
          <li>
            <strong>Responsive Pattern Detection:</strong> Identifies components using responsive hooks
          </li>
          <li>
            <strong>Breakpoint Usage:</strong> Analyzes breakpoint usage across components
          </li>
          <li>
            <strong>Performance Metrics:</strong> Measures rendering performance and optimization opportunities
          </li>
          <li>
            <strong>Bundle Analysis:</strong> Analyzes impact on bundle size and loading performance
          </li>
          <li>
            <strong>Accessibility Audit:</strong> Checks for responsive accessibility issues
          </li>
        </ul>

        <h3>Analysis Report Example</h3>
        <CodeBlock 
          language="json"
          code={`{
  "project": {
    "name": "my-responsive-app",
    "totalFiles": 45,
    "responsiveComponents": 12,
    "hooksUsage": {
      "useResponsiveValue": 8,
      "useScaledStyle": 5,
      "useBreakpoint": 3,
      "usePerformanceMonitor": 2
    }
  },
  "components": [
    {
      "name": "Button.tsx",
      "responsiveHooks": ["useResponsiveValue", "useScaledStyle"],
      "breakpoints": ["mobile", "tablet", "desktop"],
      "performanceScore": 92,
      "accessibilityScore": 88
    }
  ],
  "recommendations": [
    "Consider using usePerformanceMonitor in complex components",
    "Implement consistent breakpoint patterns across components"
  ]
}`}
        />

        <h2>Configuration</h2>
        <p>
          Create a <code>rre.config.js</code> file to customize CLI behavior:
        </p>
        <CodeBlock 
          language="javascript"
          code={`// rre.config.js
module.exports = {
  // Project configuration
  project: {
    name: 'My Responsive App',
    framework: 'nextjs',
    typescript: true,
    tailwind: true
  },
  
  // CLI behavior
  cli: {
    templates: './templates',
    output: './src/components',
    format: 'tsx'
  },
  
  // Optimization rules
  optimization: {
    performance: true,
    accessibility: true,
    bundle: true,
    memory: true
  },
  
  // Analysis settings
  analysis: {
    include: ['src/**/*.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**'],
    rules: ['performance', 'accessibility', 'bundle']
  }
}`}
        />

        <h2>Integration with Build Tools</h2>
        <p>
          The CLI integrates seamlessly with popular build tools:
        </p>

        <h3>Package.json Scripts</h3>
        <CodeBlock 
          language="json"
          code={`{
  "scripts": {
    "rre:init": "rre init",
    "rre:optimize": "rre optimize",
    "rre:generate": "rre generate",
    "rre:analyze": "rre analyze",
    "build:optimized": "rre optimize && npm run build",
    "dev:analyze": "rre analyze --watch"
  }
}`}
        />

        <h3>Git Hooks</h3>
        <CodeBlock 
          language="bash"
          code={`# .git/hooks/pre-commit
#!/bin/sh
echo "Running React Responsive Easy analysis..."
rre analyze --quick
if [ $? -ne 0 ]; then
  echo "Analysis failed. Please fix issues before committing."
  exit 1
fi`}
        />

        <h2>Advanced Usage</h2>
        
        <h3>Custom Templates</h3>
        <p>
          Create custom generation templates for your team:
        </p>
        <CodeBlock 
          language="bash"
          code={`# Create custom template
mkdir -p templates/custom-button
touch templates/custom-button/component.tsx
touch templates/custom-button/styles.css
touch templates/custom-button/index.ts

# Use custom template
rre generate component MyButton --template custom-button`}
        />

        <h3>Batch Operations</h3>
        <p>
          Perform operations on multiple components:
        </p>
        <CodeBlock 
          language="bash"
          code={`# Generate multiple components
rre generate component Button Card Modal --template card

# Optimize all components
rre optimize src/components/**/*.tsx

# Analyze with pattern matching
rre analyze "src/**/*.{ts,tsx}" --pattern "useResponsive*"`}
        />

        <h3>CI/CD Integration</h3>
        <p>
          Integrate CLI commands into your CI/CD pipeline:
        </p>
        <CodeBlock 
          language="yaml"
          code={`# .github/workflows/responsive-check.yml
name: Responsive Design Check
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm install -g @react-responsive-easy/cli
      - run: rre analyze --export report.json
      - run: rre optimize --check
      - uses: actions/upload-artifact@v3
        with:
          name: analysis-report
          path: report.json`}
        />

        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Use in development:</strong> Run analysis commands during development to catch issues early
          </li>
          <li>
            <strong>Automate optimization:</strong> Include optimization in your build pipeline
          </li>
          <li>
            <strong>Custom templates:</strong> Create team-specific templates for consistent component generation
          </li>
          <li>
            <strong>Regular analysis:</strong> Schedule regular analysis runs to maintain code quality
          </li>
          <li>
            <strong>Integration:</strong> Integrate CLI commands with your existing development workflow
          </li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          Now that you understand the CLI commands, explore the build plugins and tools:
        </p>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Button asChild className="w-full">
            <Link href="/docs/plugins">
              Explore Build Plugins →
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/docs/storybook">
              Storybook Addon →
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/docs/hooks">← React Hooks</Link>
            </Button>
            <Button asChild>
              <Link href="/docs/plugins">Next: Build Plugins →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
