# @yaseratiar/react-responsive-easy-performance-dashboard

> Enterprise-grade real-time performance monitoring dashboard for React Responsive Easy applications

[![npm version](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-performance-dashboard.svg)](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-performance-dashboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Performance](https://img.shields.io/badge/Performance-Monitoring-green.svg)](https://web.dev/performance/)
[![Real-time](https://img.shields.io/badge/Real--time-Live-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Metrics & Analytics](#-metrics--analytics)
- [Performance](#-performance)
- [Migration Guide](#-migration-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

`@yaseratiar/react-responsive-easy-performance-dashboard` is a comprehensive performance monitoring solution that provides real-time insights into React Responsive Easy application performance, responsive behavior, and user experience metrics.

Built for enterprise applications, it offers:
- **Real-time Monitoring** - Live performance metrics and alerts
- **Responsive Analytics** - Breakpoint-specific performance data
- **Performance Alerts** - Automated performance warnings and notifications
- **Historical Data** - Performance trend analysis and reporting
- **Enterprise Integration** - Seamless integration with monitoring systems

## 🚀 Features

### Core Monitoring
- **Real-time Metrics** - Live performance monitoring with sub-second updates
- **Responsive Analytics** - Breakpoint-specific performance data collection
- **Performance Alerts** - Automated performance warnings and notifications
- **Historical Data** - Performance trend analysis and reporting

### Performance Metrics
- **Bundle Performance** - Bundle size, loading times, and optimization metrics
- **Runtime Performance** - Component render times, memory usage, and CPU utilization
- **Responsive Performance** - Breakpoint switching performance and responsive calculations
- **User Experience** - Core Web Vitals, interaction times, and accessibility metrics

### Dashboard Features
- **Interactive Charts** - Real-time charts and graphs for performance visualization
- **Custom Dashboards** - Configurable dashboard layouts and widgets
- **Export Capabilities** - PDF, CSV, and JSON export for reporting
- **Multi-user Support** - Role-based access control and team collaboration

### Enterprise Features
- **Type Safety** - Full TypeScript support with type checking
- **Configuration Validation** - Validate dashboard configuration
- **Environment Support** - Different monitoring levels for dev/prod builds
- **Integration APIs** - RESTful APIs for external system integration

## 📦 Installation

### npm
```bash
npm install @yaseratiar/react-responsive-easy-performance-dashboard
```

### yarn
```bash
yarn add @yaseratiar/react-responsive-easy-performance-dashboard
```

### pnpm
```bash
pnpm add @yaseratiar/react-responsive-easy-performance-dashboard
```

### Peer Dependencies
```bash
npm install react react-dom
```

## 🎯 Quick Start

### 1. Install the Package

```bash
npm install @yaseratiar/react-responsive-easy-performance-dashboard
```

### 2. Wrap Your Application

```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function App() {
  return (
    <PerformanceDashboard>
      <YourApp />
    </PerformanceDashboard>
  );
}
```

### 3. Access the Dashboard

```tsx
import { usePerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function DashboardAccess() {
  const { openDashboard, metrics } = usePerformanceDashboard();
  
  return (
    <div>
      <button onClick={openDashboard}>Open Performance Dashboard</button>
      <p>Current Performance Score: {metrics.performanceScore}</p>
    </div>
  );
}
```

### 4. View Real-time Metrics

The dashboard automatically opens in a new window/tab with real-time performance monitoring.

## ⚙️ Configuration

### Basic Configuration

```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function App() {
  return (
    <PerformanceDashboard>
      <YourApp />
    </PerformanceDashboard>
  );
}
```

### Advanced Configuration

```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function App() {
  return (
    <PerformanceDashboard
      // Core options
      enabled={true}
      configPath="./performance.config.js"
      
      // Configuration options
      configInline={{
        metrics: {
          performance: true,
          responsive: true,
          accessibility: true,
          seo: true
        },
        alerts: {
          performanceThreshold: 0.8,
          responsiveThreshold: 0.9,
          enableNotifications: true
        }
      }}
      
      // Display options
      showDashboardButton={true}
      dashboardPosition="top-right"
      autoOpen={false}
      
      // Performance options
      updateInterval={1000}
      enableCaching={true}
      cacheSize={1000}
      
      // Development options
      enableDebugMode={process.env.NODE_ENV === 'development'}
      enablePerformanceMetrics={true}
      enableLogging={true}
      
      // Hooks
      onMetricsUpdate={(metrics) => {
        console.log('Metrics updated:', metrics);
      },
      onAlert={(alert) => {
        console.warn('Performance alert:', alert);
      },
      onError={(error) => {
        console.error('Dashboard error:', error);
      }}
    >
      <YourApp />
    </PerformanceDashboard>
  );
}
```

### Configuration File

Create a `performance.config.js` file:

```javascript
// performance.config.js
module.exports = {
  // Metrics configuration
  metrics: {
    performance: {
      enabled: true,
      coreWebVitals: true,
      bundleAnalysis: true,
      memoryUsage: true
    },
    responsive: {
      enabled: true,
      breakpointPerformance: true,
      responsiveCalculations: true,
      layoutShifts: true
    },
    accessibility: {
      enabled: true,
      wcagCompliance: true,
      screenReaderSupport: true,
      keyboardNavigation: true
    },
    seo: {
      enabled: true,
      metaTags: true,
      structuredData: true,
      performanceScore: true
    }
  },
  
  // Alerts configuration
  alerts: {
    performanceThreshold: 0.8,
    responsiveThreshold: 0.9,
    accessibilityThreshold: 0.95,
    seoThreshold: 0.85,
    enableNotifications: true,
    notificationChannels: ['console', 'email', 'slack']
  },
  
  // Dashboard configuration
  dashboard: {
    theme: 'dark',
    layout: 'grid',
    widgets: ['performance', 'responsive', 'accessibility', 'seo'],
    refreshInterval: 1000,
    maxDataPoints: 1000
  }
};
```

### Environment-Specific Configuration

```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

function App() {
  return (
    <PerformanceDashboard
      enabled={true}
      
      // Development optimizations
      ...(isDevelopment && {
        enableDebugMode: true,
        enablePerformanceMetrics: true,
        enableLogging: true,
        updateInterval: 500
      }),
      
      // Production optimizations
      ...(isProduction && {
        enableCaching: true,
        enablePerformanceMetrics: false,
        updateInterval: 5000
      })
    >
      <YourApp />
    </PerformanceDashboard>
  );
}
```

## 🔧 API Reference

### Core Components

#### `PerformanceDashboard`

Main wrapper component for performance monitoring.

```tsx
interface PerformanceDashboardProps {
  // Core options
  enabled?: boolean;
  configPath?: string;
  configInline?: PerformanceConfig;
  
  // Display options
  showDashboardButton?: boolean;
  dashboardPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  autoOpen?: boolean;
  
  // Performance options
  updateInterval?: number;
  enableCaching?: boolean;
  cacheSize?: number;
  
  // Development options
  enableDebugMode?: boolean;
  enablePerformanceMetrics?: boolean;
  enableLogging?: boolean;
  
  // Hooks
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  onAlert?: (alert: PerformanceAlert) => void;
  onError?: (error: Error) => void;
  
  children: React.ReactNode;
}
```

#### `usePerformanceDashboard`

Hook for accessing dashboard functionality.

```tsx
function usePerformanceDashboard(): {
  openDashboard: () => void;
  closeDashboard: () => void;
  metrics: PerformanceMetrics;
  alerts: PerformanceAlert[];
  isOpen: boolean;
  refresh: () => void;
  export: (format: 'pdf' | 'csv' | 'json') => void;
};
```

### Configuration Schema

```typescript
interface PerformanceConfig {
  metrics: MetricsConfig;
  alerts: AlertsConfig;
  dashboard: DashboardConfig;
}

interface MetricsConfig {
  performance: {
    enabled: boolean;
    coreWebVitals: boolean;
    bundleAnalysis: boolean;
    memoryUsage: boolean;
  };
  responsive: {
    enabled: boolean;
    breakpointPerformance: boolean;
    responsiveCalculations: boolean;
    layoutShifts: boolean;
  };
  accessibility: {
    enabled: boolean;
    wcagCompliance: boolean;
    screenReaderSupport: boolean;
    keyboardNavigation: boolean;
  };
  seo: {
    enabled: boolean;
    metaTags: boolean;
    structuredData: boolean;
    performanceScore: boolean;
  };
}

interface AlertsConfig {
  performanceThreshold: number;
  responsiveThreshold: number;
  accessibilityThreshold: number;
  seoThreshold: number;
  enableNotifications: boolean;
  notificationChannels: string[];
}

interface DashboardConfig {
  theme: 'light' | 'dark' | 'auto';
  layout: 'grid' | 'list' | 'custom';
  widgets: string[];
  refreshInterval: number;
  maxDataPoints: number;
}
```

## 🚀 Advanced Usage

### Custom Metrics Collection

```tsx
import { PerformanceDashboard, useMetricsCollector } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function CustomMetrics() {
  const { collectMetric, collectCustomMetric } = useMetricsCollector();
  
  // Collect custom performance metric
  const handleClick = () => {
    const startTime = performance.now();
    
    // ... perform action ...
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    collectCustomMetric('custom_action_duration', duration, {
      category: 'user_interaction',
      priority: 'high'
    });
  };
  
  return <button onClick={handleClick}>Custom Action</button>;
}

function App() {
  return (
    <PerformanceDashboard>
      <CustomMetrics />
      <YourApp />
    </PerformanceDashboard>
  );
}
```

### Custom Alerts

```tsx
import { PerformanceDashboard, useAlertSystem } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function CustomAlerts() {
  const { createAlert, dismissAlert } = useAlertSystem();
  
  // Create custom performance alert
  const checkPerformance = () => {
    const performanceScore = calculatePerformanceScore();
    
    if (performanceScore < 0.8) {
      createAlert({
        type: 'warning',
        title: 'Performance Degradation',
        message: `Performance score dropped to ${performanceScore}`,
        severity: 'medium',
        actionable: true,
        actions: [
          { label: 'Optimize', action: () => optimizePerformance() },
          { label: 'Dismiss', action: () => dismissAlert() }
        ]
      });
    }
  };
  
  return <button onClick={checkPerformance}>Check Performance</button>;
}
```

### Dashboard Customization

```tsx
import { PerformanceDashboard, DashboardWidget } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function CustomWidget() {
  return (
    <DashboardWidget title="Custom Metrics" size="medium">
      <div>
        <h3>Custom Performance Data</h3>
        <p>Your custom metrics here</p>
      </div>
    </DashboardWidget>
  );
}

function App() {
  return (
    <PerformanceDashboard
      configInline={{
        dashboard: {
          widgets: ['performance', 'responsive', 'custom'],
          customWidgets: {
            custom: CustomWidget
          }
        }
      }}
    >
      <YourApp />
    </PerformanceDashboard>
  );
}
```

### External Integration

```tsx
import { PerformanceDashboard, useExternalIntegration } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function ExternalIntegration() {
  const { sendToExternalSystem, configureWebhook } = useExternalIntegration();
  
  // Configure webhook for external monitoring
  useEffect(() => {
    configureWebhook({
      url: process.env.MONITORING_WEBHOOK_URL,
      events: ['metrics_update', 'alert_created', 'performance_degradation'],
      headers: {
        'Authorization': `Bearer ${process.env.MONITORING_API_KEY}`
      }
    });
  }, []);
  
  // Send custom data to external system
  const sendCustomData = (data: any) => {
    sendToExternalSystem('custom_metric', data);
  };
  
  return <div>External Integration Ready</div>;
}
```

## 📊 Metrics & Analytics

### Performance Metrics

#### Core Web Vitals
- **LCP (Largest Contentful Paint)** - Loading performance
- **FID (First Input Delay)** - Interactivity
- **CLS (Cumulative Layout Shift)** - Visual stability

#### Bundle Metrics
- **Bundle Size** - Total JavaScript bundle size
- **Loading Time** - Time to load and parse JavaScript
- **Tree Shaking** - Unused code elimination efficiency

#### Runtime Metrics
- **Component Render Time** - Individual component performance
- **Memory Usage** - Memory consumption patterns
- **CPU Utilization** - Processing overhead

### Responsive Metrics

#### Breakpoint Performance
- **Breakpoint Switching** - Time to switch between breakpoints
- **Responsive Calculations** - Performance of responsive value calculations
- **Layout Adjustments** - Time for layout changes

#### Responsive Patterns
- **Breakpoint Usage** - Frequency of breakpoint usage
- **Responsive Value Distribution** - Distribution of responsive values
- **Layout Shift Patterns** - Visual stability across breakpoints

### Accessibility Metrics

#### WCAG Compliance
- **Color Contrast** - Text and background contrast ratios
- **Keyboard Navigation** - Keyboard accessibility support
- **Screen Reader Support** - Screen reader compatibility

#### User Experience
- **Focus Management** - Focus indicator visibility
- **Alternative Text** - Image alt text coverage
- **Semantic Structure** - HTML semantic correctness

### SEO Metrics

#### Technical SEO
- **Meta Tags** - Meta tag completeness and quality
- **Structured Data** - Schema markup implementation
- **Performance Score** - Core Web Vitals compliance

#### Content Quality
- **Page Speed** - Overall page performance
- **Mobile Optimization** - Mobile-friendly design
- **Accessibility Score** - WCAG compliance level

## ⚡ Performance

### Performance Benefits

- **Real-time Monitoring** - Sub-second performance metric updates
- **Efficient Data Collection** - Minimal overhead for metric collection
- **Smart Caching** - Intelligent caching for performance data
- **Optimized Rendering** - Efficient dashboard rendering and updates

### Performance Monitoring

```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function App() {
  return (
    <PerformanceDashboard
      enablePerformanceMetrics={true}
      
      onMetricsUpdate={(metrics) => {
        // Monitor dashboard performance
        const dashboardMetrics = {
          updateTime: metrics.timestamp,
          dataPoints: metrics.dataPoints,
          memoryUsage: metrics.memoryUsage,
          renderTime: metrics.renderTime
        };
        
        // Send to monitoring service
        if (process.env.MONITORING_URL) {
          fetch(process.env.MONITORING_URL, {
            method: 'POST',
            body: JSON.stringify(dashboardMetrics)
          });
        }
      }}
    >
      <YourApp />
    </PerformanceDashboard>
  );
}
```

### Performance Budgets

```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function App() {
  return (
    <PerformanceDashboard
      configInline={{
        performance: {
          budgets: {
            maxUpdateInterval: 1000, // 1 second
            maxMemoryUsage: '50MB',
            maxRenderTime: 100, // 100ms
            maxDataPoints: 1000
          }
        }
      }}
    >
      <YourApp />
    </PerformanceDashboard>
  );
}
```

## 🔄 Migration Guide

### From Basic Performance Monitoring

**Before:**
```tsx
// Manual performance monitoring
const startTime = performance.now();
// ... component logic ...
const endTime = performance.now();
const duration = endTime - startTime;
console.log(`Component render time: ${duration}ms`);
```

**After:**
```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function App() {
  return (
    <PerformanceDashboard>
      <YourApp />
    </PerformanceDashboard>
  );
}

// Automatic performance monitoring with dashboard
```

### From Performance Libraries

**Before:**
```tsx
import { PerformanceObserver } from 'web-vitals';

const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(entry.name, entry.value);
  });
});

observer.observe({ entryTypes: ['measure'] });
```

**After:**
```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function App() {
  return (
    <PerformanceDashboard
      configInline={{
        metrics: {
          performance: {
            coreWebVitals: true,
            customMetrics: true
          }
        }
      }}
    >
      <YourApp />
    </PerformanceDashboard>
  );
}

// Automatic Core Web Vitals monitoring with dashboard
```

### From Custom Dashboards

**Before:**
```tsx
// Custom dashboard implementation
const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Manual metric collection
      const newMetrics = collectMetrics();
      setMetrics(newMetrics);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <div>Custom Dashboard</div>;
};
```

**After:**
```tsx
import { PerformanceDashboard } from '@yaseratiar/react-responsive-easy-performance-dashboard';

function App() {
  return (
    <PerformanceDashboard
      configInline={{
        dashboard: {
          widgets: ['performance', 'responsive', 'accessibility'],
          refreshInterval: 1000
        }
      }}
    >
      <YourApp />
    </PerformanceDashboard>
  );
}

// Professional dashboard with automatic metric collection
```

## 🐛 Troubleshooting

### Common Issues

#### Dashboard Not Opening

```bash
# Check if package is installed
npm list @yaseratiar/react-responsive-easy-performance-dashboard

# Verify React version
npm list react

# Check for console errors
# Open browser console and look for error messages
```

#### Performance Issues

```bash
# Enable debug mode
DEBUG=rre:performance-dashboard npm start

# Check memory usage
# Monitor browser memory usage in DevTools

# Verify configuration
RRE_VALIDATE_CONFIG=true npm start
```

#### Metrics Not Collecting

```bash
# Check configuration
node -e "console.log(require('./performance.config.js'))"

# Enable verbose logging
RRE_VERBOSE=true npm start

# Verify hooks are working
# Check console for onMetricsUpdate logs
```

### Debug Commands

```bash
# Show package version
npm list @yaseratiar/react-responsive-easy-performance-dashboard

# Check configuration
node -e "console.log(require('./performance.config.js'))"

# Test dashboard
RRE_TEST_DASHBOARD=true npm start
```

### Getting Help

```bash
# Enable debug mode
DEBUG=rre:performance-dashboard npm start

# Show help
npx @yaseratiar/react-responsive-easy-performance-dashboard --help

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

# Link package locally
pnpm --filter=@yaseratiar/react-responsive-easy-performance-dashboard link

# Test package
pnpm test
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test
pnpm test --grep "performance-dashboard"

# Coverage report
pnpm test:coverage
```

### Building

```bash
# Build package
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

- **Web Performance Team** - For Core Web Vitals and performance standards
- **React Team** - For the component-based architecture
- **TypeScript Team** - For type safety and tooling
- **Open Source Community** - For inspiration and collaboration

---

**Made with ❤️ by [naa-G](https://github.com/naaa-G)**

**[⭐ Star this repository](https://github.com/naaa-G/react-responsive-easy)** if you find it helpful!
