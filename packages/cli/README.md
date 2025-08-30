# @yaseratiar/react-responsive-easy-cli

> Professional command-line interface for React Responsive Easy development and deployment

[![npm version](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-cli.svg)](https://badge.fury.io/js/%40yaseratiar%2Freact-responsive-easy-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Downloads](https://img.shields.io/npm/dm/@yaseratiar/react-responsive-easy-cli)](https://www.npmjs.com/package/@yaseratiar/react-responsive-easy-cli)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Commands Reference](#-commands-reference)
- [Configuration](#-configuration)
- [Advanced Usage](#-advanced-usage)
- [Integration](#-integration)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

`@yaseratiar/react-responsive-easy-cli` is a powerful command-line interface that streamlines the development workflow for React Responsive Easy applications. It provides enterprise-grade tooling for project initialization, development, building, testing, and deployment.

Built for professional development teams, it offers:
- **Zero Configuration Setup** - Get started in seconds with intelligent defaults
- **Development Workflow** - Integrated development server with live preview
- **Build Pipeline** - Optimized production builds with performance analysis
- **Quality Assurance** - Automated testing, linting, and code quality checks
- **Deployment Tools** - One-command deployment to various platforms

## 🚀 Features

### Project Management
- **Project Initialization** - Create new projects with industry-standard templates
- **Preset Management** - Pre-configured setups for different frameworks
- **Dependency Management** - Automatic dependency installation and updates
- **Configuration Generation** - Smart default configurations with customization

### Development Tools
- **Development Server** - Hot reloading with responsive debugging tools
- **Live Preview** - Real-time breakpoint testing across devices
- **Performance Monitoring** - Built-in performance metrics and alerts
- **Debug Console** - Interactive debugging and inspection tools

### Build & Optimization
- **Build Pipeline** - Multi-stage builds with optimization
- **Bundle Analysis** - Detailed bundle size and performance reports
- **Code Splitting** - Intelligent code splitting strategies
- **Asset Optimization** - Image, font, and media optimization

### Quality Assurance
- **Automated Testing** - Unit, integration, and visual regression tests
- **Code Quality** - ESLint, Prettier, and TypeScript checking
- **Performance Audits** - Lighthouse integration and performance scoring
- **Accessibility Testing** - WCAG compliance checking

### Deployment
- **Multi-Platform Support** - Deploy to Vercel, Netlify, AWS, and more
- **Environment Management** - Staging, production, and preview deployments
- **CI/CD Integration** - GitHub Actions, GitLab CI, and Jenkins support
- **Monitoring** - Post-deployment performance and error monitoring

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @yaseratiar/react-responsive-easy-cli
```

### Local Installation

```bash
npm install --save-dev @yaseratiar/react-responsive-easy-cli
```

### Using npx

```bash
npx @yaseratiar/react-responsive-easy-cli@latest init my-project
```

### Using pnpm

```bash
pnpm add -g @yaseratiar/react-responsive-easy-cli
```

### Using yarn

```bash
yarn global add @yaseratiar/react-responsive-easy-cli
```

## 🎯 Quick Start

### 1. Initialize a New Project

```bash
# Create a new project with default settings
rre init my-responsive-app

# Create with specific framework
rre init my-app --framework nextjs

# Create with custom configuration
rre init my-app --config custom --typescript --tailwind
```

### 2. Navigate and Start Development

```bash
cd my-responsive-app

# Start development server
rre dev

# Start with specific options
rre dev --port 3001 --host 0.0.0.0 --https
```

### 3. Build and Deploy

```bash
# Build for production
rre build

# Build with analysis
rre build --analyze --profile

# Deploy to production
rre deploy --target production
```

## 🔧 Commands Reference

### `rre init [project-name]`

Initialize a new React Responsive Easy project.

#### Options

```bash
rre init [project-name] [options]

Options:
  --framework, -f    Framework to use (default: "vite")
                     Choices: "vite", "nextjs", "create-react-app", "custom"
  --typescript, -t   Enable TypeScript support
  --tailwind, -w     Enable Tailwind CSS
  --eslint, -e       Enable ESLint configuration
  --prettier, -p     Enable Prettier configuration
  --testing, -s      Enable testing setup (Jest + Testing Library)
  --storybook, -b    Enable Storybook setup
  --git, -g          Initialize git repository
  --install, -i      Install dependencies automatically
  --config, -c       Configuration preset to use
  --template, -m     Custom template to use
  --force, -f        Overwrite existing directory
  --yes, -y          Skip confirmation prompts
```

#### Examples

```bash
# Basic project
rre init my-app

# Next.js with TypeScript and Tailwind
rre init my-app --framework nextjs --typescript --tailwind

# Custom configuration
rre init my-app --config enterprise --typescript --testing --storybook

# Force overwrite
rre init my-app --force
```

### `rre dev`

Start development server with hot reloading.

#### Options

```bash
rre dev [options]

Options:
  --port, -p         Port to run on (default: 3000)
  --host, -h         Host to bind to (default: "localhost")
  --https, -s        Enable HTTPS
  --open, -o         Open browser automatically
  --mode, -m         Development mode (default: "development")
  --config, -c       Path to configuration file
  --env, -e          Environment variables
  --inspect, -i      Enable Node.js inspector
  --profile, -f      Enable performance profiling
```

#### Examples

```bash
# Basic development server
rre dev

# Custom port and host
rre dev --port 3001 --host 0.0.0.0

# HTTPS development
rre dev --https --port 3443

# With environment variables
rre dev --env NODE_ENV=development --env DEBUG=true
```

### `rre build`

Build project for production.

#### Options

```bash
rre build [options]

Options:
  --mode, -m         Build mode (default: "production")
  --config, -c       Path to configuration file
  --out-dir, -o     Output directory (default: "dist")
  --analyze, -a      Generate bundle analysis report
  --profile, -f      Enable performance profiling
  --sourcemap, -s    Generate source maps
  --minify, -n       Minify output (default: true)
  --target, -t       Target environment
  --watch, -w        Watch mode for development
  --clean, -l        Clean output directory before build
```

#### Examples

```bash
# Production build
rre build

# Development build with source maps
rre build --mode development --sourcemap

# Build with analysis
rre build --analyze --profile

# Watch mode
rre build --watch --mode development
```

### `rre test`

Run test suite.

#### Options

```bash
rre test [options]

Options:
  --watch, -w        Watch mode
  --coverage, -c     Generate coverage report
  --verbose, -v      Verbose output
  --bail, -b         Exit on first failure
  --grep, -g         Run tests matching pattern
  --timeout, -t      Test timeout in milliseconds
  --reporter, -r     Test reporter to use
  --config, -c       Path to test configuration
  --update-snapshots, -u  Update snapshots
```

#### Examples

```bash
# Run all tests
rre test

# Watch mode
rre test --watch

# With coverage
rre test --coverage --verbose

# Specific test pattern
rre test --grep "button"
```

### `rre analyze`

Analyze project for performance and quality.

#### Options

```bash
rre analyze [options]

Options:
  --bundle, -b       Analyze bundle size
  --performance, -p  Analyze performance
  --accessibility, -a  Analyze accessibility
  --seo, -s          Analyze SEO
  --lighthouse, -l   Run Lighthouse audit
  --output, -o       Output format (default: "console")
  --config, -c       Path to configuration file
  --threshold, -t    Performance thresholds
```

#### Examples

```bash
# Full analysis
rre analyze

# Bundle analysis only
rre analyze --bundle

# Performance with thresholds
rre analyze --performance --threshold 90

# Lighthouse audit
rre analyze --lighthouse --output html
```

### `rre deploy`

Deploy project to various platforms.

#### Options

```bash
rre deploy [options]

Options:
  --target, -t       Deployment target (required)
  --env, -e          Environment (default: "production")
  --config, -c       Path to configuration file
  --preview, -p      Preview deployment
  --rollback, -r     Rollback to previous version
  --force, -f        Force deployment
  --dry-run, -d      Show what would be deployed
  --verbose, -v      Verbose output
```

#### Examples

```bash
# Deploy to production
rre deploy --target vercel

# Preview deployment
rre deploy --target netlify --preview

# Rollback deployment
rre deploy --target aws --rollback

# Dry run
rre deploy --target vercel --dry-run
```

### `rre config`

Manage project configuration.

#### Options

```bash
rre config [options]

Options:
  --get, -g          Get configuration value
  --set, -s          Set configuration value
  --delete, -d       Delete configuration value
  --list, -l         List all configuration
  --reset, -r        Reset to defaults
  --validate, -v     Validate configuration
  --export, -e       Export configuration
  --import, -i       Import configuration
```

#### Examples

```bash
# List configuration
rre config --list

# Get specific value
rre config --get build.outDir

# Set configuration
rre config --set build.outDir=build

# Validate configuration
rre config --validate
```

## ⚙️ Configuration

### Configuration File

Create a `rre.config.js` file in your project root:

```javascript
module.exports = {
  // Project configuration
  project: {
    name: 'my-responsive-app',
    version: '1.0.0',
    description: 'A responsive React application',
    author: 'Your Name',
    license: 'MIT'
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: true,
    target: 'es2015',
    assets: {
      images: {
        optimize: true,
        formats: ['webp', 'avif']
      },
      fonts: {
        preload: true,
        display: 'swap'
      }
    }
  },

  // Development configuration
  dev: {
    port: 3000,
    host: 'localhost',
    https: false,
    open: true,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },

  // Testing configuration
  test: {
    framework: 'jest',
    coverage: {
      enabled: true,
      threshold: 80
    },
    environment: 'jsdom'
  },

  // Deployment configuration
  deploy: {
    targets: {
      vercel: {
        token: process.env.VERCEL_TOKEN,
        projectId: process.env.VERCEL_PROJECT_ID
      },
      netlify: {
        token: process.env.NETLIFY_TOKEN,
        siteId: process.env.NETLIFY_SITE_ID
      }
    }
  },

  // Performance configuration
  performance: {
    budgets: {
      bundle: '500KB',
      initial: '200KB',
      interactive: '300KB'
    },
    lighthouse: {
      enabled: true,
      thresholds: {
        performance: 90,
        accessibility: 90,
        seo: 90
      }
    }
  }
};
```

### Environment Variables

```bash
# Development
NODE_ENV=development
RRE_DEBUG=true
RRE_PORT=3000

# Build
RRE_BUILD_ANALYZE=true
RRE_BUILD_SOURCEMAP=true

# Deployment
VERCEL_TOKEN=your_token
NETLIFY_TOKEN=your_token
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

### Package.json Integration

```json
{
  "name": "my-responsive-app",
  "scripts": {
    "dev": "rre dev",
    "build": "rre build",
    "test": "rre test",
    "analyze": "rre analyze",
    "deploy": "rre deploy --target vercel",
    "deploy:preview": "rre deploy --target vercel --preview"
  },
  "rre": {
    "framework": "nextjs",
    "typescript": true,
    "tailwind": true
  }
}
```

## 🚀 Advanced Usage

### Custom Templates

Create custom project templates:

```bash
# Create template directory
mkdir ~/.rre/templates/custom-template

# Add template files
touch ~/.rre/templates/custom-template/package.json
touch ~/.rre/templates/custom-template/README.md

# Use custom template
rre init my-app --template custom-template
```

### Plugin System

Extend CLI functionality with plugins:

```javascript
// plugins/custom-plugin.js
module.exports = {
  name: 'custom-plugin',
  version: '1.0.0',
  
  hooks: {
    'build:before': async (context) => {
      console.log('Before build hook');
    },
    'build:after': async (context) => {
      console.log('After build hook');
    }
  },
  
  commands: {
    'custom': {
      description: 'Custom command',
      action: async (args, options) => {
        console.log('Custom command executed');
      }
    }
  }
};
```

### CI/CD Integration

GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install RRE CLI
        run: npm install -g @yaseratiar/react-responsive-easy-cli
      
      - name: Build project
        run: rre build --analyze
      
      - name: Run tests
        run: rre test --coverage
      
      - name: Deploy to production
        run: rre deploy --target vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### Performance Monitoring

```bash
# Monitor build performance
rre build --profile --analyze

# Performance budget checking
rre analyze --performance --threshold 90

# Lighthouse audit
rre analyze --lighthouse --output html
```

## 🔗 Integration

### Framework Support

- **Vite** - Full support with optimized configuration
- **Next.js** - SSR and SSG optimization
- **Create React App** - Eject-free customization
- **Custom Webpack** - Flexible configuration

### Build Tools

- **ESBuild** - Ultra-fast builds
- **Rollup** - Library builds
- **Webpack** - Advanced bundling
- **SWC** - Rust-based compilation

### Testing Frameworks

- **Jest** - Unit and integration testing
- **Vitest** - Fast Vite-native testing
- **Testing Library** - Component testing
- **Playwright** - E2E testing

### Deployment Platforms

- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **AWS** - Cloud infrastructure
- **Docker** - Containerized deployment

## 🛠️ Development

### Local Development

```bash
# Clone repository
git clone https://github.com/naaa-G/react-responsive-easy.git

# Install dependencies
pnpm install

# Link CLI locally
pnpm --filter=@yaseratiar/react-responsive-easy-cli link

# Test CLI
rre --version
```

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test
pnpm test --grep "init"

# Coverage report
pnpm test:coverage
```

### Building

```bash
# Build CLI
pnpm build

# Build with watch mode
pnpm build:watch

# Build for production
pnpm build:prod
```

## 🐛 Troubleshooting

### Common Issues

#### Permission Denied
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Or use nvm
nvm install node
nvm use node
```

#### Command Not Found
```bash
# Check installation
npm list -g @yaseratiar/react-responsive-easy-cli

# Reinstall
npm uninstall -g @yaseratiar/react-responsive-easy-cli
npm install -g @yaseratiar/react-responsive-easy-cli
```

#### Build Failures
```bash
# Clear cache
rre config --reset

# Check configuration
rre config --validate

# Verbose build
rre build --verbose
```

### Debug Mode

```bash
# Enable debug logging
RRE_DEBUG=true rre dev

# Verbose output
rre dev --verbose

# Node.js inspector
rre dev --inspect
```

### Getting Help

```bash
# Show help
rre --help

# Command-specific help
rre init --help

# Version information
rre --version

# Check for updates
rre update
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/naaa-G/react-responsive-easy/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/react-responsive-easy.git

# Install dependencies
pnpm install

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
pnpm test
pnpm build

# Commit changes
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standard commit messages
- **Husky**: Pre-commit hooks

### Testing Strategy

- **Unit Tests**: Jest for CLI commands
- **Integration Tests**: End-to-end workflows
- **Snapshot Tests**: Configuration validation
- **Performance Tests**: Build time benchmarks

## 📄 License

MIT License - see the [LICENSE](https://github.com/naaa-G/react-responsive-easy/blob/main/LICENSE) file for details.

## 🔗 Links

- **Documentation**: [https://github.com/naaa-G/react-responsive-easy](https://github.com/naaa-G/react-responsive-easy)
- **Issues**: [https://github.com/naaa-G/react-responsive-easy/issues](https://github.com/naaa-G/react-responsive-easy/issues)
- **Discussions**: [https://github.com/naaa-G/react-responsive-easy/discussions](https://github.com/naaa-G/react-responsive-easy/discussions)
- **Changelog**: [https://github.com/naaa-G/react-responsive-easy/blob/main/CHANGELOG.md](https://github.com/naaa-G/react-responsive-easy/blob/main/CHANGELOG.md)

## 🙏 Acknowledgments

- **Commander.js** - CLI framework
- **Chalk** - Terminal styling
- **Inquirer** - Interactive prompts
- **Ora** - Elegant terminal spinners
- **Open Source Community** - For inspiration and collaboration

---

**Made with ❤️ by [naa-G](https://github.com/naaa-G)**

**[⭐ Star this repository](https://github.com/naaa-G/react-responsive-easy)** if you find it helpful!
