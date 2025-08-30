'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon,
  DocumentDuplicateIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
  EyeIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { MonacoEditor } from './MonacoEditor';
import { LivePreview } from './LivePreview';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

// Example code templates
const codeTemplates = {
  basic: `import React from 'react';
import { ResponsiveProvider, useResponsiveValue } from '@react-responsive-easy/core';

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

function Card() {
  const fontSize = useResponsiveValue(24);
  const padding = useResponsiveValue(32);
  
  return (
    <div style={{
      fontSize,
      padding,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 12,
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: 0, marginBottom: 16 }}>
        Responsive Card
      </h2>
      <p style={{ margin: 0, opacity: 0.9 }}>
        Font size: {fontSize}px | Padding: {padding}px
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ResponsiveProvider config={config}>
      <Card />
    </ResponsiveProvider>
  );
}`,
  
  advanced: `import React from 'react';
import { ResponsiveProvider, useScaledStyle, useBreakpoint } from '@react-responsive-easy/core';

const config = {
  base: { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' },
  breakpoints: [
    { name: 'Mobile', width: 375, height: 667, alias: 'mobile' },
    { name: 'Tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'Desktop', width: 1440, height: 900, alias: 'desktop' }
  ],
  strategy: {
    mode: 'scale',
    origin: 'center',
    tokens: {}
  }
};

function Dashboard() {
  const breakpoint = useBreakpoint();
  const containerStyles = useScaledStyle({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200, 1fr))',
    gap: 24,
    padding: 32,
    background: '#f8fafc',
    borderRadius: 16,
    minHeight: 300
  });
  
  const cardStyles = useScaledStyle({
    background: 'white',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  });
  
  const titleStyles = useScaledStyle({
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    marginBottom: 12,
    color: '#1e293b'
  });
  
  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <h3 style={titleStyles}>Current Breakpoint</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          {breakpoint.name} ({breakpoint.width}×{breakpoint.height})
        </p>
      </div>
      
      <div style={cardStyles}>
        <h3 style={titleStyles}>Performance</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          Optimized for {breakpoint.alias}
        </p>
      </div>
      
      <div style={cardStyles}>
        <h3 style={titleStyles}>Responsive Magic</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          Scales automatically! ✨
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ResponsiveProvider config={config} debug>
      <Dashboard />
    </ResponsiveProvider>
  );
}`,

  hooks: `import React from 'react';
import { ResponsiveProvider, useResponsiveValue, useScaledStyle, useBreakpoint } from '@react-responsive-easy/core';

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

function HookShowcase() {
  // Individual value scaling
  const titleSize = useResponsiveValue(48);
  const spacing = useResponsiveValue(24);
  
  // Style object scaling
  const buttonStyles = useScaledStyle({
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  });
  
  // Current breakpoint info
  const breakpoint = useBreakpoint();
  
  return (
    <div style={{
      padding: spacing,
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 16
    }}>
      <h1 style={{ 
        fontSize: titleSize, 
        margin: 0, 
        marginBottom: spacing 
      }}>
        Hook Showcase
      </h1>
      
      <div style={{ marginBottom: spacing }}>
        <p style={{ margin: 0, opacity: 0.9, fontSize: 16 }}>
          Current: {breakpoint.name} ({breakpoint.width}px)
        </p>
        <p style={{ margin: 0, opacity: 0.8, fontSize: 14, marginTop: 8 }}>
          Title: {titleSize}px | Spacing: {spacing}px
        </p>
      </div>
      
      <button style={buttonStyles}>
        Responsive Button
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ResponsiveProvider config={config}>
      <HookShowcase />
    </ResponsiveProvider>
  );
}`
};

interface InteractivePlaygroundProps {
  initialCode?: string;
  className?: string;
  showTemplates?: boolean;
  height?: string;
}

export function InteractivePlayground({ 
  initialCode, 
  className,
  showTemplates = true,
  height = '600px'
}: InteractivePlaygroundProps) {
  const [code, setCode] = useState(initialCode || codeTemplates.basic);
  const [activeTemplate, setActiveTemplate] = useState<keyof typeof codeTemplates>('basic');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [error, setError] = useState<Error | null>(null);

  // Handle template changes
  const handleTemplateChange = (template: keyof typeof codeTemplates) => {
    setActiveTemplate(template);
    setCode(codeTemplates[template]);
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      toast.success('Code copied to clipboard!');
    } else {
      toast.error('Failed to copy code');
    }
  };

  // Handle fullscreen toggle
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    setTheme(current => current === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };

  return (
    <div className={cn(
      'relative rounded-xl border border-gray-200 bg-white shadow-soft dark:border-gray-700 dark:bg-gray-900',
      isFullscreen && 'fixed inset-4 z-50 h-auto w-auto',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Interactive Playground
          </h3>
          
          {showTemplates && (
            <div className="flex space-x-1">
              {Object.keys(codeTemplates).map((template) => (
                <Button
                  key={template}
                  variant={activeTemplate === template ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleTemplateChange(template as keyof typeof codeTemplates)}
                  className="capitalize"
                >
                  {template}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            title="Toggle theme"
          >
            <Cog6ToothIcon className="h-4 w-4" />
          </Button>
          
          {/* Preview Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            title="Toggle preview"
          >
            {showPreview ? <CodeBracketIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </Button>
          
          {/* Copy */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            title="Copy code"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </Button>
          
          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            title="Toggle fullscreen"
          >
            <ArrowsPointingOutIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        'grid',
        showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'
      )} style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}>
        {/* Code Editor */}
        <div className="relative border-r border-gray-200 dark:border-gray-700">
          <MonacoEditor
            value={code}
            onChange={setCode}
            language="typescript"
            theme={theme}
            height="100%"
            className="border-0"
            minimap={isFullscreen}
            automaticLayout
          />
        </div>

        {/* Live Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative"
          >
            <LivePreview
              code={code}
              className="h-full border-0"
              onError={setError}
              onSuccess={() => setError(null)}
            />
          </motion.div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>TypeScript React</span>
            <span>•</span>
            <span>Live Preview {showPreview ? 'On' : 'Off'}</span>
            {error && (
              <>
                <span>•</span>
                <span className="text-red-500">Error: {error.message}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>Press Ctrl+Space for autocomplete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
