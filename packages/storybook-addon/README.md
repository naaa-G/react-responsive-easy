# @yaseratiar/react-responsive-easy-storybook-addon

> Enterprise-grade Storybook addon for React Responsive Easy component documentation and testing

[![npm version](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-storybook-addon.svg)](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-storybook-addon)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-7+-pink.svg)](https://storybook.js.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Component Testing](#-component-testing)
- [Performance](#-performance)
- [Migration Guide](#-migration-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

`@yaseratiar/react-responsive-easy-storybook-addon` is a powerful Storybook addon that provides comprehensive responsive testing and documentation tools for React Responsive Easy components.

Built for enterprise applications, it offers:
- **Breakpoint Preview** - Test components across all breakpoints
- **Responsive Controls** - Interactive breakpoint switching
- **Performance Metrics** - Monitor responsive performance
- **Design System Integration** - Perfect for component libraries
- **Enterprise Testing** - Comprehensive testing workflows

## 🚀 Features

### Core Functionality
- **Breakpoint Management** - Visual breakpoint switching and testing
- **Responsive Preview** - Real-time responsive behavior testing
- **Component Documentation** - Comprehensive responsive documentation
- **Interactive Controls** - Dynamic responsive value adjustment

### Development Tools
- **Hot Reloading** - Instant responsive updates during development
- **Source Maps** - Accurate source mapping for debugging
- **Error Overlay** - Rich error reporting with helpful suggestions
- **Performance Monitoring** - Real-time performance metrics

### Testing Features
- **Visual Regression** - Automated responsive visual testing
- **Cross-browser Testing** - Multi-browser responsive validation
- **Accessibility Testing** - WCAG compliance checking
- **Performance Testing** - Responsive performance benchmarking

### Enterprise Features
- **Type Safety** - Full TypeScript support with type checking
- **Configuration Validation** - Validate addon configuration
- **Environment Support** - Different features for dev/prod builds
- **Monitoring Integration** - Performance metrics collection

## 📦 Installation

### npm
```bash
npm install --save-dev @yaseratiar/react-responsive-easy-storybook-addon
```

### yarn
```bash
yarn add --dev @yaseratiar/react-responsive-easy-storybook-addon
```

### pnpm
```bash
pnpm add --save-dev @yaseratiar/react-responsive-easy-storybook-addon
```

### Peer Dependencies
```bash
npm install --save-dev @storybook/react @storybook/addon-essentials
```

## 🎯 Quick Start

### 1. Install the Addon

```bash
npm install --save-dev @yaseratiar/react-responsive-easy-storybook-addon
```

### 2. Configure Storybook

```javascript
// .storybook/main.js
module.exports = {
  addons: [
    '@yaseratiar/react-responsive-easy-storybook-addon'
  ]
};
```

### 3. Use in Your Stories

```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/Button',
  decorators: [ResponsiveDecorator],
  parameters: {
    responsive: {
      breakpoints: ['mobile', 'tablet', 'desktop']
    }
  }
};

export const Primary = () => <Button>Click me</Button>;
```

### 4. Start Storybook

```bash
npm run storybook
```

## ⚙️ Configuration

### Basic Configuration

```javascript
// .storybook/main.js
module.exports = {
  addons: [
    '@yaseratiar/react-responsive-easy-storybook-addon'
  ]
};
```

### Advanced Configuration

```javascript
// .storybook/main.js
module.exports = {
  addons: [
    ['@yaseratiar/react-responsive-easy-storybook-addon', {
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
      
      // Display options
      showBreakpointToolbar: true,
      showResponsivePanel: true,
      showPerformanceMetrics: true,
      
      // Performance options
      enableCaching: true,
      cacheSize: 1000,
      enableOptimization: true,
      
      // Development options
      addComments: process.env.NODE_ENV === 'development',
      validateConfig: true,
      performanceMetrics: process.env.NODE_ENV === 'development',
      
      // Hooks
      onBreakpointChange: (breakpoint, context) => {
        console.log(`Breakpoint changed to: ${breakpoint.name}`);
      },
      onError: (error, context) => {
        console.error(`Addon error: ${error.message}`);
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
      }
    }
  }
};
```

### Environment-Specific Configuration

```javascript
// .storybook/main.js
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  addons: [
    ['@yaseratiar/react-responsive-easy-storybook-addon', {
      enabled: true,
      
      // Development optimizations
      ...(isDevelopment && {
        addComments: true,
        validateConfig: true,
        performanceMetrics: true,
        showDebugInfo: true
      }),
      
      // Production optimizations
      ...(isProduction && {
        enableOptimization: true,
        enableCaching: true,
        performanceMetrics: false,
        showDebugInfo: false
      })
    }]
  ]
};
```

## 🔧 API Reference

### Addon Options

#### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the addon |
| `configPath` | `string` | `undefined` | Path to configuration file |
| `configInline` | `object` | `undefined` | Inline configuration object |

#### Display Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showBreakpointToolbar` | `boolean` | `true` | Show breakpoint toolbar |
| `showResponsivePanel` | `boolean` | `true` | Show responsive panel |
| `showPerformanceMetrics` | `boolean` | `true` | Show performance metrics |

#### Performance Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableCaching` | `boolean` | `true` | Enable value caching |
| `cacheSize` | `number` | `1000` | Maximum cache size |
| `enableOptimization` | `boolean` | `true` | Enable optimization |

#### Development Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `addComments` | `boolean` | `false` | Add helpful comments |
| `validateConfig` | `boolean` | `false` | Validate configuration |
| `performanceMetrics` | `boolean` | `false` | Collect performance metrics |

#### Hooks

| Option | Type | Description |
|--------|------|-------------|
| `onBreakpointChange` | `function` | Called when breakpoint changes |
| `onError` | `function` | Called when errors occur |

### Story Parameters

```typescript
interface ResponsiveParameters {
  responsive: {
    breakpoints?: string[];
    defaultBreakpoint?: string;
    showToolbar?: boolean;
    showPanel?: boolean;
    performance?: boolean;
  };
}
```

### Decorators

#### `ResponsiveDecorator`

Wraps stories with responsive context and controls.

```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/Button',
  decorators: [ResponsiveDecorator]
};
```

#### `ResponsiveProvider`

Provides responsive context to stories.

```tsx
import { ResponsiveProvider } from '@yaseratiar/react-responsive-easy-storybook-addon';

export const WithProvider = () => (
  <ResponsiveProvider>
    <Button>Click me</Button>
  </ResponsiveProvider>
);
```

## 🚀 Advanced Usage

### Custom Breakpoint Testing

```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/Button',
  decorators: [ResponsiveDecorator],
  parameters: {
    responsive: {
      breakpoints: ['mobile', 'tablet', 'desktop'],
      defaultBreakpoint: 'tablet'
    }
  }
};

export const Primary = () => <Button>Click me</Button>;

export const Large = () => <Button size="large">Large Button</Button>;

export const Small = () => <Button size="small">Small Button</Button>;
```

### Performance Testing

```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/ComplexComponent',
  decorators: [ResponsiveDecorator],
  parameters: {
    responsive: {
      performance: true,
      breakpoints: ['mobile', 'tablet', 'desktop']
    }
  }
};

export const PerformanceTest = () => (
  <ComplexComponent>
    {Array.from({ length: 1000 }, (_, i) => (
      <div key={i}>Item {i}</div>
    ))}
  </ComplexComponent>
);
```

### Accessibility Testing

```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/AccessibleComponent',
  decorators: [ResponsiveDecorator],
  parameters: {
    responsive: {
      breakpoints: ['mobile', 'tablet', 'desktop'],
      accessibility: true
    }
  }
};

export const Accessible = () => (
  <AccessibleComponent aria-label="Accessible button">
    Click me
  </AccessibleComponent>
);
```

### Visual Regression Testing

```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/VisualComponent',
  decorators: [ResponsiveDecorator],
  parameters: {
    responsive: {
      breakpoints: ['mobile', 'tablet', 'desktop'],
      visualRegression: true
    }
  }
};

export const VisualTest = () => (
  <VisualComponent>
    <h1>Visual Test</h1>
    <p>This component will be tested for visual regression across breakpoints.</p>
  </VisualComponent>
);
```

## 🧪 Component Testing

### Unit Testing

```tsx
import { render, screen } from '@testing-library/react';
import { ResponsiveProvider } from '@yaseratiar/react-responsive-easy-storybook-addon';

const TestWrapper = ({ children }) => (
  <ResponsiveProvider>
    {children}
  </ResponsiveProvider>
);

test('renders button with responsive values', () => {
  render(
    <TestWrapper>
      <Button>Click me</Button>
    </TestWrapper>
  );
  
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Testing

```tsx
import { renderHook } from '@testing-library/react-hooks';
import { ResponsiveProvider, useResponsiveValue } from '@yaseratiar/react-responsive-easy-storybook-addon';

test('useResponsiveValue returns correct values', () => {
  const wrapper = ({ children }) => (
    <ResponsiveProvider>
      {children}
    </ResponsiveProvider>
  );
  
  const { result } = renderHook(() => useResponsiveValue(48, { token: 'fontSize' }), { wrapper });
  
  expect(result.current).toBeDefined();
});
```

### Visual Testing

```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/VisualTest',
  decorators: [ResponsiveDecorator],
  parameters: {
    responsive: {
      breakpoints: ['mobile', 'tablet', 'desktop'],
      visualRegression: true,
      captureDelay: 1000
    }
  }
};

export const VisualRegression = () => (
  <div style={{ padding: '20px' }}>
    <h1>Visual Regression Test</h1>
    <p>This component will be captured for visual testing.</p>
  </div>
);
```

## ⚡ Performance

### Performance Benefits

- **Build-time Processing** - Zero runtime responsive calculations
- **Bundle Optimization** - Optimize bundle size and loading
- **Tree Shaking** - Remove unused responsive code automatically
- **Code Splitting** - Intelligent code splitting for responsive features

### Performance Monitoring

```javascript
// .storybook/main.js
module.exports = {
  addons: [
    ['@yaseratiar/react-responsive-easy-storybook-addon', {
      performanceMetrics: true,
      
      onBreakpointChange: (breakpoint, context) => {
        // Collect performance metrics
        const startTime = performance.now();
        
        // ... breakpoint change logic ...
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log performance data
        console.log(`Breakpoint change took ${duration.toFixed(2)}ms`);
        
        // Send to monitoring service
        if (process.env.MONITORING_URL) {
          fetch(process.env.MONITORING_URL, {
            method: 'POST',
            body: JSON.stringify({
              metric: 'breakpoint_change_duration',
              value: duration,
              breakpoint: breakpoint.name,
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
// .storybook/main.js
module.exports = {
  addons: [
    ['@yaseratiar/react-responsive-easy-storybook-addon', {
      performanceMetrics: true,
      
      // Performance budgets
      performance: {
        maxBreakpointChangeTime: 50, // ms
        maxRenderTime: 100, // ms
        maxMemoryUsage: '50MB'
      },
      
      onBreakpointChange: (breakpoint, context) => {
        // Check performance budgets
        if (context.changeTime > 50) {
          console.warn(`Breakpoint change took ${context.changeTime}ms (budget: 50ms)`);
        }
      }
    }]
  ]
};
```

## 🔄 Migration Guide

### From Basic Storybook

**Before:**
```tsx
export default {
  title: 'Components/Button'
};

export const Primary = () => <Button>Click me</Button>;
```

**After:**
```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/Button',
  decorators: [ResponsiveDecorator],
  parameters: {
    responsive: {
      breakpoints: ['mobile', 'tablet', 'desktop']
    }
  }
};

export const Primary = () => <Button>Click me</Button>;
```

### From Other Responsive Addons

**Before:**
```tsx
import { withResponsive } from 'other-responsive-addon';

export default {
  title: 'Components/Button',
  decorators: [withResponsive]
};
```

**After:**
```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/Button',
  decorators: [ResponsiveDecorator]
};
```

### From Custom Responsive Setup

**Before:**
```tsx
const ResponsiveWrapper = ({ children }) => (
  <div style={{ width: '100%', maxWidth: '1200px' }}>
    {children}
  </div>
);

export default {
  title: 'Components/Button',
  decorators: [(story) => <ResponsiveWrapper>{story()}</ResponsiveWrapper>]
};
```

**After:**
```tsx
import { ResponsiveDecorator } from '@yaseratiar/react-responsive-easy-storybook-addon';

export default {
  title: 'Components/Button',
  decorators: [ResponsiveDecorator]
};
```

## 🐛 Troubleshooting

### Common Issues

#### Addon Not Working

```bash
# Check if addon is installed
npm list @yaseratiar/react-responsive-easy-storybook-addon

# Verify Storybook configuration
npx storybook --version

# Check for syntax errors
npx storybook build
```

#### Configuration Errors

```bash
# Validate configuration
RRE_VALIDATE_CONFIG=true npm run storybook

# Check configuration file
node -e "console.log(require('./responsive.config.js'))"

# Test with minimal config
RRE_MINIMAL_CONFIG=true npm run storybook
```

#### Build Failures

```bash
# Check build output
npm run storybook:build -- --verbose

# Enable debug mode
DEBUG=rre:storybook-addon npm run storybook

# Show transformation details
RRE_SHOW_TRANSFORMATIONS=true npm run storybook
```

### Debug Commands

```bash
# Show addon version
npx storybook --version

# List all Storybook addons
npx storybook --help

# Test specific story
npx storybook --port 6006 --quiet

# Show build info
npx storybook build --mode development
```

### Getting Help

```bash
# Enable debug mode
DEBUG=rre:storybook-addon npm run storybook

# Show help
npx @yaseratiar/react-responsive-easy-storybook-addon --help

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

# Link addon locally
pnpm --filter=@yaseratiar/react-responsive-easy-storybook-addon link

# Test addon
pnpm test
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test
pnpm test --grep "addon"

# Coverage report
pnpm test:coverage
```

### Building

```bash
# Build addon
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

- **Storybook Team** - For the amazing component development platform
- **React Team** - For the component-based architecture
- **TypeScript Team** - For type safety and tooling
- **Open Source Community** - For inspiration and collaboration

---

**Made with ❤️ by [naa-G](https://github.com/naaa-G)**

**[⭐ Star this repository](https://github.com/naaa-G/react-responsive-easy)** if you find it helpful!
