'use client';

import { useState, useEffect } from 'react';

const stats = [
  { label: 'Bundle Size', value: '< 15KB', icon: '⚡' },
  { label: 'Performance', value: '100/100', icon: '📊' },
  { label: 'TypeScript', value: 'First-Class', icon: '🛡️' },
  { label: 'Developer Experience', value: 'Excellent', icon: '💻' },
];

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-50/30 to-purple-50/30 dark:from-gray-950 dark:via-brand-950/20 dark:to-purple-950/20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-brand-400/20 to-purple-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8">
            <a
              href="/blog/announcing-v1"
              className="inline-flex items-center rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-200 dark:bg-brand-900/50 dark:text-brand-300 dark:hover:bg-brand-900/70"
            >
              <span className="mr-2">✨</span>
              Announcing React Responsive Easy v1.0
              <div className="ml-2 h-3 w-3 flex items-center justify-center">
                <div className="h-0 w-0 border-l-[5px] border-r-0 border-t-[2.5px] border-b-[2.5px] border-l-current border-t-transparent border-b-transparent" />
              </div>
            </a>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto">
            Build{' '}
            <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Responsive UIs
            </span>{' '}
            with Mathematical Precision
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Enterprise-grade responsive design system that scales your React components 
            perfectly across all devices. No more manual breakpoints or media queries.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-12">
            <a 
              href="/docs/getting-started"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 min-w-[180px]"
            >
              <span className="mr-2">🚀</span>
              Get Started
            </a>
            
            <a 
              href="/playground"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-8 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 min-w-[180px]"
            >
              <span className="mr-2">▶️</span>
              Try Playground
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-lg bg-white/60 backdrop-blur-sm dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-700/50 p-5"
              >
                <span className="text-2xl mb-3">{stat.icon}</span>
                <div className="font-bold text-gray-900 dark:text-white text-lg">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-center mt-1 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}