# @yaseratiar/react-responsive-easy-next-plugin

> Enterprise-grade Next.js plugin for React Responsive Easy integration and SSR optimization

[![npm version](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-next-plugin.svg)](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-next-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [SSR & SSG Support](#-ssr--ssg-support)
- [Performance](#-performance)
- [Migration Guide](#-migration-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

`@yaseratiar/react-responsive-easy-next-plugin` is a powerful Next.js plugin that seamlessly integrates React Responsive Easy into your Next.js applications, providing server-side rendering support, static generation optimization, and enhanced performance.

Built for enterprise applications, it offers:
- **SSR Support** - Perfect server-side rendering compatibility
- **SSG Optimization** - Static generation with responsive pre-computation
- **Zero Configuration** - Works out of the box with Next.js
- **TypeScript Support** - Full type safety with intelligent IntelliSense
- **Enterprise Integration** - Seamless integration with CI/CD pipelines

## 🚀 Features

### Core Integration
- **Next.js Native** - Built specifically for Next.js architecture
- **Plugin System** - Leverages Next.js's powerful plugin ecosystem
- **App Router Support** - Full compatibility with Next.js 13+ App Router
- **Pages Router Support** - Backward compatibility with Pages Router

### SSR & SSG Support
- **Server-Side Rendering** - Responsive values computed on the server
- **Static Generation** - Pre-computed responsive values at build time
- **Incremental Static Regeneration** - Dynamic responsive updates
- **Edge Runtime** - Edge function compatibility

### Development Experience
- **Zero Configuration** - Automatic setup with sensible defaults
- **Hot Reloading** - Instant updates with responsive debugging tools
- **Source Maps** - Accurate source mapping for debugging
- **Error Overlay** - Rich error reporting with helpful suggestions

### Build Optimization
- **Pre-computation** - Build-time responsive value calculation
- **Tree Shaking** - Remove unused responsive code automatically
- **Code Splitting** - Optimize responsive code for different chunks
- **Bundle Analysis** - Detailed bundle size and performance reports

### Enterprise Features
- **Type Safety** - Full TypeScript support with type checking
- **Configuration Validation** - Validate plugin configuration at build time
- **Environment Support** - Different optimizations for dev/prod builds
- **Monitoring Integration** - Performance metrics collection

## 📦 Installation

### npm
```bash
npm install --save-dev @yaseratiar/react-responsive-easy-next-plugin
```

### yarn
```bash
yarn add --dev @yaseratiar/react-responsive-easy-next-plugin
```

### pnpm
```bash
pnpm add --save-dev @yaseratiar/react-responsive-easy-next-plugin
```

### Peer Dependencies
```bash
npm install --save-dev next react react-dom
```

## 🎯 Quick Start

### 1. Install the Plugin

```bash
npm install --save-dev @yaseratiar/react-responsive-easy-next-plugin
```

### 2. Configure Next.js

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy({
  ssr: true,
  precompute: true
})({
  // your Next.js config
});
```

### 3. Use in Your Components

```tsx
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

const Hero = () => {
  const fontSize = useResponsiveValue(48, { token: 'fontSize' });
  const padding = useResponsiveValue(32, { token: 'spacing' });
  
  return (
    <h1 style={{ fontSize, padding }}>
      Responsive Hero Title
    </h1>
  );
};
```

### 4. Start Development

```bash
npm run dev
```

## ⚙️ Configuration

### Basic Configuration

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy()({
  // your Next.js config
});
```

### Advanced Configuration

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy({
  // Core options
  enabled: true,
  configPath: './responsive.config.js',
  
  // Configuration options
  configInline: {
    base: { width: 1920, height: 1080 },
    breakpoints: [
      { name: 'mobile', width: 390, height: 844 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ],
    strategy: {
      origin: 'width',
      tokens: {
        fontSize: { scale: 0.85, min: 12, max: 72 },
        spacing: { scale: 0.9, step: 4, min: 4, max: 128 },
        radius: { scale: 0.95, min: 2, max: 32 }
      }
    }
  },
  
  // SSR options
  ssr: true,
  ssg: true,
  edgeRuntime: false,
  
  // Build options
  precompute: true,
  generateCustomProperties: true,
  generateSourceMaps: true,
  
  // Performance options
  enableCaching: true,
  cacheSize: 1000,
  enableOptimization: true,
  
  // Development options
  addComments: process.env.NODE_ENV === 'development',
  validateConfig: true,
  performanceMetrics: process.env.NODE_ENV === 'development',
  
  // Hooks
  onTransform: (module, context) => {
    console.log(`Transformed: ${context.filename}`);
  },
  onError: (error, context) => {
    console.error(`Transform error: ${error.message}`);
  }
})({
  // your Next.js config
  experimental: {
    appDir: true
  }
});
```

### Configuration File

Create a `responsive.config.js` file:

```javascript
// responsive.config.js
module.exports = {
  base: { width: 1920, height: 1080 },
  breakpoints: [
    { name: 'xs', width: 320, height: 568 },
    { name: 'sm', width: 576, height: 667 },
    { name: 'md', width: 768, height: 1024 },
    { name: 'lg', width: 992, height: 1200 },
    { name: 'xl', width: 1200, height: 1600 },
    { name: 'xxl', width: 1920, height: 1080 }
  ],
  strategy: {
    origin: 'width',
    tokens: {
      fontSize: { 
        scale: 0.85, 
        min: 12, 
        max: 72,
        step: 1,
        round: true
      },
      spacing: { 
        scale: 0.9, 
        step: 4, 
        min: 4, 
        max: 128,
        round: true
      },
      radius: { 
        scale: 0.95, 
        min: 2, 
        max: 32,
        step: 2,
        round: true
      }
    }
  }
};
```

### Environment-Specific Configuration

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = withReactResponsiveEasy({
  enabled: true,
  
  // Development optimizations
  ...(isDevelopment && {
    addComments: true,
    validateConfig: true,
    performanceMetrics: true,
    generateSourceMaps: true
  }),
  
  // Production optimizations
  ...(isProduction && {
    ssr: true,
    ssg: true,
    precompute: true,
    enableOptimization: true,
    enableCaching: true,
    performanceMetrics: false
  })
})({
  // your Next.js config
});
```

### TypeScript Configuration

```typescript
// next.config.ts
import { withReactResponsiveEasy } from '@yaseratiar/react-responsive-easy-next-plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    appDir: true
  }
};

export default withReactResponsiveEasy({
  ssr: true,
  precompute: true,
  generateCustomProperties: true
})(nextConfig);
```

## 🔧 API Reference

### Plugin Options

#### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the plugin |
| `configPath` | `string` | `undefined` | Path to configuration file |
| `configInline` | `object` | `undefined` | Inline configuration object |

#### SSR & SSG Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ssr` | `boolean` | `true` | Enable server-side rendering support |
| `ssg` | `boolean` | `true` | Enable static generation support |
| `edgeRuntime` | `boolean` | `false` | Enable Edge Runtime support |

#### Build Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `precompute` | `boolean` | `true` | Enable build-time pre-computation |
| `generateCustomProperties` | `boolean` | `true` | Generate CSS custom properties |
| `generateSourceMaps` | `boolean` | `true` | Generate source maps |

#### Performance Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableCaching` | `boolean` | `true` | Enable value caching |
| `cacheSize` | `number` | `1000` | Maximum cache size |
| `enableOptimization` | `boolean` | `true` | Enable build optimization |

#### Development Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `addComments` | `boolean` | `false` | Add helpful comments |
| `validateConfig` | `boolean` | `false` | Validate configuration |
| `performanceMetrics` | `boolean` | `false` | Collect performance metrics |

#### Hooks

| Option | Type | Description |
|--------|------|-------------|
| `onTransform` | `function` | Called after each transformation |
| `onError` | `function` | Called when errors occur |

### Configuration Schema

```typescript
interface PluginOptions {
  // Core options
  enabled?: boolean;
  configPath?: string;
  configInline?: ResponsiveConfig;
  
  // SSR & SSG options
  ssr?: boolean;
  ssg?: boolean;
  edgeRuntime?: boolean;
  
  // Build options
  precompute?: boolean;
  generateCustomProperties?: boolean;
  generateSourceMaps?: boolean;
  
  // Performance options
  enableCaching?: boolean;
  cacheSize?: number;
  enableOptimization?: boolean;
  
  // Development options
  addComments?: boolean;
  validateConfig?: boolean;
  performanceMetrics?: boolean;
  
  // Hooks
  onTransform?: (module: Module, context: TransformContext) => void;
  onError?: (error: Error, context: TransformContext) => void;
}

interface ResponsiveConfig {
  base: Viewport;
  breakpoints: Breakpoint[];
  strategy: ScalingStrategy;
}

interface Viewport {
  width: number;
  height: number;
}

interface Breakpoint {
  name: string;
  width: number;
  height: number;
}

interface ScalingStrategy {
  origin: 'width' | 'height' | 'area' | 'diagonal';
  tokens: TokenConfig;
  fallback?: string;
}

interface TokenConfig {
  [key: string]: {
    scale: number | ((value: number, ratio: number) => number);
    min?: number;
    max?: number;
    step?: number;
    round?: boolean;
    unit?: string;
  };
}
```

## 🚀 Advanced Usage

### Custom Transformations

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy({
  ssr: true,
  precompute: true,
  development: true,
  
  // Custom transformation hooks
  onTransform: (module, context) => {
    // Log all transformations
    console.log(`Transformed ${context.filename}:${context.line}:${context.column}`);
    
    // Custom transformation logic
    if (module.type === 'js' && module.code.includes('useResponsiveValue')) {
      // Custom handling for useResponsiveValue calls
      console.log('Found useResponsiveValue call');
    }
  },
  
  onError: (error, context) => {
    // Custom error handling
    console.error(`Transform error in ${context.filename}:`, error.message);
    
    // Send to error reporting service
    if (process.env.ERROR_REPORTING_URL) {
      fetch(process.env.ERROR_REPORTING_URL, {
        method: 'POST',
        body: JSON.stringify({ error: error.message, context })
      });
    }
  }
})({
  // your Next.js config
});
```

### Multiple Configurations

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy({
  // Development configuration
  ...(process.env.NODE_ENV === 'development' ? {
    precompute: false,
    development: true,
    addComments: true,
    validateConfig: true
  } : {}),
  
  // Production configuration
  ...(process.env.NODE_ENV === 'production' ? {
    ssr: true,
    ssg: true,
    precompute: true,
    enableOptimization: true,
    enableCaching: true
  } : {})
})({
  // your Next.js config
});
```

### Integration with Other Plugins

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
const withPWA = require('next-pwa')({
  dest: 'public'
});

module.exports = withBundleAnalyzer(
  withPWA(
    withReactResponsiveEasy({
      ssr: true,
      precompute: true
    })({
      // your Next.js config
      experimental: {
        appDir: true
      }
    })
  )
);
```

### Environment Variables Integration

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy({
  ssr: process.env.ENABLE_SSR === 'true',
  precompute: process.env.ENABLE_PRECOMPUTE === 'true',
  development: process.env.NODE_ENV === 'development',
  
  // Conditional features based on environment
  enableCaching: process.env.NODE_ENV === 'production',
  performanceMetrics: process.env.NODE_ENV === 'development',
  
  // Feature flags
  features: {
    advancedOptimizations: process.env.ADVANCED_OPTIMIZATIONS === 'true',
    experimentalTransforms: process.env.EXPERIMENTAL === 'true'
  }
})({
  // your Next.js config
  env: {
    RRE_VERSION: process.env.npm_package_version,
    RRE_ENV: process.env.NODE_ENV
  }
});
```

## 🔄 SSR & SSG Support

### Server-Side Rendering

```tsx
// pages/index.tsx (Pages Router)
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

export default function HomePage() {
  const fontSize = useResponsiveValue(48, { token: 'fontSize' });
  const padding = useResponsiveValue(32, { token: 'spacing' });
  
  return (
    <div style={{ fontSize, padding }}>
      <h1>Server-Side Rendered</h1>
    </div>
  );
}

// app/page.tsx (App Router)
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

export default function HomePage() {
  const fontSize = useResponsiveValue(48, { token: 'fontSize' });
  const padding = useResponsiveValue(32, { token: 'spacing' });
  
  return (
    <div style={{ fontSize, padding }}>
      <h1>App Router Page</h1>
    </div>
  );
}
```

### Static Generation

```tsx
// pages/blog/[slug].tsx
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

export default function BlogPost({ post }) {
  const fontSize = useResponsiveValue(24, { token: 'fontSize' });
  const margin = useResponsiveValue(32, { token: 'spacing' });
  
  return (
    <article style={{ fontSize, margin }}>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}

export async function getStaticProps({ params }) {
  // Fetch post data
  const post = await fetchPost(params.slug);
  
  return {
    props: { post },
    revalidate: 60 // ISR with 60 seconds
  };
}

export async function getStaticPaths() {
  // Generate static paths
  const posts = await fetchPosts();
  
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking'
  };
}
```

### Edge Runtime Support

```tsx
// app/api/edge/route.ts
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

export const runtime = 'edge';

export async function GET() {
  const fontSize = useResponsiveValue(16, { token: 'fontSize' });
  
  return Response.json({
    message: 'Edge Runtime Response',
    fontSize
  });
}
```

### Dynamic Imports

```tsx
// components/DynamicComponent.tsx
import dynamic from 'next/dynamic';
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: true
});

export default function Wrapper() {
  const padding = useResponsiveValue(24, { token: 'spacing' });
  
  return (
    <div style={{ padding }}>
      <DynamicComponent />
    </div>
  );
}
```

## ⚡ Performance

### Performance Benefits

- **Build-time Processing** - Zero runtime responsive calculations
- **Bundle Optimization** - Optimize bundle size and loading
- **Tree Shaking** - Remove unused responsive code automatically
- **Code Splitting** - Intelligent code splitting for responsive features

### Performance Monitoring

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy({
  ssr: true,
  precompute: true,
  performanceMetrics: true,
  
  onTransform: (module, context) => {
    // Collect performance metrics
    const startTime = performance.now();
    
    // ... transformation logic ...
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log performance data
    console.log(`Transform took ${duration.toFixed(2)}ms`);
    
    // Send to monitoring service
    if (process.env.MONITORING_URL) {
      fetch(process.env.MONITORING_URL, {
        method: 'POST',
        body: JSON.stringify({
          metric: 'transform_duration',
          value: duration,
          filename: context.filename,
          timestamp: Date.now()
        })
      });
    }
  }
})({
  // your Next.js config
});
```

### Performance Budgets

```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy({
  ssr: true,
  precompute: true,
  
  // Performance budgets
  performance: {
    maxTransformTime: 100, // ms
    maxBundleSizeIncrease: '50KB',
    maxMemoryUsage: '100MB'
  },
  
  onTransform: (module, context) => {
    // Check performance budgets
    if (context.transformTime > 100) {
      console.warn(`Transform took ${context.transformTime}ms (budget: 100ms)`);
    }
  }
})({
  // your Next.js config
});
```

## 🔄 Migration Guide

### From Create React App

**Before:**
```javascript
// package.json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

**After:**
```javascript
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}

// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy()({
  // your Next.js config
});
```

### From Vite

**Before:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy()
  ]
});
```

**After:**
```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy()({
  // your Next.js config
});
```

### From Webpack

**Before:**
```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new ReactResponsiveEasyWebpackPlugin()
  ]
};
```

**After:**
```javascript
// next.config.js
const { withReactResponsiveEasy } = require('@yaseratiar/react-responsive-easy-next-plugin');

