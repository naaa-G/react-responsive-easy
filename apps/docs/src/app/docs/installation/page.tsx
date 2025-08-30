import { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';

export const metadata: Metadata = {
  title: 'Installation',
  description: 'How to install React Responsive Easy in your project.',
};

export default function InstallationPage() {
  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <h1>Installation</h1>
      <p>
        React Responsive Easy is available as an npm package. Choose your preferred package manager:
      </p>

      <h2>Package Managers</h2>

      <h3>npm</h3>
      <CodeBlock
        code="npm install @react-responsive-easy/core"
        language="bash"
        showCopy
      />

      <h3>yarn</h3>
      <CodeBlock
        code="yarn add @react-responsive-easy/core"
        language="bash"
        showCopy
      />

      <h3>pnpm</h3>
      <CodeBlock
        code="pnpm add @react-responsive-easy/core"
        language="bash"
        showCopy
      />

      <h2>Additional Packages</h2>
      <p>
        For advanced features, you can install additional packages:
      </p>

      <h3>CLI Tools</h3>
      <CodeBlock
        code="npm install -D @react-responsive-easy/cli"
        language="bash"
        showCopy
      />

      <h3>Build Plugins</h3>
      <CodeBlock
        code={`# Babel Plugin
npm install -D @react-responsive-easy/babel-plugin

# PostCSS Plugin  
npm install -D @react-responsive-easy/postcss-plugin

# Vite Plugin
npm install -D @react-responsive-easy/vite-plugin

# Next.js Plugin
npm install -D @react-responsive-easy/next-plugin`}
        language="bash"
        showCopy
      />

      <h2>Requirements</h2>
      <ul>
        <li>React 16.8+ (hooks support required)</li>
        <li>TypeScript 4.0+ (recommended)</li>
        <li>Node.js 14+ for build tools</li>
      </ul>
    </div>
  );
}
