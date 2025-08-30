# @yaseratiar/react-responsive-easy-postcss-plugin

> Enterprise-grade PostCSS plugin for React Responsive Easy CSS processing and optimization

[![npm version](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-postcss-plugin.svg)](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-postcss-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![PostCSS](https://img.shields.io/badge/PostCSS-8+-green.svg)](https://postcss.org/)
[![CSS](https://img.shields.io/badge/CSS-3+-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Performance](#-performance)
- [CSS Functions](#-css-functions)
- [Migration Guide](#-migration-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

`@yaseratiar/react-responsive-easy-postcss-plugin` is a powerful PostCSS plugin that transforms CSS using React Responsive Easy functions, providing build-time CSS optimization and responsive design token generation.

Built for enterprise applications, it offers:
- **CSS Transformations** - Convert `rre()` functions to responsive CSS
- **Design Token Generation** - Automatic CSS custom properties creation
- **Media Query Optimization** - Smart breakpoint-based CSS generation
- **Build-time Processing** - Zero runtime overhead with maximum performance
- **Enterprise Integration** - Seamless integration with design systems

## 🚀 Features

### Core CSS Processing
- **Function Transformation** - Convert `rre()` functions to responsive values
- **Custom Properties** - Generate CSS variables for responsive design tokens
- **Media Queries** - Automatic breakpoint-based CSS generation
- **Value Calculation** - Mathematical scaling based on viewport ratios

### Design System Integration
- **Token Management** - Centralized design token system
- **Theme Support** - Multi-theme and dark mode support
- **Component Library** - Perfect integration with component libraries
- **Design Handoff** - Bridge between design and development

### Performance Features
- **Build-time Processing** - Zero runtime CSS calculations
- **Bundle Optimization** - Optimize CSS bundle size
- **Tree Shaking** - Remove unused CSS automatically
- **Critical CSS** - Extract critical CSS for performance

### Development Features
- **Hot Reloading** - Instant CSS updates during development
- **Source Maps** - Accurate source mapping for debugging
- **Validation** - CSS validation and error reporting
- **Performance Metrics** - CSS performance analysis

## 📦 Installation

### npm
```bash
npm install --save-dev @yaseratiar/react-responsive-easy-postcss-plugin
```

### yarn
```bash
yarn add --dev @yaseratiar/react-responsive-easy-postcss-plugin
```

### pnpm
```bash
pnpm add --save-dev @yaseratiar/react-responsive-easy-postcss-plugin
```

### Peer Dependencies
```bash
npm install --save-dev postcss postcss-cli
```

## 🎯 Quick Start

### 1. Install the Plugin

```bash
npm install --save-dev @yaseratiar/react-responsive-easy-postcss-plugin
```

### 2. Configure PostCSS

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    '@yaseratiar/react-responsive-easy-postcss-plugin'
  ]
};
```

### 3. Use in Your CSS

```css
/* Input CSS */
.button {
  font-size: rre(18);
  padding: rre(16);
  border-radius: rre(8);
  box-shadow: 0 rre(2) rre(4) rgba(0, 0, 0, 0.1);
}

.card {
  margin: rre(24);
  border-radius: rre(12);
  box-shadow: 0 rre(4) rre(8) rgba(0, 0, 0, 0.15);
}
```

### 4. Generated CSS Output

```css
/* Output CSS */
:root {
  --rre-font-size: 18px;
  --rre-padding: 16px;
  --rre-border-radius: 8px;
  --rre-shadow-blur: 2px;
  --rre-shadow-spread: 4px;
  --rre-margin: 24px;
  --rre-card-radius: 12px;
  --rre-card-shadow-blur: 4px;
  --rre-card-shadow-spread: 8px;
}

@media (max-width: 768px) {
  :root {
    --rre-font-size: 15px;
    --rre-padding: 14px;
    --rre-border-radius: 6px;
    --rre-shadow-blur: 1px;
    --rre-shadow-spread: 3px;
    --rre-margin: 20px;
    --rre-card-radius: 10px;
    --rre-card-shadow-blur: 3px;
    --rre-card-shadow-spread: 6px;
  }
}

@media (max-width: 390px) {
  :root {
    --rre-font-size: 13px;
    --rre-padding: 12px;
    --rre-border-radius: 5px;
    --rre-shadow-blur: 1px;
    --rre-shadow-spread: 2px;
    --rre-margin: 16px;
    --rre-card-radius: 8px;
    --rre-card-shadow-blur: 2px;
    --rre-card-shadow-spread: 4px;
  }
}

.button {
  font-size: var(--rre-font-size);
  padding: var(--rre-padding);
  border-radius: var(--rre-border-radius);
  box-shadow: 0 var(--rre-shadow-blur) var(--rre-shadow-spread) rgba(0, 0, 0, 0.1);
}

.card {
  margin: var(--rre-margin);
  border-radius: var(--rre-card-radius);
  box-shadow: 0 var(--rre-card-shadow-blur) var(--rre-card-shadow-spread) rgba(0, 0, 0, 0.15);
}
```

## ⚙️ Configuration

### Basic Configuration

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    '@yaseratiar/react-responsive-easy-postcss-plugin'
  ]
};
```

### Advanced Configuration

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    ['@yaseratiar/react-responsive-easy-postcss-plugin', {
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
      
      // Output options
      generateCustomProperties: true,
      generateMediaQueries: true,
      generateFallbacks: true,
      
      // CSS options
      customPropertyPrefix: '--rre-',
      mediaQueryStrategy: 'mobile-first',
      fallbackStrategy: 'desktop',
      
      // Performance options
      enableCaching: true,
      cacheSize: 1000,
      enableOptimization: true,
      
      // Development options
      addComments: process.env.NODE_ENV === 'development',
      validateCSS: true,
      performanceMetrics: process.env.NODE_ENV === 'development',
      
      // Hooks
      onTransform: (declaration, context) => {
        console.log(`Transformed: ${declaration.prop}`);
      },
      onError: (error, context) => {
        console.error(`Transform error: ${error.message}`);
      }
    }]
  ]
};
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
      },
      shadows: {
        scale: 0.8,
        min: 0,
        max: 24,
        step: 1,
        round: true
      }
    }
  }
};
```

### Environment-Specific Configuration

```javascript
// postcss.config.js
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    ['@yaseratiar/react-responsive-easy-postcss-plugin', {
      enabled: true,
      
      // Development optimizations
      ...(isDevelopment && {
        addComments: true,
        validateCSS: true,
        performanceMetrics: true,
        generateSourceMaps: true
      }),
      
      // Production optimizations
      ...(isProduction && {
        enableOptimization: true,
        enableCaching: true,
        minifyOutput: true,
        performanceMetrics: false
      })
    }]
  ]
};
```

## 🔧 API Reference

### Plugin Options

#### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the plugin |
| `configPath` | `string` | `undefined` | Path to configuration file |
| `configInline` | `object` | `undefined` | Inline configuration object |

#### Output Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `generateCustomProperties` | `boolean` | `true` | Generate CSS custom properties |
| `generateMediaQueries` | `boolean` | `true` | Generate media queries |
| `generateFallbacks` | `boolean` | `true` | Generate fallback values |

#### CSS Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `customPropertyPrefix` | `string` | `'--rre-'` | Prefix for CSS custom properties |
| `mediaQueryStrategy` | `string` | `'mobile-first'` | Media query strategy |
| `fallbackStrategy` | `string` | `'desktop'` | Fallback strategy |

#### Performance Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableCaching` | `boolean` | `true` | Enable value caching |
| `cacheSize` | `number` | `1000` | Maximum cache size |
| `enableOptimization` | `boolean` | `true` | Enable CSS optimization |