module.exports = withReactResponsiveEasy()({
  // your Next.js config
});
```

## 🐛 Troubleshooting

### Common Issues

#### Plugin Not Working

```bash
# Check if plugin is installed
npm list @yaseratiar/react-responsive-easy-next-plugin

# Verify Next.js configuration
npx next --version

# Check for syntax errors
npx next build
```

#### Configuration Errors

```bash
# Validate configuration
RRE_VALIDATE_CONFIG=true npm run build

# Check configuration file
node -e "console.log(require('./responsive.config.js'))"

# Test with minimal config
RRE_MINIMAL_CONFIG=true npm run build
```

#### Build Failures

```bash
# Check build output
npm run build -- --verbose

# Enable debug mode
DEBUG=rre:next-plugin npm run build

# Show transformation details
RRE_SHOW_TRANSFORMATIONS=true npm run build
```

### Debug Commands

```bash
# Show plugin version
npx next --version

# List all Next.js plugins
npx next info

# Test specific file
npx next build pages/index.tsx

# Show build info
npx next build --mode development
```

### Getting Help

```bash
# Enable debug mode
DEBUG=rre:next-plugin npm run dev

# Show help
npx @yaseratiar/react-responsive-easy-next-plugin --help

# Check documentation
open https://github.com/naaa-G/react-responsive-easy
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/naaa-G/react-responsive-easy/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/naaa-G/react-responsive-easy.git

