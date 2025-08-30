# @yaseratiar/react-responsive-easy-vite-plugin

> Enterprise-grade Vite plugin for React Responsive Easy integration and optimization

[![npm version](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-vite-plugin.svg)](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-vite-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4+-purple.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Performance](#-performance)
- [Development Workflow](#-development-workflow)
- [Build Optimization](#-build-optimization)
- [Migration Guide](#-migration-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

`@yaseratiar/react-responsive-easy-vite-plugin` is a high-performance Vite plugin that seamlessly integrates React Responsive Easy into your Vite-based development workflow, providing build-time optimizations and enhanced development experience.

Built for enterprise applications, it offers:
- **Zero Configuration** - Works out of the box with intelligent defaults
- **Hot Module Replacement** - Instant updates with responsive debugging tools
- **Build Optimization** - Pre-compute responsive values for maximum performance
- **TypeScript Support** - Full type safety with intelligent IntelliSense
- **Enterprise Integration** - Seamless integration with CI/CD pipelines

## 🚀 Features

### Core Integration
- **Vite Native** - Built specifically for Vite's architecture
- **Plugin System** - Leverages Vite's powerful plugin ecosystem
- **HMR Support** - Hot module replacement with responsive state preservation
- **Build Hooks** - Integration with Vite's build pipeline

### Development Experience
- **Zero Configuration** - Automatic setup with sensible defaults
- **Dev Server Integration** - Enhanced development server with responsive tools
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
npm install --save-dev @yaseratiar/react-responsive-easy-vite-plugin
```

### yarn
```bash
yarn add --dev @yaseratiar/react-responsive-easy-vite-plugin
```

### pnpm
```bash
pnpm add --save-dev @yaseratiar/react-responsive-easy-vite-plugin
```

### Peer Dependencies
```bash
npm install --save-dev vite @vitejs/plugin-react
```

## 🎯 Quick Start

### 1. Install the Plugin

```bash
npm install --save-dev @yaseratiar/react-responsive-easy-vite-plugin
```

### 2. Configure Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
      precompute: true,
      generateCustomProperties: true
    })
  ]
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

### Advanced Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
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
    })
  ]
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
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
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
        precompute: true,
        enableOptimization: true,
        enableCaching: true,
        performanceMetrics: false
      })
    })
  ]
});
```

### TypeScript Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
      precompute: true,
      generateCustomProperties: true
    })
  ],
  
  // TypeScript configuration
  esbuild: {
    jsx: 'automatic'
  },
  
  // Build configuration
  build: {
    target: 'es2015',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          responsive: ['@yaseratiar/react-responsive-easy-core']
        }
      }
    }
  }
});
```

## 🔧 API Reference

### Plugin Options

#### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the plugin |
| `configPath` | `string` | `undefined` | Path to configuration file |
| `configInline` | `object` | `undefined` | Inline configuration object |

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
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
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
    })
  ]
});
```

### Multiple Configurations

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    
    // Development configuration
    ...(process.env.NODE_ENV === 'development' ? [
      reactResponsiveEasy({
        precompute: false,
        development: true,
        addComments: true,
        validateConfig: true
      })
    ] : []),
    
    // Production configuration
    ...(process.env.NODE_ENV === 'production' ? [
      reactResponsiveEasy({
        precompute: true,
        development: false,
        enableOptimization: true,
        enableCaching: true
      })
    ] : [])
  ]
});
```

### Integration with Other Plugins

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';
import legacy from '@vitejs/plugin-legacy';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    // React Responsive Easy plugin (should come early)
    reactResponsiveEasy({
      precompute: true,
      development: process.env.NODE_ENV === 'development'
    }),
    
    // React plugin
    react(),
    
    // Legacy browser support
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    
    // Compression (in production)
    ...(process.env.NODE_ENV === 'production' ? [
      compression({
        algorithm: 'gzip',
        ext: '.gz'
      })
    ] : [])
  ]
});
```

