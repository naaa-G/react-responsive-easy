# @yaseratiar/react-responsive-easy-figma-plugin

> Enterprise-grade Figma plugin for React Responsive Easy design system integration and responsive design tools

[![npm version](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-figma-plugin.svg)](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-figma-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Figma Plugin](https://img.shields.io/badge/Figma%20Plugin-API%20v1+-purple.svg)](https://www.figma.com/plugin-docs/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Design System Integration](#-design-system-integration)
- [Performance](#-performance)
- [Migration Guide](#-migration-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

`@yaseratiar/react-responsive-easy-figma-plugin` is a powerful Figma plugin that seamlessly integrates React Responsive Easy design systems into your Figma workflow.

Built for enterprise design teams, it provides:
- **Design System Sync** - Automatic synchronization with React Responsive Easy configurations
- **Responsive Preview** - Test designs across all breakpoints within Figma
- **Token Generation** - Generate design tokens from responsive configurations
- **Component Library** - Import and manage responsive React components
- **Developer Handoff** - Export responsive specifications and code snippets

## 🚀 Features

### Core Integration
- **Design System Sync** - Real-time synchronization with React Responsive Easy
- **Responsive Preview** - Multi-breakpoint design testing
- **Token Management** - Design token generation and management
- **Component Import** - Import responsive React components

### Design Tools
- **Breakpoint Testing** - Test designs across all responsive breakpoints
- **Responsive Grid** - Visual grid system for responsive layouts
- **Spacing System** - Responsive spacing and layout tools
- **Typography Scale** - Responsive typography management

### Developer Handoff
- **Code Export** - Generate responsive React code snippets
- **Specification Export** - Export responsive design specifications
- **Token Export** - Export design tokens in multiple formats
- **Documentation** - Auto-generate responsive design documentation

### Enterprise Features
- **Team Collaboration** - Multi-user design system management
- **Version Control** - Design system versioning and rollback
- **Integration APIs** - RESTful APIs for external system integration
- **Audit Trail** - Complete design system change history

## 📦 Installation

### Figma Plugin Installation

1. **Install from Figma Community** (coming soon)
2. **Or install manually:**
   - Download the plugin files
   - In Figma: Plugins → Development → Import plugin from manifest
   - Select the `manifest.json` file

### Development Setup

```bash
# Clone repository
git clone https://github.com/naaa-G/react-responsive-easy.git

# Install dependencies
pnpm install

# Build plugin
pnpm --filter=@yaseratiar/react-responsive-easy-figma-plugin build

# Load in Figma
# Development → Import plugin from manifest → select manifest.json
```

### Package Installation

```bash
# Install as dependency
npm install @yaseratiar/react-responsive-easy-figma-plugin

# Or with pnpm
pnpm add @yaseratiar/react-responsive-easy-figma-plugin

# Or with yarn
yarn add @yaseratiar/react-responsive-easy-figma-plugin
```

## 🎯 Quick Start

### 1. Install the Plugin

Install the React Responsive Easy Figma plugin from the Figma Community or manually.

### 2. Configure Design System

Set up your React Responsive Easy design system configuration:

```tsx
// design-system.config.ts
export const designSystemConfig = {
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  typography: {
    h1: { fontSize: { mobile: '24px', desktop: '32px' } },
    h2: { fontSize: { mobile: '20px', desktop: '28px' } },
    body: { fontSize: { mobile: '14px', desktop: '16px' } }
  }
};
```

### 3. Sync with Figma

Use the plugin to sync your design system:

```tsx
import { FigmaSync } from '@yaseratiar/react-responsive-easy-figma-plugin';

const figmaSync = new FigmaSync({
  designSystem: designSystemConfig,
  figmaFileKey: 'your-figma-file-key'
});

// Sync design system
await figmaSync.sync();
```

### 4. Use Responsive Tools

Access responsive design tools through the plugin panel in Figma.

## ⚙️ Configuration

### Plugin Configuration

```typescript
interface FigmaPluginConfig {
  // Core options
  designSystem: DesignSystemConfig;
  figmaFileKey: string;
  autoSync: boolean;
  
  // Sync options
  syncComponents: boolean;
  syncTokens: boolean;
  syncStyles: boolean;
  
  // Export options
  exportFormats: ('code' | 'tokens' | 'specs')[];
  codeLanguage: 'tsx' | 'jsx' | 'css';
  
  // Integration options
  webhookUrl?: string;
  apiKey?: string;
  teamId?: string;
}
```

### Design System Configuration

```typescript
interface DesignSystemConfig {
  breakpoints: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, TypographyConfig>;
  colors: Record<string, string>;
  shadows: Record<string, ShadowConfig>;
  borders: Record<string, BorderConfig>;
}

interface TypographyConfig {
  fontSize: Record<string, string>;
  lineHeight?: Record<string, string>;
  fontWeight?: Record<string, string>;
  fontFamily?: string;
}
```

### Environment Variables

```bash
# Figma API key
FIGMA_ACCESS_TOKEN=your-figma-access-token

# Design system URL
DESIGN_SYSTEM_URL=https://your-design-system.com

# Webhook URL for sync
WEBHOOK_URL=https://your-webhook.com/sync

# Team ID for collaboration
FIGMA_TEAM_ID=your-team-id
```

## 🔧 API Reference

### Core API

#### `FigmaSync`

Main class for syncing design systems with Figma.

```typescript
import { FigmaSync } from '@yaseratiar/react-responsive-easy-figma-plugin';

const figmaSync = new FigmaSync({
  designSystem: designSystemConfig,
  figmaFileKey: 'your-figma-file-key',
  autoSync: true
});

// Sync design system
await figmaSync.sync();

// Get sync status
const status = await figmaSync.getStatus();

// Manual sync
await figmaSync.syncComponents();
await figmaSync.syncTokens();
await figmaSync.syncStyles();
```

#### `ResponsivePreview`

Component for previewing responsive designs.

```tsx
import { ResponsivePreview } from '@yaseratiar/react-responsive-easy-figma-plugin';

function DesignPreview() {
  return (
    <ResponsivePreview
      breakpoints={['mobile', 'tablet', 'desktop']}
      showGrid={true}
      showSpacing={true}
      showTypography={true}
      onBreakpointChange={(breakpoint) => {
        console.log(`Switched to: ${breakpoint.name}`);
      }}
    />
  );
}
```

#### `TokenGenerator`

Generate design tokens from responsive configurations.

```typescript
import { TokenGenerator } from '@yaseratiar/react-responsive-easy-figma-plugin';

const tokenGenerator = new TokenGenerator(designSystemConfig);

// Generate CSS custom properties
const cssTokens = tokenGenerator.generateCSS();

// Generate SCSS variables
const scssTokens = tokenGenerator.generateSCSS();

// Generate JavaScript tokens
const jsTokens = tokenGenerator.generateJS();

// Generate Figma styles
const figmaStyles = tokenGenerator.generateFigmaStyles();
```

### Plugin API

#### `useFigmaPlugin`

Hook for accessing plugin functionality.

```tsx
import { useFigmaPlugin } from '@yaseratiar/react-responsive-easy-figma-plugin';

function PluginComponent() {
  const { 
    isConnected, 
    syncDesignSystem, 
    exportTokens, 
    previewBreakpoint 
  } = useFigmaPlugin();
  
  return (
    <div>
      <button onClick={syncDesignSystem}>
        Sync Design System
      </button>
      <button onClick={() => exportTokens('css')}>
        Export CSS Tokens
      </button>
    </div>
  );
}
```

#### `FigmaProvider`

Provider component for plugin functionality.

```tsx
import { FigmaProvider } from '@yaseratiar/react-responsive-easy-figma-plugin';

function App() {
  return (
    <FigmaProvider
      config={{
        designSystem: designSystemConfig,
        figmaFileKey: 'your-figma-file-key',
        autoSync: true
      }}
    >
      <YourApp />
    </FigmaProvider>
  );
}
```

## 🚀 Advanced Usage

### Custom Token Generation

```typescript
import { TokenGenerator, CustomTokenRule } from '@yaseratiar/react-responsive-easy-figma-plugin';

const customRules: CustomTokenRule[] = [
  {
    name: 'customSpacing',
    generate: (config) => {
      const spacing = config.spacing;
      return Object.entries(spacing).map(([key, value]) => ({
        name: `spacing-${key}`,
        value,
        type: 'spacing'
      }));
    }
  }
];

const tokenGenerator = new TokenGenerator(designSystemConfig, customRules);
const customTokens = tokenGenerator.generateCustom();
```

### Responsive Component Import

```typescript
import { ComponentImporter } from '@yaseratiar/react-responsive-easy-figma-plugin';

const componentImporter = new ComponentImporter({
  figmaFileKey: 'your-figma-file-key',
  componentLibrary: 'your-component-library'
});

// Import components
const components = await componentImporter.importComponents([
  'Button',
  'Card',
  'Navigation'
]);

// Import with responsive variants
const responsiveComponents = await componentImporter.importResponsiveComponents([
  'Button',
  'Card'
]);
```

### Design System Validation

```typescript
import { DesignSystemValidator } from '@yaseratiar/react-responsive-easy-figma-plugin';

const validator = new DesignSystemValidator();

// Validate configuration
const validationResult = validator.validate(designSystemConfig);

if (validationResult.isValid) {
  console.log('Design system is valid');
} else {
  console.error('Validation errors:', validationResult.errors);
}

// Validate against Figma
const figmaValidation = await validator.validateAgainstFigma(
  designSystemConfig,
  'your-figma-file-key'
);
```

### Webhook Integration

```typescript
import { WebhookManager } from '@yaseratiar/react-responsive-easy-figma-plugin';

const webhookManager = new WebhookManager({
  webhookUrl: 'https://your-webhook.com/sync',
  secret: 'your-webhook-secret'
});

// Register webhook
await webhookManager.register();

// Handle webhook events
webhookManager.on('designSystemUpdate', async (data) => {
  console.log('Design system updated:', data);
  await figmaSync.sync();
});

webhookManager.on('componentUpdate', async (data) => {
  console.log('Component updated:', data);
  await componentImporter.importComponents([data.componentName]);
});
```

## 🎨 Design System Integration

### Figma Styles Sync

```typescript
import { FigmaStylesSync } from '@yaseratiar/react-responsive-easy-figma-plugin';

const stylesSync = new FigmaStylesSync({
  figmaFileKey: 'your-figma-file-key',
  designSystem: designSystemConfig
});

// Sync color styles
await stylesSync.syncColors();

// Sync typography styles
await stylesSync.syncTypography();

// Sync effect styles
await stylesSync.syncEffects();

// Sync all styles
await stylesSync.syncAll();
```

### Component Library Management

```typescript
import { ComponentLibraryManager } from '@yaseratiar/react-responsive-easy-figma-plugin';

const libraryManager = new ComponentLibraryManager({
  figmaFileKey: 'your-figma-file-key',
  libraryName: 'React Responsive Easy Components'
});

// Create component library
await libraryManager.createLibrary();

// Add components to library
await libraryManager.addComponents([
  'Button',
  'Card',
  'Navigation'
]);

// Publish library
await libraryManager.publish();

// Share library with team
await libraryManager.shareWithTeam('your-team-id');
```

### Responsive Grid System

```typescript
import { ResponsiveGrid } from '@yaseratiar/react-responsive-easy-figma-plugin';

const responsiveGrid = new ResponsiveGrid({
  breakpoints: designSystemConfig.breakpoints,
  columns: { mobile: 4, tablet: 8, desktop: 12 },
  gutters: { mobile: '16px', tablet: '24px', desktop: '32px' }
});

// Generate grid frames
const gridFrames = responsiveGrid.generateFrames();

// Apply grid to selection
await responsiveGrid.applyToSelection();

// Create responsive layout
await responsiveGrid.createResponsiveLayout();
```

## ⚡ Performance

### Performance Benefits

- **Efficient Sync** - Smart syncing reduces API calls and improves performance
- **Lazy Loading** - Components and tokens load only when needed
- **Caching** - Intelligent caching reduces redundant operations
- **Batch Operations** - Multiple operations are batched for efficiency

### Performance Monitoring

```typescript
import { PerformanceMonitor } from '@yaseratiar/react-responsive-easy-figma-plugin';

const performanceMonitor = new PerformanceMonitor({
  metrics: ['syncTime', 'importTime', 'exportTime'],
  threshold: 5000 // 5 seconds
});

// Monitor sync performance
performanceMonitor.on('thresholdExceeded', (metric, value) => {
  console.warn(`${metric} exceeded threshold: ${value}ms`);
});

// Get performance report
const report = await performanceMonitor.getReport();
console.log('Performance report:', report);
```

### Optimization Strategies

```typescript
import { FigmaSync } from '@yaseratiar/react-responsive-easy-figma-plugin';

const figmaSync = new FigmaSync({
  designSystem: designSystemConfig,
  figmaFileKey: 'your-figma-file-key',
  optimization: {
    incrementalSync: true,
    parallelOperations: true,
    cacheResults: true,
    batchSize: 10
  }
});

// Optimized sync
await figmaSync.optimizedSync();
```

## 🔄 Migration Guide

### From Manual Design Systems

**Before:**
```typescript
// Manual design system management
const designSystem = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  }
};

// Manual Figma sync
function syncToFigma() {
  // Manual color creation
  figma.createPaint({
    type: 'SOLID',
    color: { r: 0, g: 123, b: 255 }
  });
  
  // Manual spacing creation
  // ... complex manual process
}
```

**After:**
```typescript
import { FigmaSync } from '@yaseratiar/react-responsive-easy-figma-plugin';

const figmaSync = new FigmaSync({
  designSystem: designSystemConfig,
  figmaFileKey: 'your-figma-file-key'
});

// Automatic sync
await figmaSync.sync();
```

### From Other Design Tools

**Before:**
```typescript
// Sketch or other design tool
const sketchColors = sketchDocument.colors;
const sketchSpacing = sketchDocument.spacing;

// Manual conversion
const figmaColors = sketchColors.map(color => ({
  name: color.name,
  value: color.value
}));
```

**After:**
```typescript
import { DesignSystemConverter } from '@yaseratiar/react-responsive-easy-figma-plugin';

const converter = new DesignSystemConverter();

// Convert from Sketch
const convertedSystem = await converter.convertFromSketch(sketchDocument);

// Sync to Figma
await figmaSync.sync(convertedSystem);
```

### From Static Design Tokens

**Before:**
```json
{
  "colors": {
    "primary": "#007bff",
    "secondary": "#6c757d"
  },
  "spacing": {
    "small": "8px",
    "medium": "16px",
    "large": "24px"
  }
}
```

**After:**
```typescript
import { TokenGenerator } from '@yaseratiar/react-responsive-easy-figma-plugin';

const tokenGenerator = new TokenGenerator(designSystemConfig);

// Generate responsive tokens
const responsiveTokens = tokenGenerator.generateResponsive();

// Sync to Figma
await figmaSync.syncTokens(responsiveTokens);
```

## 🐛 Troubleshooting

### Common Issues

#### Plugin Not Loading

```bash
# Check plugin installation
# Verify manifest.json is valid

# Check Figma permissions
# Ensure plugin has necessary permissions

# Check console for errors
# Open browser console and look for errors
```

#### Sync Failures

```bash
# Check Figma API key
# Verify FIGMA_ACCESS_TOKEN is valid

# Check file permissions
# Ensure you have access to the Figma file

# Check network connectivity
# Verify internet connection and firewall settings
```

#### Token Generation Issues

```bash
# Validate design system config
# Check for syntax errors in configuration

# Check token naming
# Ensure token names follow naming conventions

# Check value formats
# Verify values are in correct format
```

### Debug Commands

```bash
# Enable debug mode
# Set debugMode: true in plugin configuration

# Check plugin logs
# Open Figma console and look for plugin logs

# Test plugin functionality
# Use plugin features and check for errors
```

### Getting Help

```bash
# Enable debug mode
# Set debugMode: true in plugin configuration

# Check documentation
# Visit plugin documentation page

# Report issues
# Use plugin's issue reporting feature
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/naaa-G/react-responsive-easy/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/naaa-G/react-responsive-easy.git

# Install dependencies
pnpm install

# Build plugin
pnpm --filter=@yaseratiar/react-responsive-easy-figma-plugin build

# Load in Figma
# Development → Import plugin from manifest → select manifest.json
```

### Testing

```bash
# Run plugin tests
pnpm test

# Test in Figma
pnpm test:figma

# Test plugin functionality
pnpm test:plugin
```

### Building

```bash
# Build for development
pnpm build:dev

# Build for production
pnpm build:prod

# Build for all environments
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

- **Figma Team** - For the plugin platform and API
- **React Team** - For the component-based architecture
- **TypeScript Team** - For type safety and tooling
- **Open Source Community** - For inspiration and collaboration

---

**Made with ❤️ by [naa-G](https://github.com/naaa-G)**

**[⭐ Star this repository](https://github.com/naaa-G/react-responsive-easy)** if you find it helpful!