#### Development Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `addComments` | `boolean` | `false` | Add helpful comments |
| `validateCSS` | `boolean` | `false` | Validate generated CSS |
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
  
  // Output options
  generateCustomProperties?: boolean;
  generateMediaQueries?: boolean;
  generateFallbacks?: boolean;
  
  // CSS options
  customPropertyPrefix?: string;
  mediaQueryStrategy?: 'mobile-first' | 'desktop-first';
  fallbackStrategy?: string;
  
  // Performance options
  enableCaching?: boolean;
  cacheSize?: number;
  enableOptimization?: boolean;
  
  // Development options
  addComments?: boolean;
  validateCSS?: boolean;
  performanceMetrics?: boolean;
  
  // Hooks
  onTransform?: (declaration: Declaration, context: TransformContext) => void;
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

### Custom CSS Functions

```css
/* Custom responsive functions */
.container {
  /* Basic responsive values */
  width: rre(1200);
  height: rre(800);
  
  /* With specific tokens */
  font-size: rre(24, 'fontSize');
  padding: rre(32, 'spacing');
  border-radius: rre(16, 'radius');
  
  /* With constraints */
  margin: rre(48, { min: 16, max: 96 });
  
  /* With steps */
  gap: rre(24, { step: 8 });
  
  /* With rounding */
  border-width: rre(2, { round: true });
}
```