### Environment Variables Integration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
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
    })
  ],
  
  // Environment variables
  define: {
    __RRE_VERSION__: JSON.stringify(process.env.npm_package_version),
    __RRE_ENV__: JSON.stringify(process.env.NODE_ENV)
  }
});
```

## ⚡ Performance

### Performance Benefits

- **Build-time Processing** - Zero runtime responsive calculations
- **Bundle Optimization** - Optimize bundle size and loading
- **Tree Shaking** - Remove unused responsive code automatically
- **Code Splitting** - Intelligent code splitting for responsive features

### Performance Monitoring

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
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
    })
  ]
});
```

### Performance Budgets

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
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
    })
  ]
});
```

## 🛠️ Development Workflow

### Development Server

```bash
# Start development server
npm run dev

# Start with specific options
npm run dev -- --port 3001 --host 0.0.0.0

# Start with HTTPS
npm run dev -- --https
```

### Hot Module Replacement

The plugin provides enhanced HMR for responsive components:

```tsx
import { useResponsiveValue } from '@yaseratiar/react-responsive-easy-core';

const Button = () => {
  const fontSize = useResponsiveValue(16, { token: 'fontSize' });
  const padding = useResponsiveValue(12, { token: 'spacing' });
  
  return (
    <button style={{ fontSize, padding }}>
      Click me
    </button>
  );
};

// Changes to responsive values will trigger HMR
// without losing component state
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=rre:vite-plugin npm run dev

# Enable verbose output
RRE_DEBUG=true npm run dev

# Show transformation details
RRE_SHOW_TRANSFORMATIONS=true npm run dev
```

## 🏗️ Build Optimization

### Production Build

```bash
# Build for production
npm run build

# Build with analysis
npm run build -- --analyze

# Build with profiling
npm run build -- --profile
```

### Bundle Analysis

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
      precompute: true,
      enableOptimization: true
    }),
    
    // Bundle analyzer
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
```

### Code Splitting

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactResponsiveEasy } from '@yaseratiar/react-responsive-easy-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
      precompute: true
    })
  ],
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core responsive functionality
          'responsive-core': ['@yaseratiar/react-responsive-easy-core'],
          
          // Responsive hooks
          'responsive-hooks': [
            '@yaseratiar/react-responsive-easy-core/useResponsiveValue',
            '@yaseratiar/react-responsive-easy-core/useBreakpoint'
          ],
          
          // Responsive utilities
          'responsive-utils': [
            '@yaseratiar/react-responsive-easy-core/utils'
          ]
        }
      }
    }
  }
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
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}

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

### From Parcel

**Before:**
```json
// .parcelrc
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{js,mjs,jsx,cjs,ts,tsx}": ["@parcel/transformer-js"]
  }
}
```

**After:**
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

## 🐛 Troubleshooting

### Common Issues

#### Plugin Not Working

```bash
# Check if plugin is installed
npm list @yaseratiar/react-responsive-easy-vite-plugin

# Verify Vite configuration
npx vite --version

# Check for syntax errors
npx vite build
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
DEBUG=rre:vite-plugin npm run build

# Show transformation details
RRE_SHOW_TRANSFORMATIONS=true npm run build
```

### Debug Commands

```bash
# Show plugin version
npx vite --version

# List all Vite plugins
npx vite --help

# Test specific file
npx vite build src/components/Button.tsx

# Show build info
npx vite build --mode development
```

### Getting Help

```bash
# Enable debug mode
DEBUG=rre:vite-plugin npm run dev

# Show help
npx @yaseratiar/react-responsive-easy-vite-plugin --help

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
pnpm --filter=@yaseratiar/react-responsive-easy-vite-plugin link

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

- **Vite Team** - For the amazing build tool
- **React Team** - For the component-based architecture
- **TypeScript Team** - For type safety and tooling
- **Open Source Community** - For inspiration and collaboration

---

**Made with ❤️ by [naa-G](https://github.com/naaa-G)**

**[⭐ Star this repository](https://github.com/naaa-G/react-responsive-easy)** if you find it helpful!
