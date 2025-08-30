'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const codeExamples = [
  {
    id: 'basic',
    title: 'Basic Usage',
    description: 'Get started with responsive values in seconds',
    code: `import { ResponsiveProvider, useResponsiveValue } from '@react-responsive-easy/core';

function App() {
  return (
    <ResponsiveProvider config={config}>
      <Hero />
    </ResponsiveProvider>
  );
}

function Hero() {
  const fontSize = useResponsiveValue(48);
  const padding = useResponsiveValue(32);
  
  return (
    <div style={{ fontSize, padding }}>
      <h1>Welcome to the Future</h1>
      <p>Responsive design made simple</p>
    </div>
  );
}`
  },
  {
    id: 'advanced',
    title: 'Advanced Scaling',
    description: 'Fine-tune your responsive behavior with custom strategies',
    code: `import { useScaledStyle, useBreakpoint } from '@react-responsive-easy/core';

function Card() {
  const breakpoint = useBreakpoint();
  const styles = useScaledStyle({
    padding: 24,
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 1.5,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  });
  
  return (
    <div style={styles} className="card">
      <h3>Current: {breakpoint.name}</h3>
      <p>Automatically scaled for {breakpoint.width}px</p>
    </div>
  );
}`
  },
  {
    id: 'performance',
    title: 'Performance Monitoring',
    description: 'Built-in performance tracking and optimization',
    code: `import { usePerformanceMonitor } from '@react-responsive-easy/performance-dashboard';

function OptimizedComponent() {
  const { metrics, isOptimal } = usePerformanceMonitor({
    trackRender: true,
    trackMemory: true,
    trackLayoutShift: true
  });
  
  const styles = useScaledStyle({
    padding: 20,
    margin: 16,
    // Conditional optimization based on performance
    willChange: isOptimal ? 'auto' : 'transform',
    transform: \`scale(\${metrics.scaleFactor})\`
  });
  
  return (
    <div style={styles}>
      <p>Render time: {metrics.renderTime}ms</p>
      <p>Memory usage: {metrics.memoryUsage}MB</p>
    </div>
  );
}`
  },
  {
    id: 'ai',
    title: 'AI Optimization',
    description: 'Let AI suggest the best responsive configurations',
    code: `import { useAIOptimizer } from '@react-responsive-easy/ai-optimizer';

function SmartComponent() {
  const { optimizedConfig, suggestions } = useAIOptimizer({
    component: 'ProductCard',
    usage: 'e-commerce',
    priority: 'performance'
  });
  
  const styles = useScaledStyle({
    // AI-suggested optimal values
    ...optimizedConfig.styles,
    // Override with custom values if needed
    padding: optimizedConfig.padding * 1.2
  });
  
  return (
    <div style={styles}>
      <h3>AI-Optimized Design</h3>
      {suggestions.map(suggestion => (
        <div key={suggestion.id}>
          💡 {suggestion.message}
          <span>+{suggestion.performanceGain}% faster</span>
        </div>
      ))}
    </div>
  );
}`
  }
];

export function CodeShowcase() {
  const [activeExample, setActiveExample] = useState(codeExamples[0]);

  return (
    <section className="section-padding">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            See it in <span className="gradient-text">action</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            From basic responsive values to AI-powered optimization, 
            explore what's possible with React Responsive Easy.
          </motion.p>
        </div>

        <div className="mt-16">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {codeExamples.map((example) => (
              <Button
                key={example.id}
                variant={activeExample.id === example.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveExample(example)}
                className="flex-shrink-0"
              >
                {example.title}
              </Button>
            ))}
          </div>

          {/* Code Display */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExample.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-4xl"
              >
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {activeExample.title}
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {activeExample.description}
                  </p>
                </div>
                
                <CodeBlock
                  code={activeExample.code}
                  language="tsx"
                  title={`${activeExample.title}.tsx`}
                  showLineNumbers
                  showCopy
                  className="mx-auto max-w-3xl"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: 'TypeScript First', value: '100%' },
              { label: 'Bundle Size', value: '< 15KB' },
              { label: 'Performance', value: '99/100' },
              { label: 'Developer Satisfaction', value: '98%' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50"
              >
                <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