### Complex Responsive Patterns

```css
/* Responsive grid system */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(rre(300), 1fr));
  gap: rre(24);
  padding: rre(32);
}

/* Responsive typography scale */
.heading-1 { font-size: rre(48, 'fontSize'); }
.heading-2 { font-size: rre(36, 'fontSize'); }
.heading-3 { font-size: rre(24, 'fontSize'); }
.body { font-size: rre(16, 'fontSize'); }
.caption { font-size: rre(14, 'fontSize'); }

/* Responsive spacing system */
.section { margin-bottom: rre(64, 'spacing'); }
.container { padding: rre(32, 'spacing'); }
.card { margin: rre(16, 'spacing'); }
```

### Theme Integration

```css
/* Theme-aware responsive values */
.button {
  background-color: var(--theme-primary);
  color: var(--theme-on-primary);
  font-size: rre(16, 'fontSize');
  padding: rre(12, 'spacing') rre(24, 'spacing');
  border-radius: rre(8, 'radius');
  
  /* Dark theme adjustments */
  @media (prefers-color-scheme: dark) {
    background-color: var(--theme-primary-dark);
    color: var(--theme-on-primary-dark);
  }
}

/* Component variants */
.button--large {
  font-size: rre(20, 'fontSize');
  padding: rre(16, 'spacing') rre(32, 'spacing');
  border-radius: rre(12, 'radius');
}

.button--small {
  font-size: rre(14, 'fontSize');
  padding: rre(8, 'spacing') rre(16, 'spacing');
  border-radius: rre(6, 'radius');
}
```

### Advanced Media Query Strategies

```css
/* Mobile-first approach */
.component {
  /* Base styles (mobile) */
  font-size: rre(14, 'fontSize');
  padding: rre(16, 'spacing');
  
  /* Tablet and up */
  @media (min-width: 768px) {
    font-size: rre(16, 'fontSize');
    padding: rre(24, 'spacing');
  }
  
  /* Desktop and up */
  @media (min-width: 1200px) {
    font-size: rre(18, 'fontSize');
    padding: rre(32, 'spacing');
  }
}

/* Desktop-first approach */
.component {
  /* Base styles (desktop) */
  font-size: rre(18, 'fontSize');
  padding: rre(32, 'spacing');
  
  /* Tablet and down */
  @media (max-width: 1199px) {
    font-size: rre(16, 'fontSize');
    padding: rre(24, 'spacing');
  }
  
  /* Mobile and down */
  @media (max-width: 767px) {
    font-size: rre(14, 'fontSize');
    padding: rre(16, 'spacing');
  }
}
```

## ⚡ Performance

### Performance Benefits

- **Build-time Processing** - Zero runtime CSS calculations
- **Bundle Optimization** - Optimize CSS bundle size
- **Tree Shaking** - Remove unused CSS automatically
- **Critical CSS** - Extract critical CSS for performance

### Performance Monitoring

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    ['@yaseratiar/react-responsive-easy-postcss-plugin', {
      performanceMetrics: true,
      
      onTransform: (declaration, context) => {
        // Collect performance metrics
        const startTime = performance.now();
        
        // ... transformation logic ...
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log performance data
        console.log(`CSS transform took ${duration.toFixed(2)}ms`);
        
        // Send to monitoring service
        if (process.env.MONITORING_URL) {
          fetch(process.env.MONITORING_URL, {
            method: 'POST',
            body: JSON.stringify({
              metric: 'css_transform_duration',
              value: duration,
              property: declaration.prop,
              timestamp: Date.now()
            })
          });
        }
      }
    }]
  ]
};
```

### Performance Budgets

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    ['@yaseratiar/react-responsive-easy-postcss-plugin', {
      performanceMetrics: true,
      
      // Performance budgets
      performance: {
        maxTransformTime: 50, // ms
        maxCSSSizeIncrease: '100KB',
        maxCustomProperties: 1000
      },
      
      onTransform: (declaration, context) => {
        // Check performance budgets
        if (context.transformTime > 50) {
          console.warn(`CSS transform took ${context.transformTime}ms (budget: 50ms)`);
        }
      }
    }]
  ]
};
```

## 🎨 CSS Functions

### Basic Functions

#### `rre(value, options?)`

