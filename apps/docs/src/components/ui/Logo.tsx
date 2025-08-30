'use client';

import { cn } from '@/lib/utils';
import { ClientOnly } from './ClientOnly';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = false }: LogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        {/* Logo Icon */}
        <svg
          viewBox="0 0 32 32"
          className={cn('h-8 w-8', className)}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="logo-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          
          {/* Default logo shape (light theme) - always render this to prevent hydration mismatch */}
          <g>
            <rect x="2" y="2" width="12" height="12" rx="2" fill="url(#logo-gradient)" opacity="1" />
            <rect x="16" y="2" width="8" height="8" rx="1.5" fill="url(#logo-gradient)" opacity="0.8" />
            <rect x="26" y="2" width="4" height="4" rx="1" fill="url(#logo-gradient)" opacity="0.6" />
            <rect x="2" y="16" width="8" height="8" rx="1.5" fill="url(#logo-gradient)" opacity="0.8" />
            <rect x="12" y="16" width="4" height="4" rx="1" fill="url(#logo-gradient)" opacity="0.6" />
            <rect x="18" y="16" width="2" height="2" rx="0.5" fill="url(#logo-gradient)" opacity="0.4" />
            <path 
              d="M14 8 L16 6 M24 6 L26 4 M10 16 L12 18 M16 18 L18 17" 
              stroke="url(#logo-gradient)" 
              strokeWidth="1" 
              opacity="0.3"
            />
          </g>
          
          {/* Theme-dependent content wrapped in ClientOnly to prevent hydration issues */}
          <ClientOnly>
            {/* Main Logo Shape - Responsive Grid Pattern */}
            <g className="dark:hidden">
              {/* Large Screen */}
              <rect x="2" y="2" width="12" height="12" rx="2" fill="url(#logo-gradient)" opacity="1" />
              {/* Medium Screen */}
              <rect x="16" y="2" width="8" height="8" rx="1.5" fill="url(#logo-gradient)" opacity="0.8" />
              {/* Small Screen */}
              <rect x="26" y="2" width="4" height="4" rx="1" fill="url(#logo-gradient)" opacity="0.6" />
              
              {/* Bottom row - scaling down */}
              <rect x="2" y="16" width="8" height="8" rx="1.5" fill="url(#logo-gradient)" opacity="0.8" />
              <rect x="12" y="16" width="4" height="4" rx="1" fill="url(#logo-gradient)" opacity="0.6" />
              <rect x="18" y="16" width="2" height="2" rx="0.5" fill="url(#logo-gradient)" opacity="0.4" />
              
              {/* Connection lines showing responsive flow */}
              <path 
                d="M14 8 L16 6 M24 6 L26 4 M10 16 L12 18 M16 18 L18 17" 
                stroke="url(#logo-gradient)" 
                strokeWidth="1" 
                opacity="0.3"
              />
            </g>
            
            {/* Dark mode version */}
            <g className="hidden dark:block">
              <rect x="2" y="2" width="12" height="12" rx="2" fill="url(#logo-gradient-dark)" opacity="1" />
              <rect x="16" y="2" width="8" height="8" rx="1.5" fill="url(#logo-gradient-dark)" opacity="0.8" />
              <rect x="26" y="2" width="4" height="4" rx="1" fill="url(#logo-gradient-dark)" opacity="0.6" />
              <rect x="2" y="16" width="8" height="8" rx="1.5" fill="url(#logo-gradient-dark)" opacity="0.8" />
              <rect x="12" y="16" width="4" height="4" rx="1" fill="url(#logo-gradient-dark)" opacity="0.6" />
              <rect x="18" y="16" width="2" height="2" rx="0.5" fill="url(#logo-gradient-dark)" opacity="0.4" />
              <path 
                d="M14 8 L16 6 M24 6 L26 4 M10 16 L12 18 M16 18 L18 17" 
                stroke="url(#logo-gradient-dark)" 
                strokeWidth="1" 
                opacity="0.3"
              />
            </g>
          </ClientOnly>
        </svg>
      </div>
      
      {showText && (
        <span className="font-display font-bold text-lg bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          RRE
        </span>
      )}
    </div>
  );
}
