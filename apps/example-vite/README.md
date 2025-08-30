# React Responsive Easy - Vite Example

This is a comprehensive example application demonstrating all the features of React Responsive Easy with Vite.

## 🚀 Features Demonstrated

### Core Responsive Engine
- **Mathematical Scaling**: Values scale automatically across breakpoints
- **Smart Breakpoints**: Responsive breakpoint detection and management
- **Performance Optimization**: Built-in caching and memoization
- **TypeScript Support**: Full type safety and IntelliSense

### React Hooks
- `useResponsiveValue()` - Scale individual values responsively
- `useScaledStyle()` - Create responsive style objects
- `useBreakpoint()` - Get current breakpoint information
- `useBreakpointMatch()` - Conditional rendering based on breakpoints

### Advanced Features
- **Performance Dashboard**: Real-time performance monitoring
- **Theme Switching**: Light/dark mode with responsive design
- **Responsive Components**: Button, Card, and Grid components
- **CSS-in-JS**: Dynamic styling with responsive values

## 🛠️ Technology Stack

- **Vite** - Fast build tool and dev server
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **React Responsive Easy** - Our responsive design system
- **CSS Modules** - Scoped styling

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test
```

## 🎯 What You'll Learn

### 1. Responsive Value Scaling
```tsx
const fontSize = useResponsiveValue(18, { token: 'fontSize' })
const padding = useResponsiveValue(16, { token: 'spacing' })
const borderRadius = useResponsiveValue(8, { token: 'radius' })
```

### 2. Responsive Style Objects
```tsx
const buttonStyle = useScaledStyle({
  fontSize: `${fontSize}px`,
  padding: `${padding}px ${padding * 1.5}px`,
  borderRadius: `${borderRadius}px`,
  // ... more styles
})
```

### 3. Breakpoint Detection
```tsx
const breakpoint = useBreakpoint()
const isMobile = useBreakpointMatch('mobile')
const isTabletOrLarger = useBreakpointMatch('tablet', 'up')
```

### 4. Responsive Components
```tsx
<ResponsiveButton variant="primary">
  Click me
</ResponsiveButton>

<ResponsiveCard title="Feature" content="Description">
  Content here
</ResponsiveCard>

<ResponsiveGrid>
  {/* Auto-scaling grid items */}
</ResponsiveGrid>
```

## 🔧 Configuration

### Vite Plugin Configuration
```ts
// vite.config.ts
import { reactResponsiveEasy } from '@react-responsive-easy/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    reactResponsiveEasy({
      enableScaling: true,
      enablePerformanceMonitoring: true,
      enableBreakpointDetection: true,
      breakpoints: {
        mobile: 320,
        tablet: 768,
        desktop: 1024,
        wide: 1440
      }
    })
  ]
})
```

### Responsive Provider Configuration
```tsx
const responsiveConfig = {
  breakpoints: [
    { name: 'mobile', width: 320, height: 568, alias: 'mobile' },
    { name: 'tablet', width: 768, height: 1024, alias: 'tablet' },
    { name: 'desktop', width: 1024, height: 768, alias: 'desktop' },
    { name: 'wide', width: 1440, height: 900, alias: 'wide' }
  ],
  base: { name: 'desktop', width: 1024, height: 768, alias: 'desktop' },
  strategy: {
    origin: 'width',
    mode: 'linear',
    tokens: {
      fontSize: { scale: 1.0, min: 12, unit: 'px', responsive: true },
      spacing: { scale: 1.0, unit: 'px', responsive: true },
      radius: { scale: 1.0, unit: 'px', responsive: true }
    }
  }
}
```

## 📱 Responsive Design Features

### Automatic Scaling
- **Font Sizes**: Scale proportionally with accessibility minimums
- **Spacing**: Maintain visual hierarchy across screen sizes
- **Border Radius**: Smooth scaling for modern UI aesthetics
- **Shadows**: Dynamic shadow scaling for depth perception

### Breakpoint Management
- **Mobile First**: Responsive by default
- **Custom Breakpoints**: Define your own responsive ranges
- **Orientation Support**: Handle portrait/landscape changes
- **Smooth Transitions**: Animated breakpoint changes

### Performance Features
- **Smart Caching**: Memoize computed values
- **Lazy Loading**: Load responsive logic on demand
- **Bundle Optimization**: Tree-shaking for unused features
- **Real-time Monitoring**: Track performance metrics

## 🎨 Styling Approach

### CSS-in-JS with Responsive Values
```tsx
const containerStyle = useScaledStyle({
  minHeight: '100vh',
  padding: `${containerPadding}px`,
  backgroundColor: currentTheme === 'light' ? '#f8fafc' : '#0f172a',
  color: currentTheme === 'light' ? '#1e293b' : '#f1f5f9',
  transition: 'all 0.3s ease'
})
```

### CSS Custom Properties
```css
.responsive-container {
  padding: clamp(16px, 4vw, 32px);
  gap: clamp(16px, 2vw, 24px);
}
```

### Media Query Fallbacks
```css
@media (max-width: 768px) {
  .app-controls {
    flex-direction: column;
    align-items: center;
  }
}
```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui
```

### Test Setup
- **Vitest**: Fast unit testing
- **jsdom**: DOM environment for React components
- **Mock APIs**: Performance, ResizeObserver, etc.
- **TypeScript**: Full type checking in tests

## 🚀 Development Workflow

### 1. Start Development
```bash
pnpm dev
```
- Hot Module Replacement (HMR)
- Real-time responsive testing
- Performance monitoring
- TypeScript compilation

### 2. Responsive Testing
- Resize browser window to test breakpoints
- Use browser dev tools device simulation
- Test on actual mobile devices
- Verify scaling calculations

### 3. Performance Monitoring
- Watch render times in console
- Monitor memory usage
- Check scaling operation counts
- Optimize based on metrics

### 4. Build and Deploy
```bash
pnpm build
pnpm preview
```
- Production-optimized bundle
- Tree-shaking and minification
- Responsive code splitting
- Performance analysis

## 🔍 Debugging

### Console Logging
```tsx
// Enable debug mode in ResponsiveProvider
<ResponsiveProvider config={responsiveConfig} debug={true}>
  <App />
</ResponsiveProvider>
```

### Performance Dashboard
```tsx
// Toggle performance monitoring
<button onClick={() => setShowDashboard(!showDashboard)}>
  📊 {showDashboard ? 'Hide' : 'Show'} Performance Dashboard
</button>
```

### Breakpoint Indicator
- Fixed position indicator shows current breakpoint
- Real-time updates as you resize
- Visual confirmation of responsive behavior

## 📚 Next Steps

### Explore More Features
- **AI Optimization**: Automatic performance suggestions
- **Browser Extension**: Visual debugging tools
- **Storybook Addon**: Component documentation
- **CLI Tools**: Command-line utilities

### Integrate with Your App
- **Next.js**: SSR and SSG support
- **Create React App**: Classic React setup
- **Custom Build Tools**: Webpack, Rollup, etc.

### Advanced Patterns
- **Responsive Forms**: Dynamic form layouts
- **Data Visualization**: Responsive charts and graphs
- **Animation Systems**: Responsive motion design
- **Accessibility**: Screen reader optimization

## 🤝 Contributing

This example app demonstrates best practices for React Responsive Easy. Feel free to:

- **Fork and modify** for your own projects
- **Submit issues** for bugs or improvements
- **Create PRs** for new features or examples
- **Share your implementations** with the community

## 📄 License

MIT License - see the main project license for details.

---

**Built with ❤️ using React Responsive Easy**