# Install dependencies
pnpm install

# Link plugin locally
pnpm --filter=@yaseratiar/react-responsive-easy-next-plugin link

# Test plugin
pnpm test
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test
pnpm test --grep "transformation"

# Coverage report
pnpm test:coverage
```

### Building

```bash
# Build plugin
pnpm build

# Build with watch mode
pnpm build:watch

# Build for production
pnpm build:prod
```

## 📄 License

MIT License - see the [LICENSE](https://github.com/naaa-G/react-responsive-easy/blob/main/LICENSE) file for details.

## 🔗 Links

- **Documentation**: [https://github.com/naaa-G/react-responsive-easy](https://github.com/naaa-G/react-responsive-easy)
- **Issues**: [https://github.com/naaa-G/react-responsive-easy/issues](https://github.com/naaa-G/react-responsive-easy/issues)
- **Discussions**: [https://github.com/naaa-G/react-responsive-easy/discussions](https://github.com/naaa-G/react-responsive-easy/discussions)
- **Changelog**: [https://github.com/naaa-G/react-responsive-easy/blob/main/CHANGELOG.md](https://github.com/naaa-G/react-responsive-easy/blob/main/CHANGELOG.md)

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing full-stack framework
- **React Team** - For the component-based architecture
- **TypeScript Team** - For type safety and tooling
- **Open Source Community** - For inspiration and collaboration

---

**Made with ❤️ by [naa-G](https://github.com/naaa-G)**

**[⭐ Star this repository](https://github.com/naaa-G/react-responsive-easy)** if you find it helpful!
