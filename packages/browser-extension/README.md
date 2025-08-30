# @yaseratiar/react-responsive-easy-browser-extension

> Enterprise-grade browser extension for React Responsive Easy visual debugging and development tools

[![npm version](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-browser-extension.svg)](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-browser-extension)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Browser Extension](https://img.shields.io/badge/Browser%20Extension-Chrome%2CFirefox%2CEdge-blue.svg)](https://developer.chrome.com/docs/extensions/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Development Tools](#-development-tools)
- [Performance](#-performance)
- [Migration Guide](#-migration-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

`@yaseratiar/react-responsive-easy-browser-extension` is a powerful browser extension that provides comprehensive visual debugging and development tools for React Responsive Easy applications.

Built for enterprise applications, it offers:
- **Visual Debugging** - See responsive values in real-time with visual overlays
- **Breakpoint Preview** - Test responsive behavior instantly across all breakpoints
- **Performance Monitoring** - Track responsive performance and optimization metrics
- **Developer Tools** - Integrated debugging panel with advanced features
- **Cross-browser Support** - Works on Chrome, Firefox, Edge, and Safari

## 🚀 Features

### Core Debugging
- **Visual Overlays** - Real-time responsive value visualization
- **Breakpoint Switching** - Instant breakpoint testing and preview
- **Responsive Inspector** - Inspect responsive properties and values
- **Live Updates** - Real-time responsive value changes

### Development Tools
- **Developer Panel** - Integrated debugging interface
- **Performance Metrics** - Responsive performance monitoring
- **Error Reporting** - Responsive error detection and reporting
- **Configuration Editor** - Live responsive configuration editing

### Browser Integration
- **Chrome Extension** - Full Chrome DevTools integration
- **Firefox Add-on** - Firefox Developer Tools compatibility
- **Edge Extension** - Microsoft Edge DevTools support
- **Safari Extension** - Safari Web Inspector integration

### Enterprise Features
- **Type Safety** - Full TypeScript support with type checking
- **Configuration Validation** - Validate extension configuration
- **Environment Support** - Different features for dev/prod builds
- **Integration APIs** - RESTful APIs for external system integration

## 📦 Installation

### Chrome/Edge

1. **Download from Chrome Web Store** (coming soon)
2. **Or build from source:**
   ```bash
   npm install @yaseratiar/react-responsive-easy-browser-extension
   npm run build:chrome
   ```

### Firefox

1. **Download from Firefox Add-ons** (coming soon)
2. **Or build from source:**
   ```bash
   npm install @yaseratiar/react-responsive-easy-browser-extension
   npm run build:firefox
   ```

### Safari

1. **Download from Safari Extensions Gallery** (coming soon)
2. **Or build from source:**
   ```bash
   npm install @yaseratiar/react-responsive-easy-browser-extension
   npm run build:safari
   ```

### Manual Installation

```bash
# Clone repository
git clone https://github.com/naaa-G/react-responsive-easy.git

# Install dependencies
pnpm install

# Build extension
pnpm --filter=@yaseratiar/react-responsive-easy-browser-extension build

# Load extension in browser
# Chrome: chrome://extensions/ → Load unpacked → select dist/chrome
# Firefox: about:debugging → This Firefox → Load Temporary Add-on → select manifest.json
```

## 🎯 Quick Start

### 1. Install the Extension

Download and install the extension for your browser from the respective store.

### 2. Navigate to a React Responsive Easy App

Visit any website that uses React Responsive Easy.

### 3. Open Developer Tools

- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
- **Firefox**: Press `F12` or `Ctrl+Shift+I`
- **Safari**: Press `Cmd+Option+I`

### 4. Use the React Responsive Easy Panel

Look for the "React Responsive Easy" tab in the Developer Tools panel.

## ⚙️ Configuration

### Extension Settings

Access extension settings through the browser's extension management page:

```json
{
  "debugMode": false,
  "showVisualOverlays": true,
  "breakpointPreview": true,
  "performanceMonitoring": true,
  "autoRefresh": false,
  "theme": "auto"
}
```

### Website Configuration

Add configuration to your React Responsive Easy app:

```tsx
import { ResponsiveProvider } from '@yaseratiar/react-responsive-easy-core';

function App() {
  return (
    <ResponsiveProvider
      config={responsiveConfig}
      // Extension configuration
      extension={{
        enabled: true,
        debugMode: process.env.NODE_ENV === 'development',
        showOverlays: true,
        performanceTracking: true
      }}
    >
      <YourApp />
    </ResponsiveProvider>
  );
}
```

### Environment Variables

```bash
# Enable extension debugging
RRE_EXTENSION_DEBUG=true

# Enable performance monitoring
RRE_PERFORMANCE_MONITORING=true

# Enable visual overlays
RRE_VISUAL_OVERLAYS=true
```

## 🔧 API Reference

### Extension API

#### `useExtension`

Hook for accessing extension functionality.

```tsx
import { useExtension } from '@yaseratiar/react-responsive-easy-browser-extension';

function Component() {
  const { 
    isExtensionActive, 
    showOverlay, 
    hideOverlay, 
    switchBreakpoint 
  } = useExtension();
  
  return (
    <div>
      {isExtensionActive && (
        <button onClick={() => showOverlay()}>
          Show Responsive Overlay
        </button>
      )}
    </div>
  );
}
```

#### `ExtensionProvider`

Provider component for extension functionality.

```tsx
import { ExtensionProvider } from '@yaseratiar/react-responsive-easy-browser-extension';

function App() {
  return (
    <ExtensionProvider
      config={{
        enabled: true,
        debugMode: process.env.NODE_ENV === 'development',
        showOverlays: true,
        performanceTracking: true
      }}
    >
      <YourApp />
    </ExtensionProvider>
  );
}
```

### Configuration Schema

```typescript
interface ExtensionConfig {
  // Core options
  enabled: boolean;
  debugMode: boolean;
  
  // Visual options
  showOverlays: boolean;
  overlayTheme: 'light' | 'dark' | 'auto';
  overlayPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  // Debugging options
  breakpointPreview: boolean;
  responsiveInspector: boolean;
  performanceMonitoring: boolean;
  
  // Development options
  liveEditing: boolean;
  errorReporting: boolean;
  logging: boolean;
}
```

## 🚀 Advanced Usage

### Custom Visual Overlays

```tsx
import { useExtension, ResponsiveOverlay } from '@yaseratiar/react-responsive-easy-browser-extension';

function CustomOverlay() {
  const { isExtensionActive } = useExtension();
  
  if (!isExtensionActive) return null;
  
  return (
    <ResponsiveOverlay
      position="top-right"
      theme="dark"
      showBreakpoint={true}
      showResponsiveValues={true}
      showPerformanceMetrics={true}
    />
  );
}
```

### Performance Monitoring

```tsx
import { useExtension, PerformanceMonitor } from '@yaseratiar/react-responsive-easy-browser-extension';

function PerformanceTracking() {
  const { isExtensionActive } = useExtension();
  
  if (!isExtensionActive) return null;
  
  return (
    <PerformanceMonitor
      metrics={['renderTime', 'breakpointSwitch', 'responsiveCalculations']}
      threshold={100} // 100ms
      onThresholdExceeded={(metric, value) => {
        console.warn(`${metric} exceeded threshold: ${value}ms`);
      }}
    />
  );
}
```

### Breakpoint Testing

```tsx
import { useExtension, BreakpointTester } from '@yaseratiar/react-responsive-easy-browser-extension';

function BreakpointTesting() {
  const { isExtensionActive } = useExtension();
  
  if (!isExtensionActive) return null;
  
  return (
    <BreakpointTester
      breakpoints={['mobile', 'tablet', 'desktop']}
      autoSwitch={false}
      onBreakpointChange={(breakpoint) => {
        console.log(`Switched to: ${breakpoint.name}`);
      }}
    />
  );
}
```

### Error Reporting

```tsx
import { useExtension, ErrorReporter } from '@yaseratiar/react-responsive-easy-browser-extension';

function ErrorReporting() {
  const { isExtensionActive } = useExtension();
  
  if (!isExtensionActive) return null;
  
  return (
    <ErrorReporter
      onError={(error, context) => {
        // Send error to reporting service
        fetch('/api/errors', {
          method: 'POST',
          body: JSON.stringify({ error, context })
        });
      }}
      includeStackTraces={true}
      includePerformanceData={true}
    />
  );
}
```

## 🛠️ Development Tools

### Developer Panel

The extension provides a comprehensive developer panel with:

#### Responsive Inspector
- **Live Values**: Real-time responsive value display
- **Breakpoint Info**: Current breakpoint details
- **Configuration**: Live responsive configuration editing
- **Performance**: Performance metrics and optimization suggestions

#### Visual Debugger
- **Overlay Controls**: Toggle visual overlays
- **Breakpoint Preview**: Test different breakpoints
- **Responsive Grid**: Visual grid system for responsive layouts
- **Element Inspector**: Inspect individual responsive elements

#### Performance Monitor
- **Real-time Metrics**: Live performance data
- **Performance Budgets**: Set and monitor performance thresholds
- **Optimization Tips**: AI-powered optimization suggestions
- **Historical Data**: Performance trend analysis

### Browser Integration

#### Chrome DevTools
```javascript
// manifest.json
{
  "devtools_page": "devtools.html",
  "permissions": [
    "activeTab",
    "storage"
  ]
}
```

#### Firefox Developer Tools
```javascript
// manifest.json
{
  "developer": {
    "devtools_page": "devtools.html"
  }
}
```

#### Safari Web Inspector
```javascript
// manifest.json
{
  "web_accessible_resources": [
    "safari-inspector.js"
  ]
}
```

## ⚡ Performance

### Performance Benefits

- **Minimal Overhead** - Extension adds less than 5ms to page load
- **Efficient Monitoring** - Smart sampling reduces performance impact
- **Lazy Loading** - Features load only when needed
- **Memory Optimization** - Efficient memory usage for long-running sessions

### Performance Monitoring

```tsx
import { useExtension, PerformanceTracker } from '@yaseratiar/react-responsive-easy-browser-extension';

function PerformanceTracking() {
  const { isExtensionActive } = useExtension();
  
  if (!isExtensionActive) return null;
  
  return (
    <PerformanceTracker
      metrics={['extensionLoad', 'overlayRender', 'breakpointSwitch']}
      onMetricsUpdate={(metrics) => {
        // Send metrics to monitoring service
        if (process.env.MONITORING_URL) {
          fetch(process.env.MONITORING_URL, {
            method: 'POST',
            body: JSON.stringify(metrics)
          });
        }
      }}
    />
  );
}
```

### Performance Budgets

```tsx
import { useExtension, PerformanceBudget } from '@yaseratiar/react-responsive-easy-browser-extension';

function PerformanceBudgeting() {
  const { isExtensionActive } = useExtension();
  
  if (!isExtensionActive) return null;
  
  return (
    <PerformanceBudget
      budgets={{
        extensionLoad: 50, // 50ms
        overlayRender: 10, // 10ms
        breakpointSwitch: 20 // 20ms
      }}
      onBudgetExceeded={(metric, value, budget) => {
        console.warn(`${metric} exceeded budget: ${value}ms > ${budget}ms`);
      }}
    />
  );
}
```

## 🔄 Migration Guide

### From Browser DevTools

**Before:**
```javascript
// Manual responsive testing
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  console.log('Mobile breakpoint active');
}
```

**After:**
```tsx
import { useExtension } from '@yaseratiar/react-responsive-easy-browser-extension';

function Component() {
  const { currentBreakpoint, switchBreakpoint } = useExtension();
  
  return (
    <div>
      <p>Current breakpoint: {currentBreakpoint.name}</p>
      <button onClick={() => switchBreakpoint('mobile')}>
        Test Mobile
      </button>
    </div>
  );
}
```

### From Responsive Testing Tools

**Before:**
```javascript
// Manual responsive testing
function testResponsive() {
  const originalWidth = window.innerWidth;
  window.innerWidth = 375; // Mobile width
  window.dispatchEvent(new Event('resize'));
  
  // Test responsive behavior
  // ...
  
  // Restore original width
  window.innerWidth = originalWidth;
  window.dispatchEvent(new Event('resize'));
}
```

**After:**
```tsx
import { useExtension } from '@yaseratiar/react-responsive-easy-browser-extension';

function Component() {
  const { testBreakpoint, restoreBreakpoint } = useExtension();
  
  const testMobile = async () => {
    await testBreakpoint('mobile');
    // Test responsive behavior
    // ...
    restoreBreakpoint();
  };
  
  return <button onClick={testMobile}>Test Mobile</button>;
}
```

### From Performance Monitoring

**Before:**
```javascript
// Manual performance monitoring
const startTime = performance.now();
// ... responsive logic ...
const endTime = performance.now();
const duration = endTime - startTime;
console.log(`Responsive calculation took: ${duration}ms`);
```

**After:**
```tsx
import { useExtension, PerformanceMonitor } from '@yaseratiar/react-responsive-easy-browser-extension';

function Component() {
  const { isExtensionActive } = useExtension();
  
  if (!isExtensionActive) return null;
  
  return (
    <PerformanceMonitor
      metrics={['responsiveCalculations', 'breakpointSwitches']}
      onMetricsUpdate={(metrics) => {
        console.log('Performance metrics:', metrics);
      }}
    />
  );
}
```

## 🐛 Troubleshooting

### Common Issues

#### Extension Not Loading

```bash
# Check extension installation
# Go to browser extension management page

# Verify manifest.json
# Check browser console for errors

# Check permissions
# Ensure extension has necessary permissions
```

#### Performance Issues

```bash
# Enable debug mode
# Set debugMode: true in extension settings

# Check performance metrics
# Monitor extension performance in DevTools

# Verify configuration
# Check extension configuration for errors
```

#### Visual Overlays Not Showing

```bash
# Check extension settings
# Verify showOverlays is enabled

# Check website configuration
# Ensure extension is enabled on the website

# Check browser compatibility
# Verify extension works with your browser version
```

### Debug Commands

```bash
# Show extension version
# Check extension details in browser

# Check extension logs
# Open browser console and look for extension logs

# Test extension functionality
# Use extension features and check for errors
```

### Getting Help

```bash
# Enable debug mode
# Set debugMode: true in extension settings

# Check documentation
# Visit extension documentation page

# Report issues
# Use extension's issue reporting feature
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/naaa-G/react-responsive-easy/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/naaa-G/react-responsive-easy.git

# Install dependencies
pnpm install

# Build extension
pnpm --filter=@yaseratiar/react-responsive-easy-browser-extension build

# Load extension in browser
# Follow browser-specific loading instructions
```

### Testing

```bash
# Run extension tests
pnpm test

# Test in different browsers
pnpm test:browsers

# Test extension functionality
pnpm test:extension
```

### Building

```bash
# Build for Chrome
pnpm build:chrome

# Build for Firefox
pnpm build:firefox

# Build for Safari
pnpm build:safari

# Build for all browsers
pnpm build:all
```

## 📄 License

MIT License - see the [LICENSE](https://github.com/naaa-G/react-responsive-easy/blob/main/LICENSE) file for details.

## 🔗 Links

- **Documentation**: [https://github.com/naaa-G/react-responsive-easy](https://github.com/naaa-G/react-responsive-easy)
- **Issues**: [https://github.com/naaa-G/react-responsive-easy/issues](https://github.com/naaa-G/react-responsive-easy/issues)
- **Discussions**: [https://github.com/naaa-G/react-responsive-easy/discussions](https://github.com/naaa-G/react-responsive-easy/discussions)
- **Changelog**: [https://github.com/naaa-G/react-responsive-easy/blob/main/CHANGELOG.md](https://github.com/naaa-G/react-responsive-easy/blob/main/CHANGELOG.md)

## 🙏 Acknowledgments

- **Browser Extension Teams** - For extension development platforms
- **React Team** - For the component-based architecture
- **TypeScript Team** - For type safety and tooling
- **Open Source Community** - For inspiration and collaboration

---

**Made with ❤️ by [naa-G](https://github.com/naaa-G)**

**[⭐ Star this repository](https://github.com/naaa-G/react-responsive-easy)** if you find it helpful!
