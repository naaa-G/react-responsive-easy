export const siteConfig = {
  name: 'React Responsive Easy',
  description: 'Enterprise-grade responsive design system for React applications. Build responsive UIs that scale perfectly across all devices with mathematical precision.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://react-responsive-easy.dev',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/naa-G/react-responsive-easy',
    npm: 'https://www.npmjs.com/package/@react-responsive-easy/core',
    discord: 'https://discord.gg/react-responsive-easy',
    twitter: 'https://twitter.com/react_responsive',
    docs: '/docs',
    playground: '/playground',
    examples: '/examples',
    blog: '/blog'
  },
  author: {
    name: 'naa-G',
    url: 'https://github.com/naa-G',
    twitter: '@naa_G_dev'
  },
  keywords: [
    'react',
    'responsive',
    'design',
    'ui',
    'components',
    'typescript',
    'tailwind',
    'nextjs',
    'performance',
    'accessibility',
    'enterprise',
    'design-system'
  ]
} as const;

export const docsConfig = {
  mainNav: [
    {
      title: 'Documentation',
      href: '/docs',
      description: 'Complete guides and API reference'
    },
    {
      title: 'Playground',
      href: '/playground',
      description: 'Interactive code playground'
    },
    {
      title: 'Examples',
      href: '/examples',
      description: 'Real-world usage examples'
    },
    {
      title: 'Blog',
      href: '/blog',
      description: 'Latest updates and tutorials'
    }
  ],
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
          description: 'What is React Responsive Easy?'
        },
        {
          title: 'Installation',
          href: '/docs/installation',
          description: 'Get up and running in minutes'
        },
        {
          title: 'Quick Start',
          href: '/docs/quick-start',
          description: 'Your first responsive component'
        },
        {
          title: 'Configuration',
          href: '/docs/configuration',
          description: 'Configure breakpoints and scaling'
        }
      ]
    },
    {
      title: 'Core Concepts',
      items: [
        {
          title: 'Core Concepts',
          href: '/docs/core-concepts',
          description: 'Fundamental principles and mental models'
        },
        {
          title: 'Responsive Provider',
          href: '/docs/responsive-provider',
          description: 'The heart of the system'
        },
        {
          title: 'Breakpoints',
          href: '/docs/breakpoints',
          description: 'Define your responsive strategy'
        },
        {
          title: 'Scaling Engine',
          href: '/docs/scaling-engine',
          description: 'Mathematical scaling algorithms'
        },
        {
          title: 'Performance',
          href: '/docs/performance',
          description: 'Optimization and monitoring'
        }
      ]
    },
    {
      title: 'React Hooks',
      items: [
        {
          title: 'useResponsiveValue',
          href: '/docs/hooks/use-responsive-value',
          description: 'Scale individual values'
        },
        {
          title: 'useScaledStyle',
          href: '/docs/hooks/use-scaled-style',
          description: 'Scale style objects'
        },
        {
          title: 'useBreakpoint',
          href: '/docs/hooks/use-breakpoint',
          description: 'Get current breakpoint info'
        },
        {
          title: 'usePerformanceMonitor',
          href: '/docs/hooks/use-performance-monitor',
          description: 'Monitor component performance'
        }
      ]
    },
    {
      title: 'CLI & Tools',
      items: [
        {
          title: 'CLI Commands',
          href: '/docs/cli',
          description: 'Command-line interface'
        },
        {
          title: 'Build Plugins',
          href: '/docs/plugins',
          description: 'Babel, PostCSS, Vite, Next.js'
        },
        {
          title: 'Storybook Addon',
          href: '/docs/storybook',
          description: 'Document responsive components'
        },
        {
          title: 'Browser Extension',
          href: '/docs/browser-extension',
          description: 'Visual debugging tools'
        }
      ]
    },
    {
      title: 'Advanced',
      items: [
        {
          title: 'AI Optimization',
          href: '/docs/ai-optimization',
          description: 'Machine learning suggestions'
        },
        {
          title: 'Performance Dashboard',
          href: '/docs/performance-dashboard',
          description: 'Real-time monitoring'
        },
        {
          title: 'Design Tokens',
          href: '/docs/design-tokens',
          description: 'Figma integration'
        },
        {
          title: 'Testing',
          href: '/docs/testing',
          description: 'E2E and visual regression'
        }
      ]
    },
    {
      title: 'Framework Guides',
      items: [
        {
          title: 'Next.js',
          href: '/docs/frameworks/nextjs',
          description: 'Server-side rendering'
        },
        {
          title: 'Vite',
          href: '/docs/frameworks/vite',
          description: 'Modern build tooling'
        },
        {
          title: 'Create React App',
          href: '/docs/frameworks/create-react-app',
          description: 'Classic React setup'
        },
        {
          title: 'Remix',
          href: '/docs/frameworks/remix',
          description: 'Full-stack React'
        }
      ]
    }
  ]
} as const;
