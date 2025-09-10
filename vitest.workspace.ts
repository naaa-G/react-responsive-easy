import { defineWorkspace } from 'vitest/config';

/**
 * Vitest Workspace Configuration
 * 
 * Defines test configurations for all packages in the monorepo
 * with proper isolation and resource management.
 */

export default defineWorkspace([
  // Core package
  {
    test: {
      name: 'core',
      root: './packages/core',
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  },
  
  // AI Optimizer package
  {
    test: {
      name: 'ai-optimizer',
      root: './packages/ai-optimizer',
      environment: 'node',
      setupFiles: ['./src/__tests__/setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  },
  
  // Performance Dashboard package
  {
    test: {
      name: 'performance-dashboard',
      root: './packages/performance-dashboard',
      environment: 'jsdom',
      setupFiles: ['./src/__tests__/setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  },
  
  // Babel Plugin package
  {
    test: {
      name: 'babel-plugin',
      root: './packages/babel-plugin',
      environment: 'node',
      setupFiles: ['./src/__tests__/setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  },
  
  // CLI package
  {
    test: {
      name: 'cli',
      root: './packages/cli',
      environment: 'node',
      setupFiles: ['./src/__tests__/setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  },
  
  // PostCSS Plugin package
  {
    test: {
      name: 'postcss-plugin',
      root: './packages/postcss-plugin',
      environment: 'node',
      setupFiles: ['./src/__tests__/setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  },
  
  // Storybook Addon package
  {
    test: {
      name: 'storybook-addon',
      root: './packages/storybook-addon',
      environment: 'jsdom',
      setupFiles: ['./src/__tests__/setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  },
  
  // Vite Plugin package
  {
    test: {
      name: 'vite-plugin',
      root: './packages/vite-plugin',
      environment: 'node',
      setupFiles: ['./src/__tests__/setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  },
  
  // Next Plugin package
  {
    test: {
      name: 'next-plugin',
      root: './packages/next-plugin',
      environment: 'node',
      setupFiles: ['./src/__tests__/setup.ts'],
      isolate: true,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  }
]);
