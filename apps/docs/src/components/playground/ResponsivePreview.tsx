'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone,
  Tablet,
  Monitor,
  Tv
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Breakpoint {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<{ className?: string }>;
  alias: string;
}

const breakpoints: Breakpoint[] = [
  {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: Smartphone,
    alias: 'mobile'
  },
  {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: Tablet,
    alias: 'tablet'
  },
  {
    name: 'Desktop',
    width: 1440,
    height: 900,
    icon: Monitor,
    alias: 'desktop'
  },
  {
    name: 'Large',
    width: 1920,
    height: 1080,
    icon: Tv,
    alias: 'large'
  }
];

export function ResponsivePreview() {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState(breakpoints[2]); // Desktop
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBreakpointChange = (breakpoint: Breakpoint) => {
    if (breakpoint.alias === selectedBreakpoint.alias) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedBreakpoint(breakpoint);
      setIsAnimating(false);
    }, 150);
  };

  // Calculate responsive values based on the selected breakpoint
  const getScaledValue = (baseValue: number) => {
    const baseBreakpoint = breakpoints[2]; // Desktop as base
    const scale = selectedBreakpoint.width / baseBreakpoint.width;
    return Math.round(baseValue * scale);
  };

  const demoComponent = (
    <div 
      className="flex flex-col items-center justify-center space-y-4 bg-gradient-to-br from-brand-50 to-purple-50 p-8 dark:from-brand-950/20 dark:to-purple-950/20"
      style={{
        fontSize: `${getScaledValue(16)}px`,
        padding: `${getScaledValue(32)}px`,
      }}
    >
      <div 
        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
        style={{
          padding: `${getScaledValue(24)}px`,
          borderRadius: `${getScaledValue(8)}px`,
        }}
      >
        <h3 
          className="font-bold text-gray-900 dark:text-white"
          style={{ fontSize: `${getScaledValue(24)}px` }}
        >
          Responsive Card
        </h3>
        <p 
          className="mt-2 text-gray-600 dark:text-gray-300"
          style={{ 
            fontSize: `${getScaledValue(16)}px`,
            marginTop: `${getScaledValue(8)}px`
          }}
        >
          This card scales perfectly across all breakpoints using mathematical precision.
        </p>
        <div 
          className="mt-4 flex space-x-2"
          style={{ marginTop: `${getScaledValue(16)}px` }}
        >
          <div 
            className="h-3 w-3 rounded-full bg-brand-500"
            style={{
              width: `${getScaledValue(12)}px`,
              height: `${getScaledValue(12)}px`
            }}
          />
          <div 
            className="h-3 w-3 rounded-full bg-purple-500"
            style={{
              width: `${getScaledValue(12)}px`,
              height: `${getScaledValue(12)}px`
            }}
          />
          <div 
            className="h-3 w-3 rounded-full bg-pink-500"
            style={{
              width: `${getScaledValue(12)}px`,
              height: `${getScaledValue(12)}px`
            }}
          />
        </div>
      </div>
      
      <div className="text-center">
        <div 
          className="font-mono text-sm text-gray-500 dark:text-gray-400"
          style={{ fontSize: `${getScaledValue(12)}px` }}
        >
          {selectedBreakpoint.width} × {selectedBreakpoint.height}
        </div>
        <div 
          className="font-medium text-gray-700 dark:text-gray-300"
          style={{ fontSize: `${getScaledValue(14)}px` }}
        >
          Scale: {Math.round((selectedBreakpoint.width / breakpoints[2].width) * 100)}%
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl bg-white p-6 shadow-soft dark:bg-gray-900">
      {/* Breakpoint Selector */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {breakpoints.map((breakpoint) => {
          const Icon = breakpoint.icon;
          const isSelected = breakpoint.alias === selectedBreakpoint.alias;
          
          return (
            <Button
              key={breakpoint.alias}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleBreakpointChange(breakpoint)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{breakpoint.name}</span>
              <span className="text-xs opacity-70">
                {breakpoint.width}w
              </span>
            </Button>
          );
        })}
      </div>

      {/* Preview Container */}
      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBreakpoint.alias}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center p-4"
            style={{
              minHeight: '300px',
              maxHeight: '400px'
            }}
          >
            <div
              className="origin-top-left overflow-hidden rounded border bg-white shadow-sm dark:bg-gray-900"
              style={{
                width: `${Math.min(selectedBreakpoint.width, 600)}px`,
                height: `${Math.min(selectedBreakpoint.height * 0.6, 300)}px`,
                transform: selectedBreakpoint.width > 600 
                  ? `scale(${600 / selectedBreakpoint.width})` 
                  : 'scale(1)',
              }}
            >
              {demoComponent}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Device Frame Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Interactive preview showing how components scale across breakpoints.
          <br />
          <span className="font-mono">useResponsiveValue()</span> automatically calculates the perfect size for each device.
        </p>
      </div>
    </div>
  );
}