The main responsive function for CSS values.

```css
.element {
  /* Basic usage */
  font-size: rre(18);
  
  /* With token */
  padding: rre(16, 'spacing');
  
  /* With constraints */
  margin: rre(24, { min: 8, max: 48 });
  
  /* With step */
  gap: rre(20, { step: 4 });
  
  /* With rounding */
  border-radius: rre(10, { round: true });
}
```

### Advanced Functions

#### `rre-scale(value, scale, options?)`

Custom scaling function with specific scale factor.

```css
.element {
  /* Custom scale */
  font-size: rre-scale(16, 1.2);
  
  /* With constraints */
  width: rre-scale(200, 0.8, { min: 100, max: 400 });
}
```

#### `rre-token(tokenName, defaultValue, options?)`

Access design tokens directly.

```css
.element {
  /* Use design token */
  font-size: rre-token('fontSize', 16);
  padding: rre-token('spacing', 24);
  border-radius: rre-token('radius', 8);
}
```

### Utility Functions

#### `rre-breakpoint(breakpointName)`

Get breakpoint-specific values.

```css
.element {
  /* Mobile-specific */
  @media (max-width: 767px) {
    font-size: rre-breakpoint('mobile', 14);
  }
  
  /* Desktop-specific */
  @media (min-width: 1200px) {
    font-size: rre-breakpoint('desktop', 18);
  }
}
```

## 🔄 Migration Guide

### From CSS Custom Properties

**Before:**
```css
:root {
  --font-size-small: 14px;
  --font-size-medium: 16px;
  --font-size-large: 18px;
}

@media (max-width: 768px) {
  :root {
    --font-size-small: 12px;
    --font-size-medium: 14px;
    --font-size-large: 16px;
  }
}

.button {
  font-size: var(--font-size-medium);
}
```

**After:**
```css
.button {
  font-size: rre(16, 'fontSize');
}
```

### From CSS-in-JS

**Before:**
```tsx
import styled from 'styled-components';

const Button = styled.button`
  font-size: ${props => props.theme.responsive.fontSize(16)};
  padding: ${props => props.theme.responsive.spacing(24)};
`;
```

**After:**
```css
.button {
  font-size: rre(16, 'fontSize');
  padding: rre(24, 'spacing');
}
```

### From Utility Classes

**Before:**
```css
.text-sm { font-size: 14px; }
.text-base { font-size: 16px; }
.text-lg { font-size: 18px; }

@media (max-width: 768px) {
  .text-sm { font-size: 12px; }
  .text-base { font-size: 14px; }
  .text-lg { font-size: 16px; }
}
```

**After:**
```css
.text-sm { font-size: rre(14, 'fontSize'); }
.text-base { font-size: rre(16, 'fontSize'); }
.text-lg { font-size: rre(18, 'fontSize'); }
```

## 🐛 Troubleshooting

### Common Issues

#### Plugin Not Working

```bash
# Check if plugin is installed
npm list @yaseratiar/react-responsive-easy-postcss-plugin

# Verify PostCSS configuration
npx postcss --print-config src/styles.css

# Check for syntax errors
npx postcss src/styles.css
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

#### CSS Generation Issues

```bash
# Check CSS output
npx postcss src/styles.css --output dist/styles.css

# Enable verbose output
RRE_DEBUG=true npm run build

# Show transformation details
RRE_SHOW_TRANSFORMATIONS=true npm run build
```

### Debug Commands

```bash
# Show plugin version
npx postcss --version

# List all PostCSS plugins
npx postcss --print-config src/styles.css | grep plugin

# Test specific file
npx postcss src/components/Button.css --plugins @yaseratiar/react-responsive-easy-postcss-plugin

# Show AST
npx postcss --ast src/components/Button.css
```

### Getting Help

```bash
# Enable debug mode
DEBUG=rre:postcss-plugin npm run build

# Show help
npx @yaseratiar/react-responsive-easy-postcss-plugin --help

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
pnpm --filter=@yaseratiar/react-responsive-easy-postcss-plugin link

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

- **PostCSS Team** - For the amazing CSS processing platform
- **CSS Working Group** - For CSS standards and specifications
- **Design System Community** - For design token best practices
- **Open Source Community** - For inspiration and collaboration

---

**Made with ❤️ by [naa-G](https://github.com/naaa-G)**

**[⭐ Star this repository](https://github.com/naaa-G/react-responsive-easy)** if you find it helpful!
